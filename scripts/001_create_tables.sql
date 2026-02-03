-- SheRoutes Database Schema

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Waitlist/Early Access table (public - no auth required)
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist
CREATE POLICY "waitlist_insert_all" ON public.waitlist FOR INSERT WITH CHECK (true);
-- Only allow service role to read waitlist
CREATE POLICY "waitlist_select_service" ON public.waitlist FOR SELECT USING (false);

-- Contact form submissions (public - no auth required)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "contacts_insert_all" ON public.contacts FOR INSERT WITH CHECK (true);
-- Only allow service role to read contacts
CREATE POLICY "contacts_select_service" ON public.contacts FOR SELECT USING (false);

-- SOS Alerts table (requires auth)
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  message TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sos_alerts_select_own" ON public.sos_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sos_alerts_insert_own" ON public.sos_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sos_alerts_update_own" ON public.sos_alerts FOR UPDATE USING (auth.uid() = user_id);

-- Trusted contacts table (for live location sharing)
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trusted_contacts_select_own" ON public.trusted_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trusted_contacts_insert_own" ON public.trusted_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trusted_contacts_update_own" ON public.trusted_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trusted_contacts_delete_own" ON public.trusted_contacts FOR DELETE USING (auth.uid() = user_id);

-- Saved routes table
CREATE TABLE IF NOT EXISTS public.saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  route_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_routes_select_own" ON public.saved_routes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_routes_insert_own" ON public.saved_routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_routes_update_own" ON public.saved_routes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "saved_routes_delete_own" ON public.saved_routes FOR DELETE USING (auth.uid() = user_id);
