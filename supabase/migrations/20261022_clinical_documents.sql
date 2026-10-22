-- =============================================================================
-- Migration: clinical_documents (Referti, Documenti & Relazioni Cliniche)
-- Cocoora Centro Medico - Ecosistema CRM & Fascicolo Paziente
-- =============================================================================

create table if not exists public.clinical_documents (
  id                uuid primary key default gen_random_uuid(),
  patient_id        uuid not null references public.patient_profiles (id) on delete cascade,
  doctor_id         uuid references public.doctors (id) on delete set null,
  title             text not null,
  specialty         text not null,
  report_date       date not null default current_date,
  doctor_name       text not null,
  diagnosis         text,
  recommendations   text,
  document_code     text,
  is_ready          boolean not null default true,
  file_size         text default '2.4 MB',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists ix_clinical_documents_patient on public.clinical_documents (patient_id);
create index if not exists ix_clinical_documents_doctor on public.clinical_documents (doctor_id);
create index if not exists ix_clinical_documents_date on public.clinical_documents (report_date desc);

-- RLS
alter table public.clinical_documents enable row level security;

drop policy if exists "Allow read clinical_documents" on public.clinical_documents;
create policy "Allow read clinical_documents" on public.clinical_documents for select using (true);

drop policy if exists "Allow insert clinical_documents" on public.clinical_documents;
create policy "Allow insert clinical_documents" on public.clinical_documents for insert with check (true);

drop policy if exists "Allow update clinical_documents" on public.clinical_documents;
create policy "Allow update clinical_documents" on public.clinical_documents for update using (true);

drop policy if exists "Allow delete clinical_documents" on public.clinical_documents;
create policy "Allow delete clinical_documents" on public.clinical_documents for delete using (true);
