-- Enable RLS just in case it isn't
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Allow users to delete their own items
CREATE POLICY "Users can delete own items" 
ON public.items 
FOR DELETE 
USING (auth.uid() = created_by);
