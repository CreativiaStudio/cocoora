"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileSpreadsheet,
  Filter,
  Info,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  X,
  XCircle,
} from "lucide-react";
import type {
  ConsentRecord,
  ConsentLedgerStats,
} from "@/lib/consent-ledger";

export function ConsentsLedgerAdmin() {
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [stats, setStats] = useState<ConsentLedgerStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtri
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dettaglio record selezionato per la ricevuta
  const [selectedRecord, setSelectedRecord] = useState<ConsentRecord | null>(null);

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (channelFilter !== "all") params.set("channel", channelFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/consents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error("Errore fetch consensi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [channelFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConsents();
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (channelFilter !== "all") params.set("channel", channelFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    params.set("format", "csv");

    window.open(`/api/admin/consents?${params.toString()}`, "_blank");
  };

  const handleExportJson = () => {
    const params = new URLSearchParams();
    if (channelFilter !== "all") params.set("channel", channelFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    params.set("format", "json");

    window.open(`/api/admin/consents?${params.toString()}`, "_blank");
  };

  const formatChannelLabel = (channel: string) => {
    switch (channel) {
      case "cookie_banner":
        return "Banner Cookie";
      case "form_contatti":
        return "Form Contatti Web";
      case "booking_reception":
        return "Prenotazione Visita";
      case "checkout_club":
        return "Adesione Cocoora Club";
      case "questionario_salute":
        return "Questionario Anamnestico";
      case "modulo_cartaceo_frontdesk":
        return "Front-Desk Sede";
      default:
        return channel;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "granted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Accettato Totale
          </span>
        );
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200">
            <XCircle className="h-3 w-3 text-slate-500" />
            Solo Necessari
          </span>
        );
      case "partially_granted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800 border border-sky-200">
            <Sliders className="h-3 w-3 text-sky-600" />
            Personalizzato
          </span>
        );
      case "revoked":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-200">
            <AlertCircle className="h-3 w-3 text-rose-600" />
            Revocato
          </span>
        );
      default:
        return <span className="text-xs font-mono">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER CON RIFERIMENTO NORMATIVO ────────────────────────── */}
      <div className="rounded-xl border border-teal-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-teal-800 p-1.5 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h1 className="font-serif text-xl font-bold text-[#1d2327]">
                Registro Ufficiale Prove del Consenso GDPR
              </h1>
              <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
                Art. 7.1 GDPR &amp; Linee Guida Garante
              </span>
            </div>
            <p className="mt-1 text-xs text-[#50575e] max-w-3xl leading-relaxed">
              Archivio probatorio a valore legale per adempiere all&apos;onere della prova
              (*Accountability*). Registra data, ora, indirizzo IP anonimizzato (mascheramento subnet
              /24 ex Art. 5.1.c), preferenze granulari espresse e firma crittografica di non
              ripudio da esibire in sede di ispezione del Garante Privacy.
            </p>
          </div>

          {/* Tasti di Esportazione Ufficiali */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition cursor-pointer"
              title="Scarica il registro formattato per il Garante della Privacy"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Esporta CSV Ufficiale Garante</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#c3c4c7] bg-white px-3 py-2 text-xs font-semibold text-[#2c3338] hover:bg-[#f6f7f7] transition cursor-pointer"
              title="Esporta il payload JSON con le firme crittografiche SHA-256"
            >
              <Download className="h-4 w-4 text-teal-700" />
              <span>Esporta JSON</span>
            </button>

            <button
              type="button"
              onClick={fetchConsents}
              className="rounded-lg border border-[#c3c4c7] bg-white p-2 text-[#50575e] hover:bg-[#f6f7f7] transition cursor-pointer"
              title="Aggiorna registro"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── 4 KPI BOX ─────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-slate-100">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Totale Consensi Tracciati
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-900">
              {stats?.totalRecords || records.length}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Tutte le transazioni a log</p>
          </div>

          <div className="rounded-lg bg-emerald-50/60 p-3.5 border border-emerald-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              Accettazione Completa
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-emerald-900">
              {stats ? Math.round((stats.allGrantedCount / (stats.totalRecords || 1)) * 100) : 0}%
            </p>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              {stats?.allGrantedCount || 0} utenti (Analytics + Marketing)
            </p>
          </div>

          <div className="rounded-lg bg-slate-100/70 p-3.5 border border-slate-300">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
              Solo Necessari / Rifiutati
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-800">
              {stats
                ? Math.round(
                    ((stats.onlyNecessaryCount + stats.partiallyGrantedCount) /
                      (stats.totalRecords || 1)) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {(stats?.onlyNecessaryCount || 0) + (stats?.partiallyGrantedCount || 0)} utenti privacy-first
            </p>
          </div>

          <div className="rounded-lg bg-teal-50 p-3.5 border border-teal-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
              Dati Sanitari Art. 9 GDPR
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-teal-950">
              {stats?.sanitaryConsentsCount || 0}
            </p>
            <p className="text-[10px] text-teal-700 mt-0.5">Form clinici &amp; Cartella sanitaria</p>
          </div>
        </div>
      </div>

      {/* ── BARRA RICERCA E FILTRI ──────────────────────────────────── */}
      <div className="rounded-xl border border-[#c3c4c7] bg-white p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per Consent ID, IP anonimizzato (es. 151.48.xxx), identificativo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#c3c4c7] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="rounded-lg border border-[#c3c4c7] bg-white py-2 px-3 text-xs text-[#2c3338] outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="all">Tutti i Canali</option>
              <option value="cookie_banner">Banner Cookie</option>
              <option value="form_contatti">Form Contatti Web</option>
              <option value="checkout_club">Adesione Cocoora Club</option>
              <option value="booking_reception">Prenotazione Visita</option>
              <option value="questionario_salute">Questionario Salute</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#c3c4c7] bg-white py-2 px-3 text-xs text-[#2c3338] outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="all">Tutti gli Stati</option>
              <option value="granted">Accettato Totale</option>
              <option value="partially_granted">Personalizzato</option>
              <option value="denied">Solo Necessari</option>
              <option value="revoked">Revocato</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-[#2271b1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#135e96] transition cursor-pointer"
            >
              Filtra
            </button>
          </div>
        </form>
      </div>

      {/* ── TABELLA DEI CONSENSI ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-[#c3c4c7] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] text-[#50575e]">
                <th className="py-3 px-4 font-semibold">Data &amp; Ora</th>
                <th className="py-3 px-4 font-semibold">Consent ID (Ricevuta)</th>
                <th className="py-3 px-4 font-semibold">IP Anonimizzato (Minimizzato)</th>
                <th className="py-3 px-4 font-semibold">Canale di Raccolta</th>
                <th className="py-3 px-4 font-semibold">Preferenze Espresse</th>
                <th className="py-3 px-4 font-semibold">Versione Policy</th>
                <th className="py-3 px-4 font-semibold">Stato</th>
                <th className="py-3 px-4 font-semibold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-teal-700" />
                    Caricamento registro consensi...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Nessun record di consenso trovato con i filtri applicati.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-mono">
                      {new Date(r.timestamp).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      <span className="text-slate-400">·</span>{" "}
                      {new Date(r.timestamp).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-teal-950 bg-teal-50/70 px-2 py-0.5 rounded border border-teal-100">
                        {r.id}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        <Lock className="h-3 w-3 text-emerald-600" />
                        {r.anonymizedIp}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                      {formatChannelLabel(r.channel)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className="rounded bg-teal-100/70 text-teal-900 px-1.5 py-0.5">
                          Tecnici: SI
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 ${
                            r.preferences.analytics
                              ? "bg-sky-100 text-sky-800"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Analytics: {r.preferences.analytics ? "SI" : "NO"}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 ${
                            r.preferences.marketing
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Marketing: {r.preferences.marketing ? "SI" : "NO"}
                        </span>
                        {r.preferences.sanitaryDataArt9 && (
                          <span className="rounded bg-emerald-100 text-emerald-900 px-1.5 py-0.5">
                            Sanitario: SI
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {r.policyVersion}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(r.status)}</td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(r)}
                        className="rounded-md border border-teal-200 bg-white px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition cursor-pointer"
                      >
                        Vedi Prova ➔
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODALE DI AUDIT: CERTIFICATO PROBATORIO ──────────────────── */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-teal-200 bg-white p-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-teal-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-teal-700" />
                <h3 className="font-serif text-lg font-bold text-teal-950">
                  Certificato di Prova del Consenso (GDPR Art. 7.1)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-xl bg-teal-50/50 p-4 border border-teal-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800">
                      ID Univoco Transazione
                    </span>
                    <p className="font-mono font-bold text-sm text-teal-950 mt-0.5">
                      {selectedRecord.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800">
                      Timestamp Certificato UTC
                    </span>
                    <p className="font-mono text-xs text-slate-800 mt-0.5">
                      {selectedRecord.timestamp}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-teal-100/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800">
                      Indirizzo IP Troncato (GDPR Minimizzato)
                    </span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">
                      {selectedRecord.anonymizedIp}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800">
                      Canale di Raccolta
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {formatChannelLabel(selectedRecord.channel)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dettaglio Preferenze */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <h4 className="font-bold text-slate-900">Finalità Espresse dal Soggetto</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Cookie Tecnici (Necessari)</span>
                    <span className="font-bold text-emerald-700">CONCESSO</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Cookie Analytics GA4</span>
                    <span
                      className={`font-bold ${
                        selectedRecord.preferences.analytics
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {selectedRecord.preferences.analytics ? "CONCESSO" : "NEGATO"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Misurazione Marketing / Pixel</span>
                    <span
                      className={`font-bold ${
                        selectedRecord.preferences.marketing
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {selectedRecord.preferences.marketing ? "CONCESSO" : "NEGATO"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Dati Sanitari Particolari Art. 9</span>
                    <span
                      className={`font-bold ${
                        selectedRecord.preferences.sanitaryDataArt9
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {selectedRecord.preferences.sanitaryDataArt9 ? "CONCESSO" : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informazioni Tecniche e Crittografiche */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Versione Informativa Visualizzata:</span>
                  <span className="font-bold text-slate-900">{selectedRecord.policyVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Firma HMAC-SHA256 (Integrità):</span>
                  <span className="font-bold text-teal-800 break-all">
                    {selectedRecord.proofSignature}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans block mb-1">User Agent Dispositivo:</span>
                  <p className="text-[10px] text-slate-700 break-all bg-white p-2 rounded border border-slate-200">
                    {selectedRecord.userAgent}
                  </p>
                </div>
                {selectedRecord.notes && (
                  <div>
                    <span className="text-slate-500 font-sans block mb-1">Note Transazione:</span>
                    <p className="text-[11px] text-slate-800 font-sans">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900 cursor-pointer"
              >
                Chiudi Ricevuta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
