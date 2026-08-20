-- Create contact_messages table for public inquiry submissions
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public contact message inserts" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin to view and update contact messages" ON public.contact_messages;

-- Anyone (including unauthenticated visitors) can submit a contact message
CREATE POLICY "Allow public contact message inserts"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

-- Only admins can view and manage contact messages
CREATE POLICY "Allow admin to view and update contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
