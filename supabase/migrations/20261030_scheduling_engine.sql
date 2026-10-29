-- =============================================================================
--  COCOORA CENTRO MEDICO (Napoli) — MOTORE DI SCHEDULING
--  Migration : 20261030_scheduling_engine.sql
--  Scope     : Risorse prenotabili (medici, sale, dispositivi), catalogo
--              prestazioni con step clinici, tariffario privato, regole di
--              disponibilità, turni/blocchi, appuntamenti e prenotazione
--              atomica con conflict-detection a livello PostgreSQL.
--  Note      : Migrazione ADDITIVA e IDEMPOTENTE. Non elimina dati né oggetti
--              esistenti. Target: PostgreSQL 16 / Supabase.
--
--  ATTENZIONE (compatibilità installazioni preesistenti):
--  la migrazione 20261016_cocoora_crm_schema.sql definisce già una tabella
--  public.appointments "legacy" (starts_at/ends_at, enum appointment_status)
--  e una public.doctor_services legata a public.medical_services.
--  Su quei database le clausole CREATE TABLE IF NOT EXISTS non ricreano le
--  tabelle: il blocco "COMPATIBILITÀ" più sotto aggiunge solo le nuove colonne.
--  Per attivare il nuovo motore su un database legacy è necessaria una
--  migrazione dati dedicata (status enum e FK service_id).
-- =============================================================================

begin;

-- 1. ESTENSIONI E SCHEMI ------------------------------------------------------
-- btree_gist abilita gli operatori di uguaglianza all'interno degli indici GiST,
-- indispensabili per i vincoli EXCLUDE di non-sovrapposizione.
create extension if not exists btree_gist;

-- Lo schema `private` ospita il tariffario: non è esposto da PostgREST.
create schema if not exists private;

-- btree_gist può vivere in `public` (installazione fresca) oppure in
-- `extensions` (progetti Supabase preesistenti): copriamo entrambi i casi.
set search_path = public, private, extensions;

-- 2. ENUMERAZIONI DI DOMINIO --------------------------------------------------
-- Creazione idempotente: se il tipo esiste già non viene toccato.

do $$ begin
  -- Tipologia di risorsa prenotabile.
  create type public.resource_kind as enum ('doctor', 'room', 'device');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Ciclo di vita dell'appuntamento e delle prenotazioni di risorsa.
  create type public.booking_status as enum (
    'held',        -- slot temporaneamente bloccato (prenotazione online)
    'confirmed',   -- appuntamento confermato
    'checked_in',  -- paziente arrivato in sala d'attesa
    'in_progress', -- visita/trattamento in corso
    'completed',   -- visita/trattamento concluso
    'no_show',     -- paziente non presentato
    'cancelled'    -- appuntamento annullato
  );
exception when duplicate_object then null; end $$;

do $$ begin
  -- Soggetto giuridico che emette il documento fiscale.
  create type public.billing_entity as enum ('primecare', 'cocoora_stp');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Regime IVA applicato alla prestazione.
  create type public.vat_regime as enum ('esente_art10', 'iva_22');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Canale di acquisizione della prenotazione.
  create type public.booking_channel as enum ('reception', 'online', 'phone', 'whatsapp');
exception when duplicate_object then null; end $$;

-- 3. RISORSE PRENOTABILI ------------------------------------------------------
-- Una risorsa è tutto ciò che occupa tempo e non può essere usato in parallelo:
-- un medico, una sala (Studio 1..4, Sala OPT) o un dispositivo (Laser Acta).

create table if not exists public.resources (
  id           uuid primary key default gen_random_uuid(),
  kind         public.resource_kind not null,
  name         text not null,
  doctor_id    uuid references public.doctors (id) on delete set null,
  capabilities text[] not null default '{}',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  -- Un medico è tale solo se collegato all'anagrafica medici; sale e
  -- dispositivi non possono avere un doctor_id.
  constraint doctor_link check ((kind = 'doctor') = (doctor_id is not null))
);

comment on table public.resources is
  'Risorse prenotabili del centro: medici, sale (Studio 1..4, Sala OPT) e dispositivi.';
comment on column public.resources.capabilities is
  'Capacità/tecnologie della risorsa (es. riunito, laser_co2, opt_cbct): usate per l''allocazione automatica.';
