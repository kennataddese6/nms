-- =========================================================================
-- Migration: Parent-Staff Chat & Messages (Supabase Realtime enabled)
-- =========================================================================

-- 1. Create Chat Threads Table
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  subject text not null,
  created_at timestamp with time zone not null default now()
);

-- 2. Create Chat Messages Table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Indexing for lookup speed
create index if not exists chat_threads_parent_id_idx on public.chat_threads(parent_id);
create index if not exists chat_messages_thread_id_idx on public.chat_messages(thread_id);

-- Enable RLS
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- 3. Row Level Security Policies

-- THREAD SELECT: Parents can read their own chats. Staff and managers can read all chats.
create policy "Select chat threads policy"
  on public.chat_threads
  for select
  using (
    parent_id in (select id from public.parents where profile_id = auth.uid())
    or has_permission('view_all_children')
  );

-- THREAD INSERT: Parents can start chats. Staff can start chats.
create policy "Insert chat threads policy"
  on public.chat_threads
  for insert
  with check (
    parent_id in (select id from public.parents where profile_id = auth.uid())
    or has_permission('write_children_records')
  );

-- MESSAGES SELECT: Users can read messages if they have access to the parent thread.
create policy "Select chat messages policy"
  on public.chat_messages
  for select
  using (
    exists (
      select 1 from public.chat_threads t
      where t.id = chat_messages.thread_id
      and (
        t.parent_id in (select id from public.parents where profile_id = auth.uid())
        or has_permission('view_all_children')
      )
    )
  );

-- MESSAGES INSERT: Users can send messages if they belong to the parent thread.
create policy "Insert chat messages policy"
  on public.chat_messages
  for insert
  with check (
    exists (
      select 1 from public.chat_threads t
      where t.id = chat_messages.thread_id
      and (
        t.parent_id in (select id from public.parents where profile_id = auth.uid())
        or has_permission('write_children_records')
      )
    )
  );

-- 4. Enable Supabase Realtime database listener replication on chat_messages table
alter publication supabase_realtime add table public.chat_messages;

-- 5. Seeding Mock Message Threads
do $$
declare
  taddese_parent_id uuid;
  taddese_profile_id uuid;
  staff_profile_id uuid;
  new_thread_id uuid;
begin
  -- Locate Taddese parent profile
  select id, profile_id into taddese_parent_id, taddese_profile_id 
  from public.parents 
  limit 1;

  -- Locate a Manager or Staff profile to act as responder
  select user_id into staff_profile_id 
  from public.user_roles ur
  join public.roles r on ur.role_id = r.id
  where r.name in ('NURSERY_MANAGER', 'STAFF', 'SUPER_ADMIN')
  limit 1;

  -- Seed if parent exists
  if taddese_parent_id is not null then
    
    -- Create Thread
    new_thread_id := gen_random_uuid();
    
    insert into public.chat_threads (id, parent_id, subject, created_at)
    values (new_thread_id, taddese_parent_id, 'Admissions Enquiry', now() - interval '2 days');

    -- Insert Messages
    if staff_profile_id is not null then
      -- Staff welcome
      insert into public.chat_messages (thread_id, sender_id, message, created_at)
      values (new_thread_id, staff_profile_id, 'Hello! Welcome to Bubbly Nursery. Let us know if you have any questions regarding your child''s upcoming classroom schedules.', now() - interval '2 days');
    end if;

    -- Parent reply
    insert into public.chat_messages (thread_id, sender_id, message, created_at)
    values (new_thread_id, taddese_profile_id, 'Thank you! We registered yesterday. I wanted to verify what documents we need to bring on our child''s first day.', now() - interval '1 day');

    if staff_profile_id is not null then
      -- Staff answer
      insert into public.chat_messages (thread_id, sender_id, message, created_at)
      values (new_thread_id, staff_profile_id, 'Please bring their Birth Certificate copy, and any medical allergy reports. We look forward to meeting you!', now() - interval '12 hours');
    end if;

  end if;
end $$;
