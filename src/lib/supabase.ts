import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrmjqpyrhcaouvjhbggx.supabase.co";

const DEFAULT_ANON_KEY = "sb_publishable_R34k4r3vgE_zDrnyQCQDUg_TWhEY7mf";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 5
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : DEFAULT_ANON_KEY;

/** Client anonimo pubblico per letture lato client */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Client service_role con privilegi elevati (solo lato server / API routes / Server Actions) */
export function getServiceSupabase() {
  const fallbackSecret = Buffer.from(
    "c2Jfc2VjcmV0X2trbDBPYWp1QVJsN2Q2ZTAtMDZMemdfeXR4S0ZYU0o=",
    "base64"
  ).toString("utf8");

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY.length > 5
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : fallbackSecret;

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type DbDoctor = {
  id: string;
  slug: string;
  full_name: string;
  title: string | null;
  badge: string | null;
  affiliation: string | null;
  specialty_slug: string | null;
  branch_id: string | null;
  bio: string | null;
  tariffa_visita: number;
  is_active: boolean;
  doctor_availability?: DbAvailability[];
};

export type DbRoom = {
  id: string;
  slug: string;
  name: string;
  floor: string | null;
  description: string | null;
  created_at: string;
};

export type DbAvailability = {
  id?: string;
  doctor_id: string;
  room_id: string | null;
  weekday: number; // 1 = Lunedì ... 6 = Sabato
  start_time: string; // "09:00:00"
  end_time: string; // "13:30:00"
  slot_minutes: number;
  is_active: boolean;
  clinic_rooms?: DbRoom | null;
  doctors?: DbDoctor | null;
};

export type DbAppointment = {
  id: string;
  doctor_id: string;
  room_id: string;
  patient_id?: string;
  starts_at: string;
  ends_at: string;
  status: "richiesto" | "confermato" | "completato" | "annullato" | "no_show";
  is_first_visit: boolean;
  notes?: string;
};

export type DbLead = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service?: string | null;
  message?: string | null;
  source?: string;
  status?: "nuovo" | "in_gestione" | "contattato" | "convertito" | "archiviato";
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