comment on column public.resources.doctor_id is
  'Valorizzato solo per kind = doctor; collega la risorsa all''anagrafica public.doctors.';

-- Un medico può avere una sola risorsa prenotabile.
create unique index if not exists ux_resources_doctor
  on public.resources (doctor_id)
  where doctor_id is not null;

-- Ricerca rapida delle risorse che possiedono una capacità richiesta.
create index if not exists ix_resources_capabilities
  on public.resources using gin (capabilities);

-- Nome univoco per tipologia: rende idempotente il seed sottostante.
create unique index if not exists ux_resources_kind_name
  on public.resources (kind, name);

-- 4. SEED RISORSE FISICHE -----------------------------------------------------
-- Mappa definitiva stanze/macchinari concordata con la direzione del centro.

insert into public.resources (kind, name, capabilities)
values
  ('room'::public.resource_kind, 'Studio 1', array['riunito', 'scanner_3d']::text[]),
  ('room'::public.resource_kind, 'Studio 2', array['lettino_chirurgico', 'carbossiterapia', 'criolipolisi']::text[]),
  ('room'::public.resource_kind, 'Studio 3', array['laser_co2', 'laser_erbium', 'laser_qswitch', 'carbossiterapia']::text[]),
  ('room'::public.resource_kind, 'Studio 4', array['ecografo_hd', 'lampada_oculistica']::text[]),
  ('room'::public.resource_kind, 'Sala OPT', array['opt_cbct']::text[]),
  ('device'::public.resource_kind, 'Laser Acta', array['laser_acta']::text[])
on conflict do nothing;

-- 5. CATALOGO PRESTAZIONI -----------------------------------------------------
-- Il catalogo pubblico non contiene prezzi: le tariffe vivono in
-- private.price_list e sono accessibili solo al backend CRM.

create table if not exists public.services (
  id                  uuid primary key default gen_random_uuid(),
  code                text unique not null,
  name                text not null,
  area                text not null
                      check (area in ('medicina_estetica', 'odontoiatria', 'visite_specialistiche')),
  specialty           text,
  patient_prep_notes  text,
  total_duration_min  int not null default 30
                      check (total_duration_min between 5 and 480),
  is_listed           boolean not null default false,
  is_bookable_online  boolean not null default false,
  is_active           boolean not null default true,
  updated_at          timestamptz not null default now()
);

comment on table public.services is
  'Catalogo prestazioni del centro, suddiviso per area medica. Non contiene prezzi.';
comment on column public.services.total_duration_min is
  'Durata complessiva in minuti, comprensiva di eventuali step e margini di riordino.';
comment on column public.services.is_listed is
  'Indica se la prestazione è visibile nel catalogo pubblico del sito.';
comment on column public.services.is_bookable_online is
  'Abilita la prenotazione diretta dal canale online (PWA/web app).';

create index if not exists ix_services_area
  on public.services (area);
create index if not exists ix_services_listed
  on public.services (is_listed) where is_listed = true;

-- Aggiornamento automatico di updated_at (funzione dedicata per non
-- interferire con public.set_updated_at della migrazione legacy).
create or replace function private.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute function private.touch_updated_at();

-- 6. STEP CLINICI DELLA PRESTAZIONE -------------------------------------------
-- Ogni step occupa un intervallo interno alla prestazione e può richiedere
-- una sala, un dispositivo e/o la presenza del medico.

create table if not exists public.service_steps (
  id                 uuid primary key default gen_random_uuid(),
  service_id         uuid not null references public.services (id) on delete cascade,
  step_order         smallint not null,
  label              text not null,
  offset_min         int not null default 0 check (offset_min >= 0),
  duration_min       int not null check (duration_min > 0),
  needs_doctor       boolean not null default true,
  room_capability    text,
  device_capability  text,
  unique (service_id, step_order)
);

comment on table public.service_steps is
  'Scomposizione temporale della prestazione: ogni step alloca sala, dispositivo e medico.';
comment on column public.service_steps.offset_min is
  'Minuti dall''inizio dell''appuntamento in cui parte lo step.';
comment on column public.service_steps.room_capability is
  'Capacità richiesta alla sala (es. riunito, laser_co2). NULL = nessuna sala richiesta.';
