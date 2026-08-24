-- Allow users to update their own items (e.g. for soft deleting)
CREATE POLICY "Users can update own items" 
ON public.items 
FOR UPDATE 
USING (auth.uid() = created_by);
