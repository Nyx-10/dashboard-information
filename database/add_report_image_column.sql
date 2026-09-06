-- Jalankan SQL ini di Supabase SQL Editor untuk menambah kolum image_url dalam jadual user_reports
ALTER TABLE public.user_reports 
ADD COLUMN IF NOT EXISTS image_url TEXT;