comment on column public.service_steps.device_capability is
  'Capacità richiesta al dispositivo (es. laser_acta). NULL = nessun dispositivo richiesto.';

create index if not exists ix_service_steps_service
  on public.service_steps (service_id, step_order);

-- 7. MATRICE MEDICO ↔ PRESTAZIONE ---------------------------------------------
-- Definisce quali prestazioni eroga ciascun medico, con eventuale durata
-- personalizzata e sala preferita.

create table if not exists public.doctor_services (
  doctor_id           uuid not null references public.doctors (id) on delete cascade,
  service_id          uuid not null references public.services (id) on delete cascade,
  custom_duration_min int,
  preferred_room_id   uuid references public.resources (id),
  is_active           boolean not null default true,
  primary key (doctor_id, service_id)
);

-- Compatibilità: su database legacy la tabella esiste già con un'altra
-- struttura. Aggiungiamo solo le colonne mancanti, senza toccare le esistenti.
alter table public.doctor_services
  add column if not exists custom_duration_min int;
alter table public.doctor_services
  add column if not exists preferred_room_id uuid references public.resources (id);

comment on column public.doctor_services.custom_duration_min is
  'Durata personalizzata del medico; se NULL si usa public.services.total_duration_min.';
comment on column public.doctor_services.preferred_room_id is
  'Sala preferita dal medico: l''allocazione la privilegia se compatibile.';

create index if not exists ix_doctor_services_service
  on public.doctor_services (service_id);

-- 8. TARIFFARIO PRIVATO (solo backend CRM) ------------------------------------
-- Il vincolo EXCLUDE impedisce tariffe sovrapposte per la stessa prestazione
-- (generica o per medico) nello stesso intervallo di validità.

create table if not exists private.price_list (
  id             uuid primary key default gen_random_uuid(),
  service_id     uuid not null references public.services (id) on delete cascade,
  doctor_id      uuid references public.doctors (id) on delete set null,
  amount_cents   int not null check (amount_cents >= 0),
  vat_regime     public.vat_regime not null default 'esente_art10',
  default_entity public.billing_entity not null default 'cocoora_stp',
  valid_from     date not null default current_date,
  valid_to       date,
  created_at     timestamptz not null default now(),
  constraint price_list_no_overlap exclude using gist (
    service_id with =,
    (coalesce(doctor_id, '00000000-0000-0000-0000-000000000000'::uuid)) with =,
    (daterange(valid_from, coalesce(valid_to, 'infinity'::date), '[)')) with &&
  )
);

comment on table private.price_list is
  'Tariffario privato delle prestazioni. MAI esposto al pubblico: usato dal CRM per il congelamento del prezzo.';
comment on column private.price_list.amount_cents is
  'Importo in centesimi di euro, al netto di arrotondamenti applicativi.';
comment on column private.price_list.default_entity is
  'Soggetto giuridico predefinito per l''emissione del documento fiscale.';

create index if not exists ix_price_list_service
  on private.price_list (service_id, valid_from desc);
create index if not exists ix_price_list_doctor
  on private.price_list (doctor_id) where doctor_id is not null;

-- 9. REGOLE DI DISPONIBILITÀ RICORRENTE ----------------------------------------
-- Orari settimanali, eventualmente alternati su più settimane (interval_weeks).

create table if not exists public.availability_rules (
  id             uuid primary key default gen_random_uuid(),
  resource_id    uuid not null references public.resources (id) on delete cascade,
  weekday        smallint not null check (weekday between 1 and 7),
  start_time     time not null,
  end_time       time not null check (end_time > start_time),
  interval_weeks smallint not null default 1,
  anchor_date    date not null default current_date,
  valid_from     date not null default current_date,
  valid_to       date
);

comment on table public.availability_rules is
  'Disponibilità ricorrente per risorsa: weekday 1 = lunedì ... 7 = domenica.';
comment on column public.availability_rules.interval_weeks is
  'Cadenza in settimane (1 = ogni settimana, 2 = settimane alterne, ecc.).';
comment on column public.availability_rules.anchor_date is
  'Data di riferimento per il calcolo delle settimane alterne.';

create index if not exists ix_availability_rules_resource
  on public.availability_rules (resource_id, weekday);

