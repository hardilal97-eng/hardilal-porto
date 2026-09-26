/**
 * Cloudflare Worker: hardilal-porto
 * - Penyajian Aset Statis Modern Editorial (Frontend)
 * - CMS & In-Place Editor API (Auth, Content Management, Media Storage)
 * - Webmail API (Inbox, Contact Form, Send Outbound Email, Sent History)
 * - Database: Cloudflare D1 (hardilal-porto-db)
 */

// Helper hash SHA-256
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper autentikasi token
async function verifySession(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token || !env.DB) return false;

  const session = await env.DB.prepare(
    `SELECT token, username FROM admin_sessions WHERE token = ?`
  ).bind(token).first();

  return session ? session.username : false;
}

// Helper Response JSON
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // ------------------------------------------------------------------------
    // 1. Healthcheck
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/health') {
      let dbStatus = 'disconnected';
      if (env.DB) {
        try {
          await env.DB.prepare('SELECT 1').first();
          dbStatus = 'connected';
        } catch (e) {
          dbStatus = `error: ${e.message}`;
        }
      }
      return jsonResponse({
        status: 'ok',
        worker: 'hardilal-porto',
        database: 'Cloudflare D1 (hardilal-porto-db)',
        db_status: dbStatus,
        time: new Date().toISOString()
      });
    }

    // ------------------------------------------------------------------------
    // 2. Auth: Login & Verify Session
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const { username, password } = await request.json();
        if (!username || !password) {
          return jsonResponse({ error: 'Username dan password wajib diisi' }, 400);
        }

        const hashed = await sha256(password);

        // Cari di admin_users atau fallback default admin
        let user = null;
        if (env.DB) {
          user = await env.DB.prepare(
            `SELECT username, password_hash FROM admin_users WHERE username = ?`
          ).bind(username).first();
        }

        // Default credentials: admin / admin123 (jika DB belum diset)
        const defaultAdminHash = await sha256('admin123');
        const isValid = user 
          ? (user.password_hash === hashed)
          : (username === 'admin' && hashed === defaultAdminHash);

        if (!isValid) {
          return jsonResponse({ error: 'Username atau password salah' }, 401);
        }

        // Generate session token
        const token = crypto.randomUUID();
        if (env.DB) {
          await env.DB.prepare(
            `INSERT INTO admin_sessions (token, username, expires_at) VALUES (?, ?, datetime('now', '+7 days'))`
          ).bind(token, username).run();
        }

        return jsonResponse({
          success: true,
          token,
          username,
          message: 'Login berhasil'
        });
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // Logout
    if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace('Bearer ', '').trim();
      if (token && env.DB) {
        await env.DB.prepare(`DELETE FROM admin_sessions WHERE token = ?`).bind(token).run();
      }
      return jsonResponse({ success: true, message: 'Logout berhasil' });
    }

    // Change Password
    if (url.pathname === '/api/auth/password' && request.method === 'POST') {
      const authUser = await verifySession(request, env);
      if (!authUser) return jsonResponse({ error: 'Unauthorized' }, 401);

      try {
        const { newPassword } = await request.json();
        if (!newPassword || newPassword.length < 6) {
          return jsonResponse({ error: 'Password baru minimal 6 karakter' }, 400);
        }
        const newHash = await sha256(newPassword);
        if (env.DB) {
          await env.DB.prepare(
            `INSERT INTO admin_users (username, password_hash) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash`
          ).bind(authUser, newHash).run();
        }
        return jsonResponse({ success: true, message: 'Password berhasil diubah' });
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // ------------------------------------------------------------------------
    // 3. Dynamic Portfolio Content (CMS Read & Update)
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/content') {
      if (request.method === 'GET') {
        let content = null;
        if (env.DB) {
          const row = await env.DB.prepare(
            `SELECT value FROM portfolio_content WHERE key = 'site_data'`
          ).first();
          if (row && row.value) {
            try {
              content = JSON.parse(row.value);
            } catch (e) {}
          }
        }
        return jsonResponse({
          success: true,
          content, // null jika masih menggunakan default template statis
          timestamp: new Date().toISOString()
        });
      }

      if (request.method === 'PUT') {
        const authUser = await verifySession(request, env);
        if (!authUser) return jsonResponse({ error: 'Unauthorized' }, 401);

        try {
          const body = await request.json();
          const strValue = JSON.stringify(body);
          if (env.DB) {
            await env.DB.prepare(
              `INSERT INTO portfolio_content (key, value, updated_at) VALUES ('site_data', ?, datetime('now'))
               ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
            ).bind(strValue).run();
          }
          return jsonResponse({ success: true, message: 'Konten portofolio berhasil disimpan ke database.' });
        } catch (err) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    }

    // ------------------------------------------------------------------------
    // 4. Media Storage (Upload Foto/Mockup ke D1)
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/upload' && request.method === 'POST') {
      const authUser = await verifySession(request, env);
      if (!authUser) return jsonResponse({ error: 'Unauthorized' }, 401);

      try {
        const { dataUrl } = await request.json();
        if (!dataUrl || !dataUrl.startsWith('data:image/')) {
          return jsonResponse({ error: 'File gambar tidak valid (harus base64 data image)' }, 400);
        }

        const id = crypto.randomUUID().slice(0, 12);
        if (env.DB) {
          await env.DB.prepare(
            `INSERT INTO portfolio_content (key, value, updated_at) VALUES (?, ?, datetime('now'))`
          ).bind(`media_${id}`, dataUrl).run();
        }

        const imageUrl = `/api/media/${id}`;
        return jsonResponse({ success: true, id, url: imageUrl });
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    if (url.pathname.startsWith('/api/media/')) {
      const id = url.pathname.replace('/api/media/', '').trim();
      if (env.DB && id) {
        const row = await env.DB.prepare(
          `SELECT value FROM portfolio_content WHERE key = ?`
        ).bind(`media_${id}`).first();

        if (row && row.value) {
          // Parse data URL format: data:[<mediatype>][;base64],<data>
          const matches = row.value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const byteCharacters = atob(matches[2]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Response(byteArray, {
              headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable'
              }
            });
          }
        }
      }
      return new Response('Media Not Found', { status: 404 });
    }

    // ------------------------------------------------------------------------
    // 5. Contact Form API (Simpan Pesan ke Cloudflare D1)
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
          return jsonResponse({ error: 'Semua kolom formulir wajib diisi.' }, 400);
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        if (env.DB) {
          await env.DB.prepare(
            `INSERT INTO contacts (id, name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)`
          ).bind(
            id,
            String(name).slice(0, 100),
            String(email).slice(0, 150),
            String(subject).slice(0, 150),
            String(message).slice(0, 2000),
            createdAt
          ).run();
        }

        return jsonResponse({
          success: true,
          message: 'Pesan Anda berhasil diterima dan tersimpan di database.',
          id,
          db_sync: true
        });
      } catch (err) {
        return jsonResponse({ error: 'Format data JSON tidak valid.', detail: err.message }, 400);
      }
    }

    // ------------------------------------------------------------------------
    // 6. Webmail: Kotak Masuk (Inbox)
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/messages') {
      if (request.method === 'GET') {
        if (env.DB) {
          const { results } = await env.DB.prepare(
            `SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY created_at DESC LIMIT 100`
          ).all();

          return jsonResponse({
            status: 'ok',
            total: results.length,
            messages: results
          });
        }
        return jsonResponse({ error: 'Database not available' }, 500);
      }
    }

    // Hapus pesan dari Inbox
    if (url.pathname.startsWith('/api/messages/') && request.method === 'DELETE') {
      const authUser = await verifySession(request, env);
      if (!authUser) return jsonResponse({ error: 'Unauthorized' }, 401);

      const msgId = url.pathname.replace('/api/messages/', '').trim();
      if (env.DB && msgId) {
        await env.DB.prepare(`DELETE FROM contacts WHERE id = ?`).bind(msgId).run();
        return jsonResponse({ success: true, message: 'Pesan berhasil dihapus' });
      }
      return jsonResponse({ error: 'Message not found' }, 404);
    }

    // ------------------------------------------------------------------------
    // 7. Webmail: Kirim Email (Send Outbound Email) & Sent History
    // ------------------------------------------------------------------------
    if (url.pathname === '/api/send-email' && request.method === 'POST') {
      const authUser = await verifySession(request, env);
      if (!authUser) return jsonResponse({ error: 'Unauthorized' }, 401);

      try {
        const { recipient, subject, body } = await request.json();
        if (!recipient || !subject || !body) {
          return jsonResponse({ error: 'Penerima, subjek, dan isi pesan wajib diisi.' }, 400);
        }

        const id = crypto.randomUUID();
        const sentAt = new Date().toISOString();
        let deliveryStatus = 'Terkirim (Simulasi / D1 Recorded)';

        // Jika user memiliki RESEND_API_KEY diset di wrangler secrets
        if (env.RESEND_API_KEY) {
          try {
            const resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'Hardilal <contact@hardilal.my.id>',
                to: [recipient],
                subject: subject,
                text: body
              })
            });
            if (resendRes.ok) {
              deliveryStatus = 'Terkirim via Resend SMTP';
            } else {
              const resendErr = await resendRes.text();
              console.error('Resend error:', resendErr);
              deliveryStatus = `Resend Notice: ${resendErr}`;
            }
          } catch (e) {
            console.error('Mail dispatch error:', e);
          }
        }

        // Catat email terkirim di D1
        if (env.DB) {
          await env.DB.prepare(
            `INSERT INTO sent_emails (id, recipient, subject, body, status, sent_at) VALUES (?, ?, ?, ?, ?, ?)`
          ).bind(id, recipient, subject, body, deliveryStatus, sentAt).run();
        }

        return jsonResponse({
          success: true,
          message: `Email ke ${recipient} berhasil diproses.`,
          id,
          status: deliveryStatus
        });
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    if (url.pathname === '/api/sent-emails' && request.method === 'GET') {
      const authUser = await verifySession(request, env);
      if (!authUser) return jsonResponse({ error: 'Unauthorized' }, 401);

      if (env.DB) {
        const { results } = await env.DB.prepare(
          `SELECT id, recipient, subject, body, status, sent_at FROM sent_emails ORDER BY sent_at DESC LIMIT 50`
        ).all();
        return jsonResponse({ success: true, total: results.length, emails: results });
      }
      return jsonResponse({ error: 'Database not available' }, 500);
    }

    // ------------------------------------------------------------------------
    // 8. Routing /admin -> sajikan public/admin.html
    // ------------------------------------------------------------------------
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      const adminUrl = new URL('/admin.html', request.url);
      if (env.ASSETS) {
        return env.ASSETS.fetch(new Request(adminUrl, request));
      }
    }

    // ------------------------------------------------------------------------
    // 9. Sajikan frontend aset statis (HTML, CSS, JS, images)
    // ------------------------------------------------------------------------
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Asset binding not configured.', { status: 500 });
  }
};
