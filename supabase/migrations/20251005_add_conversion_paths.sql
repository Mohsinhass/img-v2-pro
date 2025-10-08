-- Add storage path columns to conversion history for previews/downloads
-- input_path: path to the original uploaded file in the private user-data bucket
-- output_path: path to the converted output file (optional)

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'conversion_history' and column_name = 'input_path'
  ) then
    alter table public.conversion_history add column input_path text;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'conversion_history' and column_name = 'output_path'
  ) then
    alter table public.conversion_history add column output_path text;
  end if;
end$$;

-- Optional: index to speed up queries filtering by user and time remains on created_at; paths are not indexed.
