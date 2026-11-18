-- Pastikan bucket "item-images" wujud dan ditetapkan sebagai awam (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Buang polisi lama jika wujud supaya tidak berlaku konflik
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual update" ON storage.objects;

-- Benarkan muat naik (INSERT) gambar ke bucket "item-images" (authenticated & anon)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'item-images' );

-- Benarkan sesiapa sahaja untuk melihat (SELECT) gambar dari bucket "item-images"
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'item-images' );

-- Benarkan pengguna memadam gambar (DELETE) milik mereka sendiri
CREATE POLICY "Allow individual delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'item-images' AND auth.uid() = owner );

-- Benarkan pengguna mengemas kini gambar (UPDATE) milik mereka sendiri
CREATE POLICY "Allow individual update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'item-images' AND auth.uid() = owner );

