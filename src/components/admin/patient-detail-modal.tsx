"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  Plus,
  Printer,
  Shield,
  ShieldCheck,
  User,
  X,
  AlertCircle,
  Receipt,
  Eye,
  Wallet,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface CompletedAppointmentContext {
  id: string;
  starts_at?: string;
  doctorName?: string;
  roomName?: string;
  notes?: string;
  is_first_visit?: boolean;
}

export interface PatientDetailModalProps {
  patient: any;
  onClose: () => void;
  onRefresh?: () => void;
  onOpenCassa?: () => void;
  initialTab?: "anagrafica" | "piani" | "visite" | "referti";
  completedAppointment?: CompletedAppointmentContext | null;
}

type PaymentMethodOption = "pos" | "contanti" | "klarna" | "stripe" | "paypal" | "bonifico";
type InvoiceModeOption = "immediata" | "saldo_assicurazione";
type InstallmentTypeOption = "acconto" | "rata" | "saldo";

const PAYMENT_METHODS: { id: PaymentMethodOption; label: string; sub: string }[] = [
  { id: "pos", label: "POS / Carta", sub: "Terminale desk" },
  { id: "contanti", label: "Contanti", sub: "Cassa sede" },
  { id: "klarna", label: "Klarna Rateale", sub: "3/6/12 quote" },
  { id: "stripe", label: "Stripe / Link", sub: "Carta online" },
  { id: "paypal", label: "PayPal", sub: "Wallet / 3 rate" },
  { id: "bonifico", label: "Bonifico", sub: "IBAN studio" },
];

