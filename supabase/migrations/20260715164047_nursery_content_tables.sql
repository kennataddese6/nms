-- 1. JOBS TABLE
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null, -- Full-time, Part-time, Apprentice
  salary text not null,
  room text not null, -- Babies, Toddlers, Preschool, All
  description text not null,
  requirements text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on jobs
alter table public.jobs enable row level security;

create policy "Allow anyone to read jobs"
  on public.jobs for select
  using (true);

create policy "Allow staff and admin to write/update jobs"
  on public.jobs for all
  using (public.has_permission('update_child') or public.is_super_admin());

-- 2. NEWS & EVENTS TABLE
create table public.news_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null check (category in ('news', 'event')),
  event_date date, -- Optional date for event
  content text not null,
  image_url text, -- Optional image URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on news_events
alter table public.news_events enable row level security;

create policy "Allow anyone to read news_events"
  on public.news_events for select
  using (true);

create policy "Allow staff and admin to write/update news_events"
  on public.news_events for all
  using (public.has_permission('update_child') or public.is_super_admin());

-- 3. GALLERY MEDIA TABLE
create table public.gallery_media (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null, -- classrooms, events, activities
  media_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on gallery_media
alter table public.gallery_media enable row level security;

create policy "Allow anyone to read gallery_media"
  on public.gallery_media for select
  using (true);

create policy "Allow staff and admin to write/update gallery_media"
  on public.gallery_media for all
  using (public.has_permission('update_child') or public.is_super_admin());

-- 4. SEED SAMPLE DATA
insert into public.jobs (title, type, salary, room, description, requirements) values
('Early Years Educator', 'Full-time', '£26,000 - £30,000 / year', 'Toddlers Room', 'Nurture, guide, and support toddler development through active learning play.', array['Level 3 Early Years Qualification', 'Paediatric First Aid', 'Satisfactory DBS check']),
('Room Leader', 'Full-time', '£32,000 - £36,000 / year', 'Preschool Room', 'Lead a team of early years educators and structure child-led lesson plans.', array['Level 3 or higher Early Years Qualification', '2+ years leadership experience', 'Enhanced DBS clearance']);

insert into public.news_events (title, category, event_date, content) values
('Nursery Autumn Harvest Festival', 'event', '2026-10-15', 'Join us for our annual autumn festival with parent activities, fresh apple pies, and pumpkin painting in the garden.'),
('Ofsted Inspection Outstand Result!', 'news', null, 'We are proud to share that Bubbly Day Nursery Westminster has received an outstanding grading on our most recent inspection!');

insert into public.gallery_media (title, category, media_url) values
('Messy Painting in Preschool', 'activities', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'),
('Outdoor Mud Kitchen fun', 'classrooms', 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600');
