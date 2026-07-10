-- supabase/migrations/20260710153358_schema_init.sql

-- Enable uuid-ossp if not already enabled
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. PROFILE & SECURITY TABLES
-- =========================================================================

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Create roles table
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- Enable RLS for roles
alter table public.roles enable row level security;

-- Create user_roles table (Many-to-Many map)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role_id uuid references public.roles(id) on delete cascade not null,
  unique (user_id, role_id)
);

-- Enable RLS for user_roles
alter table public.user_roles enable row level security;

-- Create permissions table
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  description text
);

-- Enable RLS for permissions
alter table public.permissions enable row level security;

-- Create role_permissions table
create table public.role_permissions (
  role_id uuid references public.roles(id) on delete cascade not null,
  permission_id uuid references public.permissions(id) on delete cascade not null,
  primary key (role_id, permission_id)
);

-- Enable RLS for role_permissions
alter table public.role_permissions enable row level security;

-- =========================================================================
-- 2. CORE NURSERY DOMAIN TABLES
-- =========================================================================

-- Create rooms table
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity integer not null,
  min_age_months integer not null,
  max_age_months integer not null,
  description text
);

-- Enable RLS for rooms
alter table public.rooms enable row level security;

-- Create children table
create table public.children (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  gender text,
  medical_notes text,
  allergies text,
  status text not null default 'WAITING_LIST',
  room_id uuid references public.rooms(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for children
alter table public.children enable row level security;

-- Create parents table
create table public.parents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  address text,
  emergency_contact text,
  relationship_status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for parents
alter table public.parents enable row level security;

-- Create child_parents table (Many-to-Many map)
create table public.child_parents (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete cascade not null,
  parent_id uuid references public.parents(id) on delete cascade not null,
  relationship text not null,
  primary_contact boolean default false not null,
  unique (child_id, parent_id)
);

-- Enable RLS for child_parents
alter table public.child_parents enable row level security;

-- Create staff table
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  job_title text not null,
  start_date date not null,
  dbs_expiry date,
  status text not null default 'ACTIVE'
);

-- Enable RLS for staff
alter table public.staff enable row level security;

-- Create enrollments table (Room tracking history)
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete cascade not null,
  room_id uuid references public.rooms(id) on delete cascade not null,
  start_date date not null,
  end_date date,
  status text not null default 'ACTIVE'
);

-- Enable RLS for enrollments
alter table public.enrollments enable row level security;

-- =========================================================================
-- 3. HELPER FUNCTIONS & RLS SECURITY RULES
-- =========================================================================

-- Helper to check if user is a Super Admin
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.name = 'SUPER_ADMIN'
  );
end;
$$ language plpgsql security definer;

-- Helper to check granular user permissions
create or replace function public.has_permission(permission_key text)
returns boolean as $$
begin
  -- Super admin has all permissions
  if public.is_super_admin() then
    return true;
  end if;

  return exists (
    select 1 from public.user_roles ur
    join public.role_permissions rp on ur.role_id = rp.role_id
    join public.permissions p on rp.permission_id = p.id
    where ur.user_id = auth.uid() and p.key = permission_key
  );
end;
$$ language plpgsql security definer;