function cleanVisitNotes(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(
      /\[(Arrivo|InizioVisita|Attesa|FineVisita|Durata|Reminder1h|Incasso|Motivo):[^\]]*\]/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function detectClubMembership(patient: any, plans: any[]): string | null {
  const notes = String(patient?.notes || "").toLowerCase();
  if (notes.includes("experience")) return "Cocoora Club Experience";
  if (notes.includes("longevity")) return "Cocoora Club Longevity";
  if (notes.includes("care")) return "Cocoora Club Care";
  if (notes.includes("access")) return "Cocoora Club Access";
  if (notes.includes("cocoora club") || notes.includes("percorso salute")) {
    return "Percorso Salute Cocoora Club";
  }

  const clubPlan = plans.find((p) => {
    const t = `${p.title || ""} ${p.description || ""}`.toLowerCase();
    return t.includes("club") || t.includes("percorso salute") || t.includes("longevity");
  });
  if (clubPlan) return clubPlan.title;

  return null;
}

export function PatientDetailModal({
  patient,
  onClose,
  onRefresh,
  onOpenCassa,
  initialTab,
  completedAppointment,
}: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"anagrafica" | "piani" | "visite" | "referti">(
    initialTab || "piani"
  );
  const [plans, setPlans] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const bodyScrollRef = useRef<HTMLDivElement | null>(null);

  // Form Registrazione Incasso / Acconto / Prestazione Singola
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [singleVisitTitle, setSingleVisitTitle] = useState<string>(
    cleanVisitNotes(completedAppointment?.notes) || "Prestazione Specialistica in Sede"
  );
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>("pos");
  const [installmentType, setInstallmentType] = useState<InstallmentTypeOption>("acconto");
  const [invoiceMode, setInvoiceMode] = useState<InvoiceModeOption>("immediata");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSubmittingClubZero, setIsSubmittingClubZero] = useState(false);
  const [clubZeroRecorded, setClubZeroRecorded] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<{
    type: "success" | "error";
    message: string;
    receiptNumber?: string;
  } | null>(null);

  // Visualizzatore Referto Clinico
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);

  // Form Nuovo Referto
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("Odontoiatria & Ortodonzia");
  const [newDocDoctor, setNewDocDoctor] = useState(
    completedAppointment?.doctorName || "Dott.ssa Elisa Russo (D.S.)"
  );
  const [newDocDiagnosis, setNewDocDiagnosis] = useState("");
  const [newDocRecommendations, setNewDocRecommendations] = useState("");
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Sincronizzazione tab iniziale e contesto visita conclusa
  useEffect(() => {
    setActiveTab(initialTab || "piani");
    setPaymentFeedback(null);
    setClubZeroRecorded(false);
    setSingleVisitTitle(
      cleanVisitNotes(completedAppointment?.notes) || "Prestazione Specialistica in Sede"
    );
    if (completedAppointment?.doctorName) {
      setNewDocDoctor(completedAppointment.doctorName);
    }
  }, [patient?.id, initialTab, completedAppointment?.id]);

  // Fetch dati specifici del paziente (server API + fallback Supabase diretto)
  const fetchPatientData = async () => {
    if (!patient?.id) return;
    try {
      setLoading(true);

      const [deskSettled, plansSettled, instSettled, apptSettled, docSettled] =
        await Promise.allSettled([
          fetch("/api/reception/desk", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
          supabase
            .from("patient_treatment_plans")
            .select("*")
            .eq("patient_id", patient.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("treatment_installments")
            .select("*")
            .eq("patient_id", patient.id)
            .order("due_date", { ascending: true }),
          supabase
            .from("appointments")
            .select(
              `
              id, starts_at, ends_at, status, notes, is_first_visit,
              doctors ( id, full_name, title, specialty_slug ),
              clinic_rooms ( id, name, slug )
            `
            )
            .eq("patient_id", patient.id)
            .order("starts_at", { ascending: false }),
          supabase
            .from("clinical_documents")
            .select("*")
            .eq("patient_id", patient.id)
            .order("report_date", { ascending: false }),
        ]);

      const deskData = deskSettled.status === "fulfilled" ? deskSettled.value : null;
      const sbPlans =
        plansSettled.status === "fulfilled" ? plansSettled.value.data || [] : [];
      const sbInst =
        instSettled.status === "fulfilled" ? instSettled.value.data || [] : [];
      const sbAppt =
        apptSettled.status === "fulfilled" ? apptSettled.value.data || [] : [];
      const sbDocs =
        docSettled.status === "fulfilled" ? docSettled.value.data || [] : [];

      const mergeById = (primary: any[], secondary: any[]) => {
        const map = new Map<string, any>();
        for (const item of secondary) {
          if (item?.id) map.set(item.id, item);
        }
        for (const item of primary) {
          if (item?.id) map.set(item.id, { ...map.get(item.id), ...item });
        }
        return Array.from(map.values());
      };

      const deskPlans = Array.isArray(deskData?.plans)
        ? deskData.plans.filter((p: any) => p.patient_id === patient.id)
        : [];
      const mergedPlans = mergeById(deskPlans, sbPlans).sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      const deskInst = Array.isArray(deskData?.installments)
        ? deskData.installments.filter((i: any) => i.patient_id === patient.id)
        : [];
      const mergedInst = mergeById(deskInst, sbInst).sort(
        (a, b) =>
          new Date(a.due_date || a.created_at || 0).getTime() -
          new Date(b.due_date || b.created_at || 0).getTime()
      );

      const deskAppts = Array.isArray(deskData?.appointments)
        ? deskData.appointments.filter(
            (a: any) =>
              a.patient_id === patient.id || a.patient_profiles?.id === patient.id
          )
        : [];
      const mergedAppts = mergeById(deskAppts, sbAppt).sort(
        (a, b) =>
          new Date(b.starts_at || 0).getTime() - new Date(a.starts_at || 0).getTime()
      );

      const deskDocs = Array.isArray(deskData?.documents)
        ? deskData.documents.filter((d: any) => d.patient_id === patient.id)
        : [];
      const mergedDocs = mergeById(deskDocs, sbDocs).sort(
        (a, b) =>
          new Date(b.report_date || b.created_at || 0).getTime() -
          new Date(a.report_date || a.created_at || 0).getTime()
      );

      setPlans(mergedPlans);
      setInstallments(mergedInst);
      setAppointments(mergedAppts);
      setDocuments(mergedDocs);

      setSelectedPlanId((prev) => {
        if (prev === "__single_visit__") return prev;
        if (prev && mergedPlans.some((p) => p.id === prev)) return prev;
        const openPlan = mergedPlans.find((p) => {
          const total = Number(p.net_total || p.total_amount || 0);
          const paid = Number(p.paid_total || 0);
          return total - paid > 0 && p.status !== "annullato";
        });
        if (openPlan) return openPlan.id;
        return mergedPlans.length > 0 ? mergedPlans[0].id : "__single_visit__";
      });
    } catch (e) {
      console.error("Errore fetch dettagli paziente:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patient?.id]);

  // Helper calcolo importi singolo piano
  const getPlanMetrics = (plan: any) => {
    if (!plan) return { total: 0, paid: 0, balance: 0, pct: 0 };
    const pInstPaid = installments
      .filter((i) => i.plan_id === plan.id && i.status === "pagato")
      .reduce((acc, i) => acc + Number(i.amount || 0), 0);
    const total = Number(plan.net_total || plan.total_amount || 0);
    const paid = Math.max(pInstPaid, Number(plan.paid_total || 0));
    const balance = Math.max(0, total - paid);
    const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
    return { total, paid, balance, pct };
  };

  const activePlans = plans.filter((p) => p.status !== "annullato");
  const openPlansWithBalance = activePlans.filter((p) => getPlanMetrics(p).balance > 0);
  const primaryOpenPlan = openPlansWithBalance[0] || activePlans[0] || null;
  const primaryOpenMetrics = getPlanMetrics(primaryOpenPlan);
  const clubMembershipLabel = detectClubMembership(patient, activePlans);

  const isSingleVisitMode = selectedPlanId === "__single_visit__" || !selectedPlanId;
  const selectedPlan = !isSingleVisitMode
    ? plans.find((p) => p.id === selectedPlanId) || null
    : null;
  const selectedPlanMetrics = getPlanMetrics(selectedPlan);

  const openPaymentFormInMode = (mode: "percorso" | "singola", targetPlanId?: string) => {
    setActiveTab("piani");
    setPaymentFeedback(null);

    if (mode === "singola") {
      setSelectedPlanId("__single_visit__");
      setInstallmentType("saldo");
      if (!singleVisitTitle.trim()) {
        setSingleVisitTitle(
          cleanVisitNotes(completedAppointment?.notes) || "Prestazione Specialistica in Sede"
        );
      }
      setPaymentAmount("");
    } else {
      const chosenId = targetPlanId || primaryOpenPlan?.id || plans[0]?.id || "__single_visit__";
      setSelectedPlanId(chosenId);
      setInstallmentType("acconto");
      setPaymentAmount("");
    }

    setShowAddPaymentModal(true);
    setTimeout(() => {
      bodyScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Azione Rapida 1: Visita inclusa in Percorso Salute Cocoora Club (€0 oggi)
  const handleRecordClubZeroVisit = async () => {
    if (!completedAppointment?.id) return;
    try {
      setIsSubmittingClubZero(true);
      setPaymentFeedback(null);

      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_payment",
          patientId: patient.id,
          amount: 0,
          invoiceMode: "inclusa_club",
          appointmentId: completedAppointment.id,
          notes: "Prestazione inclusa in Percorso Salute Cocoora Club",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || "Impossibile registrare la seduta inclusa nel Club");
      }

      const receiptNum =
        data.receiptNumber ||
        data.receipt_number ||
        data.installment?.receipt_number ||
        undefined;

      setClubZeroRecorded(true);
      setShowAddPaymentModal(false);
      setPaymentFeedback({
        type: "success",
        message:
          "✓ Visita registrata come inclusa nel Percorso Salute (€0 da incassare)",
        receiptNumber: receiptNum,
      });

      await fetchPatientData();
      onRefresh?.();
    } catch (err: any) {
      console.error("Errore registrazione visita inclusa Club:", err);
      setPaymentFeedback({
        type: "error",
        message: err.message || "Errore durante la registrazione della visita inclusa.",
      });
    } finally {
      setIsSubmittingClubZero(false);
    }
  };

  // Salvataggio Incasso / Acconto / Prestazione Singola lato server
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPaymentFeedback({
        type: "error",
        message: "Inserisci un importo valido maggiore di €0.",
      });
      return;
    }

    try {
      setIsSubmittingPayment(true);
      setPaymentFeedback(null);

      const effectiveInstallmentType: InstallmentTypeOption = isSingleVisitMode
        ? "saldo"
        : selectedPlanMetrics.balance > 0 && amountNum >= selectedPlanMetrics.balance
        ? "saldo"
        : installmentType;

      const resolvedSingleTitle =
        singleVisitTitle.trim() ||
        cleanVisitNotes(completedAppointment?.notes) ||
        "Prestazione Specialistica in Sede";

      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_payment",
          patientId: patient.id,
          planId: isSingleVisitMode ? null : selectedPlanId,
          singleVisitTitle: isSingleVisitMode ? resolvedSingleTitle : undefined,
          amount: amountNum,
          paymentMethod,
          installmentType: effectiveInstallmentType,
          invoiceMode,
          notes: paymentNotes.trim() || undefined,
          appointmentId: completedAppointment?.id,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || "Errore durante il salvataggio contabile");
      }

      const receiptNum =
        data.receiptNumber ||
        data.receipt_number ||
        data.installment?.receipt_number ||
        data.updated?.[0]?.receipt_number ||
        `RIC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

      setPaymentAmount("");
      setPaymentNotes("");
      setShowAddPaymentModal(false);

      setPaymentFeedback({
        type: "success",
        message: isSingleVisitMode
          ? `✓ Prestazione singola "${resolvedSingleTitle}" incassata correttamente (€${amountNum.toLocaleString("it-IT", { minimumFractionDigits: 2 })} via ${paymentMethod.toUpperCase()}).`
          : `✓ Incasso di €${amountNum.toLocaleString("it-IT", { minimumFractionDigits: 2 })} registrato su "${selectedPlan?.title || "Percorso"}" — saldo residuo aggiornato in diretta.`,
        receiptNumber: receiptNum,
      });

      await fetchPatientData();
      onRefresh?.();
    } catch (err: any) {
      console.error("Errore salvataggio incasso:", err);
      setPaymentFeedback({
        type: "error",
        message: "Errore salvataggio: " + (err.message || "Riprova"),
      });
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

      const diagnosisText =
        newDocDiagnosis || "Quadro clinico esaminato e conforme ai protocolli Cocoora.";
      const recommendationsText =
        newDocRecommendations ||
        "Proseguire con le indicazioni terapeutiche domiciliari prescritte.";

      let savedViaApi = false;
      try {
        const res = await fetch("/api/reception/desk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add_document",
            patientId: patient.id,
            title: newDocTitle,
            specialty: newDocSpecialty,
            doctorName: newDocDoctor,
            diagnosis: diagnosisText,
            recommendations: recommendationsText,
          }),
        });
        if (res.ok) savedViaApi = true;
      } catch {
        // Fallback diretto Supabase
      }

      if (!savedViaApi) {
        const code = `REF-${newDocSpecialty.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const { error } = await supabase.from("clinical_documents").insert({
          patient_id: patient.id,
          title: newDocTitle,
          specialty: newDocSpecialty,
          doctor_name: newDocDoctor,
          diagnosis: diagnosisText,
          recommendations: recommendationsText,
          document_code: code,
          report_date: new Date().toISOString().split("T")[0],
          is_ready: true,
          file_size: "1.9 MB",
        });
        if (error) throw error;
      }

      setNewDocTitle("");
      setNewDocDiagnosis("");
      setNewDocRecommendations("");
      setShowAddDocModal(false);

      await fetchPatientData();
      onRefresh?.();
    } catch (err: any) {
      console.error("Errore creazione referto:", err);
      alert("Errore creazione referto: " + (err.message || "Riprova"));
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  // Calcoli finanziari complessivi del paziente
  const plansTotalDue = activePlans.reduce(
    (acc, p) => acc + Number(p.net_total || p.total_amount || 0),
    0
  );
  const unlinkedInstallments = installments.filter((i) => !i.plan_id);
  const unlinkedPaidTotal = unlinkedInstallments
    .filter((i) => i.status === "pagato")
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);

  const totalDue = plansTotalDue + unlinkedPaidTotal;
  const paidFromInstallments = installments
    .filter((i) => i.status === "pagato")
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);
  const paidFromPlans = activePlans.reduce(
    (acc, p) => acc + Number(p.paid_total || 0),
    0
  );
  const totalPaid = Math.max(paidFromInstallments, paidFromPlans);
  const balanceDue = Math.max(0, totalDue - totalPaid);
  const percentPaid =
    totalDue > 0 ? Math.min(100, Math.round((totalPaid / totalDue) * 100)) : 0;

  const cleanedCompletedNotes = cleanVisitNotes(completedAppointment?.notes);
  const typedAmountNum = Number(paymentAmount) || 0;

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
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  {patient.first_name} {patient.last_name}
                </h2>
                <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-teal-300 border border-teal-500/40">
                  {patient.patient_code}
                </span>
                {clubMembershipLabel && (
                  <span className="rounded-full bg-[#1C4A5C] px-2.5 py-0.5 text-[11px] font-bold text-teal-200 border border-teal-400/40">
                    🛡️ {clubMembershipLabel}
                  </span>
                )}
                {patient.last_name?.includes("(demo)") || patient.notes?.includes("demo") ? (
                  <span className="rounded-full bg-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-400/50">
                    PROFILO DEMO TEST
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    PAZIENTE REALE LIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                <span>
                  Codice Fiscale:{" "}
                  <strong className="text-white font-mono">
                    {patient.fiscal_code || "Non specificato"}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Email: <strong className="text-white">{patient.email || "Non inserita"}</strong>
                </span>
                <span>•</span>
                <span>
                  Telefono:{" "}
                  <strong className="text-white">{patient.phone || "Non inserito"}</strong>
                </span>
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
              onClick={() =>
                openPaymentFormInMode(plans.length > 0 ? "percorso" : "singola")
              }
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
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("piani")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "piani"
                ? "border-teal-700 text-teal-900 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="h-4 w-4 text-teal-700" />
            <span>Investimenti &amp; Percorsi Terapeutici ({plans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("anagrafica")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all ${
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
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all ${
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
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all ${
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
        <div ref={bodyScrollRef} className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mb-2"></span>
              <p>Caricamento cartella e registri del paziente...</p>
            </div>
          ) : (
            <>
              {/* ──────────────── TAB 1: INVESTIMENTI & PERCORSI TERAPEUTICI ──────────────── */}
              {activeTab === "piani" && (
                <div className="space-y-6">
                  {/* ── BANNER CHIUSURA VISITA & AZIONI CONTABILI INTELLIGENTI ── */}
                  {completedAppointment && (
                    <div className="rounded-2xl border-2 border-[#1C4A5C] bg-gradient-to-br from-[#1C4A5C] to-[#153847] p-5 text-white shadow-md">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                            ✅ Visita Conclusa — Chiusura Contabile &amp; Percorso Paziente
                          </h3>
                          <p className="text-xs sm:text-sm text-teal-100">
                            {completedAppointment.doctorName || "Specialista"} ·{" "}
                            {completedAppointment.roomName || "Studio"}
                            {cleanedCompletedNotes ? ` — ${cleanedCompletedNotes}` : ""}
                          </p>

                          {/* Stato intelligente del paziente */}
                          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                            {clubMembershipLabel && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/20 border border-emerald-300/40 px-2.5 py-1 font-semibold text-emerald-200">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Attivo: {clubMembershipLabel}
                              </span>
                            )}
                            {primaryOpenPlan && primaryOpenMetrics.balance > 0 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-2.5 py-1 font-medium text-white">
                                <Wallet className="h-3.5 w-3.5 text-amber-300" />
                                Investimento attivo: <strong>{primaryOpenPlan.title}</strong> ·
                                Residuo:{" "}
                                <strong className="font-mono text-amber-300">
                                  €
                                  {primaryOpenMetrics.balance.toLocaleString("it-IT", {
                                    minimumFractionDigits: 2,
                                  })}
                                </strong>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-2.5 py-1 text-teal-100">
                                <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                                {activePlans.length > 0
                                  ? "Percorsi presenti integralmente saldati"
                                  : "Nessun percorso pluriennale aperto — incasso rapido seduta o inclusione Club"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3 Pulsanti Rapidi Operativi */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          type="button"
                          disabled={isSubmittingClubZero || clubZeroRecorded}
                          onClick={handleRecordClubZeroVisit}
                          className="flex flex-col items-start justify-between rounded-xl border border-emerald-300/40 bg-emerald-500/20 hover:bg-emerald-500/30 p-3.5 text-left transition-all disabled:opacity-60"
                        >
                          <span className="text-xs font-bold text-white">
                            {clubZeroRecorded
                              ? "✓ Inclusa in Percorso Salute (€0)"
                              : isSubmittingClubZero
                              ? "Registrazione in corso..."
                              : "🛡️ Rientra in Percorso Salute Club (€0 oggi)"}
                          </span>
                          <span className="text-[11px] text-emerald-100 mt-1">
                            {clubMembershipLabel
                              ? `Coperto da ${clubMembershipLabel} · €0 da incassare`
                              : "Segna prestazione coperta da Percorso Salute · €0"}
                          </span>
                        </button>

                        <button
                          type="button"
                          disabled={activePlans.length === 0}
                          onClick={() =>
                            openPaymentFormInMode("percorso", primaryOpenPlan?.id)
                          }
                          className={`flex flex-col items-start justify-between rounded-xl border p-3.5 text-left transition-all ${
                            activePlans.length > 0
                              ? "border-white/30 bg-white text-[#1C4A5C] hover:bg-teal-50 shadow-xs"
                              : "border-white/15 bg-white/5 text-teal-200/60 cursor-not-allowed"
                          }`}
                        >
                          <span className="text-xs font-bold">
                            💶 Registra Acconto / Pagamento Parziale su Percorso
                          </span>
                          <span
                            className={`text-[11px] mt-1 ${
                              activePlans.length > 0 ? "text-slate-600" : "text-teal-200/60"
                            }`}
                          >
                            {primaryOpenPlan
                              ? `${primaryOpenPlan.title} · Saldo residuo €${primaryOpenMetrics.balance.toLocaleString("it-IT")}`
                              : "Nessun investimento pluriennale attivo per il paziente"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openPaymentFormInMode("singola")}
                          className="flex flex-col items-start justify-between rounded-xl border border-teal-200/40 bg-white/15 hover:bg-white/25 p-3.5 text-left text-white transition-all"
                        >
                          <span className="text-xs font-bold">
                            🧾 Incassa come Prestazione Singola
                          </span>
                          <span className="text-[11px] text-teal-100 mt-1">
                            Incasso immediato seduta in sede (POS, Contanti, Klarna, Stripe)
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── MESSAGGIO DI CONFERMA O ERRORE OPERAZIONE CONTABILE ── */}
                  {paymentFeedback && (
                    <div
                      className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${
                        paymentFeedback.type === "success"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                          : "border-red-300 bg-red-50 text-red-900"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 text-xs">
                        {paymentFeedback.type === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{paymentFeedback.message}</p>
                          {paymentFeedback.receiptNumber && (
                            <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">
                              Ricevuta / Protocollo registrato:{" "}
                              <strong>{paymentFeedback.receiptNumber}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentFeedback(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* ── FORM INLINE ESPANDIBILE REGISTRAZIONE INCASSO / ACCONTO ── */}
                  {showAddPaymentModal && (
                    <div className="rounded-2xl border-2 border-teal-700 bg-white p-6 shadow-lg space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C4A5C] text-white">
                            <Receipt className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 font-serif">
                              {isSingleVisitMode
                                ? "Incasso Prestazione Singola in Sede"
                                : "Registrazione Acconto / Quota su Investimento"}
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Aggiornamento istantaneo del registro di cassa e del saldo paziente
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddPaymentModal(false)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleRecordPayment} className="space-y-4">
                        {/* Selettore Investimento o Prestazione Singola */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Destinazione Contabile (Investimento / Percorso oppure Prestazione Singola)
                          </label>
                          <select
                            value={selectedPlanId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedPlanId(val);
                              if (val === "__single_visit__") {
                                setInstallmentType("saldo");
                              } else {
                                setInstallmentType("acconto");
                              }
                            }}
                            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-teal-700 focus:outline-hidden"
                          >
                            {activePlans.map((p) => {
                              const m = getPlanMetrics(p);
                              return (
                                <option key={p.id} value={p.id}>
                                  {p.title} — Concordato: €{m.total.toFixed(0)} · Versato: €
                                  {m.paid.toFixed(0)} · Saldo residuo: €{m.balance.toFixed(0)}
                                </option>
                              );
                            })}
                            <option value="__single_visit__">
                              Prestazione Singola in Sede — senza percorso pluriennale
                            </option>
                          </select>
                        </div>

                        {/* Box Riepilogo Saldo Percorso Selezionato oppure Titolo Prestazione Singola */}
                        {!isSingleVisitMode && selectedPlan ? (
                          <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 space-y-2">
                            <p className="text-xs font-bold text-[#1C4A5C]">
                              Totale concordato: €
                              {selectedPlanMetrics.total.toLocaleString("it-IT", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              · Già versato: €
                              {selectedPlanMetrics.paid.toLocaleString("it-IT", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              · Saldo residuo: €
                              {selectedPlanMetrics.balance.toLocaleString("it-IT", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-600">
                                Tipologia quota:
                              </span>
                              {(
                                [
                                  { id: "acconto", label: "Acconto / Parziale" },
                                  { id: "rata", label: "Rata Percorso" },
                                  { id: "saldo", label: "Saldo Finale" },
                                ] as const
                              ).map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setInstallmentType(t.id)}
                                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition-all ${
                                    installmentType === t.id
                                      ? "bg-[#1C4A5C] text-white border-[#1C4A5C]"
                                      : "bg-white text-slate-600 border-slate-300 hover:border-teal-600"
                                  }`}
                                >
                                  {t.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Descrizione Prestazione Eseguita in Sede
                            </label>
                            <input
                              type="text"
                              value={singleVisitTitle}
                              onChange={(e) => setSingleVisitTitle(e.target.value)}
                              placeholder="es. Visita Specialistica e Valutazione Clinica"
                              required
                              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-hidden"
                            />
                          </div>
                        )}

                        {/* Importo + Chip Rapidi */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Importo Incassato Oggi (€)
                          </label>

                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {isSingleVisitMode ? (
                              [90, 120, 150, 200].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setPaymentAmount(String(preset))}
                                  className={`rounded-lg border px-3 py-1 text-xs font-mono font-bold transition-all ${
                                    Number(paymentAmount) === preset
                                      ? "border-[#1C4A5C] bg-[#1C4A5C] text-white"
                                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-teal-50 hover:border-teal-300"
                                  }`}
                                >
                                  €{preset}
                                </button>
                              ))
                            ) : (
                              <>
                                {[150, 200, 300, 500].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      setPaymentAmount(String(preset));
                                      setInstallmentType(
                                        selectedPlanMetrics.balance > 0 &&
                                          preset >= selectedPlanMetrics.balance
                                          ? "saldo"
                                          : "acconto"
                                      );
                                    }}
                                    className={`rounded-lg border px-3 py-1 text-xs font-mono font-bold transition-all ${
                                      Number(paymentAmount) === preset
                                        ? "border-[#1C4A5C] bg-[#1C4A5C] text-white"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-teal-50 hover:border-teal-300"
                                    }`}
                                  >
                                    €{preset}
                                  </button>
                                ))}
                                {selectedPlanMetrics.balance > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPaymentAmount(String(selectedPlanMetrics.balance));
                                      setInstallmentType("saldo");
                                    }}
                                    className={`rounded-lg border px-3 py-1 text-xs font-mono font-bold transition-all ${
                                      Number(paymentAmount) === selectedPlanMetrics.balance
                                        ? "border-emerald-700 bg-emerald-700 text-white"
                                        : "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                                    }`}
                                  >
                                    Saldo residuo €
                                    {selectedPlanMetrics.balance.toLocaleString("it-IT", {
                                      minimumFractionDigits: 2,
                                    })}
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                              €
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Inserisci cifra libera (es. 250)"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              required
                              className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2.5 text-sm font-bold text-slate-900 font-mono focus:border-teal-700 focus:outline-hidden"
                            />
                          </div>

                          {!isSingleVisitMode && selectedPlan && typedAmountNum > 0 && (
                            <p className="text-[11px] text-teal-800 font-medium mt-1.5">
                              Proiezione post-incasso: Versato{" "}
                              <strong className="font-mono">
                                €
                                {(selectedPlanMetrics.paid + typedAmountNum).toLocaleString(
                                  "it-IT",
                                  { minimumFractionDigits: 2 }
                                )}
                              </strong>{" "}
                              · Nuovo saldo residuo:{" "}
                              <strong className="font-mono">
                                €
                                {Math.max(
                                  0,
                                  selectedPlanMetrics.balance - typedAmountNum
                                ).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                              </strong>
                            </p>
                          )}
                        </div>

                        {/* Metodo di Pagamento (6 opzioni) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Metodo di Pagamento
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {PAYMENT_METHODS.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setPaymentMethod(m.id)}
                                className={`rounded-xl border px-3 py-2 text-left transition-all ${
                                  paymentMethod === m.id
                                    ? "border-[#1C4A5C] bg-[#1C4A5C]/10 text-[#1C4A5C] shadow-2xs"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                <span className="block text-xs font-bold">{m.label}</span>
                                <span className="block text-[10px] text-slate-500">
                                  {m.sub}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Regime Fiscale Fatture in Cloud */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Regime Fiscale Fatture in Cloud
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setInvoiceMode("immediata")}
                              className={`rounded-xl border p-3 text-left transition-all ${
                                invoiceMode === "immediata"
                                  ? "border-[#1C4A5C] bg-teal-50/80 text-[#1C4A5C]"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="block text-xs font-bold">
                                Fattura immediata su questo incasso/acconto
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                Emissione fiscale contestuale e invio Sistema Tessera Sanitaria
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setInvoiceMode("saldo_assicurazione")}
                              className={`rounded-xl border p-3 text-left transition-all ${
                                invoiceMode === "saldo_assicurazione"
                                  ? "border-[#1C4A5C] bg-teal-50/80 text-[#1C4A5C]"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="block text-xs font-bold">
                                Accantona per Fattura cumulativa a saldo (Rimborso Assicurativo)
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                Registra ricevuta d&apos;acconto interna per fattura unica a fine cura
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Note Contabili */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Note / Riferimento Operazione (opzionale)
                          </label>
                          <input
                            type="text"
                            placeholder="es. Acconto Allineatori Trasparenti serie 1 — POS Desk"
                            value={paymentNotes}
                            onChange={(e) => setPaymentNotes(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-hidden"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                          {onOpenCassa ? (
                            <button
                              type="button"
                              onClick={onOpenCassa}
                              className="text-xs font-semibold text-teal-800 hover:underline"
                            >
                              Vai al Registro Cassa Giornaliero →
                            </button>
                          ) : (
                            <span />
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddPaymentModal(false)}
                              className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              Annulla
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmittingPayment}
                              className="rounded-xl bg-[#1C4A5C] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-900 transition-colors disabled:opacity-50"
                            >
                              {isSubmittingPayment
                                ? "Registrazione contabile..."
                                : "Conferma Incasso e Aggiorna Saldo"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Riepilogo Finanziario Rapido */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Totale Investimenti Concordati
                      </p>
                      <p className="mt-1 text-2xl font-bold font-serif text-slate-900">
                        €{totalDue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {plans.length} investimento/i o percorso/i
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
                        Quote residue su percorsi attivi
                      </p>
                    </div>

                    <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          Azioni Rapide Cassa
                        </p>
                        <p className="text-xs text-teal-900 font-semibold mt-1">
                          Acconto percorso o seduta singola
                        </p>
                      </div>
                      <div className="mt-2 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            openPaymentFormInMode(
                              activePlans.length > 0 ? "percorso" : "singola"
                            )
                          }
                          className="flex-1 rounded-lg bg-[#1C4A5C] py-1.5 px-2 text-xs font-semibold text-white shadow-2xs hover:bg-teal-900 transition-colors"
                        >
                          + Incassa Ora
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lista Investimenti & Percorsi Terapeutici con Barra di Avanzamento */}
                  {plans.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                      <CreditCard className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-slate-700">
                        Nessun investimento o percorso terapeutico pluriennale registrato
                      </p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Puoi incassare subito una prestazione singola in sede oppure registrare una visita inclusa nel Percorso Salute.
                      </p>
                      <button
                        type="button"
                        onClick={() => openPaymentFormInMode("singola")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1C4A5C] px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900 transition-colors"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        <span>Incassa Prestazione Singola</span>
                      </button>
                    </div>
                  ) : (
                    plans.map((p) => {
                      const pInst = installments.filter((i) => i.plan_id === p.id);
                      const { total: pTotal, paid: pPaid, balance: pBalance, pct: pPct } =
                        getPlanMetrics(p);

                      return (
                        <div
                          key={p.id}
                          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.5 text-xs font-mono font-bold">
                                  {p.plan_code || "PT-2026"}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 font-serif">
                                  {p.title}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Branca:{" "}
                                <strong className="text-slate-700">
                                  {p.description || "Clinica Specialistica"}
                                </strong>{" "}
                                · Stato:{" "}
                                <span className="font-semibold text-teal-700 capitalize">
                                  {(p.payment_status || "in_corso").replace(/_/g, " ")}
                                </span>
                              </p>
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-center">
                              {pBalance > 0 && (
                                <button
                                  type="button"
                                  onClick={() => openPaymentFormInMode("percorso", p.id)}
                                  className="rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-bold text-[#1C4A5C] hover:bg-teal-100 transition-colors"
                                >
                                  + Registra Acconto
                                </button>
                              )}
                              <div className="text-right">
                                <span className="text-xs text-slate-400 block uppercase">
                                  Investimento Netto
                                </span>
                                <span className="text-xl font-bold font-serif text-slate-900">
                                  €{pTotal.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                                </span>
                                {p.discount_amount > 0 && (
                                  <span className="text-[10px] text-emerald-700 block">
                                    Agevolazione Club: -€{p.discount_amount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ── BARRA DI AVANZAMENTO PAGAMENTO ── */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-semibold text-slate-700">
                                Avanzamento Saldo Investimento:
                              </span>
                              <span className="font-mono font-bold text-teal-900">
                                €{pPaid.toLocaleString("it-IT", { minimumFractionDigits: 2 })} / €
                                {pTotal.toLocaleString("it-IT", { minimumFractionDigits: 2 })} (
                                {pPct}%)
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
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                              <span>
                                Già versato:{" "}
                                <strong className="text-emerald-700 font-mono">
                                  €{pPaid.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                                </strong>
                              </span>
                              <span className="font-semibold text-amber-700 font-mono">
                                Saldo residuo: €
                                {pBalance.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          {/* Tabella Rate & Quote */}
                          <div className="mt-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Dettaglio Acconti, Rateizzazioni &amp; Ricevute
                            </h4>
                            <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                  <tr>
                                    <th className="py-2.5 px-3 font-semibold">Quota / Ricevuta</th>
                                    <th className="py-2.5 px-3 font-semibold">Data</th>
                                    <th className="py-2.5 px-3 font-semibold">Importo</th>
                                    <th className="py-2.5 px-3 font-semibold">Metodo</th>
                                    <th className="py-2.5 px-3 font-semibold">Stato</th>
                                    <th className="py-2.5 px-3 font-semibold">Incassato il</th>
                                    <th className="py-2.5 px-3 font-semibold">Note</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {pInst.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={7}
                                        className="py-4 text-center text-slate-400"
                                      >
                                        Nessuna quota memorizzata per questo percorso.
                                      </td>
                                    </tr>
                                  ) : (
                                    pInst.map((inst) => (
                                      <tr key={inst.id} className="hover:bg-slate-50/80">
                                        <td className="py-2.5 px-3 font-semibold">
                                          <span className="block">
                                            #{inst.installment_number} ({inst.installment_type})
                                          </span>
                                          {inst.receipt_number && (
                                            <span className="text-[10px] font-mono text-teal-700">
                                              {inst.receipt_number}
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-slate-500">
                                          {inst.due_date || "N/A"}
                                        </td>
                                        <td className="py-2.5 px-3 font-bold font-mono text-slate-900">
                                          €
                                          {Number(inst.amount).toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                          })}
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
                                          ) : inst.status === "annullato" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-200">
                                              Assorbita da saldo
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
                                        <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-[200px] truncate">
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

                  {/* Eventuali Prestazioni Singole / Sedute Club senza Percorso pluriennale associato */}
                  {unlinkedInstallments.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-sm font-bold text-slate-900 font-serif">
                          Prestazioni Singole &amp; Sedute Percorso Salute Registrate
                        </h3>
                        <span className="text-xs font-mono text-teal-800 font-bold">
                          {unlinkedInstallments.length} movimenti
                        </span>
                      </div>
                      <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3 font-semibold">Data</th>
                              <th className="py-2 px-3 font-semibold">Descrizione / Note</th>
                              <th className="py-2 px-3 font-semibold">Metodo</th>
                              <th className="py-2 px-3 font-semibold text-right">Importo</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {unlinkedInstallments.map((inst) => (
                              <tr key={inst.id} className="hover:bg-slate-50/80">
                                <td className="py-2 px-3 font-mono text-slate-500">
                                  {inst.paid_at
                                    ? new Date(inst.paid_at).toLocaleDateString("it-IT")
                                    : inst.due_date || "—"}
                                </td>
                                <td className="py-2 px-3">
                                  {inst.label || inst.notes || "Prestazione in sede"}
                                </td>
                                <td className="py-2 px-3 uppercase font-semibold text-[10px]">
                                  {inst.payment_method || "—"}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  €
                                  {Number(inst.amount || 0).toLocaleString("it-IT", {
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Nome Completo
                        </span>
                        <span className="text-slate-900 font-bold text-sm">
                          {patient.first_name} {patient.last_name}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Codice Paziente
                        </span>
                        <span className="text-teal-800 font-mono font-bold text-sm">
                          {patient.patient_code}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Codice Fiscale
                        </span>
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
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Telefono / WhatsApp
                        </span>
                        <span className="text-slate-700 font-mono">
                          {patient.phone || "Non inserito"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Genere / Sesso
                        </span>
                        <span className="text-slate-700 capitalize">
                          {patient.gender || "Non specificato"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Indirizzo Residenza
                        </span>
                        <span className="text-slate-700">
                          {patient.address
                            ? `${patient.address}, ${patient.city || ""}`
                            : "Via non registrata"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Data Registrazione
                        </span>
                        <span className="text-slate-700 font-mono">
                          {patient.created_at
                            ? new Date(patient.created_at).toLocaleDateString("it-IT")
                            : "Recente"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">
                          Stato Dossier
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Verificato Direzione
                        </span>
                      </div>
                    </div>

                    {/* Note Cliniche Interne */}
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                        Note Cliniche Interne &amp; Percorso Salute
                      </span>
                      <div className="rounded-xl bg-teal-50/60 border border-teal-100 p-3 text-xs text-teal-950 italic">
                        {patient.notes ||
                          "Nessuna nota clinica particolare registrata per questo paziente."}
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
                            <p className="font-semibold text-slate-800 text-[11px]">
                              Trattamento Dati Sanitari
                            </p>
                            <p className="text-[10px] text-slate-500">Acquisito e conforme</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 text-[11px]">
                              Consenso WhatsApp
                            </p>
                            <p className="text-[10px] text-slate-500">Promemoria visite attivo</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                          <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 text-[11px]">
                              Fascicolo Elettronico
                            </p>
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
                        const cleanNotes = cleanVisitNotes(a.notes);

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
                                  Medico:{" "}
                                  <strong>
                                    {a.doctors?.full_name || "Specialista Cocoora"}
                                  </strong>{" "}
                                  · Stanza:{" "}
                                  <strong>{a.clinic_rooms?.name || "Studio 1"}</strong>
                                </p>
                                {cleanNotes && (
                                  <p className="text-[11px] text-slate-500 mt-1 italic">
                                    Note: {cleanNotes}
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
                                  Codice:{" "}
                                  <strong className="font-mono text-teal-800">
                                    {doc.document_code}
                                  </strong>{" "}
                                  · Branca: {doc.specialty} · Medico: {doc.doctor_name}
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
            <span>
              Fascicolo Clinico Riservato — Conforme GDPR &amp; Autorizzazione Sanitaria
            </span>
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
                  placeholder="es. Controllo Cambio Allineatori Trasparenti e Igiene Orale"
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
                    <option value="Odontoiatria & Ortodonzia">Odontoiatria &amp; Ortodonzia</option>
                    <option value="Medicina Rigenerativa & Anti-Aging">
                      Medicina Rigenerativa
                    </option>
                    <option value="Nutrizione & Longevità">Nutrizione &amp; Longevità</option>
                    <option value="Salute Donna & Senologia">Salute Donna &amp; Senologia</option>
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
                  Diagnosi / Esito dell&apos;Esame
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
                <span className="text-slate-400 block text-[10px] uppercase">
                  Medico Refertatore
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {selectedDocPreview.doctor_name}
                </span>
                <p className="text-teal-800 text-[11px] font-semibold mt-0.5">
                  Branca: {selectedDocPreview.specialty}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-teal-950 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 mb-2">
                  Oggetto della Prestazione Clinica: {selectedDocPreview.title}
                </h3>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  Diagnosi &amp; Rilievi Clinici:
                </h4>
                <div className="rounded-lg bg-white border border-slate-200 p-3 text-slate-700 leading-relaxed text-xs">
                  {selectedDocPreview.diagnosis}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  Prescrizioni &amp; Raccomandazioni Terapeutiche:
                </h4>
                <div className="rounded-lg bg-teal-50/50 border border-teal-100 p-3 text-teal-950 leading-relaxed text-xs">
                  {selectedDocPreview.recommendations}
                </div>
              </div>
            </div>

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
