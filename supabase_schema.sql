-- ==============================================================================
-- SUPABASE SCHEMA UNTUK WEB PORTOFOLIO: hardilal-porto
-- Salin dan jalankan skrip ini di SQL Editor pada Dashboard Supabase Anda
-- ==============================================================================

-- 1. Buat tabel 'contacts' untuk menampung pesan dari pengunjung
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS) demi keamanan
alter table public.contacts enable row level security;

-- 3. Policy: Izinkan publik (anon key dari Cloudflare Worker) menambahkan pesan baru
create policy "Izinkan publik / worker mengirim pesan"
on public.contacts
for insert
to anon, authenticated
with check (true);

-- 4. Policy: Hanya pemilik/admin yang dapat membaca pesan masuk
create policy "Hanya admin terautentikasi yang dapat membaca pesan"
on public.contacts
for select
to authenticated
using (true);

-- Catatan cara menghubungkan ke Cloudflare Worker 'hardilal-porto':
-- Jalankan perintah berikut di terminal:
-- npx wrangler secret put SUPABASE_URL
-- (Masukkan Project URL Anda, contoh: https://xyzcompany.supabase.co)
--
-- npx wrangler secret put SUPABASE_ANON_KEY
-- (Masukkan anon public key Supabase Anda)
