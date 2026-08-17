-- Add branch column to CRM, Content, and Rooms tables
alter table public.children add column branch text not null default 'Branch 1';
alter table public.rooms add column branch text not null default 'Branch 1';
alter table public.gallery_media add column branch text not null default 'Branch 1';
alter table public.jobs add column branch text not null default 'Branch 1';
alter table public.news_events add column branch text not null default 'Branch 1';
alter table public.nursery_menus add column branch text not null default 'Branch 1';

-- Create public storage bucket for direct uploads
insert into storage.buckets (id, name, public)
values ('nursery-assets', 'nursery-assets', true)
on conflict (id) do nothing;

-- Storage policies for the nursery-assets bucket
create policy "Allow public read access to nursery assets"
  on storage.objects for select
  using (bucket_id = 'nursery-assets');

create policy "Allow authenticated uploads to nursery assets"
  on storage.objects for insert
  with check (bucket_id = 'nursery-assets' and auth.role() = 'authenticated');

create policy "Allow authenticated updates to nursery assets"
  on storage.objects for update
  using (bucket_id = 'nursery-assets' and auth.role() = 'authenticated');

create policy "Allow authenticated deletions to nursery assets"
  on storage.objects for delete
  using (bucket_id = 'nursery-assets' and auth.role() = 'authenticated');
