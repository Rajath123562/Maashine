-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TYPE user_role AS ENUM ('customer', 'admin');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Table: services
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT NOT NULL DEFAULT 'Residential',
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
    pricing_type TEXT NOT NULL DEFAULT 'fixed', -- 'fixed', 'conditional', 'quote'
    pricing_conditions JSONB,
    includes JSONB,
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Table: cleaning_requests
CREATE TYPE request_status AS ENUM ('Pending', 'Contacted', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected');

CREATE TABLE public.cleaning_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number SERIAL NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    property_type TEXT NOT NULL,
    rooms INTEGER,
    bathrooms INTEGER,
    property_size TEXT,
    property_condition TEXT, -- 'New / Unoccupied House', 'Living / Occupied House'
    is_quote_request BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    alternative_date DATE,
    alternative_time TIME,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    landmark TEXT,
    additional_notes TEXT,
    status request_status NOT NULL DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.cleaning_requests ENABLE ROW LEVEL SECURITY;

-- Table: request_images
CREATE TABLE public.request_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.cleaning_requests(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.request_images ENABLE ROW LEVEL SECURITY;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_cleaning_requests_updated_at BEFORE UPDATE ON public.cleaning_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies

-- Admins can do everything
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Services
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL TO authenticated USING (public.is_admin());

-- Cleaning Requests
CREATE POLICY "Admins have full access to cleaning_requests" ON public.cleaning_requests FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Users can view own requests" ON public.cleaning_requests FOR SELECT TO authenticated USING (auth.uid() = customer_id);
CREATE POLICY "Users can insert own requests" ON public.cleaning_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);

-- Request Images
CREATE POLICY "Admins have full access to request_images" ON public.request_images FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Users can view own request images" ON public.request_images FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.cleaning_requests cr WHERE cr.id = request_id AND cr.customer_id = auth.uid())
);
CREATE POLICY "Users can insert own request images" ON public.request_images FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.cleaning_requests cr WHERE cr.id = request_id AND cr.customer_id = auth.uid())
);
