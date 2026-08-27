-- supabase/migrations/20260827210000_add_staff_details_and_child_staff_link.sql

ALTER TABLE public.staff
  ADD COLUMN IF NOT EXISTS preferred_name text,
  ADD COLUMN IF NOT EXISTS mobile_number text,
  ADD COLUMN IF NOT EXISTS ni_number text,
  ADD COLUMN IF NOT EXISTS nursery_branch text,
  ADD COLUMN IF NOT EXISTS room_department text,
  ADD COLUMN IF NOT EXISTS employment_type text DEFAULT 'Full-time',
  ADD COLUMN IF NOT EXISTS dbs_certificate_number text,
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship text,
  ADD COLUMN IF NOT EXISTS emergency_contact_number text,
  ADD COLUMN IF NOT EXISTS confirm_correct boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS agree_policies boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS agree_terms boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Create child_staff mapping table for key worker assignments
CREATE TABLE IF NOT EXISTS public.child_staff (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id uuid REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    staff_id uuid REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (child_id, staff_id)
);

ALTER TABLE public.child_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated staff to read child_staff" ON public.child_staff
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated staff to insert child_staff" ON public.child_staff
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated staff to delete child_staff" ON public.child_staff
    FOR DELETE USING (auth.role() = 'authenticated');
