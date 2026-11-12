'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Delete,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { SMART_DOCTORS } from '@/lib/auth-session';

interface AuthApiResponse {
  ok?: boolean;
  error?: string;
  remainingAttempts?: number;
  message?: string;
}

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function doctorInitials(name: string): string {
  return name
    .replace(/^Dott\.ssa\s+/i, '')
    .replace(/^Dott\.\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function AccessoMediciContent() {
  const searchParams = useSearchParams();
  const targetFrom = searchParams.get('from');

  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState<string | null>(null);
  const [doctorPin, setDoctorPin] = useState('');
  const [mode, setMode] = useState<'pin' | 'magic'>('pin');
  const [submitting, setSubmitting] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [magicSent, setMagicSent] = useState<string | null>(null);

  const submittingRef = useRef(false);
  const autoSubmitRef = useRef(false);

  const selectedDoctor =
    SMART_DOCTORS.find((doctor) => doctor.slug === selectedDoctorSlug) ?? null;

  const selectDoctor = useCallback((slug: string) => {
    setSelectedDoctorSlug(slug);
    setDoctorPin('');
    setError(null);
    setRemainingAttempts(null);
    setMagicSent(null);
    setMode('pin');
    autoSubmitRef.current = false;
  }, []);

  const handleDigit = useCallback((digit: string) => {
    if (submittingRef.current) return;
    setError(null);
    setRemainingAttempts(null);
    setDoctorPin((previous) => (previous.length >= 6 ? previous : `${previous}${digit}`));
  }, []);

  const handleBackspace = useCallback(() => {
    if (submittingRef.current) return;
    setError(null);
    setRemainingAttempts(null);
    setDoctorPin((previous) => previous.slice(0, -1));
  }, []);

  const submitPin = useCallback(async () => {
    if (submittingRef.current) return;

    if (!selectedDoctor) {
      setError('Seleziona prima il tuo profilo medico per accedere.');
      return;
    }

    if (doctorPin.length !== 6) {
      setError('Il PIN personale deve contenere esattamente 6 cifre.');
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setError(null);
    setRemainingAttempts(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorSlug: selectedDoctor.slug, pin: doctorPin }),
      });

      const data = (await response.json().catch(() => ({}))) as AuthApiResponse;

      if (response.ok && data.ok) {
        window.location.href =
          targetFrom && targetFrom.startsWith('/') ? targetFrom : '/medico';
        return;
      }

      setError(data.error || 'PIN non valido o accesso non consentito. Riprova.');
      setRemainingAttempts(
        typeof data.remainingAttempts === 'number' ? data.remainingAttempts : null,
      );
      setDoctorPin('');
    } catch {
      setError('Connessione al server non riuscita. Controlla la rete e riprova.');
      setDoctorPin('');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [doctorPin, selectedDoctor, targetFrom]);

  const sendMagicLink = useCallback(async () => {
    if (!selectedDoctor || magicLoading) return;

    setMagicLoading(true);
    setError(null);
    setRemainingAttempts(null);
    setMagicSent(null);

    try {
      const response = await fetch('/api/auth/doctor-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorSlug: selectedDoctor.slug }),
      });

      const data = (await response.json().catch(() => ({}))) as AuthApiResponse;

      if (response.ok && data.ok) {
        setMagicSent(
          data.message ||
            `Magic Link inviato a ${selectedDoctor.email}. Il link è valido 15 minuti e può essere usato una sola volta.`,
        );
        return;
      }

      setError(data.error || 'Invio del Magic Link non riuscito. Riprova tra poco.');
    } catch {
      setError('Connessione al server non riuscita. Controlla la rete e riprova.');
    } finally {
      setMagicLoading(false);
    }
  }, [magicLoading, selectedDoctor]);

  useEffect(() => {
    if (mode !== 'pin' || !selectedDoctor) {
      autoSubmitRef.current = false;
      return;
    }

    if (doctorPin.length !== 6) {
      autoSubmitRef.current = false;
      return;
    }

    if (autoSubmitRef.current) return;

    autoSubmitRef.current = true;
    void submitPin();
  }, [doctorPin, mode, selectedDoctor, submitPin]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const isInteractiveTarget = Boolean(
        target?.closest('input, textarea, select, [contenteditable="true"]'),
      );

      if (isInteractiveTarget) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        handleDigit(event.key);
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
        return;
      }

      if (event.key === 'Enter') {
        if (target?.closest('button, a')) return;
        event.preventDefault();
        void submitPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleDigit, submitPin]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-[#80A1B2] hover:text-[#0F4C5C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al sito
          </Link>

          <span className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:inline-flex">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            Ambiente clinico protetto
          </span>
        </div>

        <main className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-40px_rgba(15,76,92,0.55)]">
          <header className="relative border-b border-slate-100 bg-gradient-to-br from-white via-white to-[#10B981]/[0.06] px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F4C5C] to-[#10B981] text-white shadow-lg shadow-[#0F4C5C]/20">
                <Stethoscope className="h-7 w-7" strokeWidth={1.8} />
              </div>

              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0F4C5C]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  Ambulatorio Clinico Cocoora
                </span>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#0F4C5C] sm:text-3xl lg:text-4xl">
                  Portale Specialisti &amp; Medici
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Cartella Clinica, Refertazione e Lista Pazienti di Oggi
                </p>
              </div>
            </div>
          </header>

          <section className="px-5 py-7 sm:px-8 sm:py-9">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4C5C]">
                  Seleziona il tuo profilo
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Un solo tocco per identificarti sull’iPad dell’ambulatorio.
                </p>
              </div>
              <span className="hidden rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
                6 specialisti
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
              {SMART_DOCTORS.map((doctor) => {
                const isSelected = doctor.slug === selectedDoctorSlug;

                return (
                  <button
                    key={doctor.slug}
                    type="button"
                    onClick={() => selectDoctor(doctor.slug)}
                    aria-pressed={isSelected}
                    aria-label={`Seleziona ${doctor.name}, ${doctor.specialty}`}
                    className={cn(
                      'group relative flex min-h-[96px] w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50',
                      isSelected
                        ? 'border-[#10B981] bg-[#10B981]/[0.07] shadow-[0_12px_30px_-20px_rgba(16,185,129,0.9)]'
                        : 'border-slate-200 bg-white hover:border-[#80A1B2] hover:bg-slate-50 active:scale-[0.99]',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-colors',
                        isSelected
                          ? 'bg-[#0F4C5C] text-white'
                          : 'bg-[#0F4C5C]/10 text-[#0F4C5C]',
                      )}
                    >
                      {doctorInitials(doctor.name)}
                    </div>

                    <div className="min-w-0 pr-4">
                      <p className="truncate text-sm font-semibold text-[#0F4C5C]">
                        {doctor.name}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">
                        {doctor.specialty}
                      </p>
                    </div>

                    {isSelected ? (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="border-t border-slate-100 bg-[#F8FAFC]/70 px-5 py-7 sm:px-8 sm:py-9">
            {!selectedDoctor ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C5C]/10 text-[#0F4C5C]">
                  <UserRound className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <p className="mt-4 text-sm font-medium text-[#0F4C5C]">
                  Nessun medico selezionato
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  Tocca la tua scheda qui sopra per attivare il campo PIN personale e
                  accedere alla cartella clinica.
                </p>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F4C5C] text-sm font-semibold text-white">
                      {doctorInitials(selectedDoctor.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0F4C5C]">
                        {selectedDoctor.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {selectedDoctor.specialty}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectDoctor(selectedDoctor.slug)}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-[#80A1B2] hover:text-[#0F4C5C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40"
                  >
                    Cambia
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/60 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('pin');
                      setError(null);
                    }}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40',
                      mode === 'pin'
                        ? 'bg-white text-[#0F4C5C] shadow-sm'
                        : 'text-slate-500 hover:text-[#0F4C5C]',
                    )}
                  >
                    <KeyRound className="h-4 w-4" />
                    PIN rapido
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('magic');
                      setError(null);
                      setMagicSent(null);
                    }}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40',
                      mode === 'magic'
                        ? 'bg-white text-[#0F4C5C] shadow-sm'
                        : 'text-slate-500 hover:text-[#0F4C5C]',
                    )}
                  >
                    <Mail className="h-4 w-4" />
                    Magic Link
                  </button>
                </div>

                {mode === 'pin' ? (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        PIN personale a 6 cifre
                      </p>
                      <span className="rounded-full bg-[#10B981]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0F4C5C]">
                        Protetto
                      </span>
                    </div>

                    <div
                      className="mt-4 flex items-center justify-center gap-2 sm:gap-3"
                      role="status"
                      aria-label={`PIN inserito: ${doctorPin.length} cifre su 6`}
                    >
                      {Array.from({ length: 6 }).map((_, index) => {
                        const isFilled = index < doctorPin.length;
                        const isActive = index === doctorPin.length && !submitting;

                        return (
                          <div
                            key={index}
                            className={cn(
                              'flex h-12 w-10 items-center justify-center rounded-xl border transition-all duration-150 sm:h-14 sm:w-12',
                              isFilled
                                ? 'border-[#10B981] bg-[#10B981]/10'
                                : isActive
                                  ? 'border-[#80A1B2] bg-white ring-4 ring-[#80A1B2]/15'
                                  : 'border-slate-200 bg-white',
                            )}
                          >
                            {isFilled ? (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#0F4C5C]" />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-400">
                      Digita le 6 cifre: l’accesso parte automaticamente. Puoi usare anche la
                      tastiera fisica.
                    </p>

                    <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2.5 sm:gap-3">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          onClick={() => handleDigit(digit)}
                          disabled={submitting}
                          aria-label={`Cifra ${digit}`}
                          className="flex h-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-semibold text-[#0F4C5C] shadow-sm transition hover:border-[#80A1B2] hover:bg-[#F8FAFC] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {digit}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={handleBackspace}
                        disabled={submitting || doctorPin.length === 0}
                        aria-label="Cancella l’ultima cifra"
                        className="flex h-16 flex-col items-center justify-center gap-0.5 rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#80A1B2] hover:bg-[#F8FAFC] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Delete className="h-5 w-5" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                          Cancella
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDigit('0')}
                        disabled={submitting}
                        aria-label="Cifra 0"
                        className="flex h-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-semibold text-[#0F4C5C] shadow-sm transition hover:border-[#80A1B2] hover:bg-[#F8FAFC] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        0
                      </button>

                      <div aria-hidden="true" className="h-16" />
                    </div>

                    <button
                      type="button"
                      onClick={() => void submitPin()}
                      disabled={submitting}
                      className="mt-3 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F4C5C] px-5 text-base font-semibold text-white shadow-lg shadow-[#0F4C5C]/20 transition hover:bg-[#1C4A5C] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <LogIn className="h-5 w-5" />
                      )}
                      {submitting ? 'Verifica in corso…' : 'Entra in Ambulatorio'}
                    </button>

                    <div className="mt-5 flex flex-col items-center gap-1 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400">
                        Preferisci un accesso senza PIN?
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('magic');
                          void sendMagicLink();
                        }}
                        disabled={magicLoading}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#0F4C5C] transition hover:text-[#10B981] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {magicLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        Invia Magic Link via Email
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#0F4C5C]">
                      <Mail className="h-6 w-6" strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-[#0F4C5C]">
                      Accesso senza PIN
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                      Ricevi un link monouso valido 15 minuti all’indirizzo istituzionale di{' '}
                      {selectedDoctor.name}.
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                      {selectedDoctor.email}
                    </p>

                    <button
                      type="button"
                      onClick={() => void sendMagicLink()}
                      disabled={magicLoading}
                      className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F4C5C] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0F4C5C]/20 transition hover:bg-[#1C4A5C] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {magicLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                      {magicLoading
                        ? 'Invio in corso…'
                        : 'Invia Magic Link via Email'}
                    </button>

                    {magicSent ? (
                      <div
                        role="status"
                        aria-live="polite"
                        className="mt-4 flex items-start gap-3 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-3 text-left text-sm text-[#0F4C5C]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                        <p className="leading-relaxed">{magicSent}</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {error ? (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium leading-relaxed">{error}</p>
                      {remainingAttempts !== null ? (
                        <p className="mt-1 text-xs text-red-600">
                          Tentativi rimanenti: {remainingAttempts} su 5 prima del blocco di
                          sicurezza.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <footer className="border-t border-slate-100 px-5 py-4 sm:px-8">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
              Accesso riservato ai professionisti sanitari di Cocoora Centro Medico. Le
              credenziali sono personali e i tentativi di accesso vengono registrati per la
              sicurezza dei dati clinici.
            </p>
          </footer>
        </main>

        <p className="mt-5 text-center text-xs text-slate-400">
          Cocoora Centro Medico · La tua salute, seguita con cura, nel tempo.
        </p>
      </div>
    </div>
  );
}

function PortalFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-[#0F4C5C] shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
        Caricamento del portale specialisti…
      </div>
    </div>
  );
}

export default function AccessoMediciPage() {
  return (
    <Suspense fallback={<PortalFallback />}>
      <AccessoMediciContent />
    </Suspense>
  );
}
