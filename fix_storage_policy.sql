-- Benarkan pengguna log masuk memuat naik (INSERT) gambar ke bucket "item-images"
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
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
