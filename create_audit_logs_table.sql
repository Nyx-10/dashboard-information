-- 1. Cipta jadual (table) audit_logs
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    user_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan keselamatan (Row Level Security)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Benarkan pengguna log masuk untuk menambah log
CREATE POLICY "Benarkan tambah log"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Benarkan pentadbir (atau pengguna log masuk) membaca log
CREATE POLICY "Benarkan baca log"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);