-- 10. TURNI E BLOCCHI ---------------------------------------------------------
-- Turni effettivi (generati dalle regole o inseriti manualmente) e blocchi
-- (ferie, manutenzione, chiusure). Il vincolo EXCLUDE evita sovrapposizioni.

create table if not exists public.resource_shifts (
  id          uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources (id) on delete cascade,
  during      tstzrange not null,
  source_rule uuid references public.availability_rules (id) on delete set null,
  is_blocked  boolean not null default false,
  note        text,
  constraint resource_shifts_no_overlap exclude using gist (
    resource_id with =,
    during with &&
  )
);

comment on table public.resource_shifts is
  'Turni effettivi e blocchi delle risorse; is_blocked = true indica indisponibilità.';
comment on column public.resource_shifts.source_rule is
  'Regola di disponibilità che ha generato il turno, se applicabile.';

create index if not exists ix_resource_shifts_resource
  on public.resource_shifts (resource_id, lower(during));

-- 11. APPUNTAMENTI ------------------------------------------------------------
-- L'intervallo `during` è la fonte di verità temporale. Il prezzo viene
-- congelato al momento della prenotazione per garantire stabilità fiscale.

create table if not exists public.appointments (
  id                        uuid primary key default gen_random_uuid(),
  patient_id                uuid not null references public.patient_profiles (id) on delete cascade,
  service_id                uuid not null references public.services (id) on delete restrict,
  doctor_id                 uuid references public.doctors (id) on delete set null,
  status                    public.booking_status not null default 'confirmed',
  channel                   public.booking_channel not null default 'reception',
  during                    tstzrange not null,
  covered_by_membership_id  uuid,
  billing_entity            public.billing_entity not null default 'cocoora_stp',
  price_cents_frozen        int,
  vat_regime_frozen         public.vat_regime,
  hold_expires_at           timestamptz,
  override_reason           text,
  created_at                timestamptz not null default now(),
  checked_in_at             timestamptz,
  started_at                timestamptz,
  ended_at                  timestamptz
);

-- Compatibilità con la tabella legacy 20261016: aggiunge in modo additivo le
-- colonne del nuovo motore che non esistono ancora. Non modifica `status`
-- (che resta public.appointment_status) né la FK `service_id`.
alter table public.appointments add column if not exists during tstzrange;
alter table public.appointments add column if not exists channel public.booking_channel not null default 'reception';
alter table public.appointments add column if not exists covered_by_membership_id uuid;
alter table public.appointments add column if not exists billing_entity public.billing_entity not null default 'cocoora_stp';
alter table public.appointments add column if not exists price_cents_frozen int;
alter table public.appointments add column if not exists vat_regime_frozen public.vat_regime;
alter table public.appointments add column if not exists hold_expires_at timestamptz;
alter table public.appointments add column if not exists override_reason text;
alter table public.appointments add column if not exists checked_in_at timestamptz;
alter table public.appointments add column if not exists started_at timestamptz;
alter table public.appointments add column if not exists ended_at timestamptz;

comment on column public.appointments.during is
  'Intervallo effettivo dell''appuntamento; usato per il conflict-detection.';
comment on column public.appointments.price_cents_frozen is
  'Prezzo congelato al momento della prenotazione (centesimi), indipendente da future modifiche di listino.';
comment on column public.appointments.hold_expires_at is
  'Scadenza del blocco temporaneo per le prenotazioni online (status = held).';
comment on column public.appointments.override_reason is
  'Motivazione dell''eventuale forzatura manuale della disponibilità da parte della reception.';

create index if not exists ix_sched_appointments_patient
  on public.appointments (patient_id);
create index if not exists ix_sched_appointments_doctor
  on public.appointments (doctor_id, lower(during));
create index if not exists ix_sched_appointments_status
  on public.appointments (status);
create index if not exists ix_sched_appointments_during
  on public.appointments using gist (during);

