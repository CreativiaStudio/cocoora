"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { computeAvailableSlots, type Slot } from "@/lib/slot-engine";
import { supabase } from "@/lib/supabase";

type MedicalService = {
  id: string;
  code: string;
  name: string;
  category: string;
  duration_minutes: number;
  is_bookable_online: boolean;
  room?: string | null;
};

type Step = 1 | 2 | 3 | 4;

const CATEGORY_TABS = [
  { id: "all", label: "Tutte le Visite" },
  { id: "odontoiatria", label: "🦷 Odontoiatria & Igiene" },
  { id: "medicina_estetica", label: "✨ Medicina Estetica & Laser" },
  { id: "specialistica", label: "🩺 Visite Specialistiche & Diagnostica" },
];

export function PatientCalendar() {
  const [step, setStep] = useState<Step>(1);

  // STEP 1 STATE: SERVICES
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);

  // STEP 2 STATE: DATE & SLOTS
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Domani
    return d.toISOString().split("T")[0];
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // STEP 3 STATE: PATIENT FORM
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // 1. Carica il catalogo prestazioni mediche attive prenotabili online
  useEffect(() => {
    async function loadServices() {
      try {
        setLoadingServices(true);
        let loaded = false;

        try {
          const res = await fetch("/api/services");
          if (res.ok) {
            const data = await res.json();
            if (data.services && Array.isArray(data.services) && data.services.length > 0) {
              const onlineOnly = data.services.filter(
                (s: MedicalService) => s.is_bookable_online !== false
              );
              setServices(onlineOnly);
              loaded = true;
            }
          }
        } catch (err) {
          console.warn("Fallback caricamento prestazioni diretto Supabase", err);
        }

        if (!loaded) {
          // Fallback Supabase client
          const { data } = await supabase
            .from("medical_services")
            .select("id, code, name, category, duration_minutes, is_bookable_online, room")
            .eq("is_active", true)
            .eq("is_bookable_online", true)
            .order("name", { ascending: true });

          if (data && data.length > 0) {
            setServices(data);
          }
        }
      } catch (e) {
        console.error("Errore fetch prestazioni", e);
      } finally {
        setLoadingServices(false);
      }
    }

    loadServices();
  }, []);

  // 2. Carica gli slot quando cambia la data o il servizio
  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      let loaded = false;

      try {
        const queryParams = new URLSearchParams({ date: selectedDate });
        if (selectedService?.id) queryParams.set("serviceId", selectedService.id);
        const res = await fetch(`/api/calendar/slots?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.slots && Array.isArray(data.slots)) {
            setSlots(data.slots);
            loaded = true;
          }
        }
      } catch {}

      if (!loaded) {
        // Fallback slot engine
        const directSlots = await computeAvailableSlots(selectedDate);
        setSlots(directSlots);
      }
    } catch (e) {
      console.error("Errore recupero slot", e);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (step >= 2) {
      fetchSlots();
    }
  }, [selectedDate, step, selectedService]);

  // Filtro prestazioni
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Filtro categoria
      if (activeCategory === "odontoiatria") {
        const c = s.category?.toLowerCase() || "";
        if (!c.includes("odont") && !c.includes("igiene")) return false;
      } else if (activeCategory === "medicina_estetica") {
        const c = s.category?.toLowerCase() || "";
        if (!c.includes("estet") && !c.includes("laser")) return false;
      } else if (activeCategory === "specialistica") {
        const c = s.category?.toLowerCase() || "";
        if (c.includes("odont") || c.includes("igiene") || c.includes("estet")) return false;
      }

      // Filtro ricerca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCat = s.category?.toLowerCase().includes(q);
        const matchCode = s.code?.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchCode) return false;
      }

      return true;
    });
  }, [services, activeCategory, searchQuery]);

  // Gestione Date
  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const setRelativeDay = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  // Raggruppamento Slot (Mattina / Pomeriggio)
  const availableSlots = slots.filter((s) => s.isAvailable);

  const morningSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0], 10);
    return hour < 14;
  });

  const afternoonSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0], 10);
    return hour >= 14;
  });

  // Conferma finale della prenotazione
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setSubmitting(true);
    setBookingError(null);

    const duration = selectedService?.duration_minutes || 30;

    try {
      const res = await fetch("/api/calendar/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedSlot.doctorId,
          roomId: selectedSlot.roomId,
          serviceId: selectedService?.id,
          date: selectedSlot.date,
          time: selectedSlot.time,
          durationMinutes: duration,
          patientName: form.name.trim(),
          patientPhone: form.phone.trim(),
          patientEmail: form.email.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setConfirmedBookingId(data.appointmentId || `COC-APT-${Math.floor(10000 + Math.random() * 90000)}`);
          setStep(4);
          return;
        }
      }

      // Fallback Supabase diretto
      const nameParts = form.name.trim().split(" ");
      const firstName = nameParts[0] || "Paziente";
      const lastName = nameParts.slice(1).join(" ") || "Cocoora";

      let pId: string | null = null;
      const { data: pData } = await supabase
        .from("patient_profiles")
        .insert({
          patient_code: `COC-PZ-${Math.floor(10000 + Math.random() * 90000)}`,
          first_name: firstName,
          last_name: lastName,
          phone: form.phone.trim(),
          email: form.email.trim() || null,
        })
        .select("id")
        .single();

      if (pData) pId = pData.id;

      const startsAt = new Date(`${selectedSlot.date}T${selectedSlot.time}:00Z`).toISOString();
      const endsAt = new Date(new Date(startsAt).getTime() + duration * 60 * 1000).toISOString();

      const { data: apptData, error: apptErr } = await supabase
        .from("appointments")
        .insert({
          patient_id: pId,
          doctor_id: selectedSlot.doctorId,
          room_id: selectedSlot.roomId,
          service_id: selectedService?.id || null,
          starts_at: startsAt,
          ends_at: endsAt,
          status: "confermato",
          is_first_visit: true,
          notes: form.notes ? `Prenotazione Paziente: ${form.notes}` : "Prenotazione online autonoma paziente",
        })
        .select("id")
        .single();

      if (apptErr) throw apptErr;

      setConfirmedBookingId(apptData?.id || `COC-APT-${Math.floor(10000 + Math.random() * 90000)}`);
      setStep(4);
    } catch (err: unknown) {
      console.error("Errore prenotazione", err);
      setBookingError("Non è stato possibile completare la prenotazione. Contatta la nostra reception al 081 18182091.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = new Date(selectedDate + "T00:00:00Z").toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ── STEPPER HEADER ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-4 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-left transition-all ${
            step === 1
              ? "bg-[#1C4A5C] text-white shadow-xs font-semibold"
              : step > 1
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-medium"
              : "bg-slate-50 text-slate-400 border border-slate-200/60"
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              step === 1
                ? "bg-white text-[#1C4A5C]"
                : step > 1
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {step > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
          </span>
          <div className="truncate">
            <p className="text-xs sm:text-sm leading-tight">1. Prestazione</p>
            {selectedService && step > 1 && (
              <p className="text-[10px] text-emerald-700 truncate">{selectedService.name}</p>
            )}
          </div>
        </button>

        <button
          type="button"
          disabled={!selectedService}
          onClick={() => selectedService && setStep(2)}
          className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-left transition-all ${
            step === 2
              ? "bg-[#1C4A5C] text-white shadow-xs font-semibold"
              : step > 2
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-medium"
              : "bg-slate-50 text-slate-400 border border-slate-200/60 disabled:cursor-not-allowed"
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              step === 2
                ? "bg-white text-[#1C4A5C]"
                : step > 2
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {step > 2 ? <Check className="h-3.5 w-3.5" /> : "2"}
          </span>
          <div className="truncate">
            <p className="text-xs sm:text-sm leading-tight">2. Data & Ora</p>
            {selectedSlot && step > 2 && (
              <p className="text-[10px] text-emerald-700 truncate">Ore {selectedSlot.time}</p>
            )}
          </div>
        </button>

        <button
          type="button"
          disabled={!selectedSlot}
          onClick={() => selectedSlot && setStep(3)}
          className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-left transition-all ${
            step >= 3
              ? "bg-[#1C4A5C] text-white shadow-xs font-semibold"
              : "bg-slate-50 text-slate-400 border border-slate-200/60 disabled:cursor-not-allowed"
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              step >= 3 ? "bg-white text-[#1C4A5C]" : "bg-slate-200 text-slate-600"
            }`}
          >
            3
          </span>
          <div className="truncate">
            <p className="text-xs sm:text-sm leading-tight">3. Conferma</p>
            <p className="text-[10px] opacity-75 truncate">Dati personali</p>
          </div>
        </button>
      </div>

      {/* ── PASSO 1: SELEZIONE PRESTAZIONE ─────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca prestazione (es. prima visita, igiene, oculistica, filler...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:border-[#1C4A5C] focus:outline-none bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Pillole categorie */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === tab.id
                      ? "bg-[#1C4A5C] text-white shadow-xs font-semibold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Griglia prestazioni */}
          {loadingServices ? (
            <div className="p-16 text-center text-sm text-slate-500 bg-white rounded-3xl border border-slate-200">
              Caricamento catalogo prestazioni...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Stethoscope className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-base font-semibold text-slate-800">Nessuna prestazione trovata.</p>
              <p className="text-xs text-slate-500 mt-1">
                Prova a modificare il testo di ricerca o contatta la segreteria al centralino <strong>081 18182091</strong>.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(2);
                    }}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? "border-[#1C4A5C] bg-[#EEF6FA] shadow-md ring-2 ring-[#1C4A5C]/20"
                        : "border-slate-200/90 bg-white hover:border-[#1C4A5C]/60 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100/80">
                          {service.category?.replace(/_/g, " ").toUpperCase() || "VISITA"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {service.duration_minutes || 30} min
                        </span>
                      </div>

                      <h4 className="mt-3 font-serif text-base font-bold text-slate-900 leading-snug">
                        {service.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1C4A5C] flex items-center gap-1 group-hover:underline">
                        Scegli orario →
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-emerald-600" /> Prenotabile
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PASSO 2: SELEZIONE DATA & ORARIO ──────────────────────────── */}
      {step === 2 && selectedService && (
        <div className="space-y-6">
          {/* Banner di riepilogo prestazione selezionata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#EEF6FA] rounded-2xl border border-[#80A1B2]/30 gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1C4A5C] text-white flex items-center justify-center shrink-0">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Prestazione Selezionata
                </span>
                <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                  {selectedService.name}
                </h4>
                <p className="text-xs text-slate-600">
                  Durata stimata: {selectedService.duration_minutes || 30} minuti
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-[#1C4A5C] hover:underline self-start sm:self-center"
            >
              ← Cambia prestazione
            </button>
          </div>

          {/* Selettore Giorno */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeDateByDays(-1)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
                  aria-label="Giorno precedente"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-teal-50 border border-teal-100">
                  <CalendarIcon className="h-4 w-4 text-teal-700" />
                  <span className="font-serif text-sm sm:text-base font-semibold text-slate-900 capitalize">
                    {formattedDate}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => changeDateByDays(1)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
                  aria-label="Giorno successivo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Tasti rapidi e date picker */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setRelativeDay(0)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Oggi
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDay(1)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Domani
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDay(2)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dopodomani
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-800 font-semibold focus:border-[#1C4A5C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Elenco Slot divisi per Mattina / Pomeriggio */}
          {loadingSlots ? (
            <div className="p-16 text-center text-sm text-slate-500 bg-white rounded-3xl border border-slate-200">
              Verifica disponibilità specialisti in clinica...
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-teal-200 bg-white p-12 text-center text-slate-600">
              <CalendarIcon className="mx-auto h-8 w-8 text-teal-600 mb-2 opacity-60" />
              <p className="font-serif text-base font-semibold text-slate-900">
                Nessun orario disponibile per {formattedDate}.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Prova a selezionare il giorno successivo con la freccia oppure chiama la reception al <strong>081 18182091</strong>.
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => changeDateByDays(1)}
                >
                  Vedi Giorno Successivo →
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sezione Mattina */}
              {morningSlots.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    ☀️ Mattina (09:00 - 13:00)
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {morningSlots.map((slot, idx) => (
                      <button
                        key={`m-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setStep(3);
                        }}
                        className="group p-3.5 rounded-xl border border-slate-200 hover:border-[#1C4A5C] hover:bg-[#EEF6FA] text-left transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-[#1C4A5C]">
                            Ore {slot.time}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {slot.roomName || "Studio"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-700 truncate">
                          {slot.doctorName}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                          ✓ Seleziona
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sezione Pomeriggio */}
              {afternoonSlots.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    ⛅ Pomeriggio (14:30 - 19:30)
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {afternoonSlots.map((slot, idx) => (
                      <button
                        key={`p-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setStep(3);
                        }}
                        className="group p-3.5 rounded-xl border border-slate-200 hover:border-[#1C4A5C] hover:bg-[#EEF6FA] text-left transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-[#1C4A5C]">
                            Ore {slot.time}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {slot.roomName || "Studio"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-700 truncate">
                          {slot.doctorName}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                          ✓ Seleziona
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── PASSO 3: DATI PAZIENTE & CONFERMA ──────────────────────────── */}
      {step === 3 && selectedService && selectedSlot && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Card di Riepilogo Sintetico e Rassicurante */}
          <div className="bg-[#1C4A5C] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-200">
                Riepilogo Visita Scelta
              </span>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-white/80 hover:text-white underline"
              >
                Modifica data/orario
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                {selectedService.name}
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-teal-300" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-300" />
                  <span>Ore {selectedSlot.time} ({selectedService.duration_minutes || 30} min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-300" />
                  <span>{selectedSlot.doctorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-teal-300" />
                  <span>{selectedSlot.roomName || "Studio Clinico"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-teal-200">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>Cocoora Centro Medico · Via De Bonis, Napoli (NA)</span>
              </div>
            </div>
          </div>

          {/* Form Inserimento Dati */}
          <form
            onSubmit={handleConfirmBooking}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4"
          >
            <h4 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Inserisci i tuoi dati di contatto per la conferma
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Nome e Cognome *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="es. Mario Rossi"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#1C4A5C] focus:outline-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Numero di Telefono (per conferma SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="333 1234567"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#1C4A5C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Email (per promemoria digitale)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="mario.rossi@email.it"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#1C4A5C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Eventuali note per lo specialista o la reception
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Es. Prima visita di controllo, fastidio a un dente, richiesta chiarimento..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#1C4A5C] focus:outline-none resize-none"
              />
            </div>

            {bookingError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ← Torna agli orari
              </button>
              <Button type="submit" size="md" disabled={submitting}>
                {submitting ? "Registrazione in corso..." : "Conferma Prenotazione"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── PASSO 4: CONFERMA AVVENUTA CON SUCCESSO ────────────────────── */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-sm max-w-xl mx-auto text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Prenotazione Registrata
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mt-3">
              Ti aspettiamo da Cocoora!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Abbiamo inserito il tuo appuntamento nell&apos;agenda dello specialista.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Codice Appuntamento:</span>
              <span className="font-mono font-bold text-slate-900">{confirmedBookingId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Prestazione:</span>
              <span className="font-semibold text-slate-900">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Specialista:</span>
              <span className="font-semibold text-slate-900">{selectedSlot?.doctorName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Data e Ora:</span>
              <span className="font-semibold text-slate-900 capitalize">
                {formattedDate} ore {selectedSlot?.time}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Sede:</span>
              <span className="font-semibold text-slate-900">Via De Bonis, Napoli</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Riceverai una conferma via SMS sul numero indicato. Ti consigliamo di arrivare in clinica con circa 10 minuti di anticipo.
          </p>

          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep(1);
                setSelectedSlot(null);
                setForm({ name: "", phone: "", email: "", notes: "" });
              }}
            >
              Prenota un&apos;altra visita
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
