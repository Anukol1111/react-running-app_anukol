create extension if not exists pgcrypto;

create table if not exists public.running_tb (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  run_date text not null,
  run_location text not null,
  run_distance int4 not null check (run_distance >= 0),
  run_time int4 not null check (run_time >= 0),
  run_image_url text not null
);

alter table public.running_tb enable row level security;

drop policy if exists "All access running_tb" on public.running_tb;

create policy "All access running_tb"
on public.running_tb
as permissive
for all
to anon
using (true)
with check (true);

comment on table public.running_tb is 'Stores running log entries for the React running app';