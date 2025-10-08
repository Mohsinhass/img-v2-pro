-- Create a private bucket 'user-data' for storing user-uploaded input files for conversions

do $$
begin
  -- Create private bucket if not exists
  begin
    perform storage.create_bucket('user-data', public => false);
  exception when others then
    -- bucket may already exist
    null;
  end;
end$$;

-- RLS policies for storage.objects to limit access to owners only (no public read)
-- Allowed paths examples inside 'user-data':
--   <user_id>/...
--   inputs/<user_id>/...
--   outputs/<user_id>/...

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'user_data_select_own'
  ) then
    create policy user_data_select_own on storage.objects
      for select to authenticated
      using (
        bucket_id = 'user-data'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'inputs/' || auth.uid()::text || '/%'
          or name like 'outputs/' || auth.uid()::text || '/%'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'user_data_insert_own'
  ) then
    create policy user_data_insert_own on storage.objects
      for insert to authenticated
      with check (
        bucket_id = 'user-data'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'inputs/' || auth.uid()::text || '/%'
          or name like 'outputs/' || auth.uid()::text || '/%'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'user_data_update_own'
  ) then
    create policy user_data_update_own on storage.objects
      for update to authenticated
      using (
        bucket_id = 'user-data'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'inputs/' || auth.uid()::text || '/%'
          or name like 'outputs/' || auth.uid()::text || '/%'
        )
      )
      with check (
        bucket_id = 'user-data'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'inputs/' || auth.uid()::text || '/%'
          or name like 'outputs/' || auth.uid()::text || '/%'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'user_data_delete_own'
  ) then
    create policy user_data_delete_own on storage.objects
      for delete to authenticated
      using (
        bucket_id = 'user-data'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'inputs/' || auth.uid()::text || '/%'
          or name like 'outputs/' || auth.uid()::text || '/%'
        )
      );
  end if;
end$$;

-- Ask PostgREST to reload schema
notify pgrst, 'reload schema';
