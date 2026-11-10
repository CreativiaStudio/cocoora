"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Delete,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Send,
  Sparkles,
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
      // Ignora se l'utente sta interagendo con un form o un altro elemento
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
            `Accesso temporaneamente bloccato per sicurezza. Riprova tra ${data.waitMinutes || 15} minuti.`
        );
      } else {
        setError(
          data.error ||
            `PIN non valido per ${selectedDoctor.name}. Hai ancora ${data.remainingAttempts ?? "alcuni"} tentativi.`
        );
      }
    } catch {
      setError("Impossibile contattare il server. Verifica la connessione e riprova.");
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
        setError(data.error || "Impossibile generare il magic link. Riprova con il PIN.");
      }
    } catch {
      setError("Errore durante l'invio del link di accesso. Riprova con lo Smart PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between text-[#1F2421]">
      {/* Header bar */}
      <header className="w-full border-b border-emerald-900/10 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-800/80 hover:text-emerald-950 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna al sito Cocoora</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Presidio Ambulatorio Attivo
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        {/* Titolo e Badge */}
        <div className="text-center max-w-xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-semibold tracking-wider uppercase mb-3">
            <Stethoscope className="w-4 h-4 text-emerald-700" />
            AMBULATORIO CLINICO COCOORA
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F4C5C] font-semibold tracking-tight">
            Portale Specialisti & Medici
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Cartella Clinica, Refertazione e Lista Pazienti di Oggi · Accedi con 1 tap dal tablet dell&apos;ambulatorio
          </p>
        </div>

        {/* 1. Selezione Medico */}
        <div className="w-full mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
            1. Seleziona il tuo Profilo Medico
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  className={`p-3.5 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#0F4C5C] shadow-md ring-2 ring-[#0F4C5C]/20 scale-[1.02]"
                      : "bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-semibold ${
                        isSelected
                          ? "bg-[#0F4C5C] text-white"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {doc.name.replace(/^(Dott\.ssa|Dott\.)\s*/, "").charAt(0)}
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {doc.specialty}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Modulo Autenticazione (Card Bianca Centrale) */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          {/* Info Medico Selezionato */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F4C5C]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Accesso in corso</p>
                <h4 className="text-sm font-bold text-slate-900">{selectedDoctor.name}</h4>
                <p className="text-xs text-emerald-700">{selectedDoctor.specialty}</p>
              </div>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setAuthMode("smart_pin")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
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
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  authMode === "magic_link"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Magic Link
              </button>
            </div>
          </div>

          {/* Alert Errore */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {authMode === "smart_pin" ? (
            <div>
              <p className="text-xs text-slate-500 text-center mb-3">
                Digita il tuo **Smart PIN a 6 cifre** assegnato dalla clinica:
              </p>

              {/* Pallini Cifre PIN */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const isFilled = index < pin.length;
                  return (
                    <div
                      key={index}
                      className={`w-11 h-13 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isFilled
                          ? "border-[#0F4C5C] bg-emerald-50/50 text-slate-900 scale-105 shadow-sm"
                          : "border-slate-200 bg-slate-50 text-transparent"
                      }`}
                    >
                      {isFilled ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0F4C5C]" />
                      ) : (
                        <span className="text-slate-300 text-xs">•</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tastierino Numerico Touch a Schermo */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    disabled={loading}
                    onClick={() => handleKeypadPress(digit)}
                    className="h-13 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50/80 active:bg-emerald-100/80 border border-slate-200/80 text-xl font-semibold text-slate-800 transition-all active:scale-95 shadow-sm"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={loading || pin.length === 0}
                  onClick={handleKeypadDelete}
                  className="h-13 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition-all flex items-center justify-center disabled:opacity-40"
                  aria-label="Cancella cifra"
                >
                  <Delete className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleKeypadPress("0")}
                  className="h-13 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50/80 active:bg-emerald-100/80 border border-slate-200/80 text-xl font-semibold text-slate-800 transition-all active:scale-95 shadow-sm"
                >
                  0
                </button>
                <button
                  type="button"
                  disabled={loading || pin.length !== 6}
                  onClick={() => handlePinSubmit(pin)}
                  className="h-13 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#0A373E] text-white transition-all flex items-center justify-center disabled:opacity-40 shadow-sm"
                  aria-label="Conferma PIN"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider">OK</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Puoi digitare anche direttamente dalla tastiera fisica del PC o tablet.
              </p>
            </div>
          ) : (
            <div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-700" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email Registrata</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedDoctor.email}</p>
                  </div>
                </div>
              </div>

              {magicLinkSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-center mb-5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-sm">Magic Link Inviato!</p>
                  <p className="mt-1 text-slate-600">
                    Controlla la tua casella email sullo smartphone e tocca il link per accedere istantaneamente.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleMagicLinkSubmit}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0F4C5C] hover:bg-[#0A373E] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Invia Link di Accesso al mio Smartphone</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-[11px] text-slate-400 text-center mt-3">
                Il link è monouso, scade dopo 15 minuti ed è protetto contro attacchi replay.
              </p>
            </div>
          )}
        </div>

        {/* Footer info scudo */}
        <div className="mt-8 text-center text-xs text-slate-500 max-w-md">
          <p className="flex items-center justify-center gap-1.5 font-medium text-slate-600">
            <Lock className="w-3.5 h-3.5 text-emerald-800" />
            Cartella Clinica Cifrata · Riservata ai Medici Autorizzati Cocoora
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Ogni accesso viene registrato nel registro accessi di clinica ai sensi dell&apos;Art. 32 GDPR.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AccessoMediciPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <AccessoMediciContent />
    </Suspense>
  );
}
