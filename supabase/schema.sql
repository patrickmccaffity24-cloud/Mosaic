-- ============================================================
-- MOSAIC POLICY PORTAL — DATABASE SCHEMA
-- Run this in Supabase SQL editor (Database → SQL Editor → New query)
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: policies
-- ============================================================
create table if not exists policies (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  department text not null check (department in
    ('HR','Admin','Finance','Development','Programs','Productions','Operations')),
  summary text not null,
  clauses jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  adopted_date date,
  applies_to text,
  length_pages int,
  source_filename text,
  source_storage_path text,
  status text not null default 'draft' check (status in ('draft','pending_review','published','archived')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists policies_department_idx on policies(department);
create index if not exists policies_status_idx on policies(status);
create index if not exists policies_updated_idx on policies(updated_at desc);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists policies_updated_at on policies;
create trigger policies_updated_at
  before update on policies
  for each row execute function set_updated_at();

-- ============================================================
-- ROW-LEVEL SECURITY
-- Public can read published policies. Authenticated users (admins) can do everything.
-- ============================================================
alter table policies enable row level security;

drop policy if exists "public_read_published" on policies;
create policy "public_read_published" on policies
  for select using (status = 'published');

drop policy if exists "auth_all" on policies;
create policy "auth_all" on policies
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE: source PDFs
-- Run this manually in Supabase → Storage → Create new bucket → 'policy-sources' (private)
-- Then run the policies below in SQL editor
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('policy-sources', 'policy-sources', false)
  on conflict (id) do nothing;

drop policy if exists "auth_upload_sources" on storage.objects;
create policy "auth_upload_sources" on storage.objects
  for insert with check (bucket_id = 'policy-sources' and auth.role() = 'authenticated');

drop policy if exists "auth_read_sources" on storage.objects;
create policy "auth_read_sources" on storage.objects
  for select using (bucket_id = 'policy-sources' and auth.role() = 'authenticated');

drop policy if exists "auth_delete_sources" on storage.objects;
create policy "auth_delete_sources" on storage.objects
  for delete using (bucket_id = 'policy-sources' and auth.role() = 'authenticated');
