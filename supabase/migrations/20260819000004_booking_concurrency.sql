-- Add partial unique index to prevent conflicting overlapping bookings
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_booking_slot 
ON public.cleaning_requests (preferred_date, preferred_time) 
WHERE status NOT IN ('Cancelled', 'Rejected');
