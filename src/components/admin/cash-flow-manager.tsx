"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  TrendingUp,
  X,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CashFlowManagerProps {
  onOpenPatient?: (patientId: string) => void;
}

type CashMethod = "pos" | "contanti" | "klarna" | "stripe" | "paypal" | "bonifico";
type FilterMethod = "tutti" | "pos" | "contanti" | "klarna" | "stripe" | "bonifico";

const CASH_METHODS: { id: CashMethod; label: string }[] = [
  { id: "pos", label: "POS / Carta" },
  { id: "contanti", label: "Contanti" },
  { id: "klarna", label: "Klarna" },
  { id: "stripe", label: "Stripe" },
  { id: "paypal", label: "PayPal" },
  { id: "bonifico", label: "Bonifico" },
];

export function CashFlowManager({ onOpenPatient }: CashFlowManagerProps) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [methodFilter, setMethodFilter] = useState<FilterMethod>("tutti");
  const [search, setSearch] = useState("");

  // Modal Nuovo Incasso
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [singleVisitTitle, setSingleVisitTitle] = useState(
    "Prestazione Specialistica in Sede"
  );
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<CashMethod>("pos");
  const [invoiceType, setInvoiceType] = useState<
    "immediata" | "saldo_assicurazione"
  >("immediata");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [deskSettled, sbPlansSettled, sbInstSettled, sbPtsSettled] =
        await Promise.allSettled([
          fetch("/api/reception/desk", { cache: "no-store" }).then((r) =>
            r.ok ? r.json() : null
          ),
          supabase
            .from("patient_treatment_plans")
            .select(
              "*, patient_profiles(id, patient_code, first_name, last_name, phone, email)"
            )
            .order("created_at", { ascending: false }),
          supabase
            .from("treatment_installments")
            .select("*, patient_profiles(id, patient_code, first_name, last_name)")
            .order("created_at", { ascending: false }),
          supabase
            .from("patient_profiles")
            .select("id, patient_code, first_name, last_name, phone, email")
            .order("last_name"),
        ]);

      const deskData = deskSettled.status === "fulfilled" ? deskSettled.value : null;
      const sbPlans =
        sbPlansSettled.status === "fulfilled" ? sbPlansSettled.value.data || [] : [];
      const sbInst =
        sbInstSettled.status === "fulfilled" ? sbInstSettled.value.data || [] : [];
      const sbPts =
        sbPtsSettled.status === "fulfilled" ? sbPtsSettled.value.data || [] : [];

      const ptsList: any[] =
        Array.isArray(deskData?.patients) && deskData.patients.length > 0
          ? deskData.patients
          : sbPts;

      const ptsMap = new Map<string, any>();
      for (const p of ptsList) {
        if (p?.id) ptsMap.set(p.id, p);
      }

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

      const rawPlans = mergeById(
        Array.isArray(deskData?.plans) ? deskData.plans : [],
        sbPlans
      );
      const enrichedPlans = rawPlans
        .map((pl) => ({
          ...pl,
          patient_profiles: pl.patient_profiles || ptsMap.get(pl.patient_id) || null,
        }))
        .sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );

      const rawInst = mergeById(
        Array.isArray(deskData?.installments) ? deskData.installments : [],
        sbInst
      );
      const enrichedInst = rawInst
        .map((i) => ({
          ...i,
          patient_profiles: i.patient_profiles || ptsMap.get(i.patient_id) || null,
        }))
        .sort(
          (a, b) =>
            new Date(b.paid_at || b.created_at || b.due_date || 0).getTime() -
            new Date(a.paid_at || a.created_at || a.due_date || 0).getTime()
        );

      setPlans(enrichedPlans);
      setInstallments(enrichedInst);
      setPatients(ptsList);

      if (ptsList.length > 0 && !selectedPatientId) {
        setSelectedPatientId(ptsList[0].id);
      }
    } catch (e) {
      console.error("Errore fetch cassa:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Aggiorna percorso selezionato quando cambia il paziente nel modal
  useEffect(() => {
    if (selectedPatientId) {
      const patientPlans = plans.filter(
        (p) => p.patient_id === selectedPatientId && p.status !== "annullato"
      );
      if (patientPlans.length > 0) {
        setSelectedPlanId((prev) =>
          prev === "__single_visit__" || patientPlans.some((p) => p.id === prev)
            ? prev || patientPlans[0].id
            : patientPlans[0].id
        );
      } else {
        setSelectedPlanId("__single_visit__");
      }
    }
  }, [selectedPatientId, plans]);

  // Registrazione Nuovo Incasso tramite POST /api/reception/desk
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Inserisci un importo valido");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackBanner(null);

      const isSingle = !selectedPlanId || selectedPlanId === "__single_visit__";
      const targetPlan = !isSingle ? plans.find((p) => p.id === selectedPlanId) : null;
      const targetBalance = targetPlan
        ? Math.max(
            0,
            Number(targetPlan.net_total || targetPlan.total_amount || 0) -
              Number(targetPlan.paid_total || 0)
          )
        : 0;
      const computedInstallmentType = isSingle
        ? "saldo"
        : targetBalance > 0 && amountNum >= targetBalance
        ? "saldo"
        : "acconto";

      const res = await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_payment",
          patientId: selectedPatientId,
          planId: isSingle ? null : selectedPlanId,
          singleVisitTitle: isSingle
            ? singleVisitTitle.trim() || "Prestazione Specialistica in Sede"
            : undefined,
          amount: amountNum,
          paymentMethod: method,
          installmentType: computedInstallmentType,
          invoiceMode: invoiceType,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || "Errore durante la registrazione contabile");
      }

      const receiptNum =
        data.receiptNumber ||
        data.receipt_number ||
        data.installment?.receipt_number ||
        "";

      setAmount("");
      setNotes("");
      setShowAddModal(false);
      setFeedbackBanner({
        type: "success",
        text: `✓ Incasso di €${amountNum.toLocaleString("it-IT", { minimumFractionDigits: 2 })} (${method.toUpperCase()}) registrato correttamente${receiptNum ? ` — Ricevuta ${receiptNum}` : ""}.`,
      });
      await fetchData();
    } catch (err: any) {
      console.error("Errore registrazione incasso:", err);
      setFeedbackBanner({
        type: "error",
        text: "Errore registrazione: " + (err.message || "Riprova"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcoli metriche finanziarie
  const totalContracted = plans.reduce(
    (acc, p) => acc + Number(p.net_total || p.total_amount || 0),
    0
  );
  const paidTransactions = installments.filter((i) => i.status === "pagato");
  const totalCollected = paidTransactions.reduce(
    (acc, i) => acc + Number(i.amount || 0),
    0
  );
  const totalReceivables = Math.max(0, totalContracted - totalCollected);

  // Filtro movimenti per metodo
  const filteredTransactions = paidTransactions.filter((t) => {
    if (methodFilter === "tutti") return true;
    return t.payment_method?.toLowerCase() === methodFilter;
  });

  // Filtro percorsi per ricerca paziente
  const filteredPlans = plans.filter((p) => {
    const q = search.toLowerCase();
    const name = `${p.patient_profiles?.first_name || ""} ${p.patient_profiles?.last_name || ""}`.toLowerCase();
    const code = p.patient_profiles?.patient_code?.toLowerCase() || "";
    const title = p.title?.toLowerCase() || "";
    return name.includes(q) || code.includes(q) || title.includes(q);
  });

  // Esportazione CSV
  const handleExportCsv = () => {
    const headers = ["Data", "Paziente", "Codice", "Importo", "Metodo", "Note"];
    const rows = paidTransactions.map((t) => [
      t.paid_at ? new Date(t.paid_at).toLocaleDateString("it-IT") : t.due_date,
      `"${t.patient_profiles?.first_name || ""} ${t.patient_profiles?.last_name || ""}"`,
      t.patient_profiles?.patient_code || "",
      t.amount,
      t.payment_method || "POS",
      `"${(t.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `flusso_cassa_cocoora_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const patientPlansForModal = plans.filter(
    (p) => p.patient_id === selectedPatientId && p.status !== "annullato"
  );

  return (
    <div className="space-y-6">
      {feedbackBanner && (
        <div
          className={`rounded-xl border p-3.5 flex items-center justify-between text-xs ${
            feedbackBanner.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {feedbackBanner.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── HEADER MODULO CASSA ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-800 text-white font-bold text-xs">
                €
              </span>
              <h1 className="font-serif text-2xl font-bold text-slate-900">
                Gestione Cassa &amp; Flussi Finanziari
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitoraggio incassi, investimenti pluriennali, rateizzazioni e avanzamento saldi per singolo paziente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Esporta Report CSV</span>
            </button>

            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Aggiorna</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Registra Incasso / Acconto</span>
            </button>
          </div>
        </div>

        {/* ── METRICHE KPI CASSA ── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Totale Incassato Effettivo
              </span>
              <ArrowDownRight className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-emerald-950">
              €{totalCollected.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              {paidTransactions.length} transazioni registrate
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Crediti da Incassare (Residuo)
              </span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-amber-950">
              €{totalReceivables.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Quote e rate programmate in corso
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Volume Investimenti Concordati
              </span>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-slate-900">
              €{totalContracted.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {plans.length} investimenti e percorsi a tariffario netto
            </p>
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                Fatturazione &amp; Assicurazioni
              </span>
              <Receipt className="h-4 w-4 text-teal-700" />
            </div>
            <p className="mt-2 text-sm font-bold text-teal-950">
              Regime Istituzionale Flessibile
            </p>
            <p className="text-[11px] text-teal-800 mt-1">
              Fatture su acconti immediati oppure a saldo fine trattamento per rimborso polizze sanitarie.
            </p>
          </div>
        </div>
      </div>

      {/* ── SEZIONE 1: AVANZAMENTO PAGAMENTI PER SINGOLO CLIENTE ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Avanzamento Investimenti &amp; Percorsi per Singolo Paziente
            </h2>
            <p className="text-xs text-slate-500">
              Barra visiva di progressione saldi per monitorare gli acconti e le rate residue di ogni percorso.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca paziente o percorso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden w-64"
            />
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {loading ? (
            <p className="py-8 text-center text-xs text-slate-500">
              Caricamento posizioni finanziarie...
            </p>
          ) : filteredPlans.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nessun investimento o paziente trovato con i criteri inseriti.
            </p>
          ) : (
            filteredPlans.map((p) => {
              const pTotal = Number(p.net_total || p.total_amount || 0);
              const pPaid = Number(p.paid_total || 0);
              const pBalance = Math.max(0, pTotal - pPaid);
              const pct =
                pTotal > 0 ? Math.min(100, Math.round((pPaid / pTotal) * 100)) : 0;
              const patientName = `${p.patient_profiles?.first_name || ""} ${p.patient_profiles?.last_name || ""}`;

              return (
                <div
                  key={p.id}
                  className="py-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-[280px]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs">
                      {p.patient_profiles?.first_name?.[0]}
                      {p.patient_profiles?.last_name?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {patientName}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                          {p.patient_profiles?.patient_code}
                        </span>
                        {patientName.includes("(demo)") ? (
                          <span className="rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2">
                            DEMO
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-bold px-1.5 py-0.2 flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse"></span>
                            REALE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-teal-900 font-medium mt-0.5 font-serif">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.description || "Odontoiatria / Medicina Estetica"} · Tel:{" "}
                        {p.patient_profiles?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* ── BARRA DI AVANZAMENTO PAGAMENTO ── */}
                  <div className="flex-1 max-w-md px-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">
                        Progressione Saldo:
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        €{pPaid.toLocaleString("it-IT")} / €{pTotal.toLocaleString("it-IT")}{" "}
                        ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct === 100
                            ? "bg-emerald-500"
                            : pct >= 50
                            ? "bg-teal-600"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>
                        Versato:{" "}
                        <strong className="text-emerald-700 font-mono">
                          €{pPaid.toLocaleString("it-IT")}
                        </strong>
                      </span>
                      <span>
                        Residuo:{" "}
                        <strong className="text-amber-700 font-mono">
                          €{pBalance.toLocaleString("it-IT")}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(p.patient_id);
                        setSelectedPlanId(p.id);
                        setShowAddModal(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Registra Quota</span>
                    </button>

                    {onOpenPatient && (
                      <button
                        type="button"
                        onClick={() => onOpenPatient(p.patient_id)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Apri Cartella →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── SEZIONE 2: REGISTRO MOVIMENTI DI CASSA & TRANSAZIONI RECENTI ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Registro Cronologico Movimenti di Cassa
            </h2>
            <p className="text-xs text-slate-500">
              Elenco analitico di tutti gli incassi eseguiti con POS, Contanti, Klarna, Stripe o Bonifico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs">
            {(
              ["tutti", "pos", "contanti", "klarna", "stripe", "bonifico"] as const
            ).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`rounded-md px-2.5 py-1 font-semibold uppercase text-[11px] transition-all ${
                  methodFilter === m
                    ? "bg-white text-teal-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Data &amp; Ora</th>
                <th className="py-2.5 px-3 font-semibold">Paziente</th>
                <th className="py-2.5 px-3 font-semibold">Metodo</th>
                <th className="py-2.5 px-3 font-semibold">Causale &amp; Note</th>
                <th className="py-2.5 px-3 font-semibold">Regime Fiscale</th>
                <th className="py-2.5 px-3 font-semibold text-right">Importo Incassato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nessun movimento di cassa registrato per il filtro selezionato.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {t.paid_at
                        ? new Date(t.paid_at).toLocaleString("it-IT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : t.due_date || "—"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 block">
                          {t.patient_profiles?.first_name} {t.patient_profiles?.last_name}
                        </span>
                        {t.patient_profiles?.last_name?.includes("(demo)") && (
                          <span className="rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.patient_profiles?.patient_code}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          t.payment_method === "pos"
                            ? "bg-sky-50 text-sky-800 border-sky-200"
                            : t.payment_method === "bonifico"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : t.payment_method === "klarna" || t.payment_method === "stripe"
                            ? "bg-pink-50 text-pink-800 border-pink-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {t.payment_method || "POS"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs max-w-xs">
                      {t.notes || t.label || "Incasso prestazione clinica"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        <Receipt className="h-3 w-3 text-teal-700" />
                        Fatturazione Elettronica
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-sm text-emerald-700">
                        +€
                        {Number(t.amount).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL REGISTRA INCASSO / QUOTA ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Registra Nuovo Incasso di Cassa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seleziona Paziente
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
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
                  Investimento / Percorso Associato
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {patientPlansForModal.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Residuo: €
                      {Math.max(
                        0,
                        Number(p.net_total || p.total_amount || 0) -
                          Number(p.paid_total || 0)
                      ).toFixed(0)}
                      )
                    </option>
                  ))}
                  <option value="__single_visit__">
                    Prestazione Singola in Sede (senza percorso pluriennale)
                  </option>
                </select>
              </div>

              {selectedPlanId === "__single_visit__" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrizione Prestazione Singola
                  </label>
                  <input
                    type="text"
                    value={singleVisitTitle}
                    onChange={(e) => setSingleVisitTitle(e.target.value)}
                    placeholder="es. Visita Specialistica in Sede"
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              )}

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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-sm font-bold text-slate-900 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Acconti liberi e rate flessibili su investimenti pluriennali o sedute singole.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metodo di Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CASH_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`rounded-lg border py-2 px-2 text-xs font-bold transition-all ${
                        method === m.id
                          ? "border-teal-700 bg-teal-50 text-teal-900 shadow-2xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Regime di Fatturazione
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setInvoiceType("immediata")}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      invoiceType === "immediata"
                        ? "border-teal-700 bg-teal-50 text-teal-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Fattura Immediata</span>
                    <span className="block text-[10px] font-normal text-slate-500">
                      Emissione contestuale
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInvoiceType("saldo_assicurazione")}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      invoiceType === "saldo_assicurazione"
                        ? "border-teal-700 bg-teal-50 text-teal-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Fattura a Saldo</span>
                    <span className="block text-[10px] font-normal text-slate-500">
                      Per rimborso polizza sanitaria
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note / Riferimento Ricevuta
                </label>
                <input
                  type="text"
                  placeholder="es. Quota mensile Allineatori Trasparenti — POS cassa 1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Registrazione..." : "Registra e Aggiorna Cassa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
