-- Drop existing select policy for children
drop policy if exists "Allow parents to read their children's records" on public.children;

-- Re-create select policy to allow unlinked child selection during parent signup
create policy "Allow parents to read their children's records"
  on public.children for select
  using (
    public.is_parent_of_child(id)
    or public.has_permission('manage_observations')
    or (auth.role() = 'authenticated' and not exists (
      select 1 from public.child_parents where child_id = id
    ))
  );
