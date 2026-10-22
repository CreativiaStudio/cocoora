"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  FilePlus,
  FileText,
  Filter,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  RefreshCw,
  Search,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";

type Appointment = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
  is_first_visit: boolean;
  patient_profiles?: {
    id: string;
    patient_code: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
  } | null;
  doctors?: {
    id: string;
    full_name: string;
    title: string | null;
    specialty_slug: string | null;
  } | null;
  clinic_rooms?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Room = {
  id: string;
  name: string;
  slug: string;
  floor: string | null;
  description: string | null;
};

type Doctor = {
  id: string;
  full_name: string;
  title: string | null;
  specialty_slug: string | null;
};

type Patient = {
  id: string;
  patient_code: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  fiscal_code: string | null;
  notes: string | null;
};

type ClinicalDocument = {
  id: string;
  title: string;
  specialty: string;
  report_date: string;
  doctor_name: string;
  diagnosis: string | null;
  recommendations: string | null;
  document_code: string | null;
  file_size: string | null;
  patient_profiles?: {
    first_name: string;
    last_name: string;
    patient_code: string;
  } | null;
};

type Installment = {
  id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: string;
  paid_at: string | null;
  payment_method: string | null;
  notes: string | null;
  patient_profiles?: {
    first_name: string;
    last_name: string;
    patient_code: string;
  } | null;
};

