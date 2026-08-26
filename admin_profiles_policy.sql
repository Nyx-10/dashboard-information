-- 1. Padam polisi lama (jika ada) untuk mengelakkan pertindihan
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update profiles" ON public.profiles;

-- 2. Cipta polisi untuk membenarkan Admin/Super Admin MEMADAM (Delete) pengguna
CREATE POLICY "Allow admins to delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'superadmin', 'Super Admin', 'Admin')
);

-- 3. Cipta polisi untuk membenarkan Admin/Super Admin MENGEMASKINI (Update) pengguna
CREATE POLICY "Allow admins to update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'superadmin', 'Super Admin', 'Admin')
);
