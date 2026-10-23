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
  Filter,
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

export function PatientCalendar() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Domani
    return d.toISOString().split("T")[0];
  });

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
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

      // Fallback motore incrocio diretto client (Vercel static)
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

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSlot) return;

    try {
      setBookingError(null);
      try {
        const res = await fetch("/api/calendar/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: bookingSlot.doctorId,
            roomId: bookingSlot.roomId,
            date: bookingSlot.date,
            time: bookingSlot.time,
            durationMinutes: 30,
            patientName: form.name,
            patientPhone: form.phone,
            patientEmail: form.email,
            notes: form.notes,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setBookingSuccess(true);
            setTimeout(() => {
              setBookingSlot(null);
              setBookingSuccess(false);
              setForm({ name: "", phone: "", email: "", notes: "" });
              fetchSlots();
            }, 1200);
            return;
          }
        }
      } catch {}

      // Fallback prenotazione diretta su Supabase
      const [first, ...rest] = form.name.trim().split(" ");
      const lastName = rest.join(" ") || "Paziente";
      const { data: pData } = await supabase
        .from("patient_profiles")
        .insert({
          patient_code: `COC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          first_name: first,
          last_name: lastName,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
        })
        .select()
        .single();

      const startIso = `${bookingSlot.date}T${bookingSlot.time}:00Z`;
      const [h, m] = bookingSlot.time.split(":").map(Number);
      const endMins = h * 60 + m + 30;
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
        is_first_visit: true,
        notes: form.notes,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSlot(null);
        setBookingSuccess(false);
        setForm({ name: "", phone: "", email: "", notes: "" });
        fetchSlots();
      }, 1200);
    } catch {
      setBookingError("Errore durante la prenotazione.");
    }
  };

  const availableSlots = slots.filter((s) => s.isAvailable);

  // Filtri unici per medici e stanze
  const doctorList = Array.from(new Set(slots.map((s) => s.doctorName)));
  const roomList = Array.from(new Set(slots.map((s) => s.roomName).filter(Boolean)));

  const filteredSlots = availableSlots.filter((s) => {
    if (selectedDoctor !== "all" && s.doctorName !== selectedDoctor) return false;
    if (selectedRoom !== "all" && s.roomName !== selectedRoom) return false;
    return true;
  });

  const formattedDate = new Date(selectedDate + "T00:00:00Z").toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Controlli Data e Filtri */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeDateByDays(-1)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-charcoal/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-teal-50 border border-teal-100">
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

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-dark-navy font-semibold focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Filtri per Medico e per Stanza */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-charcoal/70">
            <Filter className="h-3.5 w-3.5 text-teal-700" />
            <span className="font-semibold text-dark-navy">Filtra per Medico:</span>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-dark-navy font-medium bg-slate-50 focus:border-teal-700 focus:outline-none"
            >
              <option value="all">Tutti i medici di turno</option>
              {doctorList.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-charcoal/70">
            <DoorOpen className="h-3.5 w-3.5 text-teal-700" />
            <span className="font-semibold text-dark-navy">Filtra per Stanza:</span>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-dark-navy font-medium bg-slate-50 focus:border-teal-700 focus:outline-none"
            >
              <option value="all">Tutte le sale cliniche</option>
              {roomList.map((r) => (
                <option key={r} value={r!}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Griglia Slot Disponibili per il Paziente */}
      {loading ? (
        <div className="p-16 text-center text-sm text-charcoal/60 bg-white rounded-3xl border border-slate-200">
          Ricerca disponibilità in tempo reale in agenda...
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-teal-200 bg-white p-12 text-center text-charcoal/70">
          <CalendarIcon className="mx-auto h-8 w-8 text-teal-600 mb-2 opacity-60" />
          <p className="font-serif text-base font-semibold text-dark-navy">
            Nessun orario disponibile per la data e i filtri selezionati.
          </p>
          <p className="mt-1 text-xs text-charcoal/60">
            Prova a selezionare un giorno differente o chiama direttamente la segreteria al centralino{" "}
            <strong>081 18182091</strong>.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSlots.map((slot, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-teal-500 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-navy bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    <Clock className="h-3.5 w-3.5 text-teal-700" />
                    Ore {slot.time}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-accent bg-slate-50 px-2.5 py-0.5 rounded-full">
                    {slot.roomName}
                  </span>
                </div>

                <div className="mt-3.5">
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
                    {slot.doctorName}
                  </h4>
                  {slot.doctorTitle && (
                    <p className="mt-0.5 text-xs text-charcoal/65 line-clamp-2">{slot.doctorTitle}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-600" /> Slot Confermabile
                </span>
                <button
                  type="button"
                  onClick={() => setBookingSlot(slot)}
                  className="rounded-full bg-dark-navy px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
                >
                  Prenota
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DI PRENOTAZIONE DIRETTA PAZIENTE */}
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
                Richiesta Visita Specialistica
              </h3>
            </div>

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

            <form onSubmit={handleBook} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mario Rossi"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Numero di Telefono *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="333 1234567"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Email (per conferma appuntamento)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="mario@email.it"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Note aggiuntive per lo specialista
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Richiesta prima visita, controllo..."
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
                  <Check className="h-4 w-4 shrink-0" /> Richiesta confermata! Riceverai conferma SMS.
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
                  Invia Prenotazione
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
