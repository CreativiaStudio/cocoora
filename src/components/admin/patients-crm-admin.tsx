"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  FileText,
  Printer,
  RefreshCw,
  Search,
  Stethoscope,
  User,
  Users,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { PatientDetailModal } from "./patient-detail-modal";

interface PatientsCrmAdminProps {
  onOpenCassa?: () => void;
}

export function PatientsCrmAdmin({ onOpenCassa }: PatientsCrmAdminProps) {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Prova via API
      try {
        const res = await fetch("/api/reception/desk");
        if (res.ok) {
          const data = await res.json();
          if (data.patients) setPatients(data.patients);
          if (data.documents) setDocuments(data.documents);
          if (data.installments) setInstallments(data.installments);
          return;
        }
      } catch {
        // Fallback diretto database clinico
      }

      // 2. Query diretta al database clinico
      const { data: pts } = await supabase
        .from("patient_profiles")
        .select("*")
        .order("last_name", { ascending: true });

      const { data: docs } = await supabase
        .from("clinical_documents")
        .select("*")
        .order("report_date", { ascending: false });

      const { data: inst } = await supabase
        .from("treatment_installments")
        .select("*")
        .order("due_date", { ascending: true });

      const { data: plns } = await supabase
        .from("patient_treatment_plans")
        .select("*");

      if (pts) setPatients(pts);
      if (docs) setDocuments(docs);
      if (inst) setInstallments(inst);
      if (plns) setPlans(plns);
    } catch (e) {
      console.error("Errore fetch admin patients:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(q) ||
      p.last_name?.toLowerCase().includes(q) ||
      p.patient_code?.toLowerCase().includes(q) ||
      p.fiscal_code?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* Header Tab CRM Pazienti */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-800 text-white font-bold text-xs">
                👥
              </span>
              <h2 className="font-serif text-xl font-bold text-slate-900">
                CRM Pazienti &amp; Fascicoli Clinici
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registro centrale assistiti: anagrafiche, percorsi attivi, avanzamento saldi e consultazione cartelle cliniche.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca per nome o CF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden w-56 sm:w-64"
              />
            </div>
            <Button size="sm" variant="outline" onClick={fetchData} className="gap-1.5 text-xs">
              <RefreshCw className="h-3 w-3" />
              Aggiorna
            </Button>
          </div>
        </div>

        {/* Tabella / Lista Pazienti */}
        <div className="mt-4 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-teal-700 border-t-transparent mb-2"></span>
              <p>Caricamento anagrafiche dal registro sanitario...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nessun paziente trovato con i parametri di ricerca.
            </p>
          ) : (
            filteredPatients.map((p) => {
              const pDocs = documents.filter((d) => d.patient_id === p.id);
              const pInst = installments.filter((i) => i.patient_id === p.id);
              const totalDue = pInst.reduce((acc, i) => acc + Number(i.amount || 0), 0);
              const totalPaid = pInst
                .filter((i) => i.status === "pagato")
                .reduce((acc, i) => acc + Number(i.amount || 0), 0);
              const balance = Math.max(0, totalDue - totalPaid);
              const pct = totalDue > 0 ? Math.min(100, Math.round((totalPaid / totalDue) * 100)) : 0;

              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors cursor-pointer group"
                  onClick={() => setSelectedPatient(p)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs group-hover:bg-teal-700 group-hover:text-white transition-colors">
                      {p.first_name?.[0]}
                      {p.last_name?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                          {p.first_name} {p.last_name}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                          {p.patient_code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Email: {p.email || "Non inserita"} · Tel: {p.phone || "Non inserito"} · CF: <span className="font-mono">{p.fiscal_code || "N/A"}</span>
                      </p>
                      {p.notes && (
                        <p className="text-[11px] text-teal-900 mt-1 italic">
                          Profilo: {p.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Referti Emessi
                      </span>
                      <span className="font-bold text-slate-900">{pDocs.length} documenti</span>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Avanzamento Saldo
                      </span>
                      <span className="font-bold font-mono text-teal-900">
                        €{totalPaid.toFixed(0)} / €{totalDue.toFixed(0)}
                      </span>
                      {totalDue > 0 && (
                        <div className="h-1.5 w-full rounded-full bg-slate-100 mt-1 overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatient(p);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 shadow-2xs hover:bg-teal-100 transition-all"
                    >
                      <span>Apri Fascicolo Clinico</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── MODAL DASHBOARD PAZIENTE INTERATTIVA ── */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onRefresh={fetchData}
          onOpenCassa={onOpenCassa}
        />
      )}
    </div>
  );
}
