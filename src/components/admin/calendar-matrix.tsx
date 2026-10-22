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

type Slot = {
  date: string;
  time: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string | null;
  roomId: string | null;
  roomName: string | null;
  isAvailable: boolean;
  conflictReason?: string;
};

type Room = { id: string; slug: string; name: string };

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
  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/calendar/slots?date=${selectedDate}`);
      const data = await res.json();
      if (data.slots) setSlots(data.slots);
    } catch (e) {
      console.error("Errore recupero slot", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSlot) return;

    try {
      setBookingError(null);
      const res = await fetch("/api/calendar/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: bookingSlot.doctorId,
          roomId: bookingSlot.roomId,
          date: bookingSlot.date,
          time: bookingSlot.time,
          durationMinutes: 30,
          patientName: patientForm.name,
          patientPhone: patientForm.phone,
          patientEmail: patientForm.email,
          notes: patientForm.notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSlot(null);
          setBookingSuccess(false);
          setPatientForm({ name: "", phone: "", email: "", notes: "" });
          fetchSlots();
        }, 1200);
      } else {
        setBookingError(json.error || "Errore durante la prenotazione");
      }
    } catch {
      setBookingError("Errore di connessione.");
    }
  };

  // Group slots by Room
  const studio1Slots = slots.filter((s) => s.roomName === "Studio 1");
  const studio2Slots = slots.filter((s) => s.roomName === "Studio 2");
  const studio3Slots = slots.filter((s) => s.roomName === "Studio 3");

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

      {/* Matrice a 3 Colonne per Stanza */}
      {loading ? (
        <div className="p-16 text-center text-sm text-charcoal/60 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal-700 mb-2" />
          Calcolo incrocio disponibilità per {formattedDate}...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* COLONNA 1: STUDIO 1 */}
          <RoomColumn
            roomName="Studio 1"
            subtitle="Visite Specialistiche & Diagnostica"
            slots={studio1Slots}
            onSelectSlot={(s) => setBookingSlot(s)}
          />

          {/* COLONNA 2: STUDIO 2 */}
          <RoomColumn
            roomName="Studio 2"
            subtitle="Odontoiatria Digitale 3D"
            slots={studio2Slots}
            onSelectSlot={(s) => setBookingSlot(s)}
          />

          {/* COLONNA 3: STUDIO 3 */}
          <RoomColumn
            roomName="Studio 3"
            subtitle="Medicina Estetica & Laser"
            slots={studio3Slots}
            onSelectSlot={(s) => setBookingSlot(s)}
          />
        </div>
      )}

      {/* MODAL DI PRENOTAZIONE RAPIDA SLOT */}
      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100">
            <button
              type="button"
              onClick={() => setBookingSlot(null)}
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

            {/* Dettagli Slot Selezionato */}
            <div className="mt-4 rounded-xl bg-teal-50/80 p-3.5 border border-teal-100/80 text-xs space-y-1">
              <p className="font-semibold text-dark-navy">{bookingSlot.doctorName}</p>
              <p className="text-teal-900/80">{bookingSlot.doctorTitle}</p>
              <div className="flex items-center gap-3 pt-1 text-slate-accent font-medium">
                <span className="flex items-center gap-1">
                  <DoorOpen className="h-3.5 w-3.5 text-teal-700" /> {bookingSlot.roomName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-teal-700" /> {bookingSlot.time} (30 min)
                </span>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Nome e Cognome Paziente *
                </label>
                <input
                  type="text"
                  required
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  placeholder="es. Mario Rossi"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Telefono Paziente *
                </label>
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
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Email (opzionale per promemoria)
                </label>
                <input
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  placeholder="paziente@email.it"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBookingSlot(null)}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-charcoal hover:bg-slate-50 transition-colors"
                >
                  Annulla
                </button>
                <Button type="submit" size="sm">
                  Conferma Prenotazione
                </Button>
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
        <div className="flex items-center justify-between">
          <span className="font-serif text-base font-semibold">{roomName}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 rounded-full px-2.5 py-0.5">
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
