-- Ensure the bucket is private
UPDATE storage.buckets
SET public = false
WHERE id = 'payment_screenshots';

-- In case the bucket doesn't exist yet, we can create it (this might fail if it already exists, which is fine)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment_screenshots', 'payment_screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Admins have full access to payment_screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Customers can upload own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Customers can view own payment screenshots" ON storage.objects;

-- Policy: Admins can do everything with payment screenshots
CREATE POLICY "Admins have full access to payment_screenshots" 
ON storage.objects FOR ALL TO authenticated 
USING (bucket_id = 'payment_screenshots' AND public.is_admin());

-- Policy: Customers can insert their own payment screenshots
-- (Supabase automatically sets the owner column to the authenticated user's ID)
CREATE POLICY "Customers can upload own payment screenshots" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'payment_screenshots' AND auth.uid() = owner);

-- Policy: Customers can view their own payment screenshots
CREATE POLICY "Customers can view own payment screenshots" 
ON storage.objects FOR SELECT TO authenticated 
USING (bucket_id = 'payment_screenshots' AND auth.uid() = owner);
