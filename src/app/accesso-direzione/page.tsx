"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface LoginResponse {
  ok?: boolean;
  error?: string;
  redirectUrl?: string;
  locked?: boolean;
  waitMinutes?: number;
  remainingAttempts?: number;
}

function DirezioneLoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: LoginResponse = {};
      try {
        data = (await response.json()) as LoginResponse;
      } catch {
        data = {};
      }

      if (response.ok && data.ok) {
        const redirectTo =
          data.redirectUrl || searchParams.get("from") || "/admin";
        window.location.href = redirectTo;
        return;
      }

      if (response.status === 429 || data.locked) {
        setError(
          data.error ||
            "Accesso temporaneamente sospeso per troppi tentativi. Riprova più tardi."
        );
      } else if (response.status === 401) {
        const remaining = data.remainingAttempts;
        setError(
          data.error ||
            (typeof remaining === "number"
              ? `Credenziali non valide. Tentativi rimasti: ${remaining}.`
              : "Email o password non corretti. Verifica i dati inseriti.")
        );
      } else {
        setError(
          data.error ||
            "Impossibile completare l'accesso in questo momento. Riprova."
        );
      }
    } catch {
      setError(
        "Errore di rete durante l'accesso. Controlla la connessione e riprova."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md my-auto">
      {/* Alone luminoso dietro la card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 35%, rgba(197, 168, 128, 0.18) 0%, rgba(10, 55, 62, 0) 70%)",
        }}
      />

      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-7 shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: "rgba(10, 55, 62, 0.94)",
          borderColor: "rgba(197, 168, 128, 0.25)",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(197, 168, 128, 0.12)",
        }}
      >
        {/* Filo dorato superiore */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(197,168,128,0) 0%, rgba(197,168,128,0.75) 50%, rgba(197,168,128,0) 100%)",
          }}
        />

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl border"
            style={{
              borderColor: "rgba(197, 168, 128, 0.35)",
              backgroundColor: "rgba(197, 168, 128, 0.08)",
            }}
          >
            <ShieldCheck
              className="h-6 w-6"
              style={{ color: "#C5A880" }}
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em]"
            style={{
              borderColor: "rgba(197, 168, 128, 0.35)",
              backgroundColor: "rgba(197, 168, 128, 0.07)",
              color: "#C5A880",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#C5A880" }}
              aria-hidden="true"
            />
            Portale Riservato · Livello 1
          </span>

          <h1
            className="mt-2 text-xl sm:text-2xl leading-tight font-semibold tracking-tight"
            style={{
              color: "#F4EFE6",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Direzione Sanitaria &amp; STP
          </h1>

          <p
            className="mt-1 max-w-sm text-xs leading-relaxed"
            style={{ color: "rgba(244, 239, 230, 0.62)" }}
          >
            Controllo di Gestione, Flussi Finanziari e Scudo Legale
          </p>
        </div>

        {/* Badge di sicurezza */}
        <div
          className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] leading-relaxed"
          style={{
            borderColor: "rgba(197, 168, 128, 0.2)",
            backgroundColor: "rgba(6, 40, 46, 0.65)",
            color: "rgba(244, 239, 230, 0.68)",
          }}
        >
          <Lock
            className="h-3 w-3 shrink-0"
            style={{ color: "#C5A880" }}
            aria-hidden="true"
          />
          <span>
            Crittografia HMAC-SHA256 · Rate Limiting (Art. 32 GDPR)
          </span>
        </div>

        {/* Alert errore */}
        {error ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs leading-relaxed"
            style={{
              borderColor: "rgba(214, 106, 106, 0.45)",
              backgroundColor: "rgba(214, 106, 106, 0.1)",
              color: "#F2C9C9",
            }}
          >
            <AlertTriangle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: "#E39C9C" }}
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
          <div>
            <label
              htmlFor="direzione-email"
              className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "rgba(244, 239, 230, 0.55)" }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: "rgba(197, 168, 128, 0.75)" }}
                aria-hidden="true"
              />
              <input
                id="direzione-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="admin@cocoora.it"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "rgba(6, 40, 46, 0.7)",
                  borderColor: "rgba(197, 168, 128, 0.25)",
                  color: "#F4EFE6",
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="direzione-password"
              className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "rgba(244, 239, 230, 0.55)" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: "rgba(197, 168, 128, 0.75)" }}
                aria-hidden="true"
              />
              <input
                id="direzione-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Inserisci la password master"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border py-2.5 pl-9 pr-9 text-xs outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "rgba(6, 40, 46, 0.7)",
                  borderColor: "rgba(197, 168, 128, 0.25)",
                  color: "#F4EFE6",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-xs transition"
                style={{ color: "rgba(197, 168, 128, 0.75)" }}
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition hover:brightness-105 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
            style={{
              backgroundColor: "#C5A880",
              color: "#06282E",
              boxShadow: "0 8px 24px rgba(197, 168, 128, 0.22)",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
                Verifica in corso…
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Accedi al Portale Direzione
              </>
            )}
          </button>
        </form>

        {/* Footer card */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3"
          style={{ borderColor: "rgba(197, 168, 128, 0.15)" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs transition hover:opacity-80"
            style={{ color: "rgba(244, 239, 230, 0.55)" }}
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            Torna al sito
          </Link>

          <span
            className="text-[9px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(197, 168, 128, 0.55)" }}
          >
            Sessione protetta
          </span>
        </div>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="w-full max-w-md">
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border p-8"
        style={{
          backgroundColor: "rgba(10, 55, 62, 0.92)",
          borderColor: "rgba(197, 168, 128, 0.25)",
        }}
      >
        <Loader2
          className="h-6 w-6 animate-spin"
          style={{ color: "#C5A880" }}
          aria-hidden="true"
        />
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "rgba(244, 239, 230, 0.55)" }}
        >
          Caricamento portale…
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main
      className="relative flex h-screen max-h-screen w-screen items-center justify-center overflow-hidden p-3 sm:p-4"
      style={{
        backgroundColor: "#06282E",
        backgroundImage:
          "radial-gradient(ellipse 80% 55% at 50% 0%, #0A373E 0%, rgba(10, 55, 62, 0) 65%), radial-gradient(ellipse 60% 45% at 85% 100%, rgba(197, 168, 128, 0.07) 0%, rgba(6, 40, 46, 0) 70%)",
      }}
    >
      {/* Trama sottile di linee */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197, 168, 128, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 168, 128, 0.05) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
        }}
      />

      <Suspense fallback={<LoginFallback />}>
        <DirezioneLoginForm />
      </Suspense>

      <p
        className="absolute bottom-3 left-0 right-0 text-center text-[9px] uppercase tracking-[0.24em]"
        style={{ color: "rgba(244, 239, 230, 0.28)" }}
      >
        Cocoora — Accesso riservato alla Direzione
      </p>
    </main>
  );
}
