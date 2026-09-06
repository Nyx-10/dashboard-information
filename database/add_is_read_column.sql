-- Jalankan kod SQL ini di dalam Supabase SQL Editor untuk menambah column is_read
ALTER TABLE public.messages 
ADD COLUMN is_read BOOLEAN DEFAULT false;
