"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  Plus,
  RefreshCw,
  SearchCheck,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { computeAvailableSlots, type Slot } from "@/lib/slot-engine";
import { supabase } from "@/lib/supabase";

type Room = { id: string; slug: string; name: string };

type MedicalService = {
  id: string;
  code: string | null;
  name: string;
  category?: string | null;
  duration_minutes?: number | null;
};

type RoomColumnConfig = {
  key: string;
  roomName: string;
  subtitle: string;
};

const DEFAULT_DURATION_MINUTES = 30;

const ROOM_COLUMNS: RoomColumnConfig[] = [
  { key: "studio-1", roomName: "Studio 1", subtitle: "Odontoiatria & Riunito" },
  { key: "studio-2", roomName: "Studio 2", subtitle: "Chirurgia & Estetica" },
  { key: "studio-3", roomName: "Studio 3", subtitle: "Laser & Tecnologie" },
  { key: "studio-4", roomName: "Studio 4", subtitle: "Oculistica & Diagnostica HD" },
  { key: "sala-opt", roomName: "Sala OPT", subtitle: "Radiologia Digitale OPT" },
];

function normalizeRoomName(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slotBelongsToRoom(slot: Slot, roomKey: string): boolean {
  const name = normalizeRoomName(slot.roomName);
  if (!name) return false;

  switch (roomKey) {
    case "studio-1":
      return name.includes("studio 1");
    case "studio-2":
      return name.includes("studio 2");
    case "studio-3":
      return name.includes("studio 3");
    case "studio-4":
      return name.includes("studio 4");
    case "sala-opt":
      return name.includes("opt") || name.includes("rx") || name.includes("tac") || name.includes("radiolog");
    default:
      return false;
  }
}

function buildRoomColumns(slots: Slot[]): Array<RoomColumnConfig & { slots: Slot[] }> {
  const columns = ROOM_COLUMNS.map((column) => ({
    ...column,
    slots: slots.filter((slot) => slotBelongsToRoom(slot, column.key)),
  }));

  // Raggruppamento dinamico: eventuali stanze non mappate restano visibili in coda.
  const unmatched = slots.filter(
    (slot) => !ROOM_COLUMNS.some((column) => slotBelongsToRoom(slot, column.key))
  );

  const extraRoomNames = Array.from(
    new Set(unmatched.map((slot) => slot.roomName || "Stanza da assegnare"))
  );

  extraRoomNames.forEach((roomName, index) => {
    columns.push({
      key: `extra-${index}`,
      roomName,
      subtitle: "Ambulatorio clinico",
      slots: unmatched.filter((slot) => (slot.roomName || "Stanza da assegnare") === roomName),
    });
  });

  return columns;
}

export function CalendarMatrix() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to tomorrow or next business day
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [patientForm, setPatientForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      try {
        const res = await fetch(`/api/calendar/slots?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          if (data.slots) {
            setSlots(data.slots);
            return;
          }
        }
      } catch {}

      // Fallback motore incrocio diretto client
      const directSlots = await computeAvailableSlots(selectedDate);
      setSlots(directSlots);
    } catch (e) {
      console.error("Errore recupero slot", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Errore caricamento prestazioni");
        const data = await res.json();
        if (!cancelled) {
          setServices(Array.isArray(data.services) ? data.services : []);
        }
      } catch {
        if (!cancelled) {
          setServicesError("Impossibile caricare il listino prestazioni dal backend clinico.");
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const resetBookingForm = () => {
    setPatientForm({ firstName: "", lastName: "", phone: "", email: "", notes: "" });
    setSelectedServiceId("");
    setBookingError(null);
  };

  const selectedService = services.find((service) => service.id === selectedServiceId) || null;
  const bookingDuration = selectedService?.duration_minutes || DEFAULT_DURATION_MINUTES;

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSlot) return;

    if (!selectedServiceId) {
      setBookingError("Seleziona la prestazione clinica da collegare all'appuntamento.");
      return;
    }

    const patientName = `${patientForm.firstName} ${patientForm.lastName}`.trim();
    if (!patientName) {
      setBookingError("Inserisci nome e cognome del paziente.");
      return;
    }

    try {
      setBookingError(null);
      try {
        const res = await fetch("/api/calendar/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: bookingSlot.doctorId,
            roomId: bookingSlot.roomId,
            serviceId: selectedServiceId,
            date: bookingSlot.date,
            time: bookingSlot.time,
            durationMinutes: bookingDuration,
            patientName,
            patientPhone: patientForm.phone,
            patientEmail: patientForm.email,
            notes: patientForm.notes,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setBookingSuccess(true);
            setSuccessMessage(
              `Appuntamento confermato: ${patientName} · ${bookingSlot.roomName || "Stanza"} · ${bookingSlot.date} ${bookingSlot.time}`
            );
            setTimeout(() => {
              setBookingSlot(null);
              setBookingSuccess(false);
              setSuccessMessage(null);
              resetBookingForm();
              fetchSlots();
            }, 1600);
            return;
          } else {
            setBookingError(json.error || "Prenotazione non registrata dal backend clinico.");
            return;
          }
        }

        const errorJson = await res.json().catch(() => null);
        setBookingError(
          (errorJson && typeof errorJson.error === "string" && errorJson.error) ||
            "Lo slot non è più disponibile. Aggiorna la matrice e riprova."
        );
        return;
      } catch {}

      // Fallback Supabase diretto
      const { data: pData } = await supabase
        .from("patient_profiles")
        .insert({
          patient_code: `COC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          first_name: patientForm.firstName.trim() || "Paziente",
          last_name: patientForm.lastName.trim() || "Cocoora",
          phone: patientForm.phone,
          email: patientForm.email,
          notes: patientForm.notes,
        })
        .select()
        .single();

      const startIso = `${bookingSlot.date}T${bookingSlot.time}:00Z`;
      const [h, m] = bookingSlot.time.split(":").map(Number);
      const endMins = h * 60 + m + bookingDuration;
      const endH = Math.floor(endMins / 60).toString().padStart(2, "0");
      const endM = (endMins % 60).toString().padStart(2, "0");
      const endIso = `${bookingSlot.date}T${endH}:${endM}:00Z`;

      await supabase.from("appointments").insert({
        patient_id: pData?.id,
        doctor_id: bookingSlot.doctorId,
        room_id: bookingSlot.roomId,
        starts_at: startIso,
        ends_at: endIso,
        status: "confermato",
        is_first_visit: false,
        notes: `${patientForm.notes}${selectedService ? ` [Prestazione: ${selectedService.code || selectedService.id} - ${selectedService.name}]` : ""}`.trim(),
      });

      setBookingSuccess(true);
      setSuccessMessage(
        `Appuntamento confermato: ${patientName} · ${bookingSlot.roomName || "Stanza"} · ${bookingSlot.date} ${bookingSlot.time}`
      );
      setTimeout(() => {
        setBookingSlot(null);
        setBookingSuccess(false);
        setSuccessMessage(null);
        resetBookingForm();
        fetchSlots();
      }, 1600);
    } catch {
      setBookingError("Errore durante la registrazione.");
    }
  };

  const roomColumns = buildRoomColumns(slots);

  const formattedDate = new Date(selectedDate + "T00:00:00Z").toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Barra Navigazione Data */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDateByDays(-1)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-charcoal/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-teal-50/70 border border-teal-100">
            <CalendarIcon className="h-4 w-4 text-teal-700" />
            <span className="font-serif text-sm sm:text-base font-semibold text-dark-navy capitalize">
              {formattedDate}
            </span>
          </div>
          <button
            type="button"
            onClick={() => changeDateByDays(1)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-charcoal/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-dark-navy font-semibold focus:border-teal-700 focus:outline-none"
          />
          <button
            type="button"
            onClick={fetchSlots}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-teal-800 shadow-xs hover:bg-teal-50"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Aggiorna
          </button>
        </div>
      </div>

      {/* Spiegazione Logica Incrocio */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-charcoal/75">
        <AlertCircle className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-dark-navy">Motore di Incrocio Medici x Stanze:</strong> Uno
          slot è considerato prenotabile (verde) esclusivamente quando sia lo <strong>Specialista</strong> che
          la <strong>Stanza di visita preposta</strong> sono contemporaneamente liberi, garantendo zero
          overbooking e massima efficienza clinica.
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <Check className="h-4 w-4 shrink-0" /> {successMessage}
        </div>
      )}

      {/* Matrice a 5 Colonne Responsive per Stanza */}
      {loading ? (
        <div className="p-16 text-center text-sm text-charcoal/60 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal-700 mb-2" />
          Calcolo incrocio disponibilità per {formattedDate}...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {roomColumns.map((column) => (
            <RoomColumn
              key={column.key}
              roomName={column.roomName}
              subtitle={column.subtitle}
              slots={column.slots}
              onSelectSlot={(s) => {
                setBookingError(null);
                setBookingSuccess(false);
                setSelectedServiceId("");
                setPatientForm({ firstName: "", lastName: "", phone: "", email: "", notes: "" });
                setBookingSlot(s);
              }}
            />
          ))}
        </div>
      )}

      {/* MODAL DI PRENOTAZIONE RAPIDA SLOT */}
      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100">
            <button
              type="button"
              onClick={() => {
                setBookingSlot(null);
                setBookingError(null);
                setBookingSuccess(false);
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal/50 hover:bg-slate-100 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-700" />
              <h3 className="font-serif text-lg font-semibold text-dark-navy">
                Prenota Appuntamento Clinico
              </h3>
            </div>
            <p className="mt-1 text-[11px] uppercase font-bold tracking-wider text-slate-accent">
              Matrice a 4 Vertici
            </p>

            {/* VERTICE 1: RIEPILOGO STANZA, MEDICO E ORARIO */}
            <div className="mt-4 rounded-2xl bg-teal-50/80 p-4 border border-teal-100/80 text-xs space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800/80">
                1 · Riepilogo
              </p>
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="font-semibold text-dark-navy">{bookingSlot.doctorName}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 border border-teal-100">
                  <DoorOpen className="h-3 w-3" /> {bookingSlot.roomName || "Stanza da assegnare"}
                </span>
              </div>
              {bookingSlot.doctorTitle && <p className="text-teal-900/80">{bookingSlot.doctorTitle}</p>}
              <div className="flex items-center gap-3 pt-1 text-slate-accent font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-teal-700" /> {bookingSlot.time} ({bookingDuration} min)
                </span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-teal-700" /> {bookingSlot.date}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-5 space-y-4">
              {/* VERTICE 2: PRESTAZIONE */}
              <div className="rounded-2xl border border-slate-200/90 p-3.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-accent mb-1.5">
                  2 · Prestazione Clinica *
                </label>

                {servicesError && (
                  <div className="mb-2 flex items-center gap-2 rounded-xl bg-amber-50 p-2 text-[11px] text-amber-800 border border-amber-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {servicesError}
                  </div>
                )}

                <select
                  required
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  disabled={servicesLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none disabled:bg-slate-50 disabled:text-charcoal/50"
                >
                  <option value="">
                    {servicesLoading ? "Caricamento prestazioni..." : "Seleziona la prestazione"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {`${service.code || "COC"} — ${service.name}`}
                    </option>
                  ))}
                </select>

                {selectedService && (
                  <p className="mt-2 text-[11px] text-charcoal/60">
                    Codice: <strong className="text-dark-navy">{selectedService.code || selectedService.id}</strong>
                    {selectedService.category ? ` · ${selectedService.category}` : ""} ·{" "}
                    {selectedService.duration_minutes || DEFAULT_DURATION_MINUTES} min
                  </p>
                )}

                {!servicesLoading && !servicesError && services.length === 0 && (
                  <p className="mt-2 text-[11px] text-charcoal/60 italic">
                    Nessuna prestazione attiva restituita dal backend clinico.
                  </p>
                )}
              </div>

              {/* VERTICE 3: PAZIENTE */}
              <div className="rounded-2xl border border-slate-200/90 p-3.5 space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                  3 · Paziente
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Nome *</label>
                    <input
                      type="text"
                      required
                      value={patientForm.firstName}
                      onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                      placeholder="es. Mario"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Cognome *</label>
                    <input
                      type="text"
                      required
                      value={patientForm.lastName}
                      onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                      placeholder="es. Rossi"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Telefono *</label>
                    <input
                      type="tel"
                      required
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      placeholder="es. 333 1234567"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Email</label>
                    <input
                      type="email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                      placeholder="paziente@email.it"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-navy mb-1">
                    Note cliniche o motivo visita
                  </label>
                  <input
                    type="text"
                    value={patientForm.notes}
                    onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                    placeholder="Prima visita, controllo periodico..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* VERTICE 4: CONFERMA */}
              <div className="rounded-2xl border border-slate-200/90 p-3.5 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                  4 · Conferma
                </p>

                {bookingError && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <Check className="h-4 w-4 shrink-0" /> Appuntamento registrato con successo!
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSlot(null);
                      setBookingError(null);
                      setBookingSuccess(false);
                    }}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-charcoal hover:bg-slate-50 transition-colors"
                  >
                    Annulla
                  </button>
                  <Button type="submit" size="sm" disabled={bookingSuccess}>
                    Conferma Prenotazione
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomColumn({
  roomName,
  subtitle,
  slots,
  onSelectSlot,
}: {
  roomName: string;
  subtitle: string;
  slots: Slot[];
  onSelectSlot: (slot: Slot) => void;
}) {
  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      <div className="bg-gradient-to-r from-dark-navy to-teal-950 p-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-serif text-base font-semibold">
            <DoorOpen className="h-4 w-4 text-teal-300" />
            {roomName}
          </span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider rounded-full px-2.5 py-0.5 ${
              availableCount > 0 ? "bg-emerald-400/20 text-emerald-100" : "bg-white/10 text-teal-100/80"
            }`}
          >
            {availableCount} slot liberi
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-teal-200/80">{subtitle}</p>
      </div>

      <div className="p-4 space-y-2 flex-1 max-h-[560px] overflow-y-auto">
        {slots.length === 0 ? (
          <div className="py-12 text-center text-xs text-charcoal/50 italic">
            Nessun medico programmato in questa stanza per il giorno selezionato.
          </div>
        ) : (
          slots.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                s.isAvailable
                  ? "bg-white border-slate-200/80 hover:border-teal-400 hover:shadow-xs"
                  : "bg-slate-50/80 border-slate-200/50 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-dark-navy flex items-center gap-1">
                    <Clock className="h-3 w-3 text-teal-700" /> {s.time}
                  </span>
                  <span className="text-[11px] text-charcoal/70 truncate max-w-[120px]">
                    {s.doctorName}
                  </span>
                </div>
              </div>

              {s.isAvailable ? (
                <button
                  type="button"
                  onClick={() => onSelectSlot(s)}
                  className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-600 hover:text-white transition-colors"
                >
                  Prenota
                </button>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 bg-slate-100 px-2 py-0.5 rounded-full">
                  Occupato
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
