"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Users,
} from "lucide-react";

type LoginResponse = {
  ok?: boolean;
  error?: string;
  redirectUrl?: string;
  locked?: boolean;
  waitMinutes?: number;
  remainingAttempts?: number;
};

function DeskLoginContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok || !data?.ok) {
        setError(
          data?.error ||
            "Accesso non riuscito. Verifica le credenziali della postazione e riprova."
        );
        setIsLoading(false);
        return;
      }

      const from = searchParams.get("from");
      const target = from || data.redirectUrl || "/segreteria";
      window.location.href = target;
    } catch {
      setError(
        "Impossibile contattare il sistema di autenticazione. Controlla la connessione e riprova."
      );
      setIsLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"
      style={{
        backgroundColor: "#FAF8F5",
        backgroundImage:
          "radial-gradient(1100px 520px at 50% -120px, #F3EFEA 0%, #FAF8F5 62%, #FAF8F5 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#E8E2DA] bg-white p-7 shadow-[0_24px_70px_-32px_rgba(15,76,92,0.35)] sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: "#EAF3F1",
                border: "1px solid #D3E5E1",
              }}
            >
              <Users
                className="h-7 w-7"
                style={{ color: "#0F4C5C" }}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                Postazione Desk Attiva
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h1
              className="font-serif text-3xl leading-tight sm:text-[2rem]"
              style={{ color: "#0F4C5C" }}
            >
              Desk &amp; Accoglienza Pazienti
            </h1>
            <p
              className="mt-2.5 text-sm leading-relaxed"
              style={{ color: "#5B6470" }}
            >
              Check-in Pazienti, Gestione Flussi Sala d&apos;Attesa e Pagamenti
              in Sede
            </p>
          </div>

          <div
            className="mt-6 rounded-2xl border px-4 py-3.5"
            style={{ backgroundColor: "#F1F7F4", borderColor: "#D8E8DF" }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "#2F5A4C" }}
            >
              📋 Postazione abilitata per l&apos;accettazione dei pazienti in
              arrivo, chiamata in ambulatorio ed emissione ricevute immediate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="desk-email"
                className="mb-2 block text-[13px] font-semibold"
                style={{ color: "#0F4C5C" }}
              >
                Email Segreteria
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
                  style={{ color: "#7C8B96" }}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <input
                  id="desk-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  placeholder="segreteria@cocoora.it"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-[#DCD5CC] bg-white pl-11 pr-4 text-[15px] text-[#2A2F33] outline-none transition placeholder:text-[#9AA5AE] focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/10 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="desk-password"
                className="mb-2 block text-[13px] font-semibold"
                style={{ color: "#0F4C5C" }}
              >
                Password Desk
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
                  style={{ color: "#7C8B96" }}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <input
                  id="desk-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Inserisci la password della postazione"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-[#DCD5CC] bg-white pl-11 pr-12 text-[15px] text-[#2A2F33] outline-none transition placeholder:text-[#9AA5AE] focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Nascondi password" : "Mostra password"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg transition hover:bg-[#F1F5F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C]/30"
                  style={{ color: "#7C8B96" }}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-700"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-[15px] font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0F4C5C]/25 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: "#0F4C5C" }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="h-[18px] w-[18px] animate-spin"
                    aria-hidden="true"
                  />
                  Avvio sessione in corso…
                </>
              ) : (
                "Avvia Sessione Desk Accoglienza"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#EFEAE3] pt-5">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium transition hover:opacity-70"
              style={{ color: "#7C8B96" }}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              Torna al sito
            </a>
            <span className="text-[11px] text-[#9AA5AE]">
              Accesso riservato al personale autorizzato
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-[#9AA5AE]">
          Cocoora Centro Medico · Postazione Desk &amp; Accoglienza
        </p>
      </div>
    </main>
  );
}

function DeskLoginFallback() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundColor: "#FAF8F5",
        backgroundImage:
          "radial-gradient(1100px 520px at 50% -120px, #F3EFEA 0%, #FAF8F5 62%, #FAF8F5 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="h-7 w-7 animate-spin"
          style={{ color: "#0F4C5C" }}
          aria-hidden="true"
        />
        <span className="text-[13px] text-[#7C8B96]">
          Caricamento postazione desk…
        </span>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<DeskLoginFallback />}>
      <DeskLoginContent />
    </Suspense>
  );
}
