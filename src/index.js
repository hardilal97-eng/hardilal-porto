/**
 * Cloudflare Worker: hardilal-porto
 * Menangani API backend dengan integrasi Cloudflare D1 Database (SQLite Edge)
 * dan menyajikan frontend aset portofolio statis.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Healthcheck endpoint
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

      return new Response(JSON.stringify({
        status: 'ok',
        worker: 'hardilal-porto',
        database: 'Cloudflare D1 (hardilal-porto-db)',
        db_status: dbStatus,
        time: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. Contact form endpoint (Simpan pesan ke Cloudflare D1)
    if (url.pathname === '/api/contact') {
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
          }
        });
      }

      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validasi input
        if (!name || !email || !subject || !message) {
          return new Response(JSON.stringify({
            error: 'Semua kolom formulir (nama, email, topik, pesan) wajib diisi.'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Simpan langsung ke Cloudflare D1 database
        let dbSaved = false;
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
          dbSaved = true;
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Pesan Anda berhasil diterima dan tersimpan di database.',
          id: id,
          db_sync: dbSaved
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({
          error: 'Format data JSON tidak valid.',
          detail: err.message
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 3. Endpoint melihat pesan masuk (Inbox)
    if (url.pathname === '/api/messages') {
      if (env.DB) {
        const { results } = await env.DB.prepare(
          `SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY created_at DESC LIMIT 50`
        ).all();

        return new Response(JSON.stringify({
          status: 'ok',
          total: results.length,
          messages: results
        }), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({ error: 'Database binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Sajikan frontend aset statis (HTML, CSS, JS, images)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Asset binding not configured.', { status: 500 });
  }
};
