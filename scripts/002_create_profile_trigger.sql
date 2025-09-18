-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, location, farm_size, language_preference)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'phone', ''),
    COALESCE(new.raw_user_meta_data ->> 'location', ''),
    COALESCE((new.raw_user_meta_data ->> 'farm_size')::numeric, 0),
    COALESCE(new.raw_user_meta_data ->> 'language_preference', 'english')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
