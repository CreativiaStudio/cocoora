"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  DoorOpen,
  ExternalLink,
  MessageCircle,
  Phone,
  QrCode,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  User,
  UserCheck,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PatientDetailModal } from "@/components/admin/patient-detail-modal";

interface ReceptionDeskLiveProps {
  onOpenPatient?: (patientId: string) => void;
  onOpenCassa?: () => void;
}

interface CompletedAppointmentContext {
  id: string;
  starts_at?: string;
  doctorName?: string;
  roomName?: string;
  notes?: string;
  is_first_visit?: boolean;
}

type PatientDetailModalExtendedProps = Omit<
  React.ComponentProps<typeof PatientDetailModal>,
  "initialTab" | "completedAppointment"
> & {
  initialTab?: "anagrafica" | "piani" | "visite" | "referti";
  completedAppointment?: CompletedAppointmentContext | null;
};

const PatientDetailModalBridge =
  PatientDetailModal as unknown as React.ComponentType<PatientDetailModalExtendedProps>;

// Deriva lo stato reale dell'appuntamento anche quando il DB persiste 'confermato' con tag telemetrici nelle note
export function deriveLiveStatus(status?: string | null, notes?: string | null): string {
  const base = status || "confermato";
  const n = notes || "";
  if (base === "annullato" || base === "no_show" || base === "completato") {
    return base;
  }
  if (base === "confermato") {
    if (n.includes("[FineVisita:")) return "completato";
    if (n.includes("[InizioVisita:") && !n.includes("[FineVisita:")) return "in_visita";
    if (n.includes("[Arrivo:") && !n.includes("[InizioVisita:")) return "in_attesa";
  }
  return base;
}

// Filtra via tutti i tag tecnici di telemetria/reminder/incasso dalle note cliniche mostrate
export function cleanClinicalNotes(notes?: string | null): string {
  if (!notes) return "";
  return notes
    .replace(/\[(Arrivo|InizioVisita|FineVisita|Attesa|Durata|Reminder1h|Incasso):[^\]]*\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Estrae informazioni leggibili da [Reminder1h: ...]
function extractReminderInfo(notes?: string | null): {
  sent: boolean;
  timeLabel: string;
  channelLabel: string;
} {
  if (!notes) return { sent: false, timeLabel: "", channelLabel: "" };
  const matches = Array.from(notes.matchAll(/\[Reminder1h:\s*([^\]]+)\]/gi));
  if (matches.length === 0) return { sent: false, timeLabel: "", channelLabel: "" };

  const raw = matches[matches.length - 1][1].trim();
  const isoMatch = raw.match(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?/
  );
  let timeLabel = "";
  if (isoMatch) {
    try {
      timeLabel = new Intl.DateTimeFormat("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Rome",
      }).format(new Date(isoMatch[0]));
    } catch {
      timeLabel = "";
    }
  }
  if (!timeLabel) {
    const hhmm = raw.match(/\b(\d{1,2}:\d{2})\b/);
    timeLabel = hhmm ? hhmm[1] : "oggi";
  }

  const lower = raw.toLowerCase();
  const channelLabel = lower.includes("sms")
    ? "SMS"
    : lower.includes("whatsapp") || lower.includes("wa")
    ? "WhatsApp"
    : "";

  return { sent: true, timeLabel, channelLabel };
}

// Estrae eventuali tag [Incasso: ...] come badge leggibili
function extractIncassoBadges(notes?: string | null): string[] {
  if (!notes) return [];
  return Array.from(notes.matchAll(/\[Incasso:\s*([^\]]+)\]/gi)).map((m) => m[1].trim());
}

// Data YYYY-MM-DD nel fuso Europe/Rome
function toRomeDateKey(dateInput: string | Date): string {
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    const y = parts.find((p) => p.type === "year")?.value || "2026";
    const m = parts.find((p) => p.type === "month")?.value || "01";
    const day = parts.find((p) => p.type === "day")?.value || "01";
    return `${y}-${m}-${day}`;
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

// Formatta YYYY-MM-DD in es. "12 Nov"
function formatRomeShortDate(dateKey: string): string {
  try {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dateObj = new Date(Date.UTC(y || 2026, (m || 1) - 1, d || 1, 12, 0, 0));
    const raw = new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "short",
      timeZone: "Europe/Rome",
    })
      .format(dateObj)
      .replace(".", "");
    return raw.replace(/\b([a-zà-ú])/gi, (c) => c.toUpperCase());
  } catch {
    return dateKey;
  }
}

// Formatta orario HH:MM nel fuso Europe/Rome
function formatRomeTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "--:--";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Rome",
    }).format(d);
  } catch {
    return "--:--";
  }
}

// Normalizza numero italiano per link WhatsApp (es. "+39 347 9876543" -> "393479876543")
function normalizeItalianPhoneForWhatsApp(rawPhone?: string | null): string {
  if (!rawPhone) return "";
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  if (
    digits.length > 0 &&
    !digits.startsWith("39") &&
    (digits.startsWith("3") || digits.startsWith("0"))
  ) {
    digits = `39${digits}`;
  }
  return digits;
}