-- Helper to verify if the user is a child's parent/guardian
create or replace function public.is_parent_of_child(child_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.child_parents cp
    join public.parents p on cp.parent_id = p.id
    where cp.child_id = $1 and p.profile_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- RLS Policies

-- PROFILES policies
create policy "Allow read access to profiles for authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Allow update access to profiles for owners"
  on public.profiles for update
  using (auth.uid() = id);

-- ROLES policies
create policy "Allow read access to roles for authenticated users"
  on public.roles for select
  using (auth.role() = 'authenticated');

-- USER_ROLES policies
create policy "Allow read access to user_roles for authenticated users"
  on public.user_roles for select
  using (auth.role() = 'authenticated');

-- PERMISSIONS policies
create policy "Allow read access to permissions for authenticated users"
  on public.permissions for select
  using (auth.role() = 'authenticated');

-- ROLE_PERMISSIONS policies
create policy "Allow read access to role_permissions for authenticated users"
  on public.role_permissions for select
  using (auth.role() = 'authenticated');

-- ROOMS policies
create policy "Allow read access to rooms for authenticated users"
  on public.rooms for select
  using (auth.role() = 'authenticated');

create policy "Allow full access to rooms for admin/managers"
  on public.rooms for all
  using (public.has_permission('manage_website'));

-- PARENTS policies
create policy "Allow parents to view their own records"
  on public.parents for select
  using (profile_id = auth.uid() or public.has_permission('manage_staff'));

create policy "Allow parents to update their own records"
  on public.parents for update
  using (profile_id = auth.uid());

-- CHILDREN policies
create policy "Allow parents to read their children's records"
  on public.children for select
  using (public.is_parent_of_child(id) or public.has_permission('manage_observations'));

create policy "Allow staff and admin to write/update children records"
  on public.children for all
  using (public.has_permission('update_child'));

-- CHILD_PARENTS policies
create policy "Allow parents to view their child relations"
  on public.child_parents for select
  using (
    parent_id in (select id from public.parents where profile_id = auth.uid()) 
    or public.has_permission('manage_staff')
  );

-- STAFF policies
create policy "Allow staff members to view staff records"
  on public.staff for select
  using (auth.role() = 'authenticated');

create policy "Allow managers to write staff records"
  on public.staff for all
  using (public.has_permission('manage_staff'));

-- ENROLLMENTS policies
create policy "Allow parents and staff to view room enrollments"
  on public.enrollments for select
  using (public.is_parent_of_child(child_id) or public.has_permission('manage_staff'));

-- =========================================================================
-- 4. PROFILE GENERATION TRIGGER ON SIGNUP
-- =========================================================================

-- Trigger to create a profile automatically when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- 5. SEED DATA
-- =========================================================================

-- Insert default roles
insert into public.roles (name) values
  ('SUPER_ADMIN'),
  ('NURSERY_MANAGER'),
  ('ROOM_LEADER'),
  ('STAFF'),
  ('PARENT'),
  ('ACCOUNTANT')
on conflict (name) do nothing;

-- Insert default permissions
insert into public.permissions (key, description) values
  ('create_child', 'Can register new children'),
  ('update_child', 'Can edit children records'),
  ('delete_child', 'Can remove children records'),
  ('create_invoice', 'Can issue invoices'),
  ('approve_invoice', 'Can approve invoices and log payments'),
  ('manage_staff', 'Can hire or edit staff profiles and schedules'),
  ('manage_website', 'Can edit CMS pages and rooms lists'),
  ('manage_observations', 'Can record learning log observations')
on conflict (key) do nothing;

-- Map permissions to roles
do $$
declare
  manager_role_id uuid;
  leader_role_id uuid;
  staff_role_id uuid;
  accountant_role_id uuid;
  perm_create_child_id uuid;
  perm_update_child_id uuid;
  perm_delete_child_id uuid;
  perm_create_invoice_id uuid;
  perm_approve_invoice_id uuid;
  perm_manage_staff_id uuid;
  perm_manage_website_id uuid;
  perm_manage_observations_id uuid;
begin
  -- Fetch role IDs
  select id into manager_role_id from public.roles where name = 'NURSERY_MANAGER';
  select id into leader_role_id from public.roles where name = 'ROOM_LEADER';
  select id into staff_role_id from public.roles where name = 'STAFF';
  select id into accountant_role_id from public.roles where name = 'ACCOUNTANT';

  -- Fetch permission IDs
  select id into perm_create_child_id from public.permissions where key = 'create_child';
  select id into perm_update_child_id from public.permissions where key = 'update_child';
  select id into perm_delete_child_id from public.permissions where key = 'delete_child';
  select id into perm_create_invoice_id from public.permissions where key = 'create_invoice';
  select id into perm_approve_invoice_id from public.permissions where key = 'approve_invoice';
  select id into perm_manage_staff_id from public.permissions where key = 'manage_staff';
  select id into perm_manage_website_id from public.permissions where key = 'manage_website';
  select id into perm_manage_observations_id from public.permissions where key = 'manage_observations';

  -- Map NURSERY_MANAGER permissions
  insert into public.role_permissions (role_id, permission_id) values
    (manager_role_id, perm_create_child_id),
    (manager_role_id, perm_update_child_id),
    (manager_role_id, perm_delete_child_id),
    (manager_role_id, perm_create_invoice_id),
    (manager_role_id, perm_approve_invoice_id),
    (manager_role_id, perm_manage_staff_id),
    (manager_role_id, perm_manage_website_id),
    (manager_role_id, perm_manage_observations_id)
  on conflict do nothing;

  -- Map ROOM_LEADER permissions
  insert into public.role_permissions (role_id, permission_id) values
    (leader_role_id, perm_update_child_id),
    (leader_role_id, perm_manage_observations_id)
  on conflict do nothing;

  -- Map STAFF permissions
  insert into public.role_permissions (role_id, permission_id) values
    (staff_role_id, perm_manage_observations_id)
  on conflict do nothing;

  -- Map ACCOUNTANT permissions
  insert into public.role_permissions (role_id, permission_id) values
    (accountant_role_id, perm_create_invoice_id),
    (accountant_role_id, perm_approve_invoice_id)
  on conflict do nothing;
end $$;
