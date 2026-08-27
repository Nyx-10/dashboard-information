-- Allow admins and superadmins to update (soft delete) any item
CREATE POLICY "Admins can update any item" 
ON public.items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'superadmin')
  )
);
