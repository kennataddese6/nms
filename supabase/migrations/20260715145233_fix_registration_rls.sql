-- Add insert policies for self-registration flows
create policy "Allow parents to insert their own records"
  on public.parents for insert
  with check (profile_id = auth.uid());

create policy "Allow authenticated users to insert child records"
  on public.children for insert
  with check (auth.role() = 'authenticated');

create policy "Allow parents to insert child relations"
  on public.child_parents for insert
  with check (parent_id in (
    select id from public.parents where profile_id = auth.uid()
  ));

-- Update handle_new_user() trigger function to assign the PARENT role by default
create or replace function public.handle_new_user()
returns trigger as $$
declare
  parent_role_id uuid;
begin
  -- 1. Insert user profile row
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );

  -- 2. Fetch the PARENT role ID and link it in user_roles
  select id into parent_role_id from public.roles where name = 'PARENT';
  if parent_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (new.id, parent_role_id)
    on conflict do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;
