'use client';

import { Suspense, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';

type LoginResponse = {
  ok?: boolean;
  error?: string;
  redirectUrl?: string;
};

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </svg>
  );
}

function LineChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4v16h16" />
      <path d="M7 15l3.5-4 3 2.5L20 7" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
      <path d="M5 15l.6 1.6L7.2 17l-1.6.6L5 19.2l-.6-1.6L2.8 17l1.6-.4L5 15Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 6.6 7.3 5.6a1.5 1.5 0 0 0 1.8 0l7.3-5.6" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
      <path d="M12 14.5v2.5" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17.6 17.6 0 0 1-3 3.5" />
      <path d="M6.02 7.6A17.3 17.3 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 3.4-.62" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarketingAccessForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      setError('Inserisci email e password per accedere al Content Studio.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: LoginResponse = {};
      try {
        data = (await res.json()) as LoginResponse;
      } catch {
        data = {};
      }

      if (!res.ok || !data.ok) {
        setError(
          data.error ||
            'Credenziali non valide o accesso non autorizzato. Verifica i dati e riprova.'
        );
        setLoading(false);
        return;
      }

      const from = searchParams.get('from');
      window.location.href = from || '/admin?tab=silvia';
    } catch {
      setError('Errore di connessione al server. Riprova tra qualche istante.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0F19] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 15% 0%, rgba(99,102,241,0.22) 0%, transparent 70%), radial-gradient(50% 40% at 88% 18%, rgba(129,140,248,0.16) 0%, transparent 70%), radial-gradient(60% 50% at 50% 100%, rgba(99,102,241,0.10) 0%, transparent 75%), linear-gradient(180deg, #0B0F19 0%, #0E1322 55%, #0B0F19 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(129,140,248,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(129,140,248,0.07) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 35%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 40%, black 35%, transparent 78%)',
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
            <GlobeIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-200">
            Cocoora <span className="text-indigo-300">·</span> Content Studio
          </span>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-indigo-500/50 via-violet-500/20 to-indigo-400/10 p-px shadow-[0_0_60px_-15px_rgba(99,102,241,0.55)]">
          <div className="rounded-[calc(1.5rem-1px)] bg-[#111827]/95 p-6 backdrop-blur-xl sm:p-9">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/25 to-violet-500/10 text-indigo-300">
                  <SparklesIcon className="h-5 w-5" />
                </span>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
                    <LineChartIcon className="h-3.5 w-3.5" />
                    Portale Partner &amp; Growth Marketing
                  </span>
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Content Studio &amp; Analytics
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Pannello Riservato Silvia — SEO, Pagine, Video Reels e Telemetria
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.07] px-4 py-3.5">
                <p className="text-sm leading-relaxed text-slate-300">
                  📊 Accesso agli audit log di telemetria, visitatori unici reali, analisi funnel
                  e gestione contenuti editoriali.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="partner-email"
                    className="text-xs font-medium uppercase tracking-[0.1em] text-slate-400"
                  >
                    Email Partner
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors group-focus-within:text-indigo-300">
                      <MailIcon className="h-4 w-4" />
                    </span>
                    <input
                      id="partner-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="silvia@agenzia.it"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={loading}
                      aria-invalid={error ? true : undefined}
                      className="w-full rounded-xl border border-slate-700/80 bg-[#0B0F19]/80 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-indigo-400/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="partner-password"
                    className="text-xs font-medium uppercase tracking-[0.1em] text-slate-400"
                  >
                    Password
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors group-focus-within:text-indigo-300">
                      <LockIcon className="h-4 w-4" />
                    </span>
                    <input
                      id="partner-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      aria-invalid={error ? true : undefined}
                      className="w-full rounded-xl border border-slate-700/80 bg-[#0B0F19]/80 py-3 pl-11 pr-12 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-indigo-400/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={loading}
                      aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition-colors hover:text-indigo-300 focus:outline-none focus-visible:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4.5" />
                      <path d="M12 16h.01" />
                    </svg>
                    <span>{error}</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(99,102,241,0.8)] transition-all hover:from-indigo-400 hover:to-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Accesso in corso…
                    </>
                  ) : (
                    'Accedi al Content Studio'
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                <p className="text-[11px] text-slate-500">
                  Accesso riservato ai partner autorizzati.
                </p>
                <a
                  href="/"
                  className="text-[11px] font-medium text-slate-400 transition-colors hover:text-indigo-300"
                >
                  Torna al sito
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B0F19]">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Spinner className="h-4 w-4 text-indigo-300" />
            Caricamento Content Studio…
          </div>
        </div>
      }
    >
      <MarketingAccessForm />
    </Suspense>
  );
}
