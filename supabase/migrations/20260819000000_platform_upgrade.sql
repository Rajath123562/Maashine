-- Phase A: Platform Upgrade Schema Additions

-- 1. STAFF
CREATE TYPE staff_role AS ENUM ('cleaner', 'supervisor', 'manager');
CREATE TYPE staff_status AS ENUM ('active', 'inactive', 'on_leave');

CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_code TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    photo_url TEXT,
    role staff_role NOT NULL DEFAULT 'cleaner',
    status staff_status NOT NULL DEFAULT 'active',
    skills TEXT[],
    joining_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. BOOKING ASSIGNMENTS
CREATE TYPE assignment_status AS ENUM ('assigned', 'en_route', 'in_progress', 'completed', 'cancelled');

CREATE TABLE public.booking_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.cleaning_requests(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status assignment_status NOT NULL DEFAULT 'assigned',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.booking_assignments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_booking_assignments_updated_at BEFORE UPDATE ON public.booking_assignments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. PAYMENTS
CREATE TYPE payment_status AS ENUM ('Pending', 'Verification Pending', 'Paid', 'Rejected', 'Refund Pending', 'Refunded');

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.cleaning_requests(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    upi_id TEXT,
    transaction_reference TEXT,
    screenshot_path TEXT,
    status payment_status NOT NULL DEFAULT 'Verification Pending',
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_transaction_reference UNIQUE (transaction_reference)
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. NOTIFICATIONS
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'whatsapp');

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.cleaning_requests(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel notification_channel NOT NULL DEFAULT 'in_app',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. BOOKING STATUS HISTORY
CREATE TABLE public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.cleaning_requests(id) ON DELETE CASCADE,
    old_status request_status,
    new_status request_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

-- 6. REVIEWS
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.cleaning_requests(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    admin_response TEXT,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. INVOICES
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'cancelled');

CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.cleaning_requests(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC NOT NULL DEFAULT 0 CHECK (discount >= 0),
    tax NUMERIC NOT NULL DEFAULT 0 CHECK (tax >= 0),
    total NUMERIC NOT NULL CHECK (total >= 0),
    status invoice_status NOT NULL DEFAULT 'issued',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 8. AUDIT LOGS
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR NEW TABLES

-- Staff
CREATE POLICY "Admins have full access to staff" ON public.staff FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Staff can view their own record" ON public.staff FOR SELECT TO authenticated USING (profile_id = auth.uid());

-- Booking Assignments
CREATE POLICY "Admins have full access to booking_assignments" ON public.booking_assignments FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Staff can view their own assignments" ON public.booking_assignments FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = staff_id AND s.profile_id = auth.uid())
);
CREATE POLICY "Staff can update their own assignments" ON public.booking_assignments FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = staff_id AND s.profile_id = auth.uid())
);

-- Payments
CREATE POLICY "Admins have full access to payments" ON public.payments FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Customers can view their own payments" ON public.payments FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Customers can insert their own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());

-- Notifications
CREATE POLICY "Admins have full access to notifications" ON public.notifications FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications (read status)" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Booking Status History
CREATE POLICY "Admins have full access to booking_status_history" ON public.booking_status_history FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Customers can view their own booking history" ON public.booking_status_history FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.cleaning_requests cr WHERE cr.id = request_id AND cr.customer_id = auth.uid())
);

-- Reviews
CREATE POLICY "Admins have full access to reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Customers can view their own reviews" ON public.reviews FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Customers can insert their own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Published reviews are viewable by everyone" ON public.reviews FOR SELECT USING (published = TRUE);

-- Invoices
CREATE POLICY "Admins have full access to invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Customers can view their own invoices" ON public.invoices FOR SELECT TO authenticated USING (customer_id = auth.uid());

-- Audit Logs
CREATE POLICY "Admins have full access to audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (public.is_admin());
