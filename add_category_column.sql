-- Tambah kolum 'category' ke jadual 'items'
-- Jalankan ini di Supabase SQL Editor

ALTER TABLE public.items ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL;
