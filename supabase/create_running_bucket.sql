insert into storage.buckets (id, name, public)
values ('running_bk', 'running_bk', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "All access running_bk" on storage.objects;

create policy "All access running_bk"
on storage.objects
as permissive
for all
to anon
using (bucket_id = 'running_bk')
with check (bucket_id = 'running_bk');