-- Doppia protezione contro la doppia prenotazione del medico. Il vincolo è
-- creato solo quando `status` usa l'enum del nuovo motore, per non entrare in
-- conflitto con l'installazione legacy.
do $doctor_overlap$
begin
  if exists (
    select 1
      from pg_attribute a
      join pg_type t on t.oid = a.atttypid
     where a.attrelid = 'public.appointments'::regclass
       and a.attname = 'status'
       and a.attnum > 0
       and not a.attisdropped
       and t.typname = 'booking_status'
  ) then
    alter table public.appointments
      drop constraint if exists appointments_no_doctor_overlap;
    alter table public.appointments
      add constraint appointments_no_doctor_overlap
      exclude using gist (doctor_id with =, during with &&)
      where (doctor_id is not null and status not in ('cancelled', 'no_show'));
  end if;
end
$doctor_overlap$;

-- 12. PRENOTAZIONI DELLE RISORSE ----------------------------------------------
-- Una riga per ogni risorsa occupata da uno step dell'appuntamento. Il vincolo
-- EXCLUDE è il cuore del conflict-detection: nessuna risorsa può essere
-- prenotata due volte nello stesso intervallo (salvo prenotazioni annullate).

create table if not exists public.resource_bookings (
  id             uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  step_order     smallint not null,
  resource_id    uuid not null references public.resources (id) on delete cascade,
  during         tstzrange not null check (not isempty(during)),
  status         public.booking_status not null default 'confirmed',
  constraint resource_bookings_no_overlap exclude using gist (
    resource_id with =,
    during with &&
  ) where (status <> 'cancelled')
);

comment on table public.resource_bookings is
  'Prenotazioni effettive delle risorse (sala, dispositivo, medico) per ogni step di un appuntamento.';
comment on column public.resource_bookings.step_order is
  'Step della prestazione a cui si riferisce l''occupazione della risorsa.';

create index if not exists ix_resource_bookings_appointment
  on public.resource_bookings (appointment_id);

-- 13. SINCRONIZZAZIONE DELLO STATO --------------------------------------------
-- Quando l'appuntamento cambia stato, tutte le prenotazioni di risorsa collegate
-- vengono allineate. La conversione via testo rende il trigger compatibile sia
-- con public.booking_status sia con il vecchio public.appointment_status.

create or replace function public.sync_booking_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_status public.booking_status;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  v_new_status := case new.status::text
                    when 'held'        then 'held'
                    when 'confirmed'   then 'confirmed'
                    when 'confermato'  then 'confirmed'
                    when 'richiesto'   then 'confirmed'
                    when 'checked_in'  then 'checked_in'
                    when 'in_progress' then 'in_progress'
                    when 'completed'   then 'completed'
                    when 'completato'  then 'completed'
                    when 'no_show'     then 'no_show'
                    when 'cancelled'   then 'cancelled'
                    when 'annullato'   then 'cancelled'
                    else 'confirmed'
                  end::public.booking_status;

  update public.resource_bookings
     set status = v_new_status
   where appointment_id = new.id
     and status is distinct from v_new_status;

  return new;
end;
$$;

comment on function public.sync_booking_status() is
  'Allinea lo stato delle prenotazioni di risorsa a quello dell''appuntamento collegato.';

drop trigger if exists trg_appointments_sync_booking_status on public.appointments;
create trigger trg_appointments_sync_booking_status
  after update of status on public.appointments
  for each row execute function public.sync_booking_status();

-- 14. VISTA PUBBLICA DEI SERVIZI ----------------------------------------------
-- security_invoker = true: la vista applica la RLS della tabella sottostante.
-- Nessun campo economico è incluso.

create or replace view public.v_public_services
with (security_invoker = true) as
select
  s.id,
  s.code,
  s.name,
  s.area,
  s.specialty,
  s.patient_prep_notes,
  s.total_duration_min,
  s.is_bookable_online
from public.services s
where s.is_active = true;

comment on view public.v_public_services is
  'Catalogo servizi esposto al sito/PWA: solo colonne non sensibili, nessun prezzo.';

-- 15. PRENOTAZIONE ATOMICA ----------------------------------------------------
-- Tutta la funzione è una singola transazione: se una risorsa non è disponibile
-- l'intera prenotazione viene annullata (rollback del blocco), evitando
-- appuntamenti "orfani" o risorse occupate a metà.
-- L'errore 23P01 (exclusion_violation) viene intercettato e restituito con un
-- messaggio comprensibile per il front-end.

