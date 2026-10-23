"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  FileText,
  HelpCircle,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  QrCode,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { PatientCalendar } from "@/components/calendar/patient-calendar";
import { SITE } from "@/lib/site";
import { supabase } from "@/lib/supabase";

type PatientProfile = {
  id: string;
  patient_code: string;
  first_name: string;
  last_name: string;
  fiscal_code: string | null;
  email: string | null;
  phone: string | null;
  gender: string;
  notes: string | null;
};

type ClinicalDoc = {
  id: string;
  title: string;
  specialty: string;
  report_date: string;
  doctor_name: string;
  diagnosis: string | null;
  recommendations: string | null;
  document_code: string | null;
  file_size: string | null;
};

type Appointment = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
  is_first_visit: boolean;
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

type TreatmentPlan = {
  id: string;
  plan_code: string;
  title: string;
  description: string | null;
  total_amount: number;
  discount_amount: number;
  net_total: number;
  paid_total: number;
  balance_due: number;
  status: string;
  payment_status: string;
  treatment_installments: {
    id: string;
    installment_number: number;
    amount: number;
    due_date: string;
    status: string;
    paid_at: string | null;
    payment_method: string | null;
    notes: string | null;
  }[];
};

export function PatientPortal() {
  const [selectedCode, setSelectedCode] = useState<string>("COC-2026-01001");
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [documents, setDocuments] = useState<ClinicalDoc[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);
  const [allPatients, setAllPatients] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"docs" | "appointments" | "booking" | "plan" | "club">("docs");
  const [viewingDoc, setViewingDoc] = useState<ClinicalDoc | null>(null);

  const fetchPortalData = async (code: string) => {
    try {
      setLoading(true);
      // Prova prima la route API
      try {
        const res = await fetch(`/api/patient/portal?code=${code}`);
        if (res.ok) {
          const data = await res.json();
          if (data.patient) setPatient(data.patient);
          if (data.documents) setDocuments(data.documents);
          if (data.appointments) setAppointments(data.appointments);
          if (data.plan) setPlan(data.plan);
          if (data.allPatients) setAllPatients(data.allPatients);
          return;
        }
      } catch {
        // Fallback Supabase diretto
      }

      // Query diretta a Supabase (ideale per export statico Vercel)
      const { data: p } = await supabase
        .from("patient_profiles")
        .select("*")
        .eq("patient_code", code)
        .maybeSingle();

      const { data: allP } = await supabase
        .from("patient_profiles")
        .select("id, patient_code, first_name, last_name, email, notes")
        .order("patient_code");

      if (allP) setAllPatients(allP);

      const activePatient = p || (allP && allP.length > 0 ? allP[0] : null);
      if (activePatient) {
        setPatient(activePatient);
        const { data: docs } = await supabase
          .from("clinical_documents")
          .select("*")
          .eq("patient_id", activePatient.id)
          .order("report_date", { ascending: false });
        if (docs) setDocuments(docs);

        const { data: appts } = await supabase
          .from("appointments")
          .select("*, doctors(full_name, title, specialty_slug), clinic_rooms(name, slug)")
          .eq("patient_id", activePatient.id)
          .order("starts_at", { ascending: true });
        if (appts) setAppointments(appts);

        const { data: pl } = await supabase
          .from("patient_treatment_plans")
          .select("*, treatment_installments(*)")
          .eq("patient_id", activePatient.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (pl) setPlan(pl);
      }
    } catch (e) {
      console.error("Errore fetch portale paziente:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData(selectedCode);
  }, [selectedCode]);

  return (
    <div className="space-y-8">
      {/* ── Demo Switcher Paziente & Card Digitale ──────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-teal-50/30 p-6 sm:p-8 shadow-sm">
        {/* Selettore rapido demo */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">
              Simulazione Prospettiva Paziente
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Cambia profilo paziente per testare cartelle cliniche, piani di cura e referti differenti.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allPatients.map((p) => {
              const isActive = selectedCode === p.patient_code;
              return (
                <button
                  key={p.patient_code}
                  type="button"
                  onClick={() => setSelectedCode(p.patient_code)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-navy-deep text-white shadow-xs scale-102"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>
                    {p.first_name} {p.last_name}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({p.patient_code})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profilo & Tessera Sanitaria Digitale */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300/60 px-3 py-1 text-xs font-bold text-emerald-900">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Fascicolo Sanitario Elettronico Attivo
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-deep">
              Bentornato, {patient ? `${patient.first_name} ${patient.last_name}` : "Caricamento..."}
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Il tuo spazio digitale sicuro per accedere ai referti medici, consultare i prossimi appuntamenti, verificare i piani terapeutici e comunicare con la reception di Cocoora.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 font-mono">
              <span>Codice Paziente: <strong>{patient?.patient_code}</strong></span>
              <span>Codice Fiscale: <strong>{patient?.fiscal_code || "Non specificato"}</strong></span>
              <span>Telefono: <strong>{patient?.phone}</strong></span>
            </div>
          </div>

          {/* Card Digitale Cocoora Club */}
          <div className="relative w-full sm:w-[320px] rounded-2xl bg-gradient-to-br from-navy-deep via-slate-900 to-teal-900 p-5 text-white shadow-xl border border-teal-500/30 overflow-hidden shrink-0">
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-teal-500/10 blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold tracking-wider text-teal-300 uppercase">
                Cocoora Club
              </span>
              <span className="rounded-full bg-teal-400/20 border border-teal-400/30 px-2 py-0.5 text-[10px] font-semibold text-teal-200">
                Membro Attivo Care
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Titolare</p>
              <p className="font-serif text-base font-bold text-white mt-0.5">
                {patient ? `${patient.first_name} ${patient.last_name}` : "Caricamento..."}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400">Tessera N°</p>
                <p className="font-mono text-teal-300 font-bold">{patient?.patient_code}</p>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <QrCode className="h-6 w-6 text-teal-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigazione Sezioni Portale ──────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("docs")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "docs"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="h-4 w-4 text-teal-400" />
          <span>I Miei Referti &amp; Documenti ({documents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("appointments")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "appointments"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Clock className="h-4 w-4 text-sky-400" />
          <span>I Miei Appuntamenti ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("booking")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "booking"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span>Prenota Nuova Visita</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("plan")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "plan"
              ? "bg-navy-deep text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CreditCard className="h-4 w-4 text-amber-400" />
          <span>Piano Terapeutico &amp; Rate</span>
        </button>
      </div>

      {/* ── TAB 1: I MIEI REFERTI & DOCUMENTI CLINICI ────────────────── */}
      {activeTab === "docs" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-lg font-serif font-bold text-navy-deep">
                  Archivio Referti Medici &amp; Esami Diagnostici
                </h3>
                <p className="text-xs text-slate-500">
                  Tutti i referti ufficiali firmati dalla Direzione Sanitaria e dagli specialisti di Cocoora, sempre disponibili per il download o la consultazione.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Firma Digitale Conforme GDPR
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              {documents.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Nessun referto clinico ancora caricato per questo paziente.
                </p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition-all gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 border border-teal-200">
                        <FileCheck2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-navy-deep">
                            {doc.title}
                          </h4>
                          <span className="rounded-full bg-teal-100 border border-teal-200 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
                            {doc.specialty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Specialista: <strong>{doc.doctor_name}</strong> · Data Esame: <strong>{doc.report_date}</strong>
                        </p>
                        {doc.diagnosis && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {doc.diagnosis}
                          </p>
                        )}
                        <span className="text-[11px] font-mono text-slate-400 mt-1 inline-block">
                          Codice univoco: {doc.document_code} · {doc.file_size || "2.1 MB"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => setViewingDoc(doc)}
                        className="gap-1.5 bg-navy-deep text-white hover:bg-slate-900"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Visualizza</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingDoc(doc)}
                        className="gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: I MIEI APPUNTAMENTI ───────────────────────────────── */}
      {activeTab === "appointments" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-serif font-bold text-navy-deep">
                Prossime Visite &amp; Visite Programmate
              </h3>
              <p className="text-xs text-slate-500">
                I tuoi appuntamenti confermati presso Cocoora Centro Medico.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveTab("booking")}
              className="bg-teal-700 text-white"
            >
              + Prenota Altra Visita
            </Button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Non hai appuntamenti in programma. Usa la scheda &quot;Prenota Nuova Visita&quot; per fissare un controllo.
              </p>
            ) : (
              appointments.map((app) => {
                const dateObj = new Date(app.starts_at);
                const dateStr = dateObj.toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                const timeStr = dateObj.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-teal-50 border border-teal-200 text-navy-deep">
                        <span className="text-xs uppercase font-bold text-teal-700">
                          {dateObj.toLocaleDateString("it-IT", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold leading-tight">
                          {dateObj.getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-navy-deep capitalize">
                            {dateStr} — ore {timeStr}
                          </h4>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            {app.status === "confermato" ? "Confermato" : app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Medico: <strong>{app.doctors?.full_name || "Specialista da definire"}</strong>
                        </p>
                        <p className="text-xs text-slate-500">
                          Sede: {app.clinic_rooms?.name || "Studio Specializzato"} · {SITE.fullAddress}
                        </p>
                        {app.notes && (
                          <p className="text-xs text-slate-400 italic mt-1">
                            Note per la visita: {app.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={SITE.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Contatta Reception</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: PRENOTA NUOVA VISITA ─────────────────────────────── */}
      {activeTab === "booking" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-lg font-serif font-bold text-navy-deep">
              Prenotazione Diretta Visite &amp; Controlli
            </h3>
            <p className="text-xs text-slate-500">
              Scegli lo specialista e consulta la disponibilità effettiva in tempo reale.
            </p>
          </div>
          <div className="mt-6">
            <PatientCalendar />
          </div>
        </div>
      )}

      {/* ── TAB 4: PIANO TERAPEUTICO & RATE ──────────────────────────── */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          {plan ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    Piano Terapeutico Attivo · {plan.plan_code}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-navy-deep mt-0.5">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Importo Concordato</p>
                  <p className="text-xl font-bold text-navy-deep">
                    €{Number(plan.net_total).toFixed(2)}
                  </p>
                  {Number(plan.discount_amount) > 0 && (
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Sconto Cocoora Club: -€{Number(plan.discount_amount).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Avanzamento Trattamento */}
              <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Avanzamento del Percorso di Cura</span>
                  <span className="text-teal-700">40% Completato (2 rate su 5 saldate)</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full w-[40%] transition-all"></div>
                </div>
              </div>

              {/* Tabella Rate */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Scadenziario Rate &amp; Ricevute Sanitarie
                </h4>
                <div className="divide-y divide-slate-100">
                  {plan.treatment_installments.map((inst) => {
                    const isPaid = inst.status === "pagato";
                    return (
                      <div
                        key={inst.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                            #{inst.installment_number}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-navy-deep">
                              €{Number(inst.amount).toFixed(2)} — {inst.notes || "Rata trattamento"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Scadenza: {inst.due_date} {isPaid && `· Pagato il ${inst.paid_at?.split("T")[0]}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {isPaid ? "Saldato" : "In Scadenza"}
                          </span>
                          {isPaid && (
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                            >
                              <Printer className="h-3 w-3" />
                              <span>Detrazione 730</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Nessun piano terapeutico a rate attivo per questo profilo.
            </div>
          )}
        </div>
      )}

      {/* ── MODALE VISUALIZZATORE REFERTO CLINICO UFFICIALE ─────────── */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header Referto Ufficiale */}
            <div className="flex items-start justify-between border-b-2 border-teal-800 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-navy-deep">
                  COCOORA CENTRO MEDICO
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
                  Direzione Sanitaria Specialistica · Dott.ssa Elisa Russo
                </p>
                <p className="text-[11px] text-slate-400">
                  {SITE.fullAddress} · Tel. {SITE.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dati Paziente & Referto */}
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs font-mono border border-slate-200">
              <div>
                <p className="text-slate-400 uppercase text-[10px]">Paziente</p>
                <p className="font-bold text-navy-deep text-sm font-sans">
                  {patient ? `${patient.first_name} ${patient.last_name}` : "N/A"}
                </p>
                <p className="text-slate-600 font-sans">
                  C.F.: {patient?.fiscal_code || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 uppercase text-[10px]">Documento Sanitario</p>
                <p className="font-bold text-teal-800">{viewingDoc.document_code}</p>
                <p className="text-slate-600 font-sans">Data Esame: {viewingDoc.report_date}</p>
              </div>
            </div>

            {/* Corpo Clinico */}
            <div className="mt-6 space-y-4 text-sm text-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                  Prestazione Svolta &amp; Branca
                </span>
                <p className="font-serif text-lg font-bold text-navy-deep mt-0.5">
                  {viewingDoc.title} ({viewingDoc.specialty})
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Esito Clinico &amp; Diagnosi
                </span>
                <p className="mt-1 leading-relaxed bg-teal-50/40 p-3 rounded-xl border border-teal-100/60">
                  {viewingDoc.diagnosis || "Esame eseguito con esito regolare."}
                </p>
              </div>

              {viewingDoc.recommendations && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Prescrizioni Terapeutiche &amp; Follow-up
                  </span>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    {viewingDoc.recommendations}
                  </p>
                </div>
              )}
            </div>

            {/* Firma Medico & Timbro */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Documento firmato digitalmente secondo standard sanitari vigenti</span>
              </div>
              <div className="text-right font-serif">
                <p className="font-bold text-navy-deep text-sm">{viewingDoc.doctor_name}</p>
                <p className="text-[11px] text-slate-400 italic">Firma Elettronica Certificata</p>
              </div>
            </div>

            {/* Azioni Modale */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5"
              >
                <Printer className="h-4 w-4 text-slate-600" />
                <span>Stampa / Salva PDF</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setViewingDoc(null)}
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
