-- Adds metadata fields to conversion_history and ensures RLS policies for user-owned updates

-- 1) Columns for details
alter table if exists public.conversion_history
  add column if not exists name text,
  add column if not exists description text,
  add column if not exists tags text,
  add column if not exists updated_at timestamptz default now();

-- 2) Ensure created_at exists (if your table didn't already have it)
alter table if exists public.conversion_history
  add column if not exists created_at timestamptz default now();

-- 3) Enable RLS and create safe policies for select/insert/update/delete on own rows
alter table if exists public.conversion_history enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'conversion_history' and policyname = 'select_own_conversions'
  ) then
    create policy select_own_conversions on public.conversion_history
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'conversion_history' and policyname = 'insert_own_conversions'
  ) then
    create policy insert_own_conversions on public.conversion_history
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'conversion_history' and policyname = 'update_own_conversions'
  ) then
    create policy update_own_conversions on public.conversion_history
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'conversion_history' and policyname = 'delete_own_conversions'
  ) then
    create policy delete_own_conversions on public.conversion_history
      for delete using (auth.uid() = user_id);
  end if;
end$$;

-- 4) Helpful index for faster listing
create index if not exists conversion_history_user_id_created_at_idx
  on public.conversion_history (user_id, created_at desc);

-- 5) Ask PostgREST (Supabase API layer) to reload the schema cache
notify pgrst, 'reload schema';