create or replace function public.book_appointment(
  p_patient_id               uuid,
  p_service_id               uuid,
  p_during                   tstzrange,
  p_doctor_id                uuid default null,
  p_channel                  public.booking_channel default 'reception',
  p_covered_by_membership_id uuid default null,
  p_billing_entity           public.billing_entity default 'cocoora_stp',
  p_override_reason          text default null,
  p_hold_minutes             integer default 15
)
returns uuid
language plpgsql
security definer
set search_path = public, private, extensions
as $book_appointment$
declare
  v_service            public.services%rowtype;
  v_appointment_id     uuid;
  v_status             public.booking_status;
  v_price_cents        integer;
  v_vat                public.vat_regime;
  v_entity             public.billing_entity;
  v_hold_expires_at    timestamptz;
  v_step               record;
  v_step_range         tstzrange;
  v_resource_id        uuid;
  v_doctor_resource_id uuid;
  v_preferred_room_id  uuid;
begin
  -- 15.1 Validazione dell'intervallo richiesto.
  if p_during is null
     or isempty(p_during)
     or lower_inf(p_during)
     or upper_inf(p_during) then
    raise exception 'Intervallo temporale non valido: sono richiesti inizio e fine.'
      using errcode = '22023';
  end if;

  -- 15.2 La prestazione deve esistere ed essere attiva.
  select *
    into v_service
    from public.services
   where id = p_service_id
     and is_active = true;

  if not found then
    raise exception 'Prestazione % inesistente o non attiva.', p_service_id
      using errcode = 'P0002';
  end if;

  -- 15.3 La durata dell'intervallo deve coincidere con la durata clinica.
  if (upper(p_during) - lower(p_during)) <> make_interval(mins => v_service.total_duration_min) then
    raise exception 'Durata non valida: la prestazione "%" richiede % minuti.',
      v_service.name, v_service.total_duration_min
      using errcode = '22023';
  end if;

  -- 15.4 Il canale online rispetta i flag pubblici e non ammette il passato.
  if p_channel = 'online' then
    if not v_service.is_bookable_online then
      raise exception 'La prestazione "%" non è prenotabile online.', v_service.name
        using errcode = 'P0001';
    end if;

    if lower(p_during) < now() then
      raise exception 'Non è possibile prenotare online un orario nel passato.'
        using errcode = '22007';
    end if;
  end if;

  -- 15.5 Coerenza tra medico e prestazione, con recupero della sala preferita.
  if p_doctor_id is not null then
    if not exists (
      select 1
        from public.doctor_services ds
       where ds.doctor_id = p_doctor_id
         and ds.service_id = p_service_id
         and ds.is_active = true
    ) then
      raise exception 'Il medico selezionato non eroga la prestazione richiesta.'
        using errcode = 'P0001';
    end if;

    select ds.preferred_room_id
      into v_preferred_room_id
      from public.doctor_services ds
     where ds.doctor_id = p_doctor_id
       and ds.service_id = p_service_id
     limit 1;
  end if;

  -- 15.6 Congelamento del prezzo dal tariffario privato.
  -- Precedenza alla tariffa specifica del medico, poi a quella generica.
  v_entity := p_billing_entity;

  select pl.amount_cents, pl.vat_regime, pl.default_entity
    into v_price_cents, v_vat, v_entity
    from private.price_list pl
   where pl.service_id = p_service_id
     and (pl.doctor_id = p_doctor_id or pl.doctor_id is null)
     and current_date >= pl.valid_from
     and (pl.valid_to is null or current_date < pl.valid_to)
   order by (pl.doctor_id is not null) desc, pl.valid_from desc, pl.created_at desc
   limit 1;

  if not found then
    v_price_cents := null;
    v_vat := null;
    v_entity := p_billing_entity;
  end if;

  -- 15.7 Stato iniziale: blocco temporaneo per l'online, conferma per la reception.
  v_status := case
                when p_channel = 'online' then 'held'::public.booking_status
                else 'confirmed'::public.booking_status
              end;

  v_hold_expires_at := case
                         when v_status = 'held'
                           then now() + make_interval(mins => greatest(coalesce(p_hold_minutes, 15), 1))
                         else null
                       end;

  -- 15.8 Inserimento dell'appuntamento.
  insert into public.appointments (
    patient_id, service_id, doctor_id, status, channel, during,
    covered_by_membership_id, billing_entity, price_cents_frozen,
    vat_regime_frozen, hold_expires_at, override_reason
  ) values (
    p_patient_id, p_service_id, p_doctor_id, v_status, p_channel, p_during,
    p_covered_by_membership_id, v_entity, v_price_cents,
    v_vat, v_hold_expires_at, p_override_reason
  )
  returning id into v_appointment_id;

  -- 15.9 Allocazione atomica delle risorse per ogni step della prestazione.
  for v_step in
    select ss.step_order, ss.offset_min, ss.duration_min, ss.needs_doctor,
           ss.room_capability, ss.device_capability
      from public.service_steps ss
     where ss.service_id = p_service_id
     order by ss.step_order
  loop
    v_step_range := tstzrange(
      lower(p_during) + make_interval(mins => v_step.offset_min),
      lower(p_during) + make_interval(mins => v_step.offset_min + v_step.duration_min),
      '[)'
    );

    -- 15.9.a Sala con la capacità richiesta.
    if v_step.room_capability is not null then
      select r.id
        into v_resource_id
        from public.resources r
       where r.is_active = true
         and r.kind = 'room'
         and v_step.room_capability = any (r.capabilities)
         and not exists (
           select 1
             from public.resource_bookings rb
            where rb.resource_id = r.id
              and rb.status <> 'cancelled'
              and rb.during && v_step_range
         )
       order by (r.id = v_preferred_room_id) desc nulls last, r.name
       limit 1;

      if v_resource_id is null then
        raise exception 'Nessuna sala con capacità "%" disponibile nell''intervallo richiesto.',
          v_step.room_capability
          using errcode = 'P0001';
      end if;

      insert into public.resource_bookings (appointment_id, step_order, resource_id, during, status)
      values (v_appointment_id, v_step.step_order, v_resource_id, v_step_range, v_status);
    end if;

    -- 15.9.b Dispositivo con la capacità richiesta.
    if v_step.device_capability is not null then
      select r.id
        into v_resource_id
        from public.resources r
       where r.is_active = true
         and r.kind = 'device'
         and v_step.device_capability = any (r.capabilities)
         and not exists (
           select 1
             from public.resource_bookings rb
            where rb.resource_id = r.id
              and rb.status <> 'cancelled'
              and rb.during && v_step_range
         )
       order by r.name
       limit 1;

      if v_resource_id is null then
        raise exception 'Nessun dispositivo con capacità "%" disponibile nell''intervallo richiesto.',
          v_step.device_capability
          using errcode = 'P0001';
      end if;

      insert into public.resource_bookings (appointment_id, step_order, resource_id, during, status)
      values (v_appointment_id, v_step.step_order, v_resource_id, v_step_range, v_status);
    end if;

    -- 15.9.c Medico come risorsa prenotabile, se censito in public.resources.
    if v_step.needs_doctor and p_doctor_id is not null then
      select r.id
        into v_doctor_resource_id
        from public.resources r
       where r.is_active = true
         and r.kind = 'doctor'
         and r.doctor_id = p_doctor_id
       limit 1;

      if v_doctor_resource_id is not null then
        insert into public.resource_bookings (appointment_id, step_order, resource_id, during, status)
        values (v_appointment_id, v_step.step_order, v_doctor_resource_id, v_step_range, v_status);
      end if;
    end if;
  end loop;

  return v_appointment_id;

