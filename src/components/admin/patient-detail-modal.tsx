"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Printer,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  Users,
  X,
  AlertCircle,
  Receipt,
  Eye,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PatientDetailModalProps {
  patient: any;
  onClose: () => void;
  onRefresh?: () => void;
  onOpenCassa?: () => void;
}

export function PatientDetailModal({
  patient,
  onClose,
  onRefresh,
  onOpenCassa,
}: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"anagrafica" | "piani" | "visite" | "referti">("piani");
  const [plans, setPlans] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Nuovo Incasso
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"pos" | "bonifico" | "contanti">("pos");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Visualizzatore Referto Clinico
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);

  // Form Nuovo Referto
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("Odontoiatria & Ortodonzia");
  const [newDocDoctor, setNewDocDoctor] = useState("Dott.ssa Elisa Russo (D.S.)");
  const [newDocDiagnosis, setNewDocDiagnosis] = useState("");
  const [newDocRecommendations, setNewDocRecommendations] = useState("");
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Fetch dati specifici del paziente
  const fetchPatientData = async () => {
    if (!patient?.id) return;
    try {
      setLoading(true);

      // 1. Piani terapeutici
      const { data: plansData } = await supabase
        .from("patient_treatment_plans")
        .select("*")
        .eq("patient_id", patient.id)
        .order("created_at", { ascending: false });

      if (plansData) {
        setPlans(plansData);
        if (plansData.length > 0 && !selectedPlanId) {
          setSelectedPlanId(plansData[0].id);
        }
      }

      // 2. Rate e quote incassate
      const { data: instData } = await supabase
        .from("treatment_installments")
        .select("*")
        .eq("patient_id", patient.id)
        .order("due_date", { ascending: true });

      if (instData) setInstallments(instData);

      // 3. Visite e appuntamenti
      const { data: apptData } = await supabase
        .from("appointments")
        .select(`
          id, starts_at, ends_at, status, notes, is_first_visit,
          doctors ( id, full_name, title, specialty_slug ),
          clinic_rooms ( id, name, slug )
        `)
        .eq("patient_id", patient.id)
        .order("starts_at", { ascending: false });

      if (apptData) setAppointments(apptData);

      // 4. Documenti e referti
      const { data: docData } = await supabase
        .from("clinical_documents")
        .select("*")
        .eq("patient_id", patient.id)
        .order("report_date", { ascending: false });

      if (docData) setDocuments(docData);
    } catch (e) {
      console.error("Errore fetch dettagli paziente:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patient?.id]);

  // Gestione Registrazione Nuovo Incasso
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Inserisci un importo valido");
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const targetPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
      const nowIso = new Date().toISOString();

      // 1. Inserisci rata incassata
      const nextNumber = installments.length + 1;
      const { error: instErr } = await supabase.from("treatment_installments").insert({
        plan_id: targetPlan ? targetPlan.id : null,
        patient_id: patient.id,
        installment_number: nextNumber,
        installment_type: "rata",
        amount: amountNum,
        due_date: nowIso.split("T")[0],
        status: "pagato",
        payment_method: paymentMethod,
        paid_at: nowIso,
        notes: paymentNotes || `Incasso registrato da Direzione CRM (${paymentMethod.toUpperCase()})`,
      });

      if (instErr) throw instErr;

      // 2. Se c'è un piano, aggiorna paid_total e balance_due
      if (targetPlan) {
        const newPaid = Number(targetPlan.paid_total || 0) + amountNum;
        const newBalance = Math.max(0, Number(targetPlan.net_total || targetPlan.total_amount) - newPaid);
        const newStatus = newBalance <= 0 ? "saldato" : "parzialmente_pagato";

        await supabase
          .from("patient_treatment_plans")
          .update({
            paid_total: newPaid,
            balance_due: newBalance,
            payment_status: newStatus,
            updated_at: nowIso,
          })
          .eq("id", targetPlan.id);
      }

      // Reset form
      setPaymentAmount("");
      setPaymentNotes("");
      setShowAddPaymentModal(false);

      // Ricarica dati
      await fetchPatientData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error("Errore salvataggio incasso:", err);
      alert("Errore salvataggio: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Gestione Aggiunta Referto
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) {
      alert("Inserisci il titolo del referto");
      return;
    }

    try {
      setIsSubmittingDoc(true);
      const code = `REF-${newDocSpecialty.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { error } = await supabase.from("clinical_documents").insert({
        patient_id: patient.id,
        title: newDocTitle,
        specialty: newDocSpecialty,
        doctor_name: newDocDoctor,
        diagnosis: newDocDiagnosis || "Quadro clinico esaminato e conforme ai protocolli Cocoora.",
        recommendations: newDocRecommendations || "Proseguire con le indicazioni terapeutiche domiciliari prescritte.",
        document_code: code,
        report_date: new Date().toISOString().split("T")[0],
        is_ready: true,
        file_size: "1.9 MB",
      });

      if (error) throw error;

      setNewDocTitle("");
      setNewDocDiagnosis("");
      setNewDocRecommendations("");
      setShowAddDocModal(false);

      await fetchPatientData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error("Errore creazione referto:", err);
      alert("Errore creazione referto: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  // Calcoli finanziari complessivi
  const totalDue = plans.reduce((acc, p) => acc + Number(p.net_total || p.total_amount || 0), 0);
  const totalPaid = installments
    .filter((i) => i.status === "pagato")
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);
  const balanceDue = Math.max(0, totalDue - totalPaid);
  const percentPaid = totalDue > 0 ? Math.min(100, Math.round((totalPaid / totalDue) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* ── HEADER MODAL ── */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-[#1d2327] px-6 py-5 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white font-bold text-xl shadow-md border border-teal-400/40">
              {patient.first_name?.[0]}
              {patient.last_name?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  {patient.first_name} {patient.last_name}
                </h2>
                <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-teal-300 border border-teal-500/40">
                  {patient.patient_code}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                  Paziente Attivo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                <span>Codice Fiscale: <strong className="text-white font-mono">{patient.fiscal_code || "Non specificato"}</strong></span>
                <span>•</span>
                <span>Email: <strong className="text-white">{patient.email || "Non inserita"}</strong></span>
                <span>•</span>
                <span>Telefono: <strong className="text-white">{patient.phone || "Non inserito"}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              title="Stampa scheda paziente"
            >
              <Printer className="h-3.5 w-3.5 text-slate-300" />
              <span>Stampa Scheda</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddPaymentModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Registra Incasso</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── SUB-NAV TAB BAR ── */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("piani")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "piani"
                ? "border-teal-700 text-teal-900 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="h-4 w-4 text-teal-700" />
            <span>Piani di Cura &amp; Pagamenti ({plans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("anagrafica")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "anagrafica"
                ? "border-teal-700 text-teal-900 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="h-4 w-4 text-slate-600" />
            <span>Anagrafica &amp; Cartella Clinica</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("visite")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "visite"
                ? "border-teal-700 text-teal-900 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>Visite &amp; Appuntamenti ({appointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("referti")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "referti"
                ? "border-teal-700 text-teal-900 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            <span>Fascicolo Referti PDF ({documents.length})</span>
          </button>
        </div>

        {/* ── MODAL BODY SCROLLABLE ── */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mb-2"></span>
              <p>Caricamento cartella e registri del paziente...</p>
            </div>
          ) : (
            <>
              {/* ──────────────── TAB 1: PIANI DI CURA & PAGAMENTI ──────────────── */}
              {activeTab === "piani" && (
                <div className="space-y-6">
                  {/* Riepilogo Finanziario Rapido */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Totale Preventivato
                      </p>
                      <p className="mt-1 text-2xl font-bold font-serif text-slate-900">
                        €{totalDue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {plans.length} piano/i terapeutico/i
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Totale Già Incassato
                      </p>
                      <p className="mt-1 text-2xl font-bold font-serif text-emerald-800">
                        €{totalPaid.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        {percentPaid}% del totale saldato
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Residuo da Incassare
                      </p>
                      <p className="mt-1 text-2xl font-bold font-serif text-amber-900">
                        €{balanceDue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-amber-600 mt-0.5">
                        Rate residue pianificate
                      </p>
                    </div>

                    <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          Azioni Rapide Cassa
                        </p>
                        <p className="text-xs text-teal-900 font-semibold mt-1">
                          Registra quota flessibile
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentModal(true)}
                        className="mt-2 w-full rounded-lg bg-teal-700 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 transition-colors"
                      >
                        + Incassa Quota / POS
                      </button>
                    </div>
                  </div>

                  {/* Lista Piani Terapeutici con Barra di Avanzamento */}
                  {plans.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                      <CreditCard className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-slate-700">
                        Nessun piano terapeutico o percorso registrato per questo paziente
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Puoi registrare un percorso dalla segreteria o registrare un acconto diretto.
                      </p>
                    </div>
                  ) : (
                    plans.map((p) => {
                      const pInst = installments.filter((i) => i.plan_id === p.id);
                      const pPaid = pInst
                        .filter((i) => i.status === "pagato")
                        .reduce((acc, i) => acc + Number(i.amount || 0), 0);
                      const pTotal = Number(p.net_total || p.total_amount || 0);
                      const pBalance = Math.max(0, pTotal - pPaid);
                      const pPct = pTotal > 0 ? Math.min(100, Math.round((pPaid / pTotal) * 100)) : 0;

                      return (
                        <div
                          key={p.id}
                          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.5 text-xs font-mono font-bold">
                                  {p.plan_code || "PT-2026"}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 font-serif">
                                  {p.title}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Branca: <strong className="text-slate-700">{p.description || "Clinica Specialistica"}</strong> · Stato: <span className="font-semibold text-teal-700 capitalize">{p.payment_status?.replace("_", " ") || "In corso"}</span>
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-xs text-slate-400 block uppercase">Valore Netto</span>
                              <span className="text-xl font-bold font-serif text-slate-900">
                                €{pTotal.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                              </span>
                              {p.discount_amount > 0 && (
                                <span className="text-[10px] text-emerald-700 block">
                                  Sconto: -€{p.discount_amount}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* ── BARRA DI AVANZAMENTO PAGAMENTO (STILE SIMONE PAPAGNO / COCOORA) ── */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-semibold text-slate-700">
                                Avanzamento Saldo Trattamento:
                              </span>
                              <span className="font-mono font-bold text-teal-900">
                                €{pPaid.toLocaleString("it-IT")} / €{pTotal.toLocaleString("it-IT")} ({pPct}%)
                              </span>
                            </div>
                            <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  pPct === 100
                                    ? "bg-emerald-500"
                                    : pPct >= 50
                                    ? "bg-teal-600"
                                    : "bg-amber-500"
                                }`}
                                style={{ width: `${pPct}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                              <span>Versato: €{pPaid.toLocaleString("it-IT")}</span>
                              <span className="font-semibold text-amber-700">
                                Residuo: €{pBalance.toLocaleString("it-IT")}
                              </span>
                            </div>
                          </div>

                          {/* Tabella Rate & Quote */}
                          <div className="mt-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Dettaglio Rateizzazioni &amp; Quote Incassate
                            </h4>
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                  <tr>
                                    <th className="py-2.5 px-3 font-semibold">Quota / Rata</th>
                                    <th className="py-2.5 px-3 font-semibold">Scadenza</th>
                                    <th className="py-2.5 px-3 font-semibold">Importo</th>
                                    <th className="py-2.5 px-3 font-semibold">Metodo</th>
                                    <th className="py-2.5 px-3 font-semibold">Stato</th>
                                    <th className="py-2.5 px-3 font-semibold">Data Incasso</th>
                                    <th className="py-2.5 px-3 font-semibold">Note</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {pInst.length === 0 ? (
                                    <tr>
                                      <td colSpan={7} className="py-4 text-center text-slate-400">
                                        Nessuna rata o quota memorizzata per questo piano.
                                      </td>
                                    </tr>
                                  ) : (
                                    pInst.map((inst) => (
                                      <tr key={inst.id} className="hover:bg-slate-50/80">
                                        <td className="py-2.5 px-3 font-semibold">
                                          Rata #{inst.installment_number} ({inst.installment_type})
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-slate-500">
                                          {inst.due_date || "N/A"}
                                        </td>
                                        <td className="py-2.5 px-3 font-bold font-mono text-slate-900">
                                          €{Number(inst.amount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          {inst.payment_method ? (
                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                                              {inst.payment_method}
                                            </span>
                                          ) : (
                                            <span className="text-slate-400 text-[11px]">—</span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          {inst.status === "pagato" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                                              <CheckCircle2 className="h-3 w-3" />
                                              Pagato
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                                              <Clock className="h-3 w-3" />
                                              In scadenza
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                                          {inst.paid_at
                                            ? new Date(inst.paid_at).toLocaleDateString("it-IT", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })
                                            : "—"}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-500 text-[11px] truncate max-w-[150px]">
                                          {inst.notes || "—"}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ──────────────── TAB 2: ANAGRAFICA & CARTELLA CLINICA ──────────────── */}
              {activeTab === "anagrafica" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 border-b border-slate-100 pb-2 mb-4">
                      Dati Anagrafici &amp; Identificativi Paziente
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Nome Completo</span>
                        <span className="text-slate-900 font-bold text-sm">
                          {patient.first_name} {patient.last_name}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Codice Paziente</span>
                        <span className="text-teal-800 font-mono font-bold text-sm">
                          {patient.patient_code}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Codice Fiscale</span>
                        <span className="text-slate-900 font-mono font-bold">
                          {patient.fiscal_code || "Non specificato"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                        <span className="text-slate-700">
                          {patient.email || "Non inserita"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Telefono / WhatsApp</span>
                        <span className="text-slate-700 font-mono">
                          {patient.phone || "Non inserito"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Genere / Sesso</span>
                        <span className="text-slate-700 capitalize">
                          {patient.gender || "Non specificato"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Indirizzo Residenza</span>
                        <span className="text-slate-700">
                          {patient.address ? `${patient.address}, ${patient.city || ""}` : "Via non registrata"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Data Registrazione</span>
                        <span className="text-slate-700 font-mono">
                          {patient.created_at ? new Date(patient.created_at).toLocaleDateString("it-IT") : "Recente"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Stato Dossier</span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Verificato Direzione
                        </span>
                      </div>
                    </div>

                    {/* Note Cliniche Interne */}
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                        Note Cliniche Interne &amp; Avvertenze Reception
                      </span>
                      <div className="rounded-xl bg-teal-50/60 border border-teal-100 p-3 text-xs text-teal-950 italic">
                        {patient.notes || "Nessuna nota clinica particolare registrata per questo paziente."}
                      </div>
                    </div>

                    {/* Consensi & Privacy GDPR */}
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-2">
                        Conformità Deontologica &amp; Consensi Privacy (GDPR Sanitario)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 text-[11px]">Trattamento Dati Sanitari</p>
                            <p className="text-[10px] text-slate-500">Acquisito e conforme</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 text-[11px]">Consenso WhatsApp</p>
                            <p className="text-[10px] text-slate-500">Promemoria visite attivo</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                          <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 text-[11px]">Fascicolo Elettronico</p>
                            <p className="text-[10px] text-slate-500">Accesso portale abilitato</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────── TAB 3: VISITE & APPUNTAMENTI ──────────────── */}
              {activeTab === "visite" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Registro Cronologico Visite &amp; Sedute Cliniche
                    </h3>
                    <span className="text-xs text-slate-500">
                      {appointments.length} appuntamenti totali
                    </span>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
                      Nessun appuntamento registrato in agenda per questo paziente.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((a) => {
                        const dateObj = new Date(a.starts_at);
                        const isPast = dateObj.getTime() < Date.now();

                        return (
                          <div
                            key={a.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs gap-3 hover:border-teal-200 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-sm">
                                    {dateObj.toLocaleDateString("it-IT", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <span className="font-mono text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded">
                                    {dateObj.toLocaleTimeString("it-IT", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  Medico: <strong>{a.doctors?.full_name || "Specialista Cocoora"}</strong> · Stanza: <strong>{a.clinic_rooms?.name || "Studio 1"}</strong>
                                </p>
                                {a.notes && (
                                  <p className="text-[11px] text-slate-500 mt-1 italic">
                                    Note: {a.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                                  a.status === "completato"
                                    ? "bg-slate-100 text-slate-700 border-slate-300"
                                    : a.status === "confermato"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}
                              >
                                {a.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── TAB 4: FASCICOLO REFERTI PDF ──────────────── */}
              {activeTab === "referti" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Referti Specialistici &amp; Cartella Digitale
                      </h3>
                      <p className="text-xs text-slate-500">
                        Documenti clinici pronti per la consultazione del paziente
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddDocModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Nuovo Referto</span>
                    </button>
                  </div>

                  {documents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
                      Nessun referto clinico ancora emesso nel fascicolo di questo paziente.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-teal-300 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200 font-bold text-xs">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900 font-serif">
                                  {doc.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Codice: <strong className="font-mono text-teal-800">{doc.document_code}</strong> · Branca: {doc.specialty} · Medico: {doc.doctor_name}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-slate-400">
                                {doc.report_date}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedDocPreview(doc)}
                                className="inline-flex items-center gap-1 rounded-md border border-teal-300 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Visualizza / Stampa</span>
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                Diagnosi &amp; Esito
                              </span>
                              <p className="text-slate-700 leading-relaxed text-[11px]">
                                {doc.diagnosis || "Esame eseguito con successo."}
                              </p>
                            </div>

                            <div className="rounded-lg bg-teal-50/40 p-2.5 border border-teal-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                                Indicazioni Terapeutiche
                              </span>
                              <p className="text-teal-950 leading-relaxed text-[11px]">
                                {doc.recommendations || "Nessuna prescrizione specifica."}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── FOOTER MODAL ── */}
        <div className="border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-700" />
            <span>Fascicolo Clinico Riservato — Conforme GDPR &amp; Autorizzazione Sanitaria</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Chiudi Scheda
          </button>
        </div>
      </div>

      {/* ── MODAL REGISTRA INCASSO ── */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Registra Incasso Quota / POS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Piano Terapeutico di Riferimento
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Residuo: €{(p.net_total - (p.paid_total || 0)).toFixed(0)})
                    </option>
                  ))}
                  {plans.length === 0 && <option value="">Nessun piano (Acconto generico)</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Importo Quota Versata (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    €
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="es. 500"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-sm font-bold text-slate-900 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Flessibilità totale per acconti variabili (concordato con Simone).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metodo di Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["pos", "bonifico", "contanti"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`rounded-lg border py-2 text-xs font-bold uppercase transition-all ${
                        paymentMethod === m
                          ? "border-teal-700 bg-teal-50 text-teal-900 shadow-2xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note / Riferimento Ricevuta
                </label>
                <input
                  type="text"
                  placeholder="es. Acconto allineatori serie 1 - POS Cassa"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors disabled:opacity-50"
                >
                  {isSubmittingPayment ? "Registrazione..." : "Registra e Aggiorna Saldo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL NUOVO REFERTO ── */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Aggiungi Referto nel Fascicolo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titolo Prestazione / Esame
                </label>
                <input
                  type="text"
                  placeholder="es. Controllo Cambio Allineatori e Igiene Orale"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branca Specialistica
                  </label>
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="Odontoiatria & Ortodonzia">Odontoiatria & Ortodonzia</option>
                    <option value="Medicina Rigenerativa & Anti-Aging">Medicina Rigenerativa</option>
                    <option value="Nutrizione & Longevità">Nutrizione & Longevità</option>
                    <option value="Salute Donna & Senologia">Salute Donna & Senologia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medico Refertatore
                  </label>
                  <input
                    type="text"
                    value={newDocDoctor}
                    onChange={(e) => setNewDocDoctor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnosi / Esito dell'Esame
                </label>
                <textarea
                  rows={3}
                  placeholder="Descrizione clinica dettagliata..."
                  value={newDocDiagnosis}
                  onChange={(e) => setNewDocDiagnosis(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Raccomandazioni e Terapia Prescritta
                </label>
                <textarea
                  rows={2}
                  placeholder="Indicazioni terapeutiche domiciliari..."
                  value={newDocRecommendations}
                  onChange={(e) => setNewDocRecommendations(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDoc}
                  className="rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors disabled:opacity-50"
                >
                  {isSubmittingDoc ? "Salvataggio..." : "Salva Referto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL ANTEPRIMA / STAMPA REFERTO PDF ── */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl border border-slate-200 my-8">
            {/* Header Referto Formale */}
            <div className="flex items-start justify-between border-b-2 border-teal-900 pb-4">
              <div>
                <h1 className="text-xl font-bold font-serif text-teal-900 tracking-wider">
                  COCOORA CENTRO MEDICO
                </h1>
                <p className="text-[11px] text-slate-500">
                  Via Generale Giovanni De Bonis, 81 - 80123 Napoli (NA) · Tel: 081 18182091
                </p>
                <p className="text-[10px] text-teal-800 font-semibold mt-0.5">
                  Direzione Sanitaria: Dott.ssa Elisa Russo · Aut. Sanitaria N. 1042/NA
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-mono font-bold text-teal-900 border border-teal-200 block">
                  {selectedDocPreview.document_code}
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  Data: {selectedDocPreview.report_date}
                </span>
              </div>
            </div>

            {/* Dati Paziente */}
            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Paziente</span>
                <span className="text-slate-900 font-bold text-sm">
                  {patient.first_name} {patient.last_name}
                </span>
                <p className="text-slate-500 text-[11px] font-mono mt-0.5">
                  CF: {patient.fiscal_code || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Medico Refertatore</span>
                <span className="text-slate-900 font-bold text-sm">
                  {selectedDocPreview.doctor_name}
                </span>
                <p className="text-teal-800 text-[11px] font-semibold mt-0.5">
                  Branca: {selectedDocPreview.specialty}
                </p>
              </div>
            </div>

            {/* Corpo Clinico */}
            <div className="mt-6 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-teal-950 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 mb-2">
                  Oggetto della Prestazione Clinica: {selectedDocPreview.title}
                </h3>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">Diagnosi &amp; Rilievi Clinici:</h4>
                <div className="rounded-lg bg-white border border-slate-200 p-3 text-slate-700 leading-relaxed text-xs">
                  {selectedDocPreview.diagnosis}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">Prescrizioni &amp; Raccomandazioni Terapeutiche:</h4>
                <div className="rounded-lg bg-teal-50/50 border border-teal-100 p-3 text-teal-950 leading-relaxed text-xs">
                  {selectedDocPreview.recommendations}
                </div>
              </div>
            </div>

            {/* Firma e Timbro Digitale */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                Documento clinico firmato digitalmente secondo CAD e conservato a norma.
              </div>
              <div className="text-right">
                <div className="h-10 w-32 border-b border-slate-400 mb-1 ml-auto"></div>
                <p className="text-[11px] font-bold text-slate-800">
                  {selectedDocPreview.doctor_name}
                </p>
                <p className="text-[9px] text-slate-500 uppercase">Firma del Medico</p>
              </div>
            </div>

            {/* Azioni Anteprima */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Chiudi Anteprima
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Stampa Referto PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
