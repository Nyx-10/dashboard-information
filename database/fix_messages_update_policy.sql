-- Jalankan kod SQL ini di dalam Supabase SQL Editor untuk membenarkan kemas kini status 'is_read'
CREATE POLICY "Users can update received messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = receiver_id);