exception
  -- 23P01: violazione di un vincolo EXCLUDE (risorsa già occupata).
  when exclusion_violation then
    raise exception 'Slot non più disponibile: è stata rilevata una sovrapposizione con un''altra prenotazione. Aggiorna la disponibilità e riprova.'
      using errcode = 'P0001';
  -- 23503: paziente, medico o prestazione non validi.
  when foreign_key_violation then
    raise exception 'Prenotazione non valida: paziente, medico o prestazione inesistenti.'
      using errcode = '23503';
end;
$book_appointment$;

comment on function public.book_appointment(uuid, uuid, tstzrange, uuid, public.booking_channel, uuid, public.billing_entity, text, integer) is
  'Prenota un appuntamento in modo atomico: valida durata e medico, congela il prezzo e alloca sala/dispositivo/medico per ogni step.';

-- 16. SICUREZZA: RLS E GRANT --------------------------------------------------
-- Le nuove tabelle nascono con RLS attiva (deny by default). Le policy
-- gestionali riusano le funzioni di autorizzazione della migrazione 20261016.

alter table public.resources          enable row level security;
alter table public.services           enable row level security;
alter table public.service_steps      enable row level security;
alter table public.doctor_services    enable row level security;
alter table public.availability_rules enable row level security;
alter table public.resource_shifts    enable row level security;
alter table public.resource_bookings  enable row level security;
alter table public.appointments       enable row level security;

