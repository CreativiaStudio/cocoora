/**
 * COCOORA CENTRO MEDICO — SCHEDULING & CATALOG CONTRACT
 * Single Source of Truth TypeScript per Motore Slot, Segreteria e Catalogo Admin.
 */

export type ResourceKind = "doctor" | "room" | "device";

export type BookingStatus =
  | "held"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "no_show"
  | "cancelled";

export type BillingEntity = "primecare" | "cocoora_stp";

export type VatRegime = "esente_art10" | "iva_22";

export type BookingChannel = "reception" | "online" | "phone" | "whatsapp";

export type ClinicalArea =
  | "medicina_estetica"
  | "odontoiatria"
  | "visite_specialistiche";

export interface Resource {
  id: string;
  kind: ResourceKind;
  name: string;
  doctorId?: string | null;
  capabilities: string[];
  isActive: boolean;
}

export interface ServiceStep {
  id: string;
  serviceId: string;
  stepOrder: number;
  label: string;
  offsetMin: number;
  durationMin: number;
  needsDoctor: boolean;
  roomCapability?: string | null;
  deviceCapability?: string | null;
}

export interface Service {
  id: string;
  code: string;
  name: string;
  area: ClinicalArea;
  specialty?: string | null;
  patientPrepNotes?: string | null;
  totalDurationMin: number;
  isListed: boolean;
  isBookableOnline: boolean;
  isActive: boolean;
  steps?: ServiceStep[];
}

export interface TimeInterval {
  start: Date;
  end: Date;
}

export interface ResourceShift {
  id: string;
  resourceId: string;
  start: Date;
  end: Date;
  isBlocked: boolean;
  note?: string | null;
}

export interface ResourceBooking {
  id: string;
  appointmentId: string;
  stepOrder: number;
  resourceId: string;
  start: Date;
  end: Date;
  status: BookingStatus;
}

export interface SlotCandidate {
  start: string; // ISO 8601 string
  end: string;   // ISO 8601 string
  doctorId?: string;
  doctorName?: string;
  roomId?: string;
  roomName?: string;
  deviceIds?: string[];
  priceCents?: number;
  vatRegime?: VatRegime;
  billingEntity?: BillingEntity;
  isCoveredByMembership?: boolean;
}

export interface FindSlotsInput {
  service: Service;
  from: Date;
  to: Date;
  preferredDoctorId?: string;
  granularityMin?: number; // Default 15
  resources: Resource[];
  shifts: ResourceShift[];
  bookings: ResourceBooking[];
  activeDoctorIdsForService: string[];
}

export interface BookAppointmentInput {
  patientId: string;
  serviceId: string;
  doctorId?: string;
  start: string; // ISO string
  channel: BookingChannel;
  overrideReason?: string;
  coveredByMembershipId?: string;
}

export interface BookResult {
  success: boolean;
  appointmentId?: string;
  errorCode?: "SLOT_TAKEN" | "DOCTOR_UNAVAILABLE" | "INVALID_PATIENT" | "UNKNOWN_ERROR";
  errorMessage?: string;
}
