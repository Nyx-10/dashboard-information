CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kemas kini profil lama yang mempunyai nama 'User' berdasarkan metadata pendaftaran:
UPDATE public.profiles p
SET username = COALESCE(
  u.raw_user_meta_data->>'full_name', 
  u.raw_user_meta_data->>'username', 
  u.raw_user_meta_data->>'name'
)
FROM auth.users u
WHERE p.id = u.id AND p.username = 'User';
