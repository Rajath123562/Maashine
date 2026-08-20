-- Create business_settings table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id integer PRIMARY KEY CHECK (id = 1),
    business_name text NOT NULL DEFAULT 'MaaShine Cleaning Services',
    phone text NOT NULL DEFAULT '+91 0000000000',
    email text NOT NULL DEFAULT 'contact@maashineservices.com',
    whatsapp_number text NOT NULL DEFAULT '+91 0000000000',
    upi_id text NOT NULL DEFAULT 'yourbusiness@upi',
    address text NOT NULL DEFAULT 'Mysore, Karnataka',
    operating_hours text NOT NULL DEFAULT 'Mon-Sat, 9AM to 6PM',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert the default single row
INSERT INTO public.business_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view business settings" ON public.business_settings;
DROP POLICY IF EXISTS "Only admins can update business settings" ON public.business_settings;

-- RLS Policies
-- Anyone (including unauthenticated users) can read the business settings to display them on the site
CREATE POLICY "Anyone can view business settings"
    ON public.business_settings FOR SELECT
    USING (true);

-- Only admins can update the settings
CREATE POLICY "Only admins can update business settings"
    ON public.business_settings FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admins can insert (though restricted to id=1 by check constraint)
CREATE POLICY "Only admins can insert business settings"
    ON public.business_settings FOR INSERT
    WITH CHECK (public.is_admin());
