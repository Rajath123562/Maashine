-- Create reschedule_requests table
CREATE TABLE IF NOT EXISTS public.reschedule_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    cleaning_request_id uuid REFERENCES public.cleaning_requests(id) ON DELETE CASCADE NOT NULL,
    customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_date date NOT NULL,
    original_time time without time zone NOT NULL,
    proposed_date date NOT NULL,
    proposed_time time without time zone NOT NULL,
    customer_reason text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_reason text,
    reviewed_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.reschedule_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Customers can view their own reschedule requests" ON public.reschedule_requests;
DROP POLICY IF EXISTS "Customers can insert their own reschedule requests" ON public.reschedule_requests;
DROP POLICY IF EXISTS "Admins have full access to reschedule requests" ON public.reschedule_requests;

-- RLS Policies
-- Customers can view their own reschedule requests
CREATE POLICY "Customers can view their own reschedule requests"
    ON public.reschedule_requests FOR SELECT
    USING (auth.uid() = customer_id);

-- Customers can insert their own reschedule requests
CREATE POLICY "Customers can insert their own reschedule requests"
    ON public.reschedule_requests FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Admins have full access
CREATE POLICY "Admins have full access to reschedule requests"
    ON public.reschedule_requests FOR ALL
    USING (public.is_admin());
