"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  Eye,
  FilePlus,
  FileText,
  Filter,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReceptionDeskLiveProps {
  onOpenPatient?: (patientId: string) => void;
  onOpenCassa?: () => void;
}

export function ReceptionDeskLive({ onOpenPatient, onOpenCassa }: ReceptionDeskLiveProps) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);

  // Modali
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] = useState<any | null>(null);

  // Form Incasso al Banco
  const [paymentAmount, setPaymentAmount] = useState<string>("120");
  const [paymentMethod, setPaymentMethod] = useState<"pos" | "contanti" | "bonifico">("pos");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Form Walk-in
  const [walkInPatientId, setWalkInPatientId] = useState("");
  const [walkInDoctorId, setWalkInDoctorId] = useState("");
  const [walkInRoomId, setWalkInRoomId] = useState("");
  const [walkInNotes, setWalkInNotes] = useState("Accoglienza diretta al banco");
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

  // Fetch dati
  const fetchDeskData = async () => {
    try {
      setLoading(true);

      // 1. Appuntamenti
      const { data: appts } = await supabase
        .from("appointments")
        .select(`
          id, starts_at, ends_at, status, notes, is_first_visit,
          patient_profiles ( id, patient_code, first_name, last_name, phone, email ),
          doctors ( id, full_name, title, specialty_slug ),
          clinic_rooms ( id, name, slug )
        `)
        .order("starts_at", { ascending: true });

      // 2. Stanze e medici
      const { data: rms } = await supabase.from("clinic_rooms").select("*").order("slug");
      const { data: docs } = await supabase.from("doctors").select("*").eq("is_active", true).order("full_name");
      const { data: pts } = await supabase.from("patient_profiles").select("*").order("last_name");
      const { data: plns } = await supabase.from("patient_treatment_plans").select("*");
      const { data: inst } = await supabase.from("treatment_installments").select("*");

      if (appts) setAppointments(appts);
      if (rms) {
        setRooms(rms);
        if (rms.length > 0 && !walkInRoomId) setWalkInRoomId(rms[0].id);
      }
      if (docs) {
        setDoctors(docs);
        if (docs.length > 0 && !walkInDoctorId) setWalkInDoctorId(docs[0].id);
      }
      if (pts) {
        setPatients(pts);
        if (pts.length > 0 && !walkInPatientId) setWalkInPatientId(pts[0].id);
      }
      if (plns) setPlans(plns);
      if (inst) setInstallments(inst);
    } catch (e) {
      console.error("Errore fetch desk reception:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeskData();
  }, []);

  // Avanzamento stato accoglienza visita
  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
      );

      await supabase
        .from("appointments")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", appointmentId);
    } catch (e) {
      console.error("Errore aggiornamento stato visita:", e);
    }
  };

  // Apertura modal incasso al banco
  const handleOpenPayment = (app: any) => {
    setSelectedAppointmentForPayment(app);
    const patientId = app.patient_profiles?.id;
    const patientPlans = plans.filter((p) => p.patient_id === patientId);

    if (patientPlans.length > 0) {
      setSelectedPlanId(patientPlans[0].id);
      const remaining = Number(patientPlans[0].net_total || patientPlans[0].total_amount) - Number(patientPlans[0].paid_total || 0);
      setPaymentAmount(remaining >= 500 ? "500" : remaining > 0 ? remaining.toString() : "120");
      setPaymentNotes(`Rata / Acconto percorso ${patientPlans[0].title}`);
    } else {
      setSelectedPlanId("");
      setPaymentAmount("120");
      setPaymentNotes(`Incasso visita specialistica — ${app.doctors?.full_name || "Medico"}`);
    }

    setShowPaymentModal(true);
  };

  // Registrazione Incasso
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Inserisci un importo valido");
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const nowIso = new Date().toISOString();
      const patientId = selectedAppointmentForPayment?.patient_profiles?.id;
      const targetPlan = plans.find((p) => p.id === selectedPlanId);

      // Inserisci rata incassata
      await supabase.from("treatment_installments").insert({
        plan_id: targetPlan ? targetPlan.id : null,
        patient_id: patientId,
        installment_number: installments.length + 1,
        installment_type: "rata",
        amount: amountNum,
        due_date: nowIso.split("T")[0],
        status: "pagato",
        payment_method: paymentMethod,
        paid_at: nowIso,
        notes: paymentNotes || `Incasso cassa reception (${paymentMethod.toUpperCase()})`,
      });

      // Se legato a un piano, aggiorna saldi
      if (targetPlan) {
        const newPaid = Number(targetPlan.paid_total || 0) + amountNum;
        const newBalance = Math.max(0, Number(targetPlan.net_total || targetPlan.total_amount) - newPaid);
        await supabase
          .from("patient_treatment_plans")
          .update({
            paid_total: newPaid,
            balance_due: newBalance,
            payment_status: newBalance <= 0 ? "saldato" : "parzialmente_pagato",
            updated_at: nowIso,
          })
          .eq("id", targetPlan.id);
      }

      // Se la visita era in corso o in attesa, marcala come completata
      if (selectedAppointmentForPayment) {
        await handleUpdateStatus(selectedAppointmentForPayment.id, "completato");
      }

      setShowPaymentModal(false);
      await fetchDeskData();
    } catch (err: any) {
      console.error("Errore incasso al banco:", err);
      alert("Errore incasso: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Creazione Walk-in
  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingWalkIn(true);
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 60000);

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          patient_id: walkInPatientId,
          doctor_id: walkInDoctorId,
          room_id: walkInRoomId,
          starts_at: now.toISOString(),
          ends_at: in30.toISOString(),
          status: "in_attesa",
          is_first_visit: false,
          notes: walkInNotes || "Paziente accolto direttamente al banco (Walk-in)",
        })
        .select(`
          id, starts_at, ends_at, status, notes, is_first_visit,
          patient_profiles ( id, patient_code, first_name, last_name, phone, email ),
          doctors ( id, full_name, title, specialty_slug ),
          clinic_rooms ( id, name, slug )
        `)
        .single();

      if (error) throw error;

      if (data) {
        setAppointments((prev) => [data, ...prev]);
      }

      setShowWalkInModal(false);
    } catch (err: any) {
      console.error("Errore walk-in:", err);
      alert("Errore registrazione walk-in: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingWalkIn(false);
    }
  };

  // Metriche Desk
  const waitingCount = appointments.filter((a) => a.status === "in_attesa").length;
  const inVisitCount = appointments.filter((a) => a.status === "in_visita").length;
  const completedCount = appointments.filter((a) => a.status === "completato").length;
  const toPayCount = appointments.filter((a) => a.status !== "completato").length;

  return (
    <div className="space-y-6">
      {/* ── BANNER DESK OPERATIVO & KPI ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white font-bold text-xl shadow-xs">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                  Accoglienza &amp; Cassa Live
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" /> Presidio Desk: 08:00 - 20:00
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Desk Operativo Segreteria
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fetchDeskData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Aggiorna</span>
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

        {/* ── KPI RAPIDI DI GIORNATA ── */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Visite in Giornata
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 mt-0.5">
              {appointments.length}
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
              Concluse &amp; Saldate
            </p>
            <p className="text-2xl font-bold font-serif text-emerald-950 mt-0.5">
              {completedCount}
            </p>
          </div>
        </div>
      </div>

      {/* ── ELENCO VISITE DI OGGI & CHECKOUT AL BANCO ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              Flusso Pazienti &amp; Cassa al Banco
            </h2>
            <p className="text-xs text-slate-500">
              Avanza lo stato del paziente (arrivo, studio, dimissione) e registra l&apos;incasso POS/Contanti con 1 clic.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {appointments.length} visite programmate oggi
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-teal-700 border-t-transparent mb-2"></span>
              <p>Caricamento visite in tempo reale...</p>
            </div>
          ) : appointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nessun appuntamento in agenda per oggi.
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

              // Controlla se il paziente ha piani attivi
              const patientPlans = plans.filter((pl) => pl.patient_id === p?.id);
              const activePlan = patientPlans.length > 0 ? patientPlans[0] : null;

              return (
                <div
                  key={app.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-mono font-bold text-slate-900 border border-slate-200">
                      {timeStr}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {p ? `${p.first_name} ${p.last_name}` : "Paziente"}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                          {p?.patient_code || "N/A"}
                        </span>
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

                      {/* Info Piano Terapeutico o Visita Singola */}
                      <div className="mt-1 flex items-center gap-2">
                        {activePlan ? (
                          <span className="text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            Piano Attivo: {activePlan.title} (Residuo: €{(activePlan.net_total - (activePlan.paid_total || 0)).toFixed(0)})
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            Visita Specialistica Singola (€120 da tariffario)
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

                  {/* ── STATO ACCOGLIENZA & INCASSO BANCO (ALLINEAMENTO ORIZZONTALE) ── */}
                  <div className="flex items-center gap-2 shrink-0 flex-nowrap self-start lg:self-center">
                    {/* Pulsante 1: Avanzamento Visita */}
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
                        className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors whitespace-nowrap"
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

                    {/* Pulsante 2: Incasso alla Cassa */}
                    <button
                      type="button"
                      onClick={() => handleOpenPayment(app)}
                      className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors whitespace-nowrap"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Incassa Visita / Quota 💶</span>
                    </button>

                    {/* Pulsante 3: Cartella Clinica */}
                    {onOpenPatient && p && (
                      <button
                        type="button"
                        onClick={() => onOpenPatient(p.id)}
                        className="h-9 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs"
                        title="Apri cartella clinica"
                      >
                        <span>Cartella →</span>
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
            const occupant = appointments.find(
              (a) => a.room_id === room.id && a.status === "in_visita"
            );
            const nextPatient = appointments.find(
              (a) => a.room_id === room.id && a.status === "in_attesa"
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
                  <span className="font-bold font-serif text-sm text-slate-900">
                    {room.name}
                  </span>
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
                  {room.description || "Ambulatorio specialistico"}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs">
                  {occupant ? (
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">
                        Paziente all&apos;interno:
                      </span>
                      <p className="font-bold text-slate-900">
                        {occupant.patient_profiles?.first_name} {occupant.patient_profiles?.last_name}
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
                        {nextPatient.patient_profiles?.first_name} {nextPatient.patient_profiles?.last_name}
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

      {/* ── MODAL INCASSO DIRETTO AL BANCO ── */}
      {showPaymentModal && selectedAppointmentForPayment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Registra Incasso al Banco Reception
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Paziente al Banco:
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {selectedAppointmentForPayment.patient_profiles?.first_name}{" "}
                  {selectedAppointmentForPayment.patient_profiles?.last_name}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Codice: {selectedAppointmentForPayment.patient_profiles?.patient_code}
                </p>
              </div>

              {/* Selezione se imputare a Piano Terapeutico */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Imputazione Contabile
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="">Visita Singola Estemporanea (€120)</option>
                  {plans
                    .filter((pl) => pl.patient_id === selectedAppointmentForPayment.patient_profiles?.id)
                    .map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        Piano: {pl.title} (Residuo: €{(pl.net_total - (pl.paid_total || 0)).toFixed(0)})
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Se associato a un piano, l&apos;importo viene scalato in automatico dal saldo.
                </p>
              </div>

              {/* Importo Versato */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quota / Importo Versato (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    €
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-sm font-bold text-slate-900 font-mono"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  {[120, 300, 500, 600].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPaymentAmount(preset.toString())}
                      className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700"
                    >
                      €{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metodo di Pagamento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metodo di Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["pos", "contanti", "bonifico"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`rounded-lg border py-2 text-xs font-bold uppercase transition-all ${
                        paymentMethod === m
                          ? "border-emerald-700 bg-emerald-50 text-emerald-900 shadow-2xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Ricevuta */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Ricevuta / Causale
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors disabled:opacity-50"
                >
                  {isSubmittingPayment ? "Registrazione..." : "Registra Incasso e Concludi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL WALK-IN (ACCOGLI AL BANCO) ── */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Accoglienza Paziente al Banco (Walk-in)
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
                  placeholder="es. Controllo urgente / medicazione"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

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
    </div>
  );
}
