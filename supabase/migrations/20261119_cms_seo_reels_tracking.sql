-- Migration: Persistenza centralizzata CMS, SEO, Redirects, Reels & Tracking Config
-- Data: 2026-11-19

create table if not exists public.site_cms_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

comment on table public.site_cms_config is 'Configurazione centralizzata CMS (SEO pagine, Video Reels, Redirect 301/302, Tracking IDs GA4/GTM/GSC/Meta/Ads).';

alter table public.site_cms_config enable row level security;

drop policy if exists site_cms_service_all on public.site_cms_config;
create policy site_cms_service_all
  on public.site_cms_config
  for all
  to service_role
  using (true)
  with check (true);
