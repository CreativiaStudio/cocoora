"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Delete,
  Loader2,
  Lock,
  Mail,
  Send,
  Stethoscope,
} from "lucide-react";
import { SMART_DOCTORS, type SmartDoctorBadge } from "@/lib/auth-session";

interface LoginResponse {
  ok?: boolean;
  error?: string;
  redirectUrl?: string;
  locked?: boolean;
  waitMinutes?: number;
  remainingAttempts?: number;
}

function AccessoMediciContent() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  const [selectedDoctor, setSelectedDoctor] = useState<SmartDoctorBadge>(SMART_DOCTORS[0]);
  const [authMode, setAuthMode] = useState<"smart_pin" | "magic_link">("smart_pin");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestione digitazione PIN da tastiera fisica
  useEffect(() => {
    if (authMode !== "smart_pin") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        if (pin.length < 6) {
          setPin((prev) => prev + event.key);
          setError(null);
        }
      } else if (event.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
        setError(null);
      } else if (event.key === "Enter" && pin.length === 6) {
        handlePinSubmit(pin);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, authMode, selectedDoctor]);

  // Invio automatico appena si raggiungono le 6 cifre
  useEffect(() => {
    if (pin.length === 6 && !loading) {
      handlePinSubmit(pin);
    }
  }, [pin]);

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setError(null);
    }
  };

  const handleKeypadDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handlePinSubmit = async (pinCode: string) => {
    if (pinCode.length !== 6 || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorSlug: selectedDoctor.slug,
          pin: pinCode,
        }),
      });

      const data: LoginResponse = (await response.json().catch(() => ({}))) as LoginResponse;

      if (response.ok && data.ok) {
        const dest = fromParam || data.redirectUrl || "/medico";
        window.location.href = dest;
        return;
      }

      setPin("");
      if (response.status === 429 || data.locked) {
        setError(
          data.error ||
            `Accesso temporaneamente bloccato. Riprova tra ${data.waitMinutes || 15} minuti.`
        );
      } else {
        setError(
          data.error ||
            `PIN non valido per ${selectedDoctor.name}. Hai ancora ${data.remainingAttempts ?? "alcuni"} tentativi.`
        );
      }
    } catch {
      setError("Impossibile contattare il server. Verifica la connessione.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setMagicLinkSent(false);

    try {
      const response = await fetch("/api/auth/doctor-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorSlug: selectedDoctor.slug }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        setMagicLinkSent(true);
      } else {
        setError(data.error || "Impossibile generare il magic link. Usa lo Smart PIN.");
      }
    } catch {
      setError("Errore durante l'invio del magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen max-h-screen bg-[#F4F7F5] flex flex-col justify-between p-2 sm:p-4 md:p-6 overflow-hidden text-[#1F2421]">
      {/* Top minimal bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between shrink-0 py-1 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-900/80 hover:text-emerald-950 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna al sito Cocoora</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Ambulatorio Medico
        </div>
      </header>

      {/* Main unified split cockpit card (100% above the fold) */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex items-center justify-center min-h-0 my-auto">
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
          {/* Colonna Sinistra: Selezione Medico (Dark Luxury Teal) */}
          <div className="bg-[#0A373E] text-white p-4 sm:p-5 md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#154E57] shrink-0 md:shrink">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                    Staff Medico
                  </h2>
                  <p className="text-[11px] text-emerald-100/70">Seleziona il tuo profilo</p>
                </div>
              </div>

              {/* Lista Compatta 6 Medici */}
              <div className="space-y-1.5 mt-3 max-h-[36vh] md:max-h-none overflow-y-auto pr-1">
                {SMART_DOCTORS.map((doc) => {
                  const isSelected = selectedDoctor.slug === doc.slug;
                  return (
                    <button
                      key={doc.slug}
                      type="button"
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setPin("");
                        setError(null);
                        setMagicLinkSent(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-md ring-2 ring-emerald-400 font-semibold"
                          : "bg-white/10 hover:bg-white/15 text-slate-100 border border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected
                              ? "bg-[#0F4C5C] text-white"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {doc.name.replace(/^(Dott\.ssa|Dott\.)\s*/, "").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs truncate leading-tight font-medium">
                            {doc.name}
                          </p>
                          <p
                            className={`text-[10px] truncate leading-none mt-0.5 ${
                              isSelected ? "text-emerald-700" : "text-emerald-200/70"
                            }`}
                          >
                            {doc.specialty}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-emerald-100/50 pt-3 border-t border-white/10 mt-3">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Cartella Clinica Cifrata · Art. 32 GDPR</span>
            </div>
          </div>

          {/* Colonna Destra: Modulo PIN & Tastierino Touch */}
          <div className="p-4 sm:p-6 md:w-7/12 flex flex-col justify-between bg-white overflow-y-auto">
            {/* Header Medico Selezionato & Tab Mode */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F4C5C] shrink-0 font-bold text-xs">
                  {selectedDoctor.name.replace(/^(Dott\.ssa|Dott\.)\s*/, "").charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {selectedDoctor.specialty}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAuthMode("smart_pin")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    authMode === "smart_pin"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Smart PIN
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("magic_link")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    authMode === "magic_link"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Magic Link
                </button>
              </div>
            </div>

            {/* Alert Errore compatto */}
            {error && (
              <div className="my-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">{error}</span>
              </div>
            )}

            {/* Contenuto Modalità */}
            {authMode === "smart_pin" ? (
              <div className="py-2 flex flex-col items-center">
                <p className="text-[11px] text-slate-500 mb-2">
                  Digita lo Smart PIN a 6 cifre:
                </p>

                {/* 6 Pallini PIN */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const isFilled = index < pin.length;
                    return (
                      <div
                        key={index}
                        className={`w-8 h-10 sm:w-9 sm:h-11 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isFilled
                            ? "border-[#0F4C5C] bg-emerald-50/60 shadow-sm scale-105"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        {isFilled ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C5C]" />
                        ) : (
                          <span className="text-slate-300 text-xs">•</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tastierino Touch Compatto (pulsanti h-10 / h-11) */}
                <div className="w-full max-w-[260px] grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      disabled={loading}
                      onClick={() => handleKeypadPress(digit)}
                      className="h-10 sm:h-11 rounded-lg bg-slate-50 hover:bg-emerald-50/80 active:bg-emerald-100 border border-slate-200 text-base font-semibold text-slate-800 transition-all active:scale-95 shadow-xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={loading || pin.length === 0}
                    onClick={handleKeypadDelete}
                    className="h-10 sm:h-11 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition-all flex items-center justify-center disabled:opacity-40"
                    aria-label="Cancella cifra"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleKeypadPress("0")}
                    className="h-10 sm:h-11 rounded-lg bg-slate-50 hover:bg-emerald-50/80 active:bg-emerald-100 border border-slate-200 text-base font-semibold text-slate-800 transition-all active:scale-95 shadow-xs"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    disabled={loading || pin.length !== 6}
                    onClick={() => handlePinSubmit(pin)}
                    className="h-10 sm:h-11 rounded-lg bg-[#0F4C5C] hover:bg-[#0A373E] text-white transition-all flex items-center justify-center disabled:opacity-40 shadow-xs"
                    aria-label="Conferma PIN"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider">OK</span>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Supporta tastiera fisica o touch screen iPad
                </p>
              </div>
            ) : (
              <div className="py-6 flex flex-col justify-center flex-1 max-w-sm mx-auto w-full">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-500">Email Istituzionale</p>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {selectedDoctor.email}
                    </p>
                  </div>
                </div>

                {magicLinkSent ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                    <p className="font-semibold text-xs">Link Inviato allo Smartphone!</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">
                      Tocca il link ricevuto via email per entrare senza PIN.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleMagicLinkSubmit}
                    className="w-full py-3 px-4 rounded-xl bg-[#0F4C5C] hover:bg-[#0A373E] text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Invia Magic Link 1-Tap</span>
                      </>
                    )}
                  </button>
                )}

                <p className="text-[10px] text-slate-400 text-center mt-3">
                  Link monouso crittografato valido 15 minuti
                </p>
              </div>
            )}

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                Cocoora Centro Medico Autorizzato · Presidio Sanitario
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom minimal line */}
      <footer className="w-full text-center text-[10px] text-slate-400 shrink-0 py-0.5">
        Sessione clinica protetta · Rate limiting anti-brute force attivo
      </footer>
    </div>
  );
}

export default function AccessoMediciPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-[#F4F7F5]">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-700" />
        </div>
      }
    >
      <AccessoMediciContent />
    </Suspense>
  );
}
