-- =============================================================================
--  COCOORA STUDIO MEDICO POLISPECIALISTICO (Napoli)
--  Migration : 20261016_cocoora_crm_schema.sql
--  Scope     : Schema relazionale PostgreSQL/Supabase per il Gestionale CRM
--              Receptionist, i Percorsi Salute Cocoora Club e la sincronizzazione
--              fatture verso Fatture in Cloud.
--  Author    : Antigravity — Backend Architecture
--  Note      : Migrazione idempotente (ri-eseguibile). Gli ID sono UUID.
--              I nomi delle colonne sono in inglese, i commenti in italiano.
-- =============================================================================

begin;

-- Le estensioni Supabase vivono nello schema `extensions`; lo aggiungiamo al
-- search_path così possiamo usare gli operatori GiST per il conflict-detection.
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;
set search_path = public, extensions;

-- =============================================================================
--  1. ENUMERAZIONI DI DOMINIO
-- =============================================================================

do $$ begin
  create type public.app_role as enum (
    'admin_creativia',   -- Antigravity / Creativia: super admin
    'receptionist',      -- Reception Cocoora: anagrafiche, piani, acconti
    'doctor',            -- Medici specialisti (accesso clinico limitato)
    'accountant',        -- Amministrazione / fatturazione
    'patient'            -- Paziente titolare di profilo
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gender_type as enum ('uomo', 'donna', 'altro', 'non_specificato');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.service_category as enum (
    'odontoiatria',
    'medicina_estetica',
    'visita_specialistica',
    'diagnostica',
    'precision',
    'igiene_prevenzione',
    'altro'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.path_level as enum (
    'free', 'basic', 'plus', 'premium', 'experience_plus', 'longevity', 'family_addon'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.plan_status as enum (
    'bozza', 'attivo', 'sospeso', 'completato', 'annullato'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'non_pagato', 'parzialmente_pagato', 'saldato', 'rimborsato'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.installment_type as enum ('acconto', 'rata', 'saldo', 'conguaglio');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.installment_status as enum (
    'previsto', 'pagato', 'scaduto', 'annullato', 'rimborsato'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_method as enum (
    'contanti', 'pos', 'stripe', 'klarna', 'paypal', 'bonifico', 'assegno', 'altro'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.appointment_status as enum (
    'richiesto', 'confermato', 'completato', 'annullato', 'no_show'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.guardian_relation as enum ('genitore', 'tutore', 'coniuge', 'altro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.fic_document_type as enum ('fattura', 'nota_credito', 'ricevuta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.fic_issue_reason as enum (
    'acconto', 'saldo', 'fine_percorso', 'rimborso_assicurativo'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.fic_sync_status as enum (
    'pending', 'queued', 'synced', 'error', 'void', 'skipped'
  );
exception when duplicate_object then null; end $$;

-- =============================================================================
--  2. ANAGRAFICA STUDIO: BRANCHE, SALE E MEDICI
-- =============================================================================

create table if not exists public.branches (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.branches is 'Branche cliniche (Odontoiatria, Estetica, Diagnostica, Precision...).';

create table if not exists public.clinic_rooms (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,                       -- es. 'Studio 1'
  floor         text,
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.clinic_rooms is 'Sale/ambulatori dello studio (Studio 1, Studio 2, Studio 3).';

create table if not exists public.doctors (
  id                    uuid primary key default gen_random_uuid(),
  auth_user_id          uuid unique references auth.users (id) on delete set null,
  slug                  text not null unique,
  full_name             text not null,
  title                 text,
  branch_id             uuid references public.branches (id) on delete set null,
  specialty_slug        text,                        -- link logico alle specialità di /servizi/diagnostica
  affiliation           text,
  badge                 text,
  photo_url             text,
  bio                   text,
  approach              text,
  curriculum            text[] not null default '{}',
  servizi               text[] not null default '{}',
  tariffa_visita        numeric(10,2) not null default 0 check (tariffa_visita >= 0),
  accepts_new_patients  boolean not null default true,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
comment on table public.doctors is 'Anagrafica medici: branca, curriculum, prestazioni e tariffa indicativa.';

create table if not exists public.doctor_availability (
  id            uuid primary key default gen_random_uuid(),
  doctor_id     uuid not null references public.doctors (id) on delete cascade,
  room_id       uuid references public.clinic_rooms (id) on delete set null,
  weekday       smallint not null check (weekday between 1 and 7),  -- 1 = Lunedì
  start_time    time not null,
  end_time      time not null,
  slot_minutes  integer not null default 30 check (slot_minutes between 5 and 240),
  valid_from    date,
  valid_to      date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_time > start_time)
);
comment on table public.doctor_availability is 'Orari ricorrenti settimanali dei medici per sala (Studio 1/2/3).';

create table if not exists public.medical_services (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  code              text unique,
  name              text not null,
  category          public.service_category not null default 'altro',
  branch_id         uuid references public.branches (id) on delete set null,
  description       text,
  duration_minutes  integer not null default 30 check (duration_minutes > 0),
  base_price        numeric(10,2) not null default 0 check (base_price >= 0),
  is_club_included  boolean not null default false,
  is_precision      boolean not null default false,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
comment on table public.medical_services is 'Catalogo prestazioni: Odontoiatria, Estetica, Visite Specialistiche, Diagnostica, Precision.';

create table if not exists public.doctor_services (
  doctor_id     uuid not null references public.doctors (id) on delete cascade,
  service_id    uuid not null references public.medical_services (id) on delete cascade,
  custom_price  numeric(10,2) check (custom_price is null or custom_price >= 0),
  is_active     boolean not null default true,
  primary key (doctor_id, service_id)
);
comment on table public.doctor_services is 'Matrice medico ↔ prestazione erogata, con eventuale tariffa dedicata.';

-- =============================================================================
--  3. MATRICE SINTOMI / INESTETISMI E PERCORSI SALUTE
-- =============================================================================

create table if not exists public.symptoms_attributes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  label        text not null,
  category     text not null default 'generale',   -- viso / corpo / sorriso / benessere / prevenzione
  area         text not null default 'salute_generale',
  description  text,
  icon         text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table public.symptoms_attributes is 'Sintomi e inestetismi per il filtro "Trova il tuo percorso".';

create table if not exists public.health_paths (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  code                  text unique,
  name                  text not null,
  tier_code             text,                        -- discover / access / care / ... / family-senior
  level                 public.path_level not null default 'basic',
  tagline               text,
  description           text,
  annual_price          numeric(10,2) not null default 0 check (annual_price >= 0),
  list_price            numeric(10,2) check (list_price is null or list_price >= 0),
  discount_percent      numeric(5,2) not null default 0 check (discount_percent between 0 and 100),
  validity_months       integer not null default 12 check (validity_months > 0),
  gender_toggle         boolean not null default false,
  is_family_addon       boolean not null default false,
  requires_adult_path   boolean not null default false,
  sort_order            integer not null default 0,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
comment on table public.health_paths is 'I 9 Percorsi Salute Cocoora Club (Discover → Signature Longevity + Family Care).';

create table if not exists public.health_path_services (
  health_path_id    uuid not null references public.health_paths (id) on delete cascade,
  service_id        uuid not null references public.medical_services (id) on delete cascade,
  included_quantity integer not null default 1 check (included_quantity > 0),
  gender_scope      public.gender_type not null default 'non_specificato', -- uomo/donna = esame differenziato
  is_optional       boolean not null default false,
  notes             text,
  primary key (health_path_id, service_id, gender_scope)
);
comment on table public.health_path_services is 'Servizi inclusi in ciascun Percorso Salute (con scope di genere uomo/donna).';

create table if not exists public.service_symptoms (
  service_id  uuid not null references public.medical_services (id) on delete cascade,
  symptom_id  uuid not null references public.symptoms_attributes (id) on delete cascade,
  weight      numeric(4,2) not null default 1.0 check (weight > 0),
  primary key (service_id, symptom_id)
);
comment on table public.service_symptoms is 'Matrice prestazione ↔ sintomo/inestetismo (peso di rilevanza per il matching).';

create table if not exists public.path_symptoms (
  health_path_id  uuid not null references public.health_paths (id) on delete cascade,
  symptom_id      uuid not null references public.symptoms_attributes (id) on delete cascade,
  weight          numeric(4,2) not null default 1.0 check (weight > 0),
  primary key (health_path_id, symptom_id)
);
comment on table public.path_symptoms is 'Matrice percorso ↔ sintomo/inestetismo per il matching "Trova il tuo percorso".';

-- =============================================================================
--  4. PAZIENTI (MULTI-ANAGRAFICA) E RUOLI APPLICATIVI
-- =============================================================================

-- Sequence per la numerazione progressiva delle anagrafiche e dei piani.
create sequence if not exists public.patient_code_seq start 1000;
create sequence if not exists public.plan_code_seq start 1000;

create table if not exists public.patient_profiles (
  id                    uuid primary key default gen_random_uuid(),
  auth_user_id          uuid unique references auth.users (id) on delete set null,
  patient_code          text not null unique,        -- patient_id univoco (COC-2026-00001)
  family_group_id       uuid,                        -- raggruppa più anagrafiche sotto un unico account
  is_account_holder     boolean not null default false,
  guardian_patient_id   uuid references public.patient_profiles (id) on delete set null,
  relationship          public.guardian_relation,
  first_name            text not null,
  last_name             text not null,
  fiscal_code           text,
  email                 text,                        -- NON univoca: 2-3 pazienti possono condividere la stessa email
  phone                 text,
  birth_date            date,
  gender                public.gender_type not null default 'non_specificato',
  address               text,
  city                  text,
  cap                   text,
  province              text,
  country               text not null default 'IT',
  health_path_id        uuid references public.health_paths (id) on delete set null,
  health_path_started_on date,
  health_path_expires_on date,
  notes                 text,
  gdpr_consent_at       timestamptz,
  gdpr_marketing        boolean not null default false,
  is_active             boolean not null default true,
  created_by            uuid references auth.users (id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
comment on table public.patient_profiles is
  'Anagrafiche pazienti. La stessa email può essere condivisa da più pazienti (family_group_id), il patient_code resta univoco.';

create unique index if not exists ux_patient_profiles_fiscal_code
  on public.patient_profiles (upper(fiscal_code)) where fiscal_code is not null;
create index if not exists ix_patient_profiles_email
  on public.patient_profiles (lower(email));
create index if not exists ix_patient_profiles_family
  on public.patient_profiles (family_group_id);
create index if not exists ix_patient_profiles_health_path
  on public.patient_profiles (health_path_id);

create table if not exists public.user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        public.app_role not null,
  doctor_id   uuid references public.doctors (id) on delete cascade,
  patient_id  uuid references public.patient_profiles (id) on delete cascade,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, role)
);
comment on table public.user_roles is
  'RBAC applicativo: collega auth.users ai ruoli Receptionist, Medico, Paziente, Admin Creativia, Accountant.';

-- =============================================================================
--  5. PIANI TERAPEUTICI, RATE E FATTURAZIONE
-- =============================================================================

create table if not exists public.patient_treatment_plans (
  id                 uuid primary key default gen_random_uuid(),
  plan_code          text not null unique,           -- PT-2026-00001
  patient_id         uuid not null references public.patient_profiles (id) on delete cascade,
  doctor_id          uuid references public.doctors (id) on delete set null,
  branch_id          uuid references public.branches (id) on delete set null,
  health_path_id     uuid references public.health_paths (id) on delete set null,
  title              text not null,
  description        text,
  total_amount       numeric(12,2) not null default 0 check (total_amount >= 0),   -- tipico €900 – €3.000
  discount_amount    numeric(12,2) not null default 0 check (discount_amount >= 0),
  net_total          numeric(12,2) not null default 0,   -- calcolato: total_amount - discount_amount
  paid_total         numeric(12,2) not null default 0,   -- calcolato dal trigger sulle rate
  balance_due        numeric(12,2) not null default 0,   -- calcolato: saldo residuo
  status             public.plan_status not null default 'bozza',
  payment_status     public.payment_status not null default 'non_pagato',
  start_date         date,
  expected_end_date  date,
  duration_years     integer check (duration_years between 0 and 10),
  installment_plan   jsonb,                          -- snapshot del piano rate concordato
  notes              text,
  created_by         uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  check (discount_amount <= total_amount)
);
comment on table public.patient_treatment_plans is
  'Piani terapeutici pluriennali (€900 – €3.000) con totale, acconti, saldo residuo e stato pagamento.';

create index if not exists ix_treatment_plans_patient on public.patient_treatment_plans (patient_id);
create index if not exists ix_treatment_plans_doctor on public.patient_treatment_plans (doctor_id);
create index if not exists ix_treatment_plans_status on public.patient_treatment_plans (status, payment_status);

create table if not exists public.treatment_installments (
  id                  uuid primary key default gen_random_uuid(),
  plan_id             uuid not null references public.patient_treatment_plans (id) on delete cascade,
  patient_id          uuid not null references public.patient_profiles (id) on delete cascade,
  installment_number  integer not null check (installment_number > 0),
  installment_type    public.installment_type not null default 'rata',
  label               text,
  amount              numeric(12,2) not null check (amount <> 0),
  due_date            date,
  status              public.installment_status not null default 'previsto',
  payment_method      public.payment_method,
  paid_at             timestamptz,
  receipt_number      text,
  external_payment_id text,                          -- Stripe PI, Klarna order id, transazione POS...
  notes               text,
  registered_by       uuid references auth.users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (plan_id, installment_number)
);
comment on table public.treatment_installments is
  'Rate e acconti singoli con metodo di pagamento (contanti, POS, Stripe, Klarna, PayPal...).';

create index if not exists ix_installments_plan on public.treatment_installments (plan_id);
create index if not exists ix_installments_patient on public.treatment_installments (patient_id);
create index if not exists ix_installments_status_due on public.treatment_installments (status, due_date);

create table if not exists public.fatture_in_cloud_sync (
  id                  uuid primary key default gen_random_uuid(),
  idempotency_key     text not null unique,          -- evita doppie emissioni
  patient_id          uuid not null references public.patient_profiles (id) on delete cascade,
  plan_id             uuid references public.patient_treatment_plans (id) on delete set null,
  installment_id      uuid references public.treatment_installments (id) on delete set null,
  document_type       public.fic_document_type not null default 'fattura',
  issue_reason        public.fic_issue_reason not null default 'acconto',
  amount              numeric(12,2) not null check (amount >= 0),
  vat_amount          numeric(12,2) not null default 0,
  currency            text not null default 'EUR',
  fiscal_year         integer,
  fic_entity_id       text,
  fic_document_id     text,
  fic_document_number text,
  fic_document_url    text,
  status              public.fic_sync_status not null default 'pending',
  request_payload     jsonb,
  response_payload    jsonb,
  error_message       text,
  retry_count         integer not null default 0,
  last_attempt_at     timestamptz,
  synced_at           timestamptz,
  created_by          uuid references auth.users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.fatture_in_cloud_sync is
  'Tracciamento emissione fatture su Fatture in Cloud (ad ogni acconto oppure a saldo/fine percorso per rimborso assicurativo).';

create index if not exists ix_fic_sync_patient on public.fatture_in_cloud_sync (patient_id);
create index if not exists ix_fic_sync_plan on public.fatture_in_cloud_sync (plan_id);
create index if not exists ix_fic_sync_status on public.fatture_in_cloud_sync (status);

-- =============================================================================
--  6. AGENDA RECEPTION
-- =============================================================================

create table if not exists public.appointments (
  id                 uuid primary key default gen_random_uuid(),
  patient_id         uuid not null references public.patient_profiles (id) on delete cascade,
  doctor_id          uuid references public.doctors (id) on delete set null,
  room_id            uuid references public.clinic_rooms (id) on delete set null,
  service_id         uuid references public.medical_services (id) on delete set null,
  treatment_plan_id  uuid references public.patient_treatment_plans (id) on delete set null,
  starts_at          timestamptz not null,
  ends_at            timestamptz not null,
  status             public.appointment_status not null default 'richiesto',
  is_first_visit     boolean not null default false,
  notes              text,
  created_by         uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  check (ends_at > starts_at)
);
comment on table public.appointments is 'Agenda reception: appuntamenti paziente ↔ medico ↔ sala ↔ prestazione.';

create index if not exists ix_appointments_doctor_start on public.appointments (doctor_id, starts_at);
create index if not exists ix_appointments_patient on public.appointments (patient_id);
create index if not exists ix_appointments_status on public.appointments (status);

-- Conflict-detection a livello DB: nessun doppio booking per medico o per sala.
alter table public.appointments drop constraint if exists appointments_no_overlap;
alter table public.appointments add constraint appointments_no_overlap
  exclude using gist (doctor_id with =, tstzrange(starts_at, ends_at, '[)') with &&)
  where (status in ('richiesto', 'confermato') and doctor_id is not null);

alter table public.appointments drop constraint if exists appointments_room_no_overlap;
alter table public.appointments add constraint appointments_room_no_overlap
  exclude using gist (room_id with =, tstzrange(starts_at, ends_at, '[)') with &&)
  where (status in ('richiesto', 'confermato') and room_id is not null);

-- =============================================================================
--  7. AUDIT LOG GDPR
-- =============================================================================

create table if not exists public.crm_audit_log (
  id             bigint generated always as identity primary key,
  actor_user_id  uuid references auth.users (id) on delete set null,
  actor_role     public.app_role,
  table_name     text not null,
  record_id      text,
  action         text not null,                      -- INSERT / UPDATE / DELETE
  diff           jsonb,
  created_at     timestamptz not null default now()
);
comment on table public.crm_audit_log is 'Audit trail GDPR delle operazioni su anagrafiche, piani, rate e fatture.';

create index if not exists ix_crm_audit_table on public.crm_audit_log (table_name, created_at desc);
create index if not exists ix_crm_audit_actor on public.crm_audit_log (actor_user_id);

-- =============================================================================
--  8. FUNZIONI DI SUPPORTO
-- =============================================================================

-- 8.1 updated_at automatico --------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- 8.2 Codici progressivi -----------------------------------------------------
create or replace function public.gen_patient_code()
returns trigger language plpgsql as $$
begin
  if new.patient_code is null or new.patient_code = '' then
    new.patient_code := 'COC-' || to_char(now(), 'YYYY') || '-' ||
                        lpad(nextval('public.patient_code_seq')::text, 5, '0');
  end if;
  return new;
end $$;

create or replace function public.gen_plan_code()
returns trigger language plpgsql as $$
begin
  if new.plan_code is null or new.plan_code = '' then
    new.plan_code := 'PT-' || to_char(now(), 'YYYY') || '-' ||
                     lpad(nextval('public.plan_code_seq')::text, 5, '0');
  end if;
  return new;
end $$;

-- 8.3 Ricalcolo saldi piano (SECURITY DEFINER: bypassa RLS) -------------------
create or replace function public.recalc_plan_financials(p_plan_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_net          numeric(12,2);
  v_paid         numeric(12,2);
  v_current      public.plan_status;
  v_payment      public.payment_status;
begin
  select greatest(total_amount - discount_amount, 0), status
    into v_net, v_current
    from public.patient_treatment_plans
   where id = p_plan_id;

  if not found then
    return;
  end if;

  select coalesce(sum(amount), 0)
    into v_paid
    from public.treatment_installments
   where plan_id = p_plan_id
     and status = 'pagato';

  if v_paid <= 0 then
    v_payment := 'non_pagato';
  elsif v_paid < v_net then
    v_payment := 'parzialmente_pagato';
  else
    v_payment := 'saldato';
  end if;

  update public.patient_treatment_plans
     set net_total      = v_net,
         paid_total     = v_paid,
         balance_due    = greatest(v_net - v_paid, 0),
         payment_status = v_payment,
         status = case
                    when v_current in ('bozza', 'attivo') and v_net > 0 and v_paid >= v_net
                      then 'completato'::public.plan_status
                    else v_current
                  end,
         updated_at = now()
   where id = p_plan_id;
end $$;

-- 8.4 Trigger: coerenza rate → piano ----------------------------------------
-- Trigger: quando cambia il totale (o lo sconto) di un piano, ricalcola i saldi.
create or replace function public.trg_plan_recalc()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.recalc_plan_financials(new.id);
  return new;
end $$;

create or replace function public.trg_installment_sync()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalc_plan_financials(old.plan_id);
    return old;
  elsif tg_op = 'UPDATE' and new.plan_id is distinct from old.plan_id then
    perform public.recalc_plan_financials(old.plan_id);
    perform public.recalc_plan_financials(new.plan_id);
    return new;
  else
    perform public.recalc_plan_financials(new.plan_id);
    return new;
  end if;
end $$;

create or replace function public.trg_set_installment_patient()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.patient_id is null then
    select patient_id into new.patient_id
      from public.patient_treatment_plans
     where id = new.plan_id;
  end if;
  if new.patient_id is null then
    raise exception 'Impossibile determinare patient_id per il piano %', new.plan_id;
  end if;
  return new;
end $$;

-- 8.5 Audit trail ------------------------------------------------------------
create or replace function public.audit_trigger()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_record_id text;
begin
  if tg_op = 'DELETE' then
    v_record_id := coalesce(old.id::text, '');
  else
    v_record_id := coalesce(new.id::text, '');
  end if;

  insert into public.crm_audit_log (actor_user_id, actor_role, table_name, record_id, action, diff)
  values (
    auth.uid(),
    public.current_app_role(),
    tg_table_name,
    v_record_id,
    tg_op,
    case tg_op
      when 'INSERT' then jsonb_build_object('new', to_jsonb(new))
      when 'UPDATE' then jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
      else jsonb_build_object('old', to_jsonb(old))
    end
  );
  return null;
end $$;

-- =============================================================================
--  9. FUNZIONI DI AUTORIZZAZIONE (RLS)
-- =============================================================================

create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role
    from public.user_roles
   where user_id = auth.uid()
     and is_active
   order by case role
              when 'admin_creativia' then 0
              when 'receptionist'    then 1
              when 'accountant'      then 2
              when 'doctor'          then 3
              else 4
            end
   limit 1;
$$;

create or replace function public.has_role(variadic p_roles public.app_role[])
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
     where user_id = auth.uid()
       and is_active
       and role = any (p_roles)
  );
$$;

create or replace function public.is_admin_creativia()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin_creativia');
$$;

-- Staff operativo = Admin Creativia + Receptionist
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin_creativia', 'receptionist');
$$;

-- Ambito fatturazione = Admin + Accountant + Receptionist (lettura/scrittura fatture)
create or replace function public.is_billing()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin_creativia', 'accountant', 'receptionist');
$$;

create or replace function public.current_doctor_id()
returns uuid language sql stable security definer set search_path = public as $$
  select coalesce(
    (select doctor_id from public.user_roles
      where user_id = auth.uid() and is_active and role = 'doctor' and doctor_id is not null
      limit 1),
    (select id from public.doctors where auth_user_id = auth.uid() limit 1)
  );
$$;

create or replace function public.current_patient_id()
returns uuid language sql stable security definer set search_path = public as $$
  select coalesce(
    (select patient_id from public.user_roles
      where user_id = auth.uid() and is_active and role = 'patient' and patient_id is not null
      limit 1),
    (select id from public.patient_profiles where auth_user_id = auth.uid() limit 1)
  );
$$;

create or replace function public.doctor_can_access_patient(p_patient_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
           select 1 from public.patient_treatment_plans tp
            where tp.patient_id = p_patient_id and tp.doctor_id = public.current_doctor_id()
         )
      or exists (
           select 1 from public.appointments a
            where a.patient_id = p_patient_id and a.doctor_id = public.current_doctor_id()
         );
$$;

create or replace function public.doctor_can_access_plan(p_plan_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.patient_treatment_plans
     where id = p_plan_id and doctor_id = public.current_doctor_id()
  );
$$;

-- =============================================================================
-- 10. TRIGGER
-- =============================================================================

do $$
declare
  t text;
  audited text[] := array[
    'patient_profiles', 'patient_treatment_plans', 'treatment_installments',
    'fatture_in_cloud_sync', 'user_roles'
  ];
begin
  foreach t in array array[
    'branches', 'clinic_rooms', 'doctors', 'doctor_availability', 'medical_services',
    'symptoms_attributes', 'health_paths', 'patient_profiles', 'user_roles',
    'patient_treatment_plans', 'treatment_installments', 'fatture_in_cloud_sync',
    'appointments'
  ]
  loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s', t);
    execute format(
      'create trigger trg_%1$s_updated_at before update on public.%1$s
       for each row execute function public.set_updated_at()', t);
  end loop;

  foreach t in array audited
  loop
    execute format('drop trigger if exists trg_%1$s_audit on public.%1$s', t);
    execute format(
      'create trigger trg_%1$s_audit after insert or update or delete on public.%1$s
       for each row execute function public.audit_trigger()', t);
  end loop;
end $$;

drop trigger if exists trg_patient_profiles_code on public.patient_profiles;
create trigger trg_patient_profiles_code
  before insert on public.patient_profiles
  for each row execute function public.gen_patient_code();

drop trigger if exists trg_treatment_plans_code on public.patient_treatment_plans;
create trigger trg_treatment_plans_code
  before insert on public.patient_treatment_plans
  for each row execute function public.gen_plan_code();

drop trigger if exists trg_treatment_plans_recalc on public.patient_treatment_plans;
create trigger trg_treatment_plans_recalc
  after insert or update of total_amount, discount_amount on public.patient_treatment_plans
  for each row execute function public.trg_plan_recalc();

drop trigger if exists trg_installments_patient on public.treatment_installments;
create trigger trg_installments_patient
  before insert or update on public.treatment_installments
  for each row execute function public.trg_set_installment_patient();

drop trigger if exists trg_installments_sync on public.treatment_installments;
create trigger trg_installments_sync
  after insert or update or delete on public.treatment_installments
  for each row execute function public.trg_installment_sync();

-- =============================================================================
-- 11. VIEWS (security_invoker → applicano la RLS delle tabelle sottostanti)
-- =============================================================================

create or replace view public.v_patient_balance_summary
with (security_invoker = true) as
select
  pp.id                as patient_id,
  pp.patient_code,
  pp.first_name || ' ' || pp.last_name as patient_name,
  pp.email,
  count(distinct tp.id)                              as plans_count,
  coalesce(sum(tp.net_total), 0)                     as plans_net_total,
  coalesce(sum(tp.paid_total), 0)                    as plans_paid_total,
  coalesce(sum(tp.balance_due), 0)                   as plans_balance_due
from public.patient_profiles pp
left join public.patient_treatment_plans tp on tp.patient_id = pp.id
group by pp.id, pp.patient_code, pp.first_name, pp.last_name, pp.email;
comment on view public.v_patient_balance_summary is 'Riepilogo economico per paziente (usato dalla reception).';

create or replace view public.v_installments_due
with (security_invoker = true) as
select
  ti.id,
  ti.plan_id,
  tp.plan_code,
  ti.patient_id,
  pp.patient_code,
  pp.first_name || ' ' || pp.last_name as patient_name,
  ti.installment_number,
  ti.installment_type,
  ti.label,
  ti.amount,
  ti.due_date,
  ti.status,
  (current_date - ti.due_date) as days_overdue
from public.treatment_installments ti
join public.patient_treatment_plans tp on tp.id = ti.plan_id
join public.patient_profiles pp on pp.id = ti.patient_id
where ti.status in ('previsto', 'scaduto');
comment on view public.v_installments_due is 'Rate previste/scadute per il cruscotto incassi reception.';

create or replace view public.v_reception_day_schedule
with (security_invoker = true) as
select
  a.id,
  a.starts_at,
  a.ends_at,
  a.status,
  a.is_first_visit,
  pp.patient_code,
  pp.first_name || ' ' || pp.last_name as patient_name,
  pp.phone,
  d.full_name   as doctor_name,
  r.name        as room_name,
  ms.name       as service_name,
  a.treatment_plan_id
from public.appointments a
join public.patient_profiles pp on pp.id = a.patient_id
left join public.doctors d on d.id = a.doctor_id
left join public.clinic_rooms r on r.id = a.room_id
left join public.medical_services ms on ms.id = a.service_id;
comment on view public.v_reception_day_schedule is 'Agenda giornaliera reception (paziente, medico, sala, prestazione).';

-- Motore del filtro "Trova il tuo percorso": dato un insieme di sintomi,
-- restituisce i percorsi e i servizi più pertinenti con il relativo punteggio.
create or replace function public.match_paths_by_symptoms(p_symptom_slugs text[])
returns table (
  health_path_id uuid,
  slug           text,
  name           text,
  level          public.path_level,
  annual_price   numeric,
  score          numeric
)
language sql stable security invoker set search_path = public as $$
  select hp.id, hp.slug, hp.name, hp.level, hp.annual_price,
         sum(ps.weight)::numeric as score
    from public.path_symptoms ps
    join public.health_paths hp on hp.id = ps.health_path_id
    join public.symptoms_attributes sa on sa.id = ps.symptom_id
   where sa.slug = any (p_symptom_slugs)
     and hp.is_active
   group by hp.id, hp.slug, hp.name, hp.level, hp.annual_price
   order by score desc, hp.sort_order;
$$;
comment on function public.match_paths_by_symptoms(text[]) is
  'Restituisce i Percorsi Salute pertinenti agli inestetismi selezionati, ordinati per punteggio.';

create or replace function public.match_services_by_symptoms(p_symptom_slugs text[])
returns table (
  service_id uuid,
  slug       text,
  name       text,
  category   public.service_category,
  base_price numeric,
  score      numeric
)
language sql stable security invoker set search_path = public as $$
  select ms.id, ms.slug, ms.name, ms.category, ms.base_price,
         sum(ss.weight)::numeric as score
    from public.service_symptoms ss
    join public.medical_services ms on ms.id = ss.service_id
    join public.symptoms_attributes sa on sa.id = ss.symptom_id
   where sa.slug = any (p_symptom_slugs)
     and ms.is_active
   group by ms.id, ms.slug, ms.name, ms.category, ms.base_price
   order by score desc, ms.sort_order;
$$;
comment on function public.match_services_by_symptoms(text[]) is
  'Restituisce le prestazioni pertinenti agli inestetismi selezionati, ordinate per punteggio.';

-- Verifica disponibilità slot (usata dalla reception prima dell'inserimento).
create or replace function public.is_slot_available(
  p_doctor_id uuid,
  p_starts_at timestamptz,
  p_ends_at   timestamptz,
  p_exclude_appointment_id uuid default null
)
returns boolean language sql stable security invoker set search_path = public as $$
  select not exists (
    select 1 from public.appointments a
     where a.doctor_id = p_doctor_id
       and a.status in ('richiesto', 'confermato')
       and a.id is distinct from p_exclude_appointment_id
       and tstzrange(a.starts_at, a.ends_at, '[)') && tstzrange(p_starts_at, p_ends_at, '[)')
  );
$$;

-- =============================================================================
-- 12. ROW LEVEL SECURITY
-- =============================================================================

-- 12.1 Catalogo pubblico (lettura anon, gestione staff) ----------------------
do $$
declare
  t text;
  catalog text[] := array[
    'branches', 'clinic_rooms', 'doctors', 'doctor_availability', 'medical_services',
    'doctor_services', 'symptoms_attributes', 'health_paths', 'health_path_services',
    'service_symptoms', 'path_symptoms'
  ];
begin
  foreach t in array catalog loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_public_read', t);
    execute format('drop policy if exists %I on public.%I', t || '_staff_manage', t);
    execute format(
      'create policy %I on public.%I for all to authenticated
         using (public.is_staff()) with check (public.is_staff())',
      t || '_staff_manage', t);
  end loop;
end $$;

-- I medici possono aggiornare la propria scheda e i propri orari.
drop policy if exists doctors_self_update on public.doctors;
create policy doctors_self_update on public.doctors
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

drop policy if exists doctor_availability_self_manage on public.doctor_availability;
create policy doctor_availability_self_manage on public.doctor_availability
  for all to authenticated
  using (doctor_id = public.current_doctor_id())
  with check (doctor_id = public.current_doctor_id());

-- 12.2 Ruoli applicativi -----------------------------------------------------
alter table public.user_roles enable row level security;
drop policy if exists user_roles_self_read on public.user_roles;
create policy user_roles_self_read on public.user_roles
  for select to authenticated using (user_id = auth.uid());
drop policy if exists user_roles_admin_all on public.user_roles;
create policy user_roles_admin_all on public.user_roles
  for all to authenticated
  using (public.is_admin_creativia())
  with check (public.is_admin_creativia());

-- 12.3 Pazienti --------------------------------------------------------------
alter table public.patient_profiles enable row level security;

drop policy if exists patients_staff_all on public.patient_profiles;
create policy patients_staff_all on public.patient_profiles
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists patients_billing_read on public.patient_profiles;
create policy patients_billing_read on public.patient_profiles
  for select to authenticated using (public.has_role('accountant'));

drop policy if exists patients_doctor_read on public.patient_profiles;
create policy patients_doctor_read on public.patient_profiles
  for select to authenticated
  using (public.has_role('doctor') and public.doctor_can_access_patient(id));

drop policy if exists patients_self_read on public.patient_profiles;
create policy patients_self_read on public.patient_profiles
  for select to authenticated using (auth_user_id = auth.uid());

drop policy if exists patients_self_update on public.patient_profiles;
create policy patients_self_update on public.patient_profiles
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- 12.4 Piani terapeutici -----------------------------------------------------
alter table public.patient_treatment_plans enable row level security;

drop policy if exists plans_staff_all on public.patient_treatment_plans;
create policy plans_staff_all on public.patient_treatment_plans
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists plans_billing_read on public.patient_treatment_plans;
create policy plans_billing_read on public.patient_treatment_plans
  for select to authenticated using (public.has_role('accountant'));

drop policy if exists plans_doctor_read on public.patient_treatment_plans;
create policy plans_doctor_read on public.patient_treatment_plans
  for select to authenticated using (doctor_id = public.current_doctor_id());

drop policy if exists plans_doctor_update on public.patient_treatment_plans;
create policy plans_doctor_update on public.patient_treatment_plans
  for update to authenticated
  using (doctor_id = public.current_doctor_id())
  with check (doctor_id = public.current_doctor_id());

drop policy if exists plans_patient_read on public.patient_treatment_plans;
create policy plans_patient_read on public.patient_treatment_plans
  for select to authenticated using (patient_id = public.current_patient_id());

-- 12.5 Rate e acconti --------------------------------------------------------
alter table public.treatment_installments enable row level security;

drop policy if exists installments_staff_all on public.treatment_installments;
create policy installments_staff_all on public.treatment_installments
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists installments_billing_read on public.treatment_installments;
create policy installments_billing_read on public.treatment_installments
  for select to authenticated using (public.has_role('accountant'));

drop policy if exists installments_billing_update on public.treatment_installments;
create policy installments_billing_update on public.treatment_installments
  for update to authenticated
  using (public.has_role('accountant'))
  with check (public.has_role('accountant'));

drop policy if exists installments_doctor_read on public.treatment_installments;
create policy installments_doctor_read on public.treatment_installments
  for select to authenticated using (public.doctor_can_access_plan(plan_id));

drop policy if exists installments_patient_read on public.treatment_installments;
create policy installments_patient_read on public.treatment_installments
  for select to authenticated using (patient_id = public.current_patient_id());

-- 12.6 Fatture in Cloud ------------------------------------------------------
alter table public.fatture_in_cloud_sync enable row level security;

drop policy if exists fic_admin_all on public.fatture_in_cloud_sync;
create policy fic_admin_all on public.fatture_in_cloud_sync
  for all to authenticated
  using (public.is_admin_creativia())
  with check (public.is_admin_creativia());

drop policy if exists fic_staff_manage on public.fatture_in_cloud_sync;
create policy fic_staff_manage on public.fatture_in_cloud_sync
  for select to authenticated using (public.is_staff());

drop policy if exists fic_staff_insert on public.fatture_in_cloud_sync;
create policy fic_staff_insert on public.fatture_in_cloud_sync
  for insert to authenticated with check (public.is_staff());

drop policy if exists fic_staff_update on public.fatture_in_cloud_sync;
create policy fic_staff_update on public.fatture_in_cloud_sync
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists fic_accountant_read on public.fatture_in_cloud_sync;
create policy fic_accountant_read on public.fatture_in_cloud_sync
  for select to authenticated using (public.has_role('accountant'));

drop policy if exists fic_accountant_update on public.fatture_in_cloud_sync;
create policy fic_accountant_update on public.fatture_in_cloud_sync
  for update to authenticated
  using (public.has_role('accountant')) with check (public.has_role('accountant'));

drop policy if exists fic_patient_read on public.fatture_in_cloud_sync;
create policy fic_patient_read on public.fatture_in_cloud_sync
  for select to authenticated using (patient_id = public.current_patient_id());

-- 12.7 Agenda ----------------------------------------------------------------
alter table public.appointments enable row level security;

drop policy if exists appointments_staff_all on public.appointments;
create policy appointments_staff_all on public.appointments
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists appointments_doctor_read on public.appointments;
create policy appointments_doctor_read on public.appointments
  for select to authenticated using (doctor_id = public.current_doctor_id());

drop policy if exists appointments_doctor_update on public.appointments;
create policy appointments_doctor_update on public.appointments
  for update to authenticated
  using (doctor_id = public.current_doctor_id())
  with check (doctor_id = public.current_doctor_id());

drop policy if exists appointments_patient_read on public.appointments;
create policy appointments_patient_read on public.appointments
  for select to authenticated using (patient_id = public.current_patient_id());

drop policy if exists appointments_patient_request on public.appointments;
create policy appointments_patient_request on public.appointments
  for insert to authenticated
  with check (patient_id = public.current_patient_id() and status = 'richiesto');

-- 12.8 Audit log -------------------------------------------------------------
alter table public.crm_audit_log enable row level security;
drop policy if exists audit_admin_read on public.crm_audit_log;
create policy audit_admin_read on public.crm_audit_log
  for select to authenticated using (public.is_admin_creativia());

-- =============================================================================
-- 13. GRANTS ESPLICITI (la RLS resta l'autorità finale)
-- =============================================================================

grant usage on schema public to anon, authenticated;

grant select on
  public.branches, public.clinic_rooms, public.doctors, public.doctor_availability,
  public.medical_services, public.doctor_services, public.symptoms_attributes,
  public.health_paths, public.health_path_services, public.service_symptoms,
  public.path_symptoms
to anon, authenticated;

grant select, insert, update, delete on
  public.patient_profiles, public.user_roles, public.patient_treatment_plans,
  public.treatment_installments, public.fatture_in_cloud_sync, public.appointments,
  public.crm_audit_log
to authenticated;

grant select, insert, update, delete on
  public.branches, public.clinic_rooms, public.doctors, public.doctor_availability,
  public.medical_services, public.doctor_services, public.symptoms_attributes,
  public.health_paths, public.health_path_services, public.service_symptoms,
  public.path_symptoms
to authenticated;

grant execute on function
  public.match_paths_by_symptoms(text[]),
  public.match_services_by_symptoms(text[]),
  public.is_slot_available(uuid, timestamptz, timestamptz, uuid)
to anon, authenticated;

grant execute on function
  public.current_app_role(),
  public.is_admin_creativia(),
  public.is_staff(),
  public.is_billing(),
  public.current_doctor_id(),
  public.current_patient_id(),
  public.doctor_can_access_patient(uuid),
  public.doctor_can_access_plan(uuid)
to authenticated;

-- =============================================================================
-- 14. SEED — CATALOGO, SINTOMI, PERCORSI SALUTE
-- =============================================================================

-- 14.1 Branche ---------------------------------------------------------------
insert into public.branches (slug, name, description, sort_order)
select v.slug, v.name, v.description, v.ord
from (values
  ('odontoiatria',            'Odontoiatria & Ortodonzia Digitale', 'Prevenzione, ortodonzia, implantologia e cura del sorriso.', 10),
  ('medicina-estetica',       'Medicina Estetica & Rigenerativa',   'Qualità della pelle, armonizzazione del volto e rimodellamento corporeo.', 20),
  ('visite-specialistiche',   'Visite Specialistiche & Diagnostica', 'Poliambulatorio multidisciplinare e diagnostica rapida.', 30),
  ('precision',               'Cocoora Precision',                 'Genomica, microbiota e medicina predittiva.', 40),
  ('nutrizione',              'Nutrizione Clinica & Metabolismo',  'Piani nutrizionali personalizzati su base clinica.', 50)
) as v(slug, name, description, ord)
on conflict (slug) do nothing;

-- 14.2 Sale / Studi ----------------------------------------------------------
insert into public.clinic_rooms (slug, name, floor, description)
select v.slug, v.name, v.floor, v.description
from (values
  ('studio-1', 'Studio 1', 'Piano 1', 'Ambulatorio polivalente — visite specialistiche e diagnostica.'),
  ('studio-2', 'Studio 2', 'Piano 1', 'Sala odontoiatrica digitale con tecnologia 3D.'),
  ('studio-3', 'Studio 3', 'Piano 2', 'Sala medicina estetica e trattamenti rigenerativi.')
) as v(slug, name, floor, description)
on conflict (slug) do nothing;

-- 14.3 Catalogo prestazioni --------------------------------------------------
insert into public.medical_services
  (slug, code, name, category, branch_id, description, duration_minutes, base_price, is_club_included, is_precision, sort_order)
select v.slug, v.code, v.name, v.category::public.service_category, b.id,
       v.description, v.duration, v.price, v.club, v.prec, v.ord
from (values
  -- Odontoiatria
  ('visita-odontoiatrica','ODO-001','Visita odontoiatrica di controllo','odontoiatria','odontoiatria','Valutazione clinica completa di denti, gengive e occlusione.',30,90,true,false,10),
  ('opt-ortopantomografia','ODO-002','Ortopantomografia (OPT)','odontoiatria','odontoiatria','Radiografia panoramica delle arcate dentarie.',15,60,true,false,20),
  ('igiene-orale','ODO-003','Igiene orale professionale','igiene_prevenzione','odontoiatria','Rimozione professionale di placca e tartaro.',45,90,true,false,30),
  ('sbiancamento-professionale','ODO-004','Sbiancamento professionale','odontoiatria','odontoiatria','Sbiancamento dentale in studio.',60,250,false,false,40),
  ('ortodonzia-invisalign','ODO-005','Ortodonzia invisibile Invisalign','odontoiatria','odontoiatria','Percorso ortodontico con allineatori trasparenti.',45,150,false,false,50),
  ('implantologia','ODO-006','Implantologia guidata 3D','odontoiatria','odontoiatria','Riabilitazione implantare con chirurgia guidata.',90,1200,false,false,60),
  ('conservativa','ODO-007','Odontoiatria conservativa','odontoiatria','odontoiatria','Restauri estetici e recupero della struttura dentale.',45,120,false,false,70),
  ('endodonzia','ODO-008','Endodonzia','odontoiatria','odontoiatria','Trattamento canalare per conservare il dente.',60,250,false,false,80),
  ('parodontologia','ODO-009','Trattamento parodontale','odontoiatria','odontoiatria','Diagnosi e gestione delle malattie gengivali.',60,200,false,false,90),
  ('gnatologia-bite','ODO-010','Gnatologia e bite','odontoiatria','odontoiatria','Valutazione ATM e bruxismo, eventuale bite.',45,150,false,false,100),
  -- Medicina estetica
  ('visita-medicina-estetica','EST-001','Visita di medicina estetica','medicina_estetica','medicina-estetica','Valutazione viso e corpo e piano trattamenti.',30,80,true,false,10),
  ('skin-checkup','EST-002','Skin check-up digitale','medicina_estetica','medicina-estetica','Analisi strumentale della qualità della pelle.',30,120,true,false,20),
  ('piattaforma-laser','EST-003','Trattamento laser medicale','medicina_estetica','medicina-estetica','QS NPP, Erbium, CPL e CO2 selezionati dal medico.',45,200,false,false,30),
  ('biorivitalizzazione','EST-004','Biorivitalizzazione','medicina_estetica','medicina-estetica','Biostimolazione per idratazione e luminosità.',30,250,false,false,40),
  ('prx','EST-005','PRX biostimolazione','medicina_estetica','medicina-estetica','Biostimolazione cutanea senza aghi.',45,200,false,false,50),
  ('filler-acido-ialuronico','EST-006','Filler acido ialuronico','medicina_estetica','medicina-estetica','Armonizzazione dei volumi del volto.',30,350,false,false,60),
  ('tossina-botulinica','EST-007','Tossina botulinica','medicina_estetica','medicina-estetica','Attenuazione delle rughe dinamiche.',30,300,false,false,70),
  ('acido-polilattico','EST-008','Biostimolazione acido polilattico','medicina_estetica','medicina-estetica','Stimolazione del collagene e sostegno dei tessuti.',45,400,false,false,80),
  ('cryoliposculpt','EST-009','Cryoliposculpt','medicina_estetica','medicina-estetica','Riduzione non invasiva degli accumuli adiposi.',60,400,false,false,90),
  ('carbossiterapia','EST-010','Carbossiterapia','medicina_estetica','medicina-estetica','Trattamento medico con CO2 medicale.',30,150,false,false,100),
  ('ultrasuoni-cfu','EST-011','Ultrasuoni CFU','medicina_estetica','medicina-estetica','Ultrasuoni focalizzati per tono e compattezza.',60,300,false,false,110),
  -- Visite specialistiche e diagnostica
  ('visita-medicina-generale','VIS-001','Visita medica generale','visita_specialistica','visite-specialistiche','Valutazione clinica generale con anamnesi.',30,60,true,false,10),
  ('esami-ematici-base','VIS-002','Esami ematici — pannello base','visita_specialistica','visite-specialistiche','Emocromo, glicemia, colesterolo, creatinina, AST, ALT.',15,45,true,false,20),
  ('esami-ematici-estesi','VIS-003','Esami ematici — pannello esteso','visita_specialistica','visite-specialistiche','Pannello esteso con funzionalità epatica, renale e tiroidea.',15,90,true,false,30),
  ('visita-cardiologica','VIS-004','Visita cardiologica','visita_specialistica','visite-specialistiche','Valutazione del rischio cardiovascolare.',30,130,true,false,40),
  ('ecg-riposo','VIS-005','ECG a riposo','diagnostica','visite-specialistiche','Elettrocardiogramma a riposo.',15,40,true,false,50),
  ('ecocardiogramma','VIS-006','Ecocardiogramma color-Doppler','diagnostica','visite-specialistiche','Ecocardiografia con color-Doppler.',30,120,false,false,60),
  ('ecocolordoppler-tsa','VIS-007','Ecocolordoppler TSA','diagnostica','visite-specialistiche','Ecocolordoppler dei tronchi sovraortici.',30,100,false,false,70),
  ('visita-senologica','VIS-008','Visita senologica','visita_specialistica','visite-specialistiche','Valutazione clinica senologica.',30,120,false,false,80),
  ('ecografia-mammaria','VIS-009','Ecografia mammaria bilaterale','diagnostica','visite-specialistiche','Ecografia mammaria ad alta risoluzione.',30,120,false,false,90),
  ('ecografia-addome','VIS-010','Ecografia addome completo','diagnostica','visite-specialistiche','Ecografia degli organi addominali.',30,90,false,false,100),
  ('ecografia-tiroidea','VIS-011','Ecografia tiroidea','diagnostica','visite-specialistiche','Ecografia tiroidea e paratiroidea.',20,70,false,false,110),
  ('ecografia-pelvica','VIS-012','Ecografia pelvica','diagnostica','visite-specialistiche','Ecografia pelvica sovrapubica o transvaginale.',30,90,false,false,120),
  ('ecografia-urinaria-prostatica','VIS-013','Ecografia urinaria / prostatica','diagnostica','visite-specialistiche','Ecografia apparato urinario e vescico-prostatica.',30,100,false,false,130),
  ('visita-oculistica','VIS-014','Visita oculistica','visita_specialistica','visite-specialistiche','Visus, refrazione, tonometria e fondo oculare.',30,100,true,false,140),
  ('visita-ginecologica','VIS-015','Visita ginecologica','visita_specialistica','visite-specialistiche','Prevenzione ginecologica e valutazione ormonale.',30,110,false,false,150),
  ('visita-pediatrica','VIS-016','Visita pediatrica','visita_specialistica','visite-specialistiche','Bilanci di salute e certificazioni sportive.',30,90,false,false,160),
  ('visita-dermatologica','VIS-017','Visita dermatologica','visita_specialistica','visite-specialistiche','Dermatologia preventiva e controllo nei.',30,120,false,false,170),
  ('visita-nutrizionale','VIS-018','Consulenza nutrizionale','visita_specialistica','visite-specialistiche','Anamnesi metabolica e piano personalizzato.',45,90,true,false,180),
  -- Precision
  ('dna5-skin','PRE-001','Test DNA 5 — Skin & Beauty','precision','precision','Pannello genetico per qualità e invecchiamento cutaneo.',20,690,false,true,10),
  ('dna5-nutri','PRE-002','Test DNA 5 — Nutri Metabolic','precision','precision','Pannello genetico nutrizionale e metabolico.',20,690,false,true,20),
  ('dna5-donna','PRE-003','Test DNA 5 — Donna','precision','precision','Equilibrio ormonale, tiroide, ossa e metabolismo.',20,690,false,true,30),
  ('dna5-longevity','PRE-004','Test DNA 5 — Longevity Core','precision','precision','Invecchiamento cellulare e protezione cardiovascolare.',20,690,false,true,40),
  ('microbiota-intestinale','PRE-005','Microbiota Intestinale NGS','precision','precision','Sequenziamento del microbiota intestinale.',20,200,false,true,50),
  ('microbiota-cutaneo','PRE-006','Microbiota Pelle','precision','precision','Analisi della barriera cutanea.',20,200,false,true,60),
  ('microbiota-vaginale','PRE-007','Microbiota Vaginale','precision','precision','Valutazione della flora vaginale.',20,200,false,true,70)
) as v(slug, code, name, category, branch_slug, description, duration, price, club, prec, ord)
join public.branches b on b.slug = v.branch_slug
on conflict (slug) do nothing;

-- 14.4 Sintomi / inestetismi -------------------------------------------------
insert into public.symptoms_attributes (slug, label, category, area, description, sort_order)
select v.slug, v.label, v.category, v.area, v.description, v.ord
from (values
  ('rughe-dinamiche','Rughe dinamiche','viso','viso','Rughe da espressione su fronte, glabella e contorno occhi.',10),
  ('rughe-sottili','Rughe sottili e texture','viso','viso','Rughe fini e texture irregolare.',20),
  ('perdita-volume','Perdita di volume del volto','viso','viso','Volumi ridotti e contorni meno definiti.',30),
  ('lassita-viso','Lassità del viso e del collo','viso','viso','Lassità cutanea lieve o moderata.',40),
  ('macchie-discromie','Macchie e discromie','viso','viso','Macchie solari, melasma e fotodanneggiamento.',50),
  ('cicatrici-acne','Cicatrici da acne','viso','viso','Esiti cicatriziali e irregolarità della texture.',60),
  ('occhiaie','Occhiaie e borse','viso','viso','Zona perioculare e sguardo affaticato.',70),
  ('pelle-spenta','Pelle spenta e disidratata','viso','viso','Pelle opaca e poco luminosa.',80),
  ('adiposita-localizzata','Adiposità localizzata','corpo','corpo','Accumuli adiposi localizzati.',10),
  ('cellulite','Cellulite','corpo','corpo','Pelle a buccia d''arancia.',20),
  ('lassita-corporea','Lassità corporea','corpo','corpo','Tono e compattezza ridotti.',30),
  ('gonfiore-addominale','Gonfiore addominale','corpo','corpo','Discomfort e gonfiore intestinale.',40),
  ('difficolta-calo-peso','Difficoltà nel calo ponderale','corpo','corpo','Metabolismo lento o dieta non efficace.',50),
  ('denti-disallineati','Denti disallineati','sorriso','sorriso','Affollamento o malocclusione.',10),
  ('spazi-tra-denti','Spazi tra i denti','sorriso','sorriso','Diastemi e spazi interdentali.',20),
  ('denti-macchiati','Denti macchiati','sorriso','sorriso','Colorazione e pigmentazioni.',30),
  ('gengive-sanguinanti','Gengive sanguinanti','sorriso','sorriso','Sanguinamento e infiammazione gengivale.',40),
  ('mancanza-denti','Mancanza di denti','sorriso','sorriso','Edentulia singola o multipla.',50),
  ('bruxismo','Bruxismo','sorriso','sorriso','Digrignamento e dolore ATM.',60),
  ('stanchezza-cronica','Stanchezza cronica','benessere','salute_generale','Affaticamento persistente.',10),
  ('rischio-cardiovascolare','Rischio cardiovascolare','benessere','salute_generale','Familiarità e fattori di rischio.',20),
  ('controllo-prevenzione','Check-up di prevenzione','prevenzione','salute_generale','Controllo periodico completo.',30),
  ('equilibrio-ormonale','Equilibrio ormonale','benessere','salute_generale','Climaterio, tiroide e ciclo.',40),
  ('salute-intima','Salute intima','benessere','salute_generale','Microbiota e benessere pelvico.',50),
  ('ansia-stress','Ansia e stress','benessere','salute_generale','Gestione dello stress e del sonno.',60),
  ('qualita-pelle','Qualità della pelle','benessere','salute_generale','Salute biologica della pelle.',70),
  ('salute-cute-capelli','Cute e capelli','benessere','salute_generale','Caduta e salute del cuoio capelluto.',80),
  ('digestione-microbiota','Digestione e microbiota','benessere','salute_generale','Disbiosi, gonfiore e intestino.',90)
) as v(slug, label, category, area, description, ord)
on conflict (slug) do nothing;

-- 14.5 I 9 Percorsi Salute Cocoora Club --------------------------------------
insert into public.health_paths
  (slug, code, name, tier_code, level, tagline, description, annual_price, list_price,
   discount_percent, validity_months, gender_toggle, is_family_addon, requires_adult_path, sort_order)
select v.slug, v.code, v.name, v.tier_code, v.level::public.path_level, v.tagline, v.description,
       v.price, v.list_price, v.discount, v.months, v.gender, v.family, v.req_adult, v.ord
from (values
  ('discover','CLUB-DISCOVER','Discover','discover','free','Il tuo ingresso in Cocoora.','Profilo sanitario digitale, questionario anamnestico e accesso al catalogo servizi.',0,null,0,12,false,false,false,10),
  ('access','CLUB-ACCESS','Access','access','basic','Il primo passo concreto per il tuo benessere.','Check-up essenziale: visita generale, ECG, esami base, cura del sorriso, nutrizione e medicina estetica.',99,null,5,12,false,false,false,20),
  ('care','CLUB-CARE','Care','care','plus','Più attenzione, più cura, più te.','Check-up strutturato con esami estesi, igiene orale e prevenzione mirata uomo/donna.',349,null,10,12,true,false,false,30),
  ('experience','CLUB-EXPERIENCE','Experience','experience','premium','Il percorso avanzato e coordinato.','Diagnostica cardiologica e vascolare avanzata, nutrizione avanzata, dermatologia e oculistica.',649,null,15,12,true,false,false,40),
  ('signature','CLUB-SIGNATURE','Signature','signature','experience_plus','L''esperienza Cocoora al completo.','Tutto Experience più diagnostica ecografica avanzata, dermatologia preventiva e test Precision.',890,null,20,12,true,false,false,50),
  ('signature-longevity','CLUB-LONGEVITY','Signature Longevity','signature-longevity','longevity','La prevenzione del futuro.','Protocollo Longevity con biomarcatori, microbiota NGS e piano nutrizionale di precisione.',1190,1280,20,12,true,false,false,60),
  ('family-basic','CLUB-FAMILY-BASIC','Family Care Basic','family-basic','family_addon','La prevenzione dedicata ai più piccoli.','Check-up annuale minori con visite pediatriche, oculistica e valutazione posturale.',149,null,0,12,false,true,true,70),
  ('family-elite','CLUB-FAMILY-ELITE','Family Care Elite','family-elite','family_addon','Il benessere dei tuoi figli al centro.','Tutto Family Care Basic più consulenza psicologica e nutrizionale.',199,null,0,12,false,true,true,80),
  ('family-senior','CLUB-FAMILY-SENIOR','Family Care Senior','family-senior','family_addon','Prevenzione dedicata agli over 65.','Percorso per gli anziani con geriatria, cardiologia e supporto nutrizionale.',249,null,0,12,false,true,true,90)
) as v(slug, code, name, tier_code, level, tagline, description, price, list_price, discount, months, gender, family, req_adult, ord)
on conflict (slug) do nothing;

-- 14.6 Servizi inclusi nei Percorsi Salute -----------------------------------
-- Discover: nessuna prestazione sanitaria inclusa (solo servizi digitali).

-- Access
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', null
from public.health_paths hp
join public.medical_services ms on ms.slug = any (array[
  'visita-medicina-generale','ecg-riposo','esami-ematici-base','visita-odontoiatrica',
  'opt-ortopantomografia','visita-nutrizionale','visita-medicina-estetica'])
where hp.slug = 'access'
on conflict do nothing;

-- Care (comuni + differenziati uomo/donna)
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', null
from public.health_paths hp
join public.medical_services ms on ms.slug = any (array[
  'visita-medicina-generale','ecg-riposo','esami-ematici-base','esami-ematici-estesi',
  'visita-odontoiatrica','opt-ortopantomografia','igiene-orale','visita-nutrizionale',
  'visita-medicina-estetica','skin-checkup','visita-cardiologica'])
where hp.slug = 'care'
on conflict do nothing;

insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'uomo', 'Prevenzione mirata uomo'
from public.health_paths hp
join public.medical_services ms on ms.slug = 'ecografia-urinaria-prostatica'
where hp.slug = 'care'
on conflict do nothing;

insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'donna', 'Prevenzione mirata donna'
from public.health_paths hp
join public.medical_services ms on ms.slug in ('visita-ginecologica','ecografia-pelvica')
where hp.slug = 'care'
on conflict do nothing;

-- Experience
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', null
from public.health_paths hp
join public.medical_services ms on ms.slug = any (array[
  'visita-medicina-generale','ecg-riposo','esami-ematici-base','esami-ematici-estesi',
  'visita-odontoiatrica','opt-ortopantomografia','igiene-orale','visita-nutrizionale',
  'visita-medicina-estetica','skin-checkup','visita-cardiologica','ecocardiogramma',
  'ecocolordoppler-tsa','ecografia-addome','visita-oculistica'])
where hp.slug = 'experience'
on conflict do nothing;

insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'uomo', 'Percorso uomo Experience'
from public.health_paths hp
join public.medical_services ms on ms.slug = 'ecografia-urinaria-prostatica'
where hp.slug = 'experience'
on conflict do nothing;

insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'donna', 'Percorso donna Experience'
from public.health_paths hp
join public.medical_services ms on ms.slug in ('ecografia-mammaria','visita-senologica')
where hp.slug = 'experience'
on conflict do nothing;

-- Signature
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', null
from public.health_paths hp
join public.medical_services ms on ms.slug = any (array[
  'visita-medicina-generale','ecg-riposo','esami-ematici-estesi','visita-odontoiatrica',
  'opt-ortopantomografia','igiene-orale','visita-nutrizionale','visita-medicina-estetica',
  'skin-checkup','visita-cardiologica','ecocardiogramma','ecocolordoppler-tsa',
  'ecografia-addome','ecografia-tiroidea','visita-oculistica','visita-dermatologica',
  'dna5-skin'])
where hp.slug = 'signature'
on conflict do nothing;

insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'donna', 'Percorso donna Signature'
from public.health_paths hp
join public.medical_services ms on ms.slug in ('ecografia-mammaria','ecografia-pelvica','visita-senologica')
where hp.slug = 'signature'
on conflict do nothing;

-- Signature Longevity
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', null
from public.health_paths hp
join public.medical_services ms on ms.slug = any (array[
  'visita-medicina-generale','ecg-riposo','esami-ematici-estesi','visita-odontoiatrica',
  'igiene-orale','visita-nutrizionale','visita-medicina-estetica','skin-checkup',
  'visita-cardiologica','ecocardiogramma','ecocolordoppler-tsa','ecografia-addome',
  'ecografia-tiroidea','visita-oculistica','visita-dermatologica','dna5-longevity',
  'microbiota-intestinale'])
where hp.slug = 'signature-longevity'
on conflict do nothing;

-- Family Care Basic
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', 'Minori fino a 18 anni'
from public.health_paths hp
join public.medical_services ms on ms.slug in ('visita-pediatrica','visita-oculistica','visita-odontoiatrica')
where hp.slug = 'family-basic'
on conflict do nothing;

-- Family Care Elite (Basic + consulenze)
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', 'Minori fino a 18 anni'
from public.health_paths hp
join public.medical_services ms on ms.slug in ('visita-pediatrica','visita-oculistica','visita-odontoiatrica','visita-nutrizionale')
where hp.slug = 'family-elite'
on conflict do nothing;

-- Family Care Senior
insert into public.health_path_services (health_path_id, service_id, gender_scope, notes)
select hp.id, ms.id, 'non_specificato', 'Over 65'
from public.health_paths hp
join public.medical_services ms on ms.slug in (
  'visita-medicina-generale','visita-cardiologica','ecg-riposo','esami-ematici-estesi','visita-nutrizionale')
where hp.slug = 'family-senior'
on conflict do nothing;

-- 14.7 Matrice percorso ↔ sintomo (motore "Trova il tuo percorso") ----------
insert into public.path_symptoms (health_path_id, symptom_id, weight)
select hp.id, sa.id, v.weight
from (values
  ('access','controllo-prevenzione',1.0), ('access','denti-macchiati',0.6), ('access','gengive-sanguinanti',0.6),
  ('care','controllo-prevenzione',1.0), ('care','rischio-cardiovascolare',0.8), ('care','gengive-sanguinanti',0.8),
  ('care','difficolta-calo-peso',0.6), ('care','salute-intima',0.6), ('care','equilibrio-ormonale',0.6),
  ('experience','rischio-cardiovascolare',1.0), ('experience','stanchezza-cronica',0.8), ('experience','controllo-prevenzione',0.8),
  ('experience','occhiaie',0.5), ('experience','pelle-spenta',0.5),
  ('signature','macchie-discromie',1.0), ('signature','qualita-pelle',1.0), ('signature','salute-cute-capelli',0.8),
  ('signature','rischio-cardiovascolare',0.8), ('signature','occhiaie',0.6), ('signature','controllo-prevenzione',0.7),
  ('signature-longevity','stanchezza-cronica',1.0), ('signature-longevity','digestione-microbiota',1.0),
  ('signature-longevity','equilibrio-ormonale',0.8), ('signature-longevity','rischio-cardiovascolare',0.9),
  ('signature-longevity','qualita-pelle',0.7),
  ('family-basic','controllo-prevenzione',0.5),
  ('family-elite','ansia-stress',0.8), ('family-elite','controllo-prevenzione',0.5),
  ('family-senior','controllo-prevenzione',0.8), ('family-senior','rischio-cardiovascolare',0.8)
) as v(path_slug, symptom_slug, weight)
join public.health_paths hp on hp.slug = v.path_slug
join public.symptoms_attributes sa on sa.slug = v.symptom_slug
on conflict do nothing;

-- 14.8 Matrice prestazione ↔ sintomo ----------------------------------------
insert into public.service_symptoms (service_id, symptom_id, weight)
select ms.id, sa.id, v.weight
from (values
  ('tossina-botulinica','rughe-dinamiche',1.0),
  ('filler-acido-ialuronico','perdita-volume',1.0),
  ('acido-polilattico','lassita-viso',1.0),
  ('piattaforma-laser','macchie-discromie',1.0), ('piattaforma-laser','cicatrici-acne',0.8),
  ('biorivitalizzazione','pelle-spenta',1.0), ('biorivitalizzazione','rughe-sottili',0.7),
  ('prx','rughe-sottili',0.8), ('prx','pelle-spenta',0.8),
  ('cryoliposculpt','adiposita-localizzata',1.0),
  ('carbossiterapia','cellulite',1.0),
  ('ultrasuoni-cfu','lassita-corporea',1.0), ('ultrasuoni-cfu','lassita-viso',0.6),
  ('ortodonzia-invisalign','denti-disallineati',1.0), ('ortodonzia-invisalign','spazi-tra-denti',0.9),
  ('sbiancamento-professionale','denti-macchiati',1.0),
  ('implantologia','mancanza-denti',1.0),
  ('igiene-orale','gengive-sanguinanti',1.0),
  ('gnatologia-bite','bruxismo',1.0),
  ('visita-cardiologica','rischio-cardiovascolare',1.0),
  ('visita-ginecologica','salute-intima',0.9), ('visita-ginecologica','equilibrio-ormonale',0.9),
  ('visita-dermatologica','qualita-pelle',0.9), ('visita-dermatologica','salute-cute-capelli',0.7),
  ('visita-nutrizionale','difficolta-calo-peso',1.0), ('visita-nutrizionale','digestione-microbiota',0.8),
  ('dna5-skin','qualita-pelle',1.0),
  ('dna5-nutri','difficolta-calo-peso',1.0), ('dna5-nutri','digestione-microbiota',0.8),
  ('dna5-donna','equilibrio-ormonale',1.0),
  ('dna5-longevity','stanchezza-cronica',0.9), ('dna5-longevity','rischio-cardiovascolare',0.9),
  ('microbiota-intestinale','digestione-microbiota',1.0), ('microbiota-intestinale','gonfiore-addominale',0.9),
  ('microbiota-vaginale','salute-intima',1.0),
  ('microbiota-cutaneo','qualita-pelle',1.0),
  ('visita-medicina-generale','controllo-prevenzione',1.0)
) as v(service_slug, symptom_slug, weight)
join public.medical_services ms on ms.slug = v.service_slug
join public.symptoms_attributes sa on sa.slug = v.symptom_slug
on conflict do nothing;

commit;

-- =============================================================================
--  FINE MIGRAZIONE
--  Per popolare i medici reali (allineati a src/lib/doctors.ts) e gli orari
--  settimanali, usare una migrazione di seed separata oppure la Console Supabase.
-- =============================================================================
