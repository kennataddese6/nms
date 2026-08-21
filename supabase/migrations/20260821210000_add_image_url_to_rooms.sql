-- Add image_url column to public.rooms table
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS image_url text;