-- Catalogo attivo leggibile dal sito/PWA (nessun dato economico).
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
  for select to anon, authenticated
  using (is_active = true);

-- Policy gestionali: create solo se le funzioni di autorizzazione esistono
-- (esecuzione del file dopo la migrazione 20261016).
do $rls$
begin
  if to_regprocedure('public.is_staff()') is null then
    raise notice 'Funzioni di autorizzazione assenti: RLS attiva in modalità deny-by-default.';
    return;
  end if;

  execute 'drop policy if exists resources_staff_all on public.resources';
  execute 'create policy resources_staff_all on public.resources for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists services_staff_all on public.services';
  execute 'create policy services_staff_all on public.services for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists service_steps_staff_all on public.service_steps';
  execute 'create policy service_steps_staff_all on public.service_steps for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists doctor_services_staff_all on public.doctor_services';
  execute 'create policy doctor_services_staff_all on public.doctor_services for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists doctor_services_doctor_read on public.doctor_services';
  execute 'create policy doctor_services_doctor_read on public.doctor_services for select to authenticated using (doctor_id = public.current_doctor_id())';

  execute 'drop policy if exists availability_rules_staff_all on public.availability_rules';
  execute 'create policy availability_rules_staff_all on public.availability_rules for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists resource_shifts_staff_all on public.resource_shifts';
  execute 'create policy resource_shifts_staff_all on public.resource_shifts for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists resource_bookings_staff_all on public.resource_bookings';
  execute 'create policy resource_bookings_staff_all on public.resource_bookings for all to authenticated using (public.is_staff()) with check (public.is_staff())';

  execute 'drop policy if exists resource_bookings_doctor_read on public.resource_bookings';
  execute 'create policy resource_bookings_doctor_read on public.resource_bookings for select to authenticated using (exists (select 1 from public.resources r where r.id = resource_id and r.doctor_id = public.current_doctor_id()))';

  execute 'drop policy if exists resource_bookings_patient_read on public.resource_bookings';
  execute 'create policy resource_bookings_patient_read on public.resource_bookings for select to authenticated using (exists (select 1 from public.appointments a where a.id = appointment_id and a.patient_id = public.current_patient_id()))';
end
$rls$;

-- Lo schema private non è raggiungibile dai ruoli pubblici: solo il backend CRM.
revoke all on schema private from public;
grant usage on schema private to service_role;
grant select, insert, update, delete on private.price_list to service_role;

grant usage on schema public to anon, authenticated;

-- Catalogo e risorse: lettura per gli utenti autenticati (RLS filtra).
grant select on
  public.resources, public.services, public.service_steps,
  public.doctor_services, public.availability_rules
to authenticated;

-- Scritture gestionali (la RLS resta l'autorità finale).
grant select, insert, update, delete on
  public.resources, public.services, public.service_steps,
  public.doctor_services, public.availability_rules, public.resource_shifts,
  public.resource_bookings
to authenticated;

-- Appuntamenti: i permessi legacy restano validi; riallineiamo per sicurezza.
grant select, insert, update, delete on public.appointments to authenticated;

-- Vista pubblica del catalogo. Con security_invoker = true il ruolo anon deve
-- avere il privilegio SELECT anche sulla tabella sottostante (la RLS filtra).
grant select on public.services to anon;
grant select on public.v_public_services to anon, authenticated;

-- RPC di prenotazione: esclusa da PUBLIC, disponibile a utenti e backend.
revoke all on function public.book_appointment(
  uuid, uuid, tstzrange, uuid, public.booking_channel,
  uuid, public.billing_entity, text, integer
) from public;
grant execute on function public.book_appointment(
  uuid, uuid, tstzrange, uuid, public.booking_channel,
  uuid, public.billing_entity, text, integer
) to authenticated, service_role;

commit;
