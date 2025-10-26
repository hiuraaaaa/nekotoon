
# Manga Reader – Google Auth + `ext` per Chapter (Vite + Tailwind)

- Wajib login Google (Firebase) sebelum akses aplikasi.
- **Versi A (`ext`)**: tiap chapter punya satu ekstensi (`webp/jpg/png/avif`). Path: `/manga/<slug>/<chapter>/<001>.<ext>`.
- Webtoon mode, pagination episode, riwayat baca unik per seri (max 6), admin JSON.
- Siap deploy Vercel (static build + SPA fallback).

## ENV
Lihat `.env.example`, isi di lokal & Vercel Project Settings → Environment Variables.

## Jalankan
```bash
npm i
npm run dev
```

## Deploy
Push repo → vercel.com/new → Deploy.