export function ReceptionCrm() {
  const [tab, setTab] = useState<"queue" | "rooms" | "documents" | "payments" | "booking">("queue");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);

  // Modali
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<Installment | null>(null);

  // Form Nuovo Referto
  const [docForm, setDocForm] = useState({
    patientId: "",
    doctorId: "",
    title: "",
    specialty: "Odontoiatria & Ortodonzia",
    diagnosis: "",
    recommendations: "",
  });

  // Form Walk-in
  const [walkInForm, setWalkInForm] = useState({
    patientId: "",
    doctorId: "",
    roomId: "",
    notes: "Visita urgente al banco",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reception/desk");
      const data = await res.json();
      if (data.appointments) setAppointments(data.appointments);
      if (data.rooms) setRooms(data.rooms);
      if (data.doctors) setDoctors(data.doctors);
      if (data.patients) {
        setPatients(data.patients);
        if (data.patients.length > 0 && !docForm.patientId) {
          setDocForm((prev) => ({ ...prev, patientId: data.patients[0].id }));
          setWalkInForm((prev) => ({ ...prev, patientId: data.patients[0].id }));
        }
      }
      if (data.documents) setDocuments(data.documents);
      if (data.installments) setInstallments(data.installments);

      if (data.doctors && data.doctors.length > 0 && !docForm.doctorId) {
        setDocForm((prev) => ({ ...prev, doctorId: data.doctors[0].id }));
        setWalkInForm((prev) => ({ ...prev, doctorId: data.doctors[0].id }));
      }
      if (data.rooms && data.rooms.length > 0 && !walkInForm.roomId) {
        setWalkInForm((prev) => ({ ...prev, roomId: data.rooms[0].id }));
      }
    } catch (e) {
      console.error("Errore fetch reception desk:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (appointmentId: string, nextStatus: string) => {
    try {
      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          appointmentId,
          status: nextStatus,
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error("Errore aggiornamento status appuntamento:", e);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedDoc = doctors.find((d) => d.id === docForm.doctorId);
      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_document",
          patientId: docForm.patientId,
          doctorId: docForm.doctorId,
          doctorName: selectedDoc ? selectedDoc.full_name : "Direzione Sanitaria",
          title: docForm.title,
          specialty: docForm.specialty,
          diagnosis: docForm.diagnosis,
          recommendations: docForm.recommendations,
        }),
      });
      if (res.ok) {
        setShowDocModal(false);
        setDocForm({
          patientId: patients[0]?.id || "",
          doctorId: doctors[0]?.id || "",
          title: "",
          specialty: "Odontoiatria & Ortodonzia",
          diagnosis: "",
          recommendations: "",
        });
        fetchData();
      }
    } catch (e) {
      console.error("Errore creazione referto:", e);
    }
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_walk_in",
          patientId: walkInForm.patientId,
          doctorId: walkInForm.doctorId,
          roomId: walkInForm.roomId,
          notes: walkInForm.notes,
        }),
      });
      if (res.ok) {
        setShowWalkInModal(false);
        fetchData();
      }
    } catch (e) {
      console.error("Errore creazione walk in:", e);
    }
  };

  const handleRecordPayment = async (installmentId: string) => {
    try {
      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_payment",
          installmentId,
          paymentMethod: "pos",
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error("Errore registrazione pagamento:", e);
    }
  };

  // KPI Rapidi
  const todayCount = appointments.length;
  const inVisitCount = appointments.filter((a) => a.status === "in_visita").length;
  const waitingCount = appointments.filter((a) => a.status === "in_attesa").length;
  const docsCount = documents.length;

  return (
    <div className="space-y-6">
      {/* ── Banner Reception Header & KPI ───────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-700 text-white shadow-xs">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">
                  Postazione Reception &amp; Front-Desk
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" /> Orario: 08:00 - 20:00
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-navy-deep sm:text-2xl mt-0.5">
                Cruscotto Operativo Segreteria
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Aggiorna</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setShowWalkInModal(true)}
              className="gap-1.5 bg-teal-700 hover:bg-teal-800 text-white"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Accogli al Banco</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setShowDocModal(true)}
              className="gap-1.5 bg-navy-deep hover:bg-slate-900 text-white"
            >
              <FilePlus className="h-3.5 w-3.5" />
              <span>+ Carica Referto</span>
            </Button>
          </div>
        </div>

        {/* ── KPI Rapidi ── */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-slate-100">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Pazienti Prenotati
            </p>
            <p className="text-2xl font-bold text-navy-deep mt-0.5">{todayCount}</p>
          </div>
          <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
              In Sala d&apos;Attesa
            </p>
            <p className="text-2xl font-bold text-amber-900 mt-0.5">{waitingCount}</p>
          </div>
          <div className="rounded-xl bg-teal-50/70 p-3 border border-teal-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
              In Visita negli Studi
            </p>
            <p className="text-2xl font-bold text-teal-900 mt-0.5">{inVisitCount}</p>
          </div>
          <div className="rounded-xl bg-sky-50/70 p-3 border border-sky-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
              Referti nel Fascicolo
            </p>
            <p className="text-2xl font-bold text-sky-900 mt-0.5">{docsCount}</p>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher Reception ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setTab("queue")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            tab === "queue"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Accoglienza &amp; Sala d&apos;Attesa</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("rooms")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            tab === "rooms"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <DoorOpen className="h-4 w-4" />
          <span>Occupazione Stanze Live</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("documents")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            tab === "documents"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Archivio Referti &amp; Documenti</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("payments")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            tab === "payments"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Cassa &amp; Ricevute Sanitarie</span>
        </button>
      </div>

      {/* ── TAB 1: ACCOGLIENZA & SALA D'ATTESA ────────────────────────── */}
      {tab === "queue" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-navy-deep">
                Pazienti in Giornata &amp; Flusso Ingresso
              </h3>
              <p className="text-xs text-slate-500">
                Avanza lo stato del paziente con 1 clic dall&apos;arrivo al banco fino al termine della visita.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Totale: {appointments.length} visite programmate
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Nessun appuntamento registrato per oggi.
              </p>
            ) : (
              appointments.map((app) => {
                const p = app.patient_profiles;
                const d = app.doctors;
                const r = app.clinic_rooms;
                const timeStr = new Date(app.starts_at).toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-navy-deep border border-slate-200">
                        {timeStr}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-navy-deep">
                            {p ? `${p.first_name} ${p.last_name}` : "Paziente Anonimo"}
                          </span>
                          {app.is_first_visit && (
                            <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 text-[10px] font-semibold">
                              Prima Visita
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            (ID: {p?.patient_code || "N/A"})
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 text-teal-700 font-medium">
                            <Stethoscope className="h-3 w-3" />
                            {d?.full_name || "Specialista da definire"}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <DoorOpen className="h-3 w-3" />
                            {r?.name || "Stanza non assegnata"}
                          </span>
                          {p?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {p.phone}
                            </span>
                          )}
                        </div>
                        {app.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">
                            Note: {app.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stato & Azioni Rapide Segreteria */}
                    <div className="flex items-center gap-2 shrink-0">
                      {app.status === "confermato" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, "in_attesa")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition-colors"
                        >
                          <span>Arrivato (Sala d&apos;Attesa)</span>
                        </button>
                      )}

                      {app.status === "in_attesa" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, "in_visita")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-700 transition-colors"
                        >
                          <span>🩺 Fai Entrare in Studio</span>
                        </button>
                      )}

                      {app.status === "in_visita" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, "completato")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Concludi &amp; Cassa</span>
                        </button>
                      )}

                      {app.status === "completato" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Visita Eseguita
                        </span>
                      )}

                      {/* Dropdown status manuale */}
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:outline-hidden"
                      >
                        <option value="richiesto">Richiesto</option>
                        <option value="confermato">Confermato</option>
                        <option value="in_attesa">In Attesa</option>
                        <option value="in_visita">In Visita</option>
                        <option value="completato">Completato</option>
                        <option value="disdetto">Disdetto</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: OCCUPAZIONE STANZE LIVE ───────────────────────────── */}
      {tab === "rooms" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((room) => {
            const activeApp = appointments.find(
              (a) => a.clinic_rooms?.id === room.id && a.status === "in_visita"
            );
            const nextApp = appointments.find(
              (a) =>
                a.clinic_rooms?.id === room.id &&
                (a.status === "confermato" || a.status === "in_attesa")
            );

            return (
              <div
                key={room.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {room.floor || "Piano Terra"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        activeApp
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current"></span>
                      {activeApp ? "In Visita (Occupata)" : "Libera"}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-navy-deep mt-2">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {room.description || "Dotazione specialistica standard"}
                  </p>

                  {/* Stato Visita in Corso */}
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase text-slate-400">
                      Paziente in Studio:
                    </p>
                    {activeApp ? (
                      <div className="mt-1">
                        <p className="text-sm font-bold text-navy-deep">
                          {activeApp.patient_profiles?.first_name}{" "}
                          {activeApp.patient_profiles?.last_name}
                        </p>
                        <p className="text-xs text-teal-700 mt-0.5">
                          Medico: {activeApp.doctors?.full_name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-1">
                        Nessun paziente attualmente all&apos;interno
                      </p>
                    )}
                  </div>

                  {/* Prossimo Paziente */}
                  <div className="mt-2.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Prossimo atteso: </span>
                    {nextApp ? (
                      <span>
                        {nextApp.patient_profiles?.first_name} {nextApp.patient_profiles?.last_name}{" "}
                        (ore{" "}
                        {new Date(nextApp.starts_at).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        )
                      </span>
                    ) : (
                      <span className="italic">Nessuno in coda</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Controllo Stanze Live</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                    onClick={() => {
                      setWalkInForm((prev) => ({ ...prev, roomId: room.id }));
                      setShowWalkInModal(true);
                    }}
                  >
                    Assegna Visita
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: ARCHIVIO REFERTI & DOCUMENTI ─────────────────────── */}
      {tab === "documents" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-navy-deep">
                Referti Clinici &amp; Cartelle Digitali
              </h3>
              <p className="text-xs text-slate-500">
                I documenti caricati qui diventano immediatamente consultabili e scaricabili dal paziente nella sua area personale.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowDocModal(true)}
              className="gap-1.5 bg-teal-700 text-white"
            >
              <FilePlus className="h-3.5 w-3.5" />
              <span>+ Emetti Nuovo Referto</span>
            </Button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {documents.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Nessun referto presente nell&apos;archivio.
              </p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy-deep">
                          {doc.title}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-semibold text-slate-600">
                          {doc.specialty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Paziente:{" "}
                        <span className="font-semibold text-navy-deep">
                          {doc.patient_profiles
                            ? `${doc.patient_profiles.first_name} ${doc.patient_profiles.last_name}`
                            : "N/A"}
                        </span>{" "}
                        · Redatto da: {doc.doctor_name} · Data: {doc.report_date}
                      </p>
                      {doc.diagnosis && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Esito: {doc.diagnosis}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
                      Fascicolo Sincronizzato
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {doc.document_code}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: CASSA & RICEVUTE SANITARIE ───────────────────────── */}
      {tab === "payments" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-navy-deep">
                Gestione Cassa, Rate &amp; Ricevute Detraibili (730)
              </h3>
              <p className="text-xs text-slate-500">
                Registra i pagamenti effettuati al POS o bonifico ed emetti le ricevute fiscali per i pazienti.
              </p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {installments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Nessuna rata registrata.
              </p>
            ) : (
              installments.map((inst) => {
                const isPaid = inst.status === "pagato";
                const p = inst.patient_profiles;

                return (
                  <div
                    key={inst.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy-deep">
                          Rata #{inst.installment_number} — €{inst.amount.toFixed(2)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.2 text-[10px] font-semibold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isPaid ? "Saldato" : "In Scadenza"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Paziente:{" "}
                        <span className="font-semibold text-navy-deep">
                          {p ? `${p.first_name} ${p.last_name}` : "N/A"}
                        </span>{" "}
                        · Scadenza: {inst.due_date} {inst.notes && `(${inst.notes})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isPaid ? (
                        <button
                          type="button"
                          onClick={() => handleRecordPayment(inst.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Incassa al POS (€{inst.amount.toFixed(2)})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowReceiptModal(inst)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-deep shadow-2xs hover:bg-slate-50"
                        >
                          <Printer className="h-3.5 w-3.5 text-teal-600" />
                          <span>Ricevuta 730</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── MODALE NUOVO REFERTO CLINICO ─────────────────────────────── */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FilePlus className="h-5 w-5 text-teal-600" />
                <h3 className="font-serif text-lg font-bold text-navy-deep">
                  Emetti &amp; Sincronizza Referto Clinico
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Paziente Destinatario *
                </label>
                <select
                  value={docForm.patientId}
                  onChange={(e) => setDocForm({ ...docForm, patientId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.patient_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Medico Specialista *
                  </label>
                  <select
                    value={docForm.doctorId}
                    onChange={(e) => setDocForm({ ...docForm, doctorId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                    required
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Branca Specialistica *
                  </label>
                  <select
                    value={docForm.specialty}
                    onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  >
                    <option value="Odontoiatria & Ortodonzia">Odontoiatria &amp; Ortodonzia</option>
                    <option value="Medicina Estetica & Rigenerativa">Medicina Estetica</option>
                    <option value="Diagnostica & Ecografia">Diagnostica &amp; Ecografia</option>
                    <option value="Cocoora Precision (DNA & Microbiota)">Cocoora Precision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Titolo Referto / Prestazione *
                </label>
                <input
                  type="text"
                  placeholder="Es. Ortopantomografia Arcate o Valutazione Dermatologica"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Esito Clinico &amp; Diagnosi *
                </label>
                <textarea
                  rows={2}
                  placeholder="Descrizione clinica dell'esame svolto..."
                  value={docForm.diagnosis}
                  onChange={(e) => setDocForm({ ...docForm, diagnosis: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Prescrizioni &amp; Istruzioni al Paziente
                </label>
                <textarea
                  rows={2}
                  placeholder="Terapia domiciliare, data del prossimo controllo..."
                  value={docForm.recommendations}
                  onChange={(e) => setDocForm({ ...docForm, recommendations: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDocModal(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" className="bg-teal-700 text-white">
                  Salva &amp; Invia al Fascicolo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE ACCOGLIENZA AL BANCO (WALK-IN) ────────────────────── */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-teal-600" />
                <h3 className="font-serif text-lg font-bold text-navy-deep">
                  Accoglienza Diretta al Banco (Walk-In)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalkInModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Seleziona Paziente *
                </label>
                <select
                  value={walkInForm.patientId}
                  onChange={(e) => setWalkInForm({ ...walkInForm, patientId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.patient_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Medico Assegnato *
                </label>
                <select
                  value={walkInForm.doctorId}
                  onChange={(e) => setWalkInForm({ ...walkInForm, doctorId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Studio di Visita *
                </label>
                <select
                  value={walkInForm.roomId}
                  onChange={(e) => setWalkInForm({ ...walkInForm, roomId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                  required
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Note Accoglienza
                </label>
                <input
                  type="text"
                  value={walkInForm.notes}
                  onChange={(e) => setWalkInForm({ ...walkInForm, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowWalkInModal(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" className="bg-teal-700 text-white">
                  Registra Entrata
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE RICEVUTA SANITARIA 730 ────────────────────────────── */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-navy-deep">
                Ricevuta Sanitaria Detraibile
              </h3>
              <button
                type="button"
                onClick={() => setShowReceiptModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono text-slate-800">
              <div className="text-center font-bold font-serif text-sm text-navy-deep border-b border-slate-200 pb-2">
                COCOORA CENTRO MEDICO S.R.L.
                <br />
                <span className="text-[10px] font-sans font-normal text-slate-500">
                  Via Generale Giovanni De Bonis, 81 - Napoli | P.IVA 09876543210
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Ricevuta N.:</span>
                <span className="font-bold">RC-2026-00{showReceiptModal.installment_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Paziente:</span>
                <span className="font-bold">
                  {showReceiptModal.patient_profiles?.first_name}{" "}
                  {showReceiptModal.patient_profiles?.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Importo Pagato:</span>
                <span className="font-bold text-sm text-teal-800">
                  €{showReceiptModal.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Modalità:</span>
                <span className="uppercase">
                  {showReceiptModal.payment_method || "POS (Tracciabile)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Data Quietanza:</span>
                <span>{showReceiptModal.paid_at || new Date().toISOString().split("T")[0]}</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 italic">
                * Spesa sanitaria valida per la detrazione fiscale 19% nel Modello 730 / Sistema Tessera Sanitaria.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Stampa</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setShowReceiptModal(null)}
                className="bg-navy-deep text-white"
              >
                Chiudi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
