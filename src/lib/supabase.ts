import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrmjqpyrhcaouvjhbggx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** Client anonimo pubblico per letture lato client */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Client service_role con privilegi elevati (solo lato server / API routes / Server Actions) */
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
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
