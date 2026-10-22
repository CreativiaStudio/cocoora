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
} from "lucide-react";
import { Button } from "@/components/ui";

export function PatientsCrmAdmin() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reception/desk");
      const data = await res.json();
      if (data.patients) setPatients(data.patients);
      if (data.documents) setDocuments(data.documents);
      if (data.installments) setInstallments(data.installments);
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
      <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-teal-900">
              Anagrafiche Pazienti &amp; Fascicoli Clinici (Direzione)
            </h3>
            <p className="text-xs text-charcoal/60">
              Elenco generale dei pazienti registrati, stato dei piani terapeutici e referti emessi.
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
                className="rounded-full border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
            <Button size="sm" variant="outline" onClick={fetchData} className="gap-1.5 text-xs">
              <RefreshCw className="h-3 w-3" />
              Aggiorna
            </Button>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {filteredPatients.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nessun paziente trovato.
            </p>
          ) : (
            filteredPatients.map((p) => {
              const pDocs = documents.filter((d) => d.patient_id === p.id);
              const pInst = installments.filter((i) => i.patient_id === p.id);
              const totalDue = pInst.reduce((acc, i) => acc + Number(i.amount || 0), 0);
              const totalPaid = pInst
                .filter((i) => i.status === "pagato")
                .reduce((acc, i) => acc + Number(i.amount || 0), 0);

              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs">
                      {p.first_name[0]}
                      {p.last_name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-navy-deep">
                          {p.first_name} {p.last_name}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-mono font-semibold text-slate-700">
                          {p.patient_code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Email: {p.email || "Non inserita"} · Tel: {p.phone || "Non inserito"} · CF: {p.fiscal_code || "N/A"}
                      </p>
                      {p.notes && (
                        <p className="text-[11px] text-teal-800/80 mt-1 italic">
                          Profilo: {p.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs shrink-0">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">
                        Referti Emessi
                      </span>
                      <span className="font-bold text-navy-deep">{pDocs.length} documenti</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">
                        Piano Cure &amp; Saldo
                      </span>
                      <span className="font-bold text-teal-800">
                        €{totalPaid.toFixed(0)} / €{totalDue.toFixed(0)}
                      </span>
                    </div>

                    <a
                      href={`/area-paziente`}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Apri Fascicolo →
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
