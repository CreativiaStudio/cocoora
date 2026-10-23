"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Eye,
  FileCheck,
  FilePlus,
  FileText,
  Printer,
  RefreshCw,
  Search,
  Shield,
  Stethoscope,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ReceptionDocumentsDesk() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal Anteprima / Stampa
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // Modal Nuovo Referto
  const [showAddModal, setShowAddModal] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("Odontoiatria & Ortodonzia");
  const [doctorName, setDoctorName] = useState("Dott.ssa Elisa Russo (D.S.)");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: docs } = await supabase
        .from("clinical_documents")
        .select("*, patient_profiles(id, patient_code, first_name, last_name, fiscal_code)")
        .order("report_date", { ascending: false });

      const { data: pts } = await supabase.from("patient_profiles").select("id, patient_code, first_name, last_name").order("last_name");
      const { data: dcs } = await supabase.from("doctors").select("id, full_name, specialty_slug").eq("is_active", true).order("full_name");

      if (docs) setDocuments(docs);
      if (pts) {
        setPatients(pts);
        if (pts.length > 0 && !patientId) setPatientId(pts[0].id);
      }
      if (dcs) {
        setDoctors(dcs);
        if (dcs.length > 0 && !doctorId) {
          setDoctorId(dcs[0].id);
          setDoctorName(dcs[0].full_name);
        }
      }
    } catch (e) {
      console.error("Errore fetch referti desk:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Inserisci il titolo della prestazione");
      return;
    }

    try {
      setIsSubmitting(true);
      const code = `REF-${specialty.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await supabase.from("clinical_documents").insert({
        patient_id: patientId,
        doctor_id: doctorId || null,
        title,
        specialty,
        doctor_name: doctorName,
        diagnosis: diagnosis || "Quadro clinico esaminato e conforme ai protocolli del centro.",
        recommendations: recommendations || "Proseguire con le indicazioni terapeutiche domiciliari.",
        document_code: code,
        report_date: new Date().toISOString().split("T")[0],
        is_ready: true,
        file_size: "1.9 MB",
      });

      setTitle("");
      setDiagnosis("");
      setRecommendations("");
      setShowAddModal(false);
      await fetchData();
    } catch (err: any) {
      console.error("Errore salvataggio referto:", err);
      alert("Errore salvataggio: " + (err.message || "Riprova"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDocs = documents.filter((d) => {
    const q = search.toLowerCase();
    const patientName = `${d.patient_profiles?.first_name || ""} ${d.patient_profiles?.last_name || ""}`.toLowerCase();
    const code = d.document_code?.toLowerCase() || "";
    const docTitle = d.title?.toLowerCase() || "";
    return patientName.includes(q) || code.includes(q) || docTitle.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-800 text-white font-bold text-xs">
                📁
              </span>
              <h2 className="font-serif text-xl font-bold text-slate-900">
                Fascicolo Referti &amp; Consegna Documenti
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Archivio referti clinici, consultazione immediata e stampa per i pazienti che attendono allo sportello.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca paziente o codice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden w-56 sm:w-64"
              />
            </div>
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Aggiorna</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800"
            >
              <FilePlus className="h-3.5 w-3.5" />
              <span>+ Carica Referto</span>
            </button>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-teal-700 border-t-transparent mb-2"></span>
              <p>Caricamento referti in corso...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nessun referto clinico trovato con i filtri correnti.
            </p>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {doc.patient_profiles?.first_name} {doc.patient_profiles?.last_name}
                      </span>
                      <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-800 border border-teal-200">
                        {doc.document_code}
                      </span>
                    </div>
                    <p className="text-xs font-serif font-bold text-teal-900 mt-0.5">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Branca: {doc.specialty} · Medico: <strong>{doc.doctor_name}</strong> · Data: {doc.report_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 shadow-2xs hover:bg-teal-100 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Visualizza &amp; Stampa PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── MODAL ANTEPRIMA / STAMPA REFERTO PDF ── */}
      {previewDoc && (
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
                  {previewDoc.document_code}
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  Data: {previewDoc.report_date}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Paziente</span>
                <span className="text-slate-900 font-bold text-sm">
                  {previewDoc.patient_profiles?.first_name} {previewDoc.patient_profiles?.last_name}
                </span>
                <p className="text-slate-500 text-[11px] font-mono mt-0.5">
                  CF: {previewDoc.patient_profiles?.fiscal_code || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Medico Refertatore</span>
                <span className="text-slate-900 font-bold text-sm">
                  {previewDoc.doctor_name}
                </span>
                <p className="text-teal-800 text-[11px] font-semibold mt-0.5">
                  Branca: {previewDoc.specialty}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-teal-950 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 mb-2">
                  Oggetto della Prestazione Clinica: {previewDoc.title}
                </h3>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">Diagnosi &amp; Rilievi Clinici:</h4>
                <div className="rounded-lg bg-white border border-slate-200 p-3 text-slate-700 leading-relaxed text-xs">
                  {previewDoc.diagnosis}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">Prescrizioni &amp; Raccomandazioni Terapeutiche:</h4>
                <div className="rounded-lg bg-teal-50/50 border border-teal-100 p-3 text-teal-950 leading-relaxed text-xs">
                  {previewDoc.recommendations}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                Documento clinico conservato digitalmente a norma di legge.
              </div>
              <div className="text-right">
                <div className="h-10 w-32 border-b border-slate-400 mb-1 ml-auto"></div>
                <p className="text-[11px] font-bold text-slate-800">
                  {previewDoc.doctor_name}
                </p>
                <p className="text-[9px] text-slate-500 uppercase">Firma del Medico</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Chiudi
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Stampa Referto al Banco</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL NUOVO REFERTO ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FilePlus className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Carica Referto Specialistico nel Fascicolo
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

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seleziona Paziente
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
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
                  Titolo Prestazione / Esame
                </label>
                <input
                  type="text"
                  placeholder="es. Visita Odontoiatrica di Controllo Mascherine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
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
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnosi Clinica
                </label>
                <textarea
                  rows={3}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Esito dell'esame o visita..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prescrizioni &amp; Raccomandazioni
                </label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Terapia domiciliare o prossimo appuntamento..."
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
                  className="rounded-lg bg-teal-800 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Caricamento..." : "Salva Referto nel Fascicolo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