export function ReceptionDeskLive({ onOpenCassa }: ReceptionDeskLiveProps) {
  const [loading, setLoading] = useState(true);
  const [isResettingDemo, setIsResettingDemo] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Filtro rapido data: "today" vs "all"
  const [dateFilter, setDateFilter] = useState<"today" | "all">("today");

  // Stato collegamento WhatsApp Studio sul PC della reception
  const [waPcLinked, setWaPcLinked] = useState<boolean>(true);
  const [waOpenMode, setWaOpenMode] = useState<"web" | "desktop">("web");
  const [reminderRuleMode, setReminderRuleMode] = useState<"whatsapp_pc" | "sms_auto">(
    "whatsapp_pc"
  );
  const [showWhatsAppStudioModal, setShowWhatsAppStudioModal] = useState<boolean>(false);
  const [qrLoadError, setQrLoadError] = useState<boolean>(false);

  // Scheda Completa Paziente (PatientDetailModal) integrata nel Desk
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<any | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<
    "anagrafica" | "piani" | "visite" | "referti"
  >("piani");
  const [completedAppointmentContext, setCompletedAppointmentContext] =
    useState<CompletedAppointmentContext | null>(null);

  // Popup Anteprima Promemoria -1h
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [selectedAppForReminder, setSelectedAppForReminder] = useState<any | null>(null);
  const [reminderPhone, setReminderPhone] = useState<string>("");
  const [reminderMessage, setReminderMessage] = useState<string>("");
  const [sendRealSms, setSendRealSms] = useState<boolean>(false);
  const [isSubmittingReminder, setIsSubmittingReminder] = useState<boolean>(false);

  // Modale Walk-in (durata 60 minuti - regola 1 ora Cocoora)
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInPatientId, setWalkInPatientId] = useState("");
  const [walkInDoctorId, setWalkInDoctorId] = useState("");
  const [walkInRoomId, setWalkInRoomId] = useState("");
  const [walkInNotes, setWalkInNotes] = useState("Accoglienza diretta al banco");
  const [walkInIsFirstVisit, setWalkInIsFirstVisit] = useState(false);
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

  // Modali Sposta e Annulla
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppForReschedule, setSelectedAppForReschedule] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("10:00");
  const [rescheduleReason, setRescheduleReason] = useState<string>(
    "Richiesta del paziente (lavoro / impegni personali)"
  );
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppForCancel, setSelectedAppForCancel] = useState<any | null>(null);
  const [cancelType, setCancelType] = useState<"annullato" | "no_show">("annullato");
  const [cancelReason, setCancelReason] = useState<string>(
    "Disdetto con preavviso dal paziente (motivi personali)"
  );
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Carica preferenze WhatsApp PC da localStorage
  useEffect(() => {
    try {
      const savedLinked = window.localStorage.getItem("cocoora_wa_pc_linked");
      if (savedLinked === null) {
        window.localStorage.setItem("cocoora_wa_pc_linked", "true");
        setWaPcLinked(true);
      } else {
        setWaPcLinked(savedLinked === "true");
      }

      const savedMode = window.localStorage.getItem("cocoora_wa_open_mode");
      if (savedMode === "desktop" || savedMode === "web") {
        setWaOpenMode(savedMode);
      }

      const savedRule = window.localStorage.getItem("cocoora_reminder_rule_mode");
      if (savedRule === "whatsapp_pc" || savedRule === "sms_auto") {
        setReminderRuleMode(savedRule);
      }
    } catch {
      // Fallback silenzioso in caso di restrizioni storage
    }
  }, []);

  // Aggiorna il timer live ogni 20s per calcolare attese e durate in tempo reale
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Caricamento dati Desk coerente: prima GET /api/reception/desk (no-store), fallback Supabase client
  const fetchDeskData = async () => {
    try {
      setLoading(true);
      let loadedViaApi = false;

      try {
        const res = await fetch("/api/reception/desk", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.appointments)) {
            const normalizedAppts = json.appointments.map((app: any) => ({
              ...app,
              status: deriveLiveStatus(app.status, app.notes),
            }));
            setAppointments(normalizedAppts);
            loadedViaApi = true;
          }
          if (Array.isArray(json.rooms)) {
            setRooms(json.rooms);
            if (json.rooms.length > 0 && !walkInRoomId) setWalkInRoomId(json.rooms[0].id);
          }
          if (Array.isArray(json.doctors)) {
            setDoctors(json.doctors);
            if (json.doctors.length > 0 && !walkInDoctorId) setWalkInDoctorId(json.doctors[0].id);
          }
          if (Array.isArray(json.patients)) {
            setPatients(json.patients);
            if (json.patients.length > 0 && !walkInPatientId) setWalkInPatientId(json.patients[0].id);
          }
          if (Array.isArray(json.plans)) {
            setPlans(json.plans);
          } else {
            const { data: plns } = await supabase.from("patient_treatment_plans").select("*");
            if (plns) setPlans(plns);
          }
        }
      } catch (apiErr) {
        console.warn("Fallback fetchDeskData su client Supabase:", apiErr);
      }

      if (!loadedViaApi) {
        const [apptsRes, rmsRes, docsRes, ptsRes, plnsRes] = await Promise.all([
          supabase
            .from("appointments")
            .select(
              `
              id, patient_id, doctor_id, room_id, starts_at, ends_at, status, notes, is_first_visit,
              patient_profiles ( id, patient_code, first_name, last_name, phone, email, fiscal_code, notes ),
              doctors ( id, full_name, title, specialty_slug ),
              clinic_rooms ( id, name, slug )
            `
            )
            .order("starts_at", { ascending: true }),
          supabase.from("clinic_rooms").select("*").order("slug"),
          supabase.from("doctors").select("*").eq("is_active", true).order("full_name"),
          supabase.from("patient_profiles").select("*").order("last_name"),
          supabase.from("patient_treatment_plans").select("*"),
        ]);

        if (apptsRes.data) {
          setAppointments(
            apptsRes.data.map((app: any) => ({
              ...app,
              status: deriveLiveStatus(app.status, app.notes),
            }))
          );
        }
        if (rmsRes.data) {
          setRooms(rmsRes.data);
          if (rmsRes.data.length > 0 && !walkInRoomId) setWalkInRoomId(rmsRes.data[0].id);
        }
        if (docsRes.data) {
          setDoctors(docsRes.data);
          if (docsRes.data.length > 0 && !walkInDoctorId) setWalkInDoctorId(docsRes.data[0].id);
        }
        if (ptsRes.data) {
          setPatients(ptsRes.data);
          if (ptsRes.data.length > 0 && !walkInPatientId) setWalkInPatientId(ptsRes.data[0].id);
        }
        if (plnsRes.data) setPlans(plnsRes.data);
      }
    } catch (e) {
      console.error("Errore fetch desk reception:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeskData();
  }, []);

  // Data attiva per "Visite di Oggi": confronta Europe/Rome con new Date(), poi 2026-11-12, o fallback data più recente
  const activeTodayKey = useMemo(() => {
    const realTodayKey = toRomeDateKey(new Date());
    if (appointments.length === 0) return realTodayKey;

    const uniqueDates = Array.from(
      new Set(appointments.map((a) => toRomeDateKey(a.starts_at)))
    ).sort();

    if (uniqueDates.includes(realTodayKey)) return realTodayKey;
    if (uniqueDates.includes("2026-11-12")) return "2026-11-12";
    return uniqueDates[uniqueDates.length - 1] || realTodayKey;
  }, [appointments]);

  const todayAppointments = useMemo(
    () => appointments.filter((a) => toRomeDateKey(a.starts_at) === activeTodayKey),
    [appointments, activeTodayKey]
  );

  const visibleAppointments = dateFilter === "today" ? todayAppointments : appointments;

  // Risoluzione profilo completo del paziente per PatientDetailModal
  const resolvePatientProfile = (app: any) => {
    const partial = app?.patient_profiles;
    const full = patients.find(
      (pt) => pt.id === partial?.id || (app?.patient_id && pt.id === app.patient_id)
    );
    if (full && partial) return { ...partial, ...full };
    return full || partial || null;
  };

  // Apertura Scheda & Incasso del paziente direttamente dal Desk
  const handleOpenPatientSheet = (
    app: any,
    tab: "anagrafica" | "piani" | "visite" | "referti" = "piani",
    explicitNotes?: string
  ) => {
    const patientObj = resolvePatientProfile(app);
    if (!patientObj) return;

    const effectiveNotes = explicitNotes !== undefined ? explicitNotes : app.notes;
    const isCompleted =
      app.status === "completato" || deriveLiveStatus(app.status, effectiveNotes) === "completato";

    setModalInitialTab(tab);
    setCompletedAppointmentContext(
      isCompleted
        ? {
            id: app.id,
            starts_at: app.starts_at,
            doctorName: app.doctors?.full_name,
            roomName: app.clinic_rooms?.name,
            notes: cleanClinicalNotes(effectiveNotes),
            is_first_visit: app.is_first_visit,
          }
        : null
    );
    setSelectedPatientForModal(patientObj);
  };

  // Reset rapido Demo Oggi
  const handleResetDemo = async () => {
    try {
      setIsResettingDemo(true);
      await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_demo_today" }),
      });
      await fetchDeskData();
      setCurrentTime(Date.now());
    } catch (e) {
      console.error("Errore reset demo:", e);
    } finally {
      setIsResettingDemo(false);
    }
  };

  // Avanzamento stato accoglienza visita + apertura automatica Scheda Paziente su "Concludi Visita"
  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    const targetApp = appointments.find((a) => a.id === appointmentId);
    const nowIso = new Date().toISOString();

    // Aggiornamento ottimistico immediato per azzerare latenza UI sui timer
    let optimisticNotes = targetApp?.notes || "";
    if (newStatus === "in_attesa" && !optimisticNotes.includes("[Arrivo:")) {
      optimisticNotes = `${optimisticNotes} [Arrivo: ${nowIso}]`.trim();
    } else if (newStatus === "in_visita" && !optimisticNotes.includes("[InizioVisita:")) {
      const arrMatch = optimisticNotes.match(/\[Arrivo:\s*([^\]]+)\]/);
      const waitM =
        arrMatch && arrMatch[1]
          ? Math.max(0, Math.round((Date.now() - new Date(arrMatch[1]).getTime()) / 60000))
          : 5;
      optimisticNotes = `${optimisticNotes} [InizioVisita: ${nowIso}] [Attesa: ${waitM}m]`.trim();
    } else if (newStatus === "completato" && !optimisticNotes.includes("[FineVisita:")) {
      const stMatch = optimisticNotes.match(/\[InizioVisita:\s*([^\]]+)\]/);
      const durM =
        stMatch && stMatch[1]
          ? Math.max(1, Math.round((Date.now() - new Date(stMatch[1]).getTime()) / 60000))
          : 45;
      optimisticNotes = `${optimisticNotes} [FineVisita: ${nowIso}] [Durata: ${durM}m]`.trim();
    }

    setCurrentTime(Date.now());
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: newStatus, notes: optimisticNotes } : a
      )
    );

    let finalNotes = optimisticNotes;

    try {
      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          appointmentId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const serverNotes =
          json?.data?.notes || json?.updated?.[0]?.notes || json?.appointment?.notes;
        if (serverNotes) {
          finalNotes = serverNotes;
          setCurrentTime(Date.now());
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === appointmentId
                ? {
                    ...a,
                    status: newStatus,
                    notes: serverNotes,
                  }
                : a
            )
          );
        }
      } else {
        await supabase
          .from("appointments")
          .update({
            status: newStatus === "in_attesa" || newStatus === "in_visita" ? "confermato" : newStatus,
            notes: optimisticNotes,
            updated_at: nowIso,
          })
          .eq("id", appointmentId);
      }
    } catch (e) {
      console.error("Errore aggiornamento stato visita:", e);
    }

    // PUNTO CHIAVE: quando l'operatrice clicca "Concludi Visita", apre automaticamente PatientDetailModal
    if (newStatus === "completato" && targetApp) {
      const updatedApp = { ...targetApp, status: "completato", notes: finalNotes };
      const patientObj = resolvePatientProfile(updatedApp);
      if (patientObj) {
        setModalInitialTab("piani");
        setCompletedAppointmentContext({
          id: updatedApp.id,
          starts_at: updatedApp.starts_at,
          doctorName: updatedApp.doctors?.full_name,
          roomName: updatedApp.clinic_rooms?.name,
          notes: cleanClinicalNotes(finalNotes),
          is_first_visit: updatedApp.is_first_visit,
        });
        setSelectedPatientForModal(patientObj);
      }
    }
  };

  // Apertura Popup Anteprima Promemoria (-1h)
  const handleOpenReminderPopup = (app: any) => {
    const p = app.patient_profiles;
    const d = app.doctors;

    const cleanFirstName = (p?.first_name || "Paziente")
      .replace(/\s*\(demo\)\s*/gi, "")
      .trim();
    const timeFormatted = formatRomeTime(app.starts_at);
    const doctorName = (d?.full_name || "il nostro Specialista")
      .replace(/\s*\(demo\)\s*/gi, "")
      .trim();

    const prefilledMsg = `Gentile ${cleanFirstName}, le ricordiamo il suo appuntamento di oggi alle ore ${timeFormatted} presso Cocoora Centro Medico (Via Generale Giovanni De Bonis 81, Napoli) con ${doctorName}. La aspettiamo! Per qualsiasi necessità può rispondere direttamente a questo messaggio.`;

    setSelectedAppForReminder(app);
    setReminderPhone(p?.phone || "");
    setReminderMessage(prefilledMsg);
    setSendRealSms(false);
    setShowReminderModal(true);
  };

  // Esecuzione invio/registrazione Reminder dal Popup
  const handleConfirmReminder = async (
    mode: "whatsapp_pc" | "sms_twilio" | "demo_only"
  ) => {
    if (!selectedAppForReminder) return;

    try {
      setIsSubmittingReminder(true);
      const app = selectedAppForReminder;
      const msg = reminderMessage.trim();

      // Se l'operatrice sceglie WhatsApp sul PC, apri la finestra WhatsApp precompilata
      if (mode === "whatsapp_pc") {
        const cleanPhone = normalizeItalianPhoneForWhatsApp(reminderPhone);
        const encodedText = encodeURIComponent(msg);
        const waUrl =
          waOpenMode === "desktop"
            ? cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodedText}`
              : `https://wa.me/?text=${encodedText}`
            : cleanPhone
            ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
            : `https://web.whatsapp.com`;

        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      const apiChannel = mode === "sms_twilio" ? "sms_twilio" : "whatsapp_pc";
      const timeNowRome = formatRomeTime(new Date());
      const fallbackTag = `[Reminder1h: ${timeNowRome} ${
        mode === "sms_twilio" ? "SMS COCOORA" : "WhatsApp Studio"
      }]`;
      const optimisticNotes = `${app.notes || ""} ${fallbackTag}`.trim();

      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_reminder",
          appointmentId: app.id,
          channel: apiChannel,
          messageText: msg,
          sendRealSms: mode === "sms_twilio" ? sendRealSms : false,
          demoOnly: mode === "demo_only",
          phone: reminderPhone,
        }),
      });

      let updatedNotes = optimisticNotes;
      if (res.ok) {
        const json = await res.json();
        const serverNotes =
          json?.data?.notes || json?.updated?.[0]?.notes || json?.appointment?.notes;
        if (serverNotes) {
          updatedNotes = serverNotes;
        }
      } else {
        await supabase
          .from("appointments")
          .update({ notes: optimisticNotes, updated_at: new Date().toISOString() })
          .eq("id", app.id);
      }

      setAppointments((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, notes: updatedNotes } : a))
      );
      setShowReminderModal(false);
    } catch (err) {
      console.error("Errore invio reminder:", err);
    } finally {
      setIsSubmittingReminder(false);
    }
  };

  // Salvataggio preferenze collegamento WhatsApp Studio PC
  const handleConfirmWaPcLink = (linked: boolean) => {
    setWaPcLinked(linked);
    try {
      window.localStorage.setItem("cocoora_wa_pc_linked", linked ? "true" : "false");
    } catch {
      // Ignora errori storage
    }
  };

  const handleChangeWaOpenMode = (mode: "web" | "desktop") => {
    setWaOpenMode(mode);
    try {
      window.localStorage.setItem("cocoora_wa_open_mode", mode);
    } catch {
      // Ignora errori storage
    }
  };

  const handleToggleReminderRule = () => {
    const next = reminderRuleMode === "whatsapp_pc" ? "sms_auto" : "whatsapp_pc";
    setReminderRuleMode(next);
    try {
      window.localStorage.setItem("cocoora_reminder_rule_mode", next);
    } catch {
      // Ignora errori storage
    }
  };

  // Creazione Walk-in tramite API (regola 60 minuti Cocoora + ingresso immediato in sala d'attesa)
  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingWalkIn(true);
      const now = new Date();
      const in60 = new Date(now.getTime() + 60 * 60000);

      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_walk_in",
          patientId: walkInPatientId,
          doctorId: walkInDoctorId,
          roomId: walkInRoomId,
          durationMinutes: 60,
          startsAt: now.toISOString(),
          endsAt: in60.toISOString(),
          isFirstVisit: walkInIsFirstVisit,
          notes: walkInNotes || "Accoglienza diretta al banco (Walk-in)",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const createdApp = json?.appointment || json?.data;
        if (createdApp?.id) {
          const derived = deriveLiveStatus(createdApp.status, createdApp.notes);
          if (derived !== "in_attesa") {
            await fetch("/api/reception/desk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "update_status",
                appointmentId: createdApp.id,
                status: "in_attesa",
              }),
            });
          }
        }
        await fetchDeskData();
      } else {
        const walkNotes = `${
          walkInNotes || "Accoglienza diretta al banco (Walk-in)"
        } [Arrivo: ${now.toISOString()}]`.trim();

        const { data, error } = await supabase
          .from("appointments")
          .insert({
            patient_id: walkInPatientId,
            doctor_id: walkInDoctorId,
            room_id: walkInRoomId,
            starts_at: now.toISOString(),
            ends_at: in60.toISOString(),
            status: "confermato",
            is_first_visit: walkInIsFirstVisit,
            notes: walkNotes,
          })
          .select(
            `
            id, patient_id, doctor_id, room_id, starts_at, ends_at, status, notes, is_first_visit,
            patient_profiles ( id, patient_code, first_name, last_name, phone, email ),
            doctors ( id, full_name, title, specialty_slug ),
            clinic_rooms ( id, name, slug )
          `
          )
          .single();

        if (error) throw error;
        if (data) {
          setAppointments((prev) => [
            { ...data, status: deriveLiveStatus(data.status, data.notes) },
            ...prev,
          ]);
        }
      }

      setDateFilter("today");
      setShowWalkInModal(false);
    } catch (err: any) {
      console.error("Errore walk-in:", err);
      alert("Errore registrazione walk-in: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingWalkIn(false);
    }
  };

  // Apertura modale Sposta / Riprogramma
  const handleOpenReschedule = (app: any) => {
    setSelectedAppForReschedule(app);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRescheduleDate(toRomeDateKey(tomorrow));
    setRescheduleTime(formatRomeTime(app.starts_at));
    setRescheduleReason("Richiesta del paziente (lavoro / impegni personali)");
    setShowRescheduleModal(true);
  };

  // Submit Sposta Visita (durata 60 minuti Cocoora)
  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForReschedule || !rescheduleDate || !rescheduleTime) {
      alert("Seleziona data e orario validi");
      return;
    }
    try {
      setIsSubmittingReschedule(true);
      const newStartsAt = new Date(`${rescheduleDate}T${rescheduleTime}:00`);
      const newEndsAt = new Date(newStartsAt.getTime() + 60 * 60000);
      const noteAppend = ` [Spostato al ${newStartsAt.toLocaleDateString("it-IT")} ore ${rescheduleTime} - ${rescheduleReason}]`;
      const cleanedPrev = (selectedAppForReschedule.notes || "")
        .replace(/\[(Arrivo|InizioVisita|FineVisita|Attesa|Durata):[^\]]*\]/gi, "")
        .trim();
      const updatedNotes = `${cleanedPrev}${noteAppend}`.trim();

      const { error } = await supabase
        .from("appointments")
        .update({
          starts_at: newStartsAt.toISOString(),
          ends_at: newEndsAt.toISOString(),
          status: "confermato",
          notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedAppForReschedule.id);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppForReschedule.id
            ? {
                ...a,
                starts_at: newStartsAt.toISOString(),
                ends_at: newEndsAt.toISOString(),
                status: "confermato",
                notes: updatedNotes,
              }
            : a
        )
      );
      setShowRescheduleModal(false);
    } catch (err: any) {
      console.error("Errore spostamento appuntamento:", err);
      alert("Errore durante lo spostamento: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  // Apertura modale Annulla / No-Show
  const handleOpenCancel = (app: any) => {
    setSelectedAppForCancel(app);
    setCancelType("annullato");
    setCancelReason("Disdetto con preavviso dal paziente (motivi personali)");
    setShowCancelModal(true);
  };

  // Submit Annulla / No-Show
  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForCancel) return;
    try {
      setIsSubmittingCancel(true);
      const tag = cancelType === "no_show" ? "NO-SHOW" : "DISDETTA";
      const noteAppend = ` [${tag}: ${cancelReason}]`;
      const updatedNotes = `${selectedAppForCancel.notes || ""}${noteAppend}`.trim();

      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          appointmentId: selectedAppForCancel.id,
          status: cancelType,
          notes: updatedNotes,
        }),
      });

      if (!res.ok) {
        const { error } = await supabase
          .from("appointments")
          .update({
            status: cancelType,
            notes: updatedNotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedAppForCancel.id);
        if (error) throw error;
      }

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppForCancel.id
            ? {
                ...a,
                status: cancelType,
                notes: updatedNotes,
              }
            : a
        )
      );
      setShowCancelModal(false);
    } catch (err: any) {
      console.error("Errore annullamento appuntamento:", err);
      alert("Errore durante l'annullamento: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Metriche Desk calcolate sulla vista attiva
  const waitingCount = visibleAppointments.filter((a) => a.status === "in_attesa").length;
  const inVisitCount = visibleAppointments.filter((a) => a.status === "in_visita").length;
  const completedCount = visibleAppointments.filter((a) => a.status === "completato").length;
  const cancelledCount = visibleAppointments.filter((a) => a.status === "annullato").length;
  const noShowCount = visibleAppointments.filter((a) => a.status === "no_show").length;
  const rescheduledCount = visibleAppointments.filter((a) => a.notes?.includes("[Spostato")).length;
  const totalCount = visibleAppointments.length;
  const showUpRate =
    totalCount > 0
      ? Math.round(((totalCount - cancelledCount - noShowCount) / totalCount) * 100)
      : 100;

  // Calcolo tempo medio reale di attesa dai log clinici
  const waitTimes: number[] = [];
  visibleAppointments.forEach((a) => {
    const m = a.notes?.match(/\[Attesa:\s*(\d+)m\]/);
    if (m && m[1]) {
      waitTimes.push(parseInt(m[1], 10));
    }
  });
  const avgWaitMinutes =
    waitTimes.length > 0
      ? Math.round(waitTimes.reduce((acc, curr) => acc + curr, 0) / waitTimes.length)
      : 5;

  const shortActiveDateLabel = formatRomeShortDate(activeTodayKey);

  return (
    <div className="space-y-6">
      {/* ── BANNER DESK OPERATIVO, WHATSAPP STUDIO & KPI ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-800 text-white font-bold text-xl shadow-xs">
              📋
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                  Accoglienza &amp; Cassa Live
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" /> Orari Centro: Lun–Ven 09:00–19:00 · Sabato chiuso
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Desk Operativo Segreteria
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fetchDeskData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Aggiorna</span>
            </button>

            <button
              type="button"
              onClick={handleResetDemo}
              disabled={isResettingDemo}
              title="Ripristina gli stati demo della giornata per ripetere il flusso dal vivo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`h-3.5 w-3.5 text-teal-700 ${isResettingDemo ? "animate-spin" : ""}`} />
              <span>↺ Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowWalkInModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Accogli al Banco (Walk-in)</span>
            </button>
          </div>
        </div>

        {/* ── BARRA CONNETTIVITÀ WHATSAPP STUDIO (+39 081 1818 2091) & REGOLA REMINDER (-1H) ── */}
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowWhatsAppStudioModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-emerald-500 hover:bg-emerald-50/60 transition-all"
            >
              <span>📱 WhatsApp Studio (+39 081 1818 2091)</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  waPcLinked
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    waPcLinked ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                {waPcLinked ? "Collegato al PC" : "Collega ora"}
              </span>
              <QrCode className="h-3.5 w-3.5 text-emerald-700" />
            </button>

            <button
              type="button"
              onClick={handleToggleReminderRule}
              title="Clicca per alternare la modalità predefinita promemoria"
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-50 transition-colors"
            >
              <span>
                ⏰ Regola Reminder (-1h):{" "}
                {reminderRuleMode === "whatsapp_pc" ? (
                  <>
                    <strong className="text-emerald-800">Invio Guidato WhatsApp PC</strong>{" "}
                    <span className="text-slate-500 font-normal">· (o Auto SMS COCOORA)</span>
                  </>
                ) : (
                  <>
                    <strong className="text-blue-800">Auto SMS COCOORA</strong>{" "}
                    <span className="text-slate-500 font-normal">· (o Invio Guidato WhatsApp PC)</span>
                  </>
                )}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowWhatsAppStudioModal(true)}
            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 self-start lg:self-center"
          >
            Configura QR &amp; Postazione PC →
          </button>
        </div>

        {/* ── KPI RAPIDI DI GIORNATA ── */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {dateFilter === "today" ? `Visite in Giornata (${shortActiveDateLabel})` : "Visite in Agenda"}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
              {visibleAppointments.length}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              In Sala d&apos;Attesa
            </p>
            <p className="text-2xl font-bold font-serif text-amber-950 mt-0.5">
              {waitingCount}
            </p>
          </div>

          <div className="rounded-xl bg-teal-50/80 p-3.5 border border-teal-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
              In Visita negli Studi
            </p>
            <p className="text-2xl font-bold font-serif text-teal-950 mt-0.5">
              {inVisitCount}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50/80 p-3.5 border border-emerald-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              Concluse &amp; Gestite
            </p>
            <p className="text-2xl font-bold font-serif text-emerald-950 mt-0.5">
              {completedCount}
            </p>
          </div>
        </div>

        {/* ── METRICHE QUALITÀ CLINICA, ATTESA & DISDETTE ── */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/70 p-3 border border-emerald-100">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
              {showUpRate}%
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Tasso Presenza
              </p>
              <p className="text-xs text-emerald-950 font-medium">Show-up eccellente</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-teal-50/70 p-3 border border-teal-100">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800 font-bold text-xs font-mono">
              {avgWaitMinutes}m
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                Attesa Media Sala
              </p>
              <p className="text-xs text-teal-950 font-medium">
                {avgWaitMinutes <= 7 ? "Target < 7 min rispettato 🟢" : "Attesa da ottimizzare 🟡"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-amber-50/70 p-3 border border-amber-100">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
              {rescheduledCount}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Spostate / Riprogrammate
              </p>
              <p className="text-xs text-amber-950 font-medium">Visite concordate</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-rose-50/70 p-3 border border-rose-100">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-800 font-bold text-xs">
              {cancelledCount + noShowCount}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                Disdette &amp; No-Show
              </p>
              <p className="text-xs text-rose-950 font-medium">
                {cancelledCount} disdette · {noShowCount} no-show
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ELENCO VISITE DI OGGI & CHECKOUT AL BANCO ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              Flusso Pazienti, Reminder (-1h) &amp; Scheda Contabile
            </h2>
            <p className="text-xs text-slate-500">
              Invia il promemoria WhatsApp dallo studio, segui arrivo/ingresso in studio e apri automaticamente la Scheda Paziente a fine visita.
            </p>
          </div>

          {/* Filtro rapido data: Visite di Oggi vs Tutte in Agenda */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setDateFilter("today")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  dateFilter === "today"
                    ? "bg-white text-teal-900 shadow-2xs border border-teal-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📅 Visite di Oggi ({shortActiveDateLabel})</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    dateFilter === "today"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {todayAppointments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDateFilter("all")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  dateFilter === "all"
                    ? "bg-white text-teal-900 shadow-2xs border border-teal-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📋 Tutte in Agenda</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    dateFilter === "all"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {appointments.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-teal-700 border-t-transparent mb-2"></span>
              <p>Caricamento visite in tempo reale...</p>
            </div>
          ) : visibleAppointments.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 space-y-2">
              <p>Nessun appuntamento presente per la selezione corrente.</p>
              {dateFilter === "today" && appointments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDateFilter("all")}
                  className="text-xs font-semibold text-teal-700 underline hover:text-teal-900"
                >
                  Mostra tutte le {appointments.length} visite in agenda →
                </button>
              )}
            </div>
          ) : (
            visibleAppointments.map((app) => {
              const p = app.patient_profiles;
              const d = app.doctors;
              const r = app.clinic_rooms;
              const timeStr = formatRomeTime(app.starts_at);
              const dateShortStr = formatRomeShortDate(toRomeDateKey(app.starts_at));

              // Percorsi Salute / Investimenti attivi del paziente
              const patientPlans = plans.filter((pl) => pl.patient_id === p?.id);
              const activePlan = patientPlans.length > 0 ? patientPlans[0] : null;
              const planNetTotal = activePlan
                ? Number(activePlan.net_total ?? activePlan.total_amount ?? 0)
                : 0;
              const planPaidTotal = activePlan ? Number(activePlan.paid_total ?? 0) : 0;
              const planResiduo = Math.max(0, planNetTotal - planPaidTotal);

              const reminderInfo = extractReminderInfo(app.notes);
              const incassoBadges = extractIncassoBadges(app.notes);
              const cleanNotes = cleanClinicalNotes(app.notes);

              return (
                <div
                  key={app.id}
                  className="flex flex-col xl:flex-row xl:items-center justify-between py-4 gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex flex-col h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-mono font-bold text-slate-900 border border-slate-200">
                      <span>{timeStr}</span>
                      {dateFilter === "all" && (
                        <span className="text-[9px] font-sans font-semibold text-slate-500">
                          {dateShortStr}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {p ? `${p.first_name} ${p.last_name}` : "Paziente"}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                          {p?.patient_code || "N/A"}
                        </span>
                        {p?.last_name?.includes("(demo)") || p?.notes?.includes("demo") ? (
                          <span className="rounded bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 text-[9px] font-bold">
                            DEMO
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 text-[9px] font-bold flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse"></span>
                            PAZIENTE REALE
                          </span>
                        )}
                        {app.is_first_visit && (
                          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 text-[10px] font-semibold">
                            Prima Visita
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-teal-800">
                          <Stethoscope className="h-3.5 w-3.5" />
                          {d?.full_name || "Specialista da assegnare"}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-semibold">
                          <DoorOpen className="h-3.5 w-3.5" />
                          {r?.name || "Stanza da definire"}
                        </span>
                        {p?.phone && (
                          <span className="flex items-center gap-1 text-slate-500 font-mono">
                            <Phone className="h-3 w-3" />
                            {p.phone}
                          </span>
                        )}
                      </div>

                      {/* Info Percorso Salute / Investimento o Prestazione Specialistica */}
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {activePlan ? (
                          <span className="text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            Percorso Attivo: {activePlan.title}{" "}
                            {planResiduo > 0
                              ? `(Residuo: €${planResiduo.toFixed(0)})`
                              : "(Incluso / Saldato)"}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            Prestazione Specialistica / Percorso Cocoora
                          </span>
                        )}
                      </div>

                      {/* Badge Telemetria Clinica Live, Reminder & Incassi */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {(() => {
                          const notes = app.notes || "";
                          if (app.status === "in_attesa") {
                            const arrivoMatch = notes.match(/\[Arrivo:\s*([^\]]+)\]/);
                            let waitMins = 0;
                            if (arrivoMatch && arrivoMatch[1]) {
                              const arrTime = new Date(arrivoMatch[1]).getTime();
                              if (!isNaN(arrTime)) {
                                waitMins = Math.max(0, Math.floor((currentTime - arrTime) / 60000));
                              }
                            }
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-ping" />
                                ⏳ In attesa in sala da {waitMins} min
                              </span>
                            );
                          }
                          if (app.status === "in_visita") {
                            const startMatch = notes.match(/\[InizioVisita:\s*([^\]]+)\]/);
                            const waitMatch = notes.match(/\[Attesa:\s*(\d+)m\]/);
                            let visitMins = 0;
                            if (startMatch && startMatch[1]) {
                              const stTime = new Date(startMatch[1]).getTime();
                              if (!isNaN(stTime)) {
                                visitMins = Math.max(0, Math.floor((currentTime - stTime) / 60000));
                              }
                            }
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-teal-100 text-teal-900 border border-teal-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                                🩺 In visita da {visitMins} min{" "}
                                {waitMatch ? `· Atteso ${waitMatch[1]}m` : ""}
                              </span>
                            );
                          }
                          if (app.status === "completato") {
                            const durMatch = notes.match(/\[Durata:\s*(\d+)m\]/);
                            const waitMatch = notes.match(/\[Attesa:\s*(\d+)m\]/);
                            if (durMatch || waitMatch) {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                  ✓ Visita: {durMatch ? `${durMatch[1]}m` : "N/D"} · Attesa sala:{" "}
                                  {waitMatch ? `${waitMatch[1]}m` : "N/D"}
                                </span>
                              );
                            }
                          }
                          return null;
                        })()}

                        {/* Storico Reminder su stati successivi a confermato/in_attesa */}
                        {reminderInfo.sent &&
                          app.status !== "confermato" &&
                          app.status !== "in_attesa" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                              ✓ Reminder inviato ({reminderInfo.timeLabel})
                            </span>
                          )}

                        {/* Badge Incassi registrati */}
                        {incassoBadges.map((inc, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 text-[10px] font-semibold text-emerald-900"
                          >
                            💶 Incasso: {inc}
                          </span>
                        ))}
                      </div>

                      {cleanNotes && (
                        <p className="text-[11px] text-slate-500 italic mt-1">
                          Note: {cleanNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── AZIONI REMINDER, STATO ACCOGLIENZA & SCHEDA PAZIENTE ── */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start xl:self-center xl:justify-end">
                    {/* Bottone o Badge Reminder (-1h) per visite confermate o in attesa */}
                    {(app.status === "confermato" || app.status === "in_attesa") &&
                      (reminderInfo.sent ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReminderPopup(app)}
                          title="Promemoria già inviato — clicca per visualizzare o reinviare"
                          className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                        >
                          <span>✓ Reminder inviato ({reminderInfo.timeLabel})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenReminderPopup(app)}
                          className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors whitespace-nowrap"
                        >
                          <span>💬 Reminder (-1h)</span>
                        </button>
                      ))}

                    {/* Avanzamento Stato Visita */}
                    {app.status === "confermato" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, "in_attesa")}
                        className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition-colors whitespace-nowrap"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Arrivato (Sala d&apos;Attesa)</span>
                      </button>
                    )}

                    {app.status === "in_attesa" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, "in_visita")}
                        className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 transition-colors whitespace-nowrap"
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        <span>Fai Entrare in Studio</span>
                      </button>
                    )}

                    {app.status === "in_visita" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, "completato")}
                        className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors whitespace-nowrap"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Concludi Visita</span>
                      </button>
                    )}

                    {app.status === "completato" && (
                      <span className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3 text-xs font-semibold text-slate-700 whitespace-nowrap">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Visita Conclusa</span>
                      </span>
                    )}

                    {app.status === "annullato" && (
                      <span className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 text-xs font-semibold text-rose-700 whitespace-nowrap">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>Disdetto dal Paziente</span>
                      </span>
                    )}

                    {app.status === "no_show" && (
                      <span className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 text-xs font-semibold text-amber-800 whitespace-nowrap">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>No-Show (Non Presentato)</span>
                      </span>
                    )}

                    {/* Azioni Sposta & Disdici per visite non ancora completate */}
                    {app.status !== "completato" &&
                      app.status !== "annullato" &&
                      app.status !== "no_show" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenReschedule(app)}
                            className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs"
                            title="Sposta data o orario dell'appuntamento"
                          >
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>Sposta 🗓️</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenCancel(app)}
                            className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors whitespace-nowrap shadow-2xs"
                            title="Registra disdetta o mancata presentazione"
                          >
                            <XCircle className="h-3.5 w-3.5 text-rose-600" />
                            <span>Disdici ✕</span>
                          </button>
                        </>
                      )}

                    {/* Se annullato o no-show, possibilità rapida di riprogrammare */}
                    {(app.status === "annullato" || app.status === "no_show") && (
                      <button
                        type="button"
                        onClick={() => handleOpenReschedule(app)}
                        className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs"
                        title="Fissa una nuova data per il paziente"
                      >
                        <CalendarClock className="h-3.5 w-3.5 text-teal-700" />
                        <span>Riprogramma 🗓️</span>
                      </button>
                    )}

                    {/* Pulsante Unico Chiaro: Scheda & Incasso -> apre PatientDetailModal */}
                    {p && (
                      <button
                        type="button"
                        onClick={() => handleOpenPatientSheet(app, "piani")}
                        className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1d2327] px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors whitespace-nowrap"
                        title="Apri scheda completa paziente, Percorsi Salute, Investimenti e contabilità"
                      >
                        <User className="h-3.5 w-3.5 text-teal-300" />
                        <span>👤 Scheda &amp; Incasso →</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── OCCUPAZIONE STANZE LIVE (STUDIO 1, 2, 3) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
          Stato Occupazione Studi Medici in Tempo Reale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((room) => {
            const occupant = visibleAppointments.find(
              (a) =>
                (a.room_id === room.id || a.clinic_rooms?.id === room.id) &&
                a.status === "in_visita"
            );
            const nextPatient = visibleAppointments.find(
              (a) =>
                (a.room_id === room.id || a.clinic_rooms?.id === room.id) &&
                a.status === "in_attesa"
            );

            return (
              <div
                key={room.id}
                className={`rounded-xl border p-4 transition-all ${
                  occupant
                    ? "border-amber-300 bg-amber-50/50"
                    : "border-emerald-200 bg-emerald-50/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-serif text-sm text-slate-900">{room.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      occupant
                        ? "bg-amber-200 text-amber-900"
                        : "bg-emerald-200 text-emerald-900"
                    }`}
                  >
                    {occupant ? "Occupato" : "Disponibile"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {room.description || "Studio medico specialistico"}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs">
                  {occupant ? (
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">
                        Paziente all&apos;interno:
                      </span>
                      <p className="font-bold text-slate-900">
                        {occupant.patient_profiles?.first_name}{" "}
                        {occupant.patient_profiles?.last_name}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Medico: {occupant.doctors?.full_name}
                      </p>
                    </div>
                  ) : nextPatient ? (
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Prossimo in attesa:
                      </span>
                      <p className="font-semibold text-slate-800">
                        {nextPatient.patient_profiles?.first_name}{" "}
                        {nextPatient.patient_profiles?.last_name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Nessun paziente assegnato al momento.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SCHEDA COMPLETA PAZIENTE (APERTURA AUTOMATICA A FINE VISITA O DA "SCHEDA & INCASSO ->") ── */}
      {selectedPatientForModal && (
        <PatientDetailModalBridge
          patient={selectedPatientForModal}
          initialTab={modalInitialTab}
          completedAppointment={completedAppointmentContext}
          onClose={() => {
            setSelectedPatientForModal(null);
            setCompletedAppointmentContext(null);
          }}
          onRefresh={() => {
            fetchDeskData();
          }}
          onOpenCassa={onOpenCassa}
        />
      )}

      {/* ── MODALE: COLLEGA WHATSAPP CLINICA (+39 081 1818 2091) AL GESTIONALE ── */}
      {showWhatsAppStudioModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      Collega WhatsApp Clinica al Gestionale
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        waPcLinked
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {waPcLinked ? "● Collegato al PC" : "○ In attesa di scansione"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Numero Ufficiale Studio Cocoora: <strong className="font-mono text-slate-800">+39 081 1818 2091</strong> · Postazione Segreteria
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppStudioModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Passo 1: Scansione QR su WhatsApp Web / Desktop */}
              <div className="md:col-span-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">
                    1
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Scansiona il QR dal Telefono di Studio
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apri <strong>WhatsApp</strong> sul telefono della clinica (
                  <span className="font-mono font-semibold text-slate-800">+39 081 1818 2091</span>
                  ), vai su <strong>Dispositivi collegati → Collega un dispositivo</strong> e inquadra il QR Code mostrato su questo PC della reception.
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Una volta abbinato, ogni clic su <strong>&ldquo;💬 Reminder (-1h)&rdquo;</strong> apre direttamente la chat del paziente con il messaggio già pronto da inviare in 1 secondo.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      "https://web.whatsapp.com",
                      "cocoora_whatsapp_studio",
                      "width=1060,height=780,noopener,noreferrer"
                    );
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
                >
                  <span>💻 Apri WhatsApp Web per Scansionare il QR dello Studio</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>

                {/* Selettore preferenza apertura sul PC */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Preferenza apertura messaggi su questo PC:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeWaOpenMode("web")}
                      className={`rounded-lg border p-2.5 text-left text-xs transition-all ${
                        waOpenMode === "web"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block">🌐 WhatsApp Web nel Browser</span>
                      <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                        web.whatsapp.com
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChangeWaOpenMode("desktop")}
                      className={`rounded-lg border p-2.5 text-left text-xs transition-all ${
                        waOpenMode === "desktop"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block">🖥️ App WhatsApp Desktop</span>
                      <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                        wa.me / protocollo nativo
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Passo 2: Card QR Visivo Reale Chat Ufficiale Studio */}
              <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex flex-col items-center justify-between text-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-[11px] font-bold">
                      2
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                      QR Chat Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Inquadra con lo smartphone per testare la chat ufficiale Cocoora{" "}
                    <strong className="font-mono">+39 081 1818 2091</strong>
                  </p>
                </div>

                <div className="my-3 rounded-2xl border-2 border-white bg-white p-3 shadow-sm">
                  {!qrLoadError ? (
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwa.me%2F3908118182091"
                      alt="QR Code WhatsApp Cocoora Studio +39 081 1818 2091"
                      width={168}
                      height={168}
                      onError={() => setQrLoadError(true)}
                      className="h-42 w-42 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex h-42 w-42 flex-col items-center justify-center rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-3 text-emerald-900">
                      <QrCode className="h-14 w-14 text-emerald-700 mb-1.5" />
                      <span className="text-[11px] font-bold">Chat Studio Verificata</span>
                      <span className="text-[10px] font-mono mt-0.5">+39 081 1818 2091</span>
                    </div>
                  )}
                </div>

                <a
                  href="https://wa.me/3908118182091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>wa.me/3908118182091</span>
                </a>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => handleConfirmWaPcLink(!waPcLinked)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
              >
                {waPcLinked
                  ? "Segna temporaneamente come non collegato"
                  : "Ripristina stato collegato"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppStudioModal(false)}
                  className="rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Chiudi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleConfirmWaPcLink(true);
                    setShowWhatsAppStudioModal(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                >
                  <span>✓ Conferma Postazione PC Collegata</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── POPUP ANTEPRIMA PROMEMORIA APPUNTAMENTO (-1H) ── */}
      {showReminderModal && selectedAppForReminder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Anteprima Promemoria Appuntamento -1h
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verifica o personalizza il testo prima dell&apos;invio da WhatsApp Studio (+39 081 1818 2091)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReminderModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Riepilogo Destinatario & Appuntamento */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Paziente Destinatario
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {`${selectedAppForReminder.patient_profiles?.first_name || ""} ${
                      selectedAppForReminder.patient_profiles?.last_name || ""
                    }`
                      .replace(/\s*\(demo\)\s*/gi, "")
                      .trim() || "Paziente"}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Telefono / WhatsApp Destinatario
                  </label>
                  <input
                    type="text"
                    value={reminderPhone}
                    onChange={(e) => setReminderPhone(e.target.value)}
                    placeholder="+39 347 ..."
                    className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600">
                <span>
                  Orario: <strong className="font-mono text-teal-900">{formatRomeTime(selectedAppForReminder.starts_at)}</strong>
                </span>
                <span>
                  Specialista:{" "}
                  <strong className="text-slate-900">
                    {selectedAppForReminder.doctors?.full_name || "Specialista Cocoora"}
                  </strong>
                </span>
                <span>
                  Stanza:{" "}
                  <strong className="text-slate-900">
                    {selectedAppForReminder.clinic_rooms?.name || "Studio 1"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Textarea Messaggio Precompilato GDPR Art. 9 Compliant */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Testo del Messaggio (modificabile dalla segreteria)
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <ShieldCheck className="h-3 w-3" /> GDPR Art. 9 (Zero dati clinici)
                </span>
              </div>
              <textarea
                rows={4}
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-emerald-600 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Opzione SMS Reale Twilio */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={sendRealSms}
                  onChange={(e) => setSendRealSms(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Invia SMS reale Twilio ora (altrimenti simula invio su numeri test)</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-blue-800">Mittente: COCOORA</span>
            </div>

            {/* 3 Pulsanti Azione */}
            <div className="mt-5 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmittingReminder}
                onClick={() => handleConfirmReminder("demo_only")}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Segna come Inviato (Solo Demo)
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  disabled={isSubmittingReminder}
                  onClick={() => handleConfirmReminder("sms_twilio")}
                  className="rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  📩 Invia via SMS (Mittente COCOORA)
                </button>

                <button
                  type="button"
                  disabled={isSubmittingReminder}
                  onClick={() => handleConfirmReminder("whatsapp_pc")}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  💬 Apri WhatsApp sul PC e Invia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL WALK-IN (ACCOGLI AL BANCO - 60 MINUTI) ── */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Accoglienza Paziente al Banco (Walk-in · 60 min)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalkInModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seleziona Paziente
                </label>
                <select
                  value={walkInPatientId}
                  onChange={(e) => setWalkInPatientId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.patient_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medico Specialista Disponibile
                </label>
                <select
                  value={walkInDoctorId}
                  onChange={(e) => setWalkInDoctorId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} ({d.title || "Specialista"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stanza Operativa Assegnata
                </label>
                <select
                  value={walkInRoomId}
                  onChange={(e) => setWalkInRoomId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Accoglienza / Motivo Visita
                </label>
                <input
                  type="text"
                  value={walkInNotes}
                  onChange={(e) => setWalkInNotes(e.target.value)}
                  placeholder="es. Controllo urgente / consulenza"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={walkInIsFirstVisit}
                  onChange={(e) => setWalkInIsFirstVisit(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-teal-700"
                />
                <span>Prima Visita conoscitiva (slot 60 min)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWalkIn}
                  className="rounded-lg bg-teal-800 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors disabled:opacity-50"
                >
                  {isSubmittingWalkIn ? "Inserimento..." : "Fai Entrare in Sala d'Attesa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL SPOSTA / RIPROGRAMMA VISITA ── */}
      {showRescheduleModal && selectedAppForReschedule && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Sposta / Riprogramma Visita
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700">
              <p className="font-bold text-slate-900">
                {selectedAppForReschedule.patient_profiles?.first_name}{" "}
                {selectedAppForReschedule.patient_profiles?.last_name} (
                {selectedAppForReschedule.patient_profiles?.patient_code})
              </p>
              <p className="text-slate-500 mt-0.5">
                Specialista:{" "}
                <span className="font-semibold text-teal-800">
                  {selectedAppForReschedule.doctors?.full_name || "Assegnato"}
                </span>
              </p>
            </div>

            <form onSubmit={handleConfirmReschedule} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nuova Data
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nuovo Orario
                  </label>
                  <input
                    type="time"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo dello Spostamento
                </label>
                <select
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                >
                  <option value="Richiesta del paziente (lavoro / impegni personali)">
                    Richiesta del paziente (lavoro / impegni personali)
                  </option>
                  <option value="Richiesta del paziente (motivi di salute)">
                    Richiesta del paziente (motivi di salute)
                  </option>
                  <option value="Imprevisto medico / Cambio turno clinico">
                    Imprevisto medico / Cambio turno clinico
                  </option>
                  <option value="Anticipo orario concordato">
                    Anticipo orario concordato
                  </option>
                  <option value="Altro motivo organizzativo">
                    Altro motivo organizzativo
                  </option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReschedule}
                  className="rounded-lg bg-teal-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-900 disabled:opacity-50"
                >
                  {isSubmittingReschedule ? "Spostamento in corso..." : "Conferma Spostamento 🗓️"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL ANNULLA / NO-SHOW ── */}
      {showCancelModal && selectedAppForCancel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-700" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Registra Disdetta o No-Show
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700">
              <p className="font-bold text-slate-900">
                {selectedAppForCancel.patient_profiles?.first_name}{" "}
                {selectedAppForCancel.patient_profiles?.last_name} (
                {selectedAppForCancel.patient_profiles?.patient_code})
              </p>
              <p className="text-slate-500 mt-0.5">
                Visita prevista: {formatRomeTime(selectedAppForCancel.starts_at)} —{" "}
                {selectedAppForCancel.doctors?.full_name || "Medico"}
              </p>
            </div>

            <form onSubmit={handleConfirmCancel} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tipologia Esito
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCancelType("annullato")}
                    className={`rounded-lg border p-2.5 text-left text-xs font-semibold transition-all ${
                      cancelType === "annullato"
                        ? "border-rose-600 bg-rose-50 text-rose-900 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-bold">🚫 Disdetto dal Paziente</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Ha avvisato prima
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCancelType("no_show")}
                    className={`rounded-lg border p-2.5 text-left text-xs font-semibold transition-all ${
                      cancelType === "no_show"
                        ? "border-amber-600 bg-amber-50 text-amber-900 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-bold">⚠️ No-Show</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Non si è presentato
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo / Note Accoglienza
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-rose-600 focus:outline-none"
                >
                  <option value="Disdetto con preavviso dal paziente (motivi personali)">
                    Disdetto con preavviso dal paziente (motivi personali)
                  </option>
                  <option value="Disdetto last-minute <24h">
                    Disdetto last-minute &lt;24h
                  </option>
                  <option value="Mancata presentazione senza avviso (non risponde al telefono)">
                    Mancata presentazione senza avviso (non risponde al telefono)
                  </option>
                  <option value="Sintomi influenzali o malattia improvvisa">
                    Sintomi influenzali o malattia improvvisa
                  </option>
                  <option value="Altro motivo">Altro motivo</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Indietro
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCancel}
                  className="rounded-lg bg-rose-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
                >
                  {isSubmittingCancel ? "Registrazione in corso..." : "Conferma Esito"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
