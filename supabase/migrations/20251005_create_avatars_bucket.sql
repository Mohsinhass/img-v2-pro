-- Create avatars storage bucket and policies so users can upload avatar and banner images

do $$
begin
  -- Create bucket if it doesn't exist; ignore error if it already exists
  begin
    perform storage.create_bucket('avatars', public => true);
  exception when others then
    -- bucket probably exists; proceed
    null;
  end;
end$$;

-- Public read access to objects in the avatars bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'avatars_public_read'
  ) then
    create policy avatars_public_read on storage.objects
      for select using (bucket_id = 'avatars');
  end if;
end$$;

-- Authenticated users can upload to their own folder(s)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'avatars_auth_insert_own'
  ) then
    create policy avatars_auth_insert_own on storage.objects
      for insert to authenticated
      with check (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'banners/' || auth.uid()::text || '/%'
        )
      );
  end if;
end$$;

-- Authenticated users can update objects in their own folder(s)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'avatars_auth_update_own'
  ) then
    create policy avatars_auth_update_own on storage.objects
      for update to authenticated
      using (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'banners/' || auth.uid()::text || '/%'
        )
      )
      with check (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'banners/' || auth.uid()::text || '/%'
        )
      );
  end if;
end$$;

-- Authenticated users can delete objects in their own folder(s)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'avatars_auth_delete_own'
  ) then
    create policy avatars_auth_delete_own on storage.objects
      for delete to authenticated
      using (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (
          name like auth.uid()::text || '/%'
          or name like 'banners/' || auth.uid()::text || '/%'
        )
      );
  end if;
end$$;
