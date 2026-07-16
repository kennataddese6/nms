-- =========================================================================
-- Migration: Daily Child Activity Logs
-- =========================================================================

-- Create Daily Activity Logs Table
create table if not exists public.daily_activity_logs (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  logged_by uuid references public.profiles(id) on delete set null,
  activity_type text not null check (activity_type in ('CHECK_IN', 'CHECK_OUT', 'MEAL', 'NAP', 'DIAPER', 'OBSERVATION')),
  details jsonb not null default '{}'::jsonb,
  logged_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

-- Indexing for search performance
create index if not exists daily_activity_logs_child_id_idx on public.daily_activity_logs(child_id);
create index if not exists daily_activity_logs_logged_at_idx on public.daily_activity_logs(logged_at);

-- Enable RLS
alter table public.daily_activity_logs enable row level security;

-- SELECT Policy: Parents can only view their own children's logs. Managers and staff can read all logs.
create policy "Select activity logs policy"
  on public.daily_activity_logs
  for select
  using (
    is_parent_of_child(child_id)
    or has_permission('view_all_children')
  );

-- INSERT Policy: Staff and Managers can record logs.
create policy "Insert activity logs policy"
  on public.daily_activity_logs
  for insert
  with check (
    has_permission('write_children_records')
  );

-- UPDATE Policy: Staff and Managers can edit logs.
create policy "Update activity logs policy"
  on public.daily_activity_logs
  for update
  using (
    has_permission('write_children_records')
  );

-- DELETE Policy: Staff and Managers can delete logs.
create policy "Delete activity logs policy"
  on public.daily_activity_logs
  for delete
  using (
    has_permission('write_children_records')
  );

-- Dynamic Seeding: Seed activity logs for any children currently in the database
do $$
begin
  -- Check if children exist before seeding
  if exists (select 1 from public.children) then
    
    -- Seed Check-ins
    insert into public.daily_activity_logs (child_id, activity_type, details, logged_at)
    select 
      id,
      'CHECK_IN',
      '{"authorized_pickup": "Mother", "notes": "Arrived with a big smile, excited to play with blocks"}'::jsonb,
      now() - interval '5 hours'
    from public.children;

    -- Seed Snack/Meal
    insert into public.daily_activity_logs (child_id, activity_type, details, logged_at)
    select 
      id,
      'MEAL',
      '{"meal_name": "Morning Snack", "portion_eaten": "All", "notes": "Ate all the apple slices and drank all the milk"}'::jsonb,
      now() - interval '4 hours'
    from public.children;

    -- Seed Nap time
    insert into public.daily_activity_logs (child_id, activity_type, details, logged_at)
    select 
      id,
      'NAP',
      '{"start_time": "11:30", "end_time": "12:30", "duration_minutes": 60, "notes": "Slept soundly in the nursery cot"}'::jsonb,
      now() - interval '2 hours'
    from public.children;

    -- Seed Diaper change
    insert into public.daily_activity_logs (child_id, activity_type, details, logged_at)
    select 
      id,
      'DIAPER',
      '{"status": "Wet", "notes": "Dry diaper changed, skin clean and dry"}'::jsonb,
      now() - interval '1 hour'
    from public.children;

  end if;
end $$;
