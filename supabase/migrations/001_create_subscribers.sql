-- Migration: create_subscribers_table
-- Applied via Supabase MCP on project dabhfvdgcsmzlorbgdjq

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Index for fast email lookups
create index if not exists subscribers_email_idx on public.subscribers (email);

-- Enable Row Level Security
alter table public.subscribers enable row level security;

-- Allow inserts from anon (signup form via server action)
create policy "Allow anon insert" on public.subscribers
  for insert to anon with check (true);

-- No public read access
create policy "No public read" on public.subscribers
  for select to anon using (false);
