-- Jalankan SQL ini di Supabase SQL Editor untuk menambah kolum suspended_until dalam jadual profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ;
