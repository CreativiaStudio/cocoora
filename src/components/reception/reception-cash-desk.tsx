"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Filter,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReceptionCashDeskProps {
  onOpenPatient?: (patientId: string) => void;
}

export function ReceptionCashDesk({ onOpenPatient }: ReceptionCashDeskProps) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [methodFilter, setMethodFilter] = useState<"tutti" | "pos" | "bonifico" | "contanti">("tutti");
  const [search, setSearch] = useState("");

  // Modal Nuovo Incasso
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"pos" | "bonifico" | "contanti">("pos");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: plansData } = await supabase
        .from("patient_treatment_plans")
        .select("*, patient_profiles(id, patient_code, first_name, last_name, phone, email)")
        .order("created_at", { ascending: false });

      const { data: instData } = await supabase
        .from("treatment_installments")
        .select("*, patient_profiles(id, patient_code, first_name, last_name)")
        .order("created_at", { ascending: false });

      const { data: ptsData } = await supabase
        .from("patient_profiles")
        .select("id, patient_code, first_name, last_name, phone, email")
        .order("last_name");

      if (plansData) setPlans(plansData);
      if (instData) setInstallments(instData);
      if (ptsData) {
        setPatients(ptsData);
        if (ptsData.length > 0 && !selectedPatientId) {
          setSelectedPatientId(ptsData[0].id);
        }
      }
    } catch (e) {
      console.error("Errore fetch cassa desk:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      const patientPlans = plans.filter((p) => p.patient_id === selectedPatientId);
      if (patientPlans.length > 0) {
        setSelectedPlanId(patientPlans[0].id);
      } else {
        setSelectedPlanId("");
      }
    }
  }, [selectedPatientId, plans]);

  // Registrazione Incasso
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Inserisci un importo valido");
      return;
    }

    try {
      setIsSubmitting(true);
      const nowIso = new Date().toISOString();
      const targetPlan = plans.find((p) => p.id === selectedPlanId);

      await supabase.from("treatment_installments").insert({
        plan_id: targetPlan ? targetPlan.id : null,
        patient_id: selectedPatientId,
        installment_number: installments.length + 1,
        installment_type: "rata",
        amount: amountNum,
        due_date: nowIso.split("T")[0],
        status: "pagato",
        payment_method: method,
        paid_at: nowIso,
        notes: notes || `Incasso cassa reception (${method.toUpperCase()})`,
      });

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

      setAmount("");
      setNotes("");
      setShowAddModal(false);
      await fetchData();
    } catch (err: any) {
      console.error("Errore salvataggio incasso desk:", err);
      alert("Errore salvataggio: " + (err.message || "Riprova"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcoli finanziari
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTransactions = installments.filter(
    (i) => i.status === "pagato" && (i.paid_at?.startsWith(todayStr) || i.due_date === todayStr)
  );

  const todayPos = todayTransactions
    .filter((i) => i.payment_method === "pos")
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);

  const todayCash = todayTransactions
    .filter((i) => i.payment_method === "contanti")
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);

  const todayBank = todayTransactions
    .filter((i) => i.payment_method === "bonifico")
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);

  const todayTotal = todayPos + todayCash + todayBank;

  // Totali complessivi
  const allPaidTransactions = installments.filter((i) => i.status === "pagato");
  const filteredTransactions = allPaidTransactions.filter((t) => {
    if (methodFilter === "tutti") return true;
    return t.payment_method?.toLowerCase() === methodFilter;
  });

  const filteredPlans = plans.filter((p) => {
    const q = search.toLowerCase();
    const name = `${p.patient_profiles?.first_name || ""} ${p.patient_profiles?.last_name || ""}`.toLowerCase();
    const code = p.patient_profiles?.patient_code?.toLowerCase() || "";
    const title = p.title?.toLowerCase() || "";
    return name.includes(q) || code.includes(q) || title.includes(q);
  });

  // Export CSV Chiusura Cassa
  const handleExportDailyClosing = () => {
    const rows = [
      ["COCOORA CENTRO MEDICO — CHIUSURA CASSA GIORNALIERA RECEPTION"],
      ["Data Chiusura:", new Date().toLocaleDateString("it-IT")],
      ["Operatore:", "Segreteria Operativa Front-Desk"],
      [""],
      ["METODO", "IMPORTO TOTALE"],
      ["POS (Carta / Bancomat)", `EUR ${todayPos.toFixed(2)}`],
      ["Contanti (Cassa Desk)", `EUR ${todayCash.toFixed(2)}`],
      ["Bonifici Verificati", `EUR ${todayBank.toFixed(2)}`],
      ["TOTALE COMPLESSIVO GIORNATA", `EUR ${todayTotal.toFixed(2)}`],
      [""],
      ["DETTAGLIO TRANSAZIONI DI OGGI:"],
      ["Ora", "Paziente", "Codice", "Metodo", "Importo", "Note"],
      ...todayTransactions.map((t) => [
        t.paid_at ? new Date(t.paid_at).toLocaleTimeString("it-IT") : "—",
        `"${t.patient_profiles?.first_name || ""} ${t.patient_profiles?.last_name || ""}"`,
        t.patient_profiles?.patient_code || "",
        t.payment_method?.toUpperCase() || "POS",
        t.amount,
        `"${(t.notes || "").replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chiusura_cassa_reception_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER CASSA DESK & QUADRATURA GIORNALIERA ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-xs">
                💳
              </span>
              <h1 className="font-serif text-2xl font-bold text-slate-900">
                Cassa Desk &amp; Chiusura Giornaliera
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quadratura incassi del giorno al banco, registrazione quote su piani terapeutici e rendicontazione contabile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportDailyClosing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Esporta Chiusura Cassa (CSV)</span>
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Registra Incasso Quota</span>
            </button>
          </div>
        </div>

        {/* ── QUADRATURA CASSA DEL GIORNO (PER SIMONE / AMMINISTRAZIONE) ── */}
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Riepilogo Quadratura Giornaliera (Oggi)
              </span>
              <p className="text-xs text-emerald-950 font-semibold">
                Totale movimenti registrati al banco reception
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-700 font-medium">Totale Incassato Oggi:</span>
              <span className="text-2xl font-bold font-serif text-emerald-950 ml-2">
                €{todayTotal.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-sky-800 block">
                Totale POS / Carte
              </span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                €{todayPos.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Da riscontrare con scontrino POS serale
              </p>
            </div>

            <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Totale Contanti
              </span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                €{todayCash.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Presenti fisicamente nel cassetto desk
              </p>
            </div>

            <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-purple-800 block">
                Totale Bonifici
              </span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                €{todayBank.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Accreditati su conto corrente studio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEZIONE AVANZAMENTO PAGAMENTI PIANI DEI CLIENTI ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Avanzamento Pagamenti Piani Terapeutici
            </h2>
            <p className="text-xs text-slate-500">
              Controllo immediato delle quote versate e dei saldi residui per rispondere al volo ai pazienti allo sportello.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca paziente o trattamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden w-64"
            />
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {filteredPlans.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nessun piano o paziente trovato con i filtri correnti.
            </p>
          ) : (
            filteredPlans.map((p) => {
              const pTotal = Number(p.net_total || p.total_amount || 0);
              const pPaid = Number(p.paid_total || 0);
              const pBalance = Math.max(0, pTotal - pPaid);
              const pct = pTotal > 0 ? Math.min(100, Math.round((pPaid / pTotal) * 100)) : 0;
              const patientName = `${p.patient_profiles?.first_name || ""} ${p.patient_profiles?.last_name || ""}`;

              return (
                <div
                  key={p.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-[280px]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs">
                      {p.patient_profiles?.first_name?.[0]}
                      {p.patient_profiles?.last_name?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{patientName}</span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                          {p.patient_profiles?.patient_code}
                        </span>
                      </div>
                      <p className="text-xs text-teal-900 font-medium mt-0.5 font-serif">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.description || "Odontoiatria / Medicina Estetica"} · Tel: {p.patient_profiles?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Barra Avanzamento */}
                  <div className="flex-1 max-w-md px-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Progressione Pagamento:</span>
                      <span className="font-mono font-bold text-slate-900">
                        €{pPaid.toLocaleString("it-IT")} / €{pTotal.toLocaleString("it-IT")} ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-teal-600" : "bg-amber-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Versato: <strong className="text-emerald-700 font-mono">€{pPaid.toLocaleString("it-IT")}</strong></span>
                      <span>Residuo: <strong className="text-amber-700 font-mono">€{pBalance.toLocaleString("it-IT")}</strong></span>
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
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors"
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
                        Cartella →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── REGISTRO INCASSI RECENTI AL BANCO ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Registro Cronologico Movimenti Cassa Desk
            </h2>
            <p className="text-xs text-slate-500">
              Tutte le operazioni registrate al banco con POS, contanti o bonifici verificati.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs">
            {(["tutti", "pos", "bonifico", "contanti"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`rounded-md px-2.5 py-1 font-semibold uppercase text-[11px] transition-all ${
                  methodFilter === m
                    ? "bg-white text-emerald-900 shadow-2xs font-bold"
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
                <th className="py-2.5 px-3 font-semibold text-right">Importo Incassato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Nessun movimento registrato con il filtro selezionato.
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
                      <span className="font-bold text-slate-900 block">
                        {t.patient_profiles?.first_name} {t.patient_profiles?.last_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.patient_profiles?.patient_code}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          t.payment_method === "pos"
                            ? "bg-sky-50 text-sky-800 border border-sky-200"
                            : t.payment_method === "bonifico"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {t.payment_method || "POS"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs max-w-xs">
                      {t.notes || "Incasso prestazione clinica"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-sm text-emerald-700">
                        +€{Number(t.amount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Registra Incasso Quota al Banco
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
                  Piano Terapeutico Associato
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {plans
                    .filter((p) => p.patient_id === selectedPatientId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Residuo: €{(p.net_total - (p.paid_total || 0)).toFixed(0)})
                      </option>
                    ))}
                  {plans.filter((p) => p.patient_id === selectedPatientId).length === 0 && (
                    <option value="">Nessun piano (Visita singola o acconto generico)</option>
                  )}
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-sm font-bold text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metodo di Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["pos", "contanti", "bonifico"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`rounded-lg border py-2 text-xs font-bold uppercase transition-all ${
                        method === m
                          ? "border-emerald-700 bg-emerald-50 text-emerald-900 shadow-2xs"
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
                  Note Ricevuta / Causale
                </label>
                <input
                  type="text"
                  placeholder="es. Quota controllo mensile al banco POS"
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
                  className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Registrazione..." : "Registra Incasso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
