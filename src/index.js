/**
 * Cloudflare Worker: hardilal-porto
 * Menangani API backend (Supabase contact sync & healthcheck)
 * dan menyajikan frontend aset portofolio statis melalui Cloudflare Static Assets.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Healthcheck endpoint
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        worker: 'hardilal-porto',
        time: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. Contact form endpoint (Supabase integration)
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

        // Simpan ke Supabase jika kredensial env sudah dikonfigurasi
        let supabaseSaved = false;
        let supabaseNotice = 'Supabase credentials belum diset di secrets worker.';

        if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
          try {
            const supabaseRes = await fetch(`${env.SUPABASE_URL}/rest/v1/contacts`, {
              method: 'POST',
              headers: {
                'apikey': env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                name: String(name).slice(0, 100),
                email: String(email).slice(0, 150),
                subject: String(subject).slice(0, 150),
                message: String(message).slice(0, 2000),
                created_at: new Date().toISOString()
              })
            });

            if (supabaseRes.ok) {
              supabaseSaved = true;
              supabaseNotice = 'Pesan berhasil disimpan ke database Supabase.';
            } else {
              const errBody = await supabaseRes.text();
              console.error('Supabase API error:', errBody);
              supabaseNotice = `Gagal menyimpan ke Supabase: ${errBody}`;
            }
          } catch (dbErr) {
            console.error('Supabase fetch error:', dbErr);
            supabaseNotice = dbErr.message;
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Pesan berhasil diterima oleh worker hardilal-porto.',
          supabase_sync: supabaseSaved,
          notice: supabaseNotice
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

    // 3. Sajikan aset statis portofolio (HTML, CSS, JS, images)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Asset binding not configured.', { status: 500 });
  }
};
