# Peraturan Projek untuk Agen AI

## Git & GitHub (WAJIB)

- Selepas setiap perubahan kod yang siap dan telah disemak (lint/build/ujian lulus),
  **sentiasa commit dan push** ke `origin` (GitHub: `Nyx-10/dashboard-information`)
  pada branch semasa (biasanya `main`). Jangan biarkan perubahan tanpa commit.
- Gunakan mesej commit gaya Conventional Commits, cth.
  `feat(tv): ...`, `fix(auth): ...`, `chore: ...`.
- Hanya `git add` fail yang berkaitan dengan tugasan. Jangan sekali-kali commit
  `.env`, rahsia/kunci API, `node_modules/`, `dist/` atau `dev-dist/`.
- Jangan guna `git push --force` atau tulis semula sejarah tanpa kebenaran pengguna.
- Jika push gagal (rangkaian/kebenaran), laporkan ralat kepada pengguna dan
  pastikan commit tempatan tetap disimpan supaya boleh di-push kemudian.
