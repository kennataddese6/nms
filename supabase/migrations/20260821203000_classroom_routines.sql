-- =========================================================================
-- Migration: Classroom Daily Routines
-- =========================================================================

-- 1. Create Room Routines Table
create table if not exists public.room_routines (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  age_group text not null default 'babies', -- 'babies' | 'toddlers' | 'preschool'
  time text not null,
  activity text not null,
  details text not null default '',
  display_order integer not null default 0,
  created_at timestamp with time zone not null default now()
);

-- Indexing
create index if not exists room_routines_room_id_idx on public.room_routines(room_id);
create index if not exists room_routines_age_group_idx on public.room_routines(age_group);

-- Enable RLS
alter table public.room_routines enable row level security;

-- 2. Row Level Security Policies
-- Public / authenticated users can view classroom routines without RLS error
create policy "Allow public read access to room_routines"
  on public.room_routines
  for select
  using (true);

-- Staff / admin users can manage room_routines
create policy "Allow staff full access to room_routines"
  on public.room_routines
  for all
  using (true)
  with check (true);

-- 3. Seed Default Routine Data
insert into public.room_routines (age_group, time, activity, details, display_order)
values
  -- Babies Routine (0 - 18 months)
  ('babies', '07:30 - 08:30', 'Arrival & Quiet Play', 'Welcoming babies, settling into the room, soft sensory play.', 1),
  ('babies', '08:30 - 09:15', 'Breakfast & Morning Milk', 'Nutritious purées, cereals, or milk feeds tailored to each baby.', 2),
  ('babies', '09:15 - 10:30', 'Sensory Session & Outdoors', 'Tummy time, bubble popping, and outdoor pram walks in our secure garden.', 3),
  ('babies', '10:30 - 11:30', 'Morning Nap Time', 'Snoozing in dark, peaceful sleep pods with soothing white noise.', 4),
  ('babies', '11:30 - 12:30', 'Nutritious Lunch', 'Freshly prepared warm lunch purées or finger foods.', 5),
  ('babies', '12:30 - 14:00', 'Messy Play & Discovery', 'Water play, textured paint stamping, and crawling exploration.', 6),
  ('babies', '14:00 - 15:00', 'Afternoon Nap / Quiet Time', 'Restful nap time tailored to each baby''s natural sleep routine.', 7),
  ('babies', '15:00 - 16:00', 'Afternoon Tea & Snacks', 'Healthy fruit snacks, finger foods, and warm milk.', 8),
  ('babies', '16:00 - 18:00', 'Story Time & Departure', 'Rhyme time, soft toy play, and peaceful handovers to parents.', 9),

  -- Toddlers Routine (18 - 36 months)
  ('toddlers', '07:30 - 08:30', 'Welcome & Breakfast', 'Free play, choice of healthy cereals, toast, and milk.', 1),
  ('toddlers', '08:30 - 09:30', 'Circle Time & Phonics', 'Singing songs, weather board updates, and early phonics games.', 2),
  ('toddlers', '09:30 - 11:00', 'Outdoor Exploration', 'Trikes, mud kitchen baking, and nature trail discovery.', 3),
  ('toddlers', '11:00 - 12:00', 'Nutritious Cooked Lunch', 'Family-style hot dining learning independence with cutlery.', 4),
  ('toddlers', '12:00 - 14:00', 'Nap Time / Calm Play', 'Resting on individual cots or quiet storybook reading.', 5),
  ('toddlers', '14:00 - 15:30', 'Creative Workshop & STEM', 'Playdough building, water experiments, and finger painting.', 6),
  ('toddlers', '15:30 - 16:30', 'Afternoon Tea', 'Hot afternoon tea meal with fresh fruit slices.', 7),
  ('toddlers', '16:30 - 18:00', 'Free Choice Play & Home Time', 'Construction blocks, puzzle time, and parent updates.', 8),

  -- Preschool Routine (3 - 5 years)
  ('preschool', '07:30 - 08:45', 'Arrival & Table Activities', 'Early arrival welcoming, table-top puzzles, and breakfast.', 1),
  ('preschool', '08:45 - 09:45', 'EYFS Focus Session', 'Letter sounds, counting games, and structured group learning.', 2),
  ('preschool', '09:45 - 11:30', 'Free Flow Garden Play', 'Climbing frames, sand play, sports drills, and planting.', 3),
  ('preschool', '11:30 - 12:30', 'Chef Cooked Lunch', 'Balanced hot lunch with self-serving and table manners.', 4),
  ('preschool', '12:30 - 13:30', 'Mindfulness & Quiet Reading', 'Guided relaxation, mindfulness stories, and quiet book corners.', 5),
  ('preschool', '13:30 - 15:15', 'School Readiness & French/Music', 'Pre-writing skills, music rhythm class, and basic French.', 6),
  ('preschool', '15:15 - 16:15', 'Afternoon Tea & Social Dining', 'Nourishing meal with social conversation and table clearing.', 7),
  ('preschool', '16:15 - 18:00', 'Reflection & Departure', 'Day in review sharing, board games, and parent pickup.', 8);
