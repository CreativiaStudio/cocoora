"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";

type AccessRole = "admin" | "segreteria" | "medico" | "paziente";

interface AccessOption {
  id: AccessRole;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface LoginResponse {
  ok?: boolean;
  error?: string;
  redirectUrl?: string;
  locked?: boolean;
  waitMinutes?: number;
  remainingAttempts?: number;
}

const ACCESS_OPTIONS: AccessOption[] = [
  {
    id: "admin",
    label: "Admin / Direzione Sanitaria",
    description: "Controllo completo, CRM e gestione del centro",
    icon: ShieldCheck,
  },
  {
    id: "segreteria",
    label: "Segreteria CRM",
    description: "Accoglienza, agenda, cassa e referti",
    icon: Users,
  },
  {
    id: "medico",
    label: "Area Medico",
    description: "Agenda giornaliera e pazienti assegnati",
    icon: Stethoscope,
  },
  {
    id: "paziente",
    label: "Area Paziente",
    description: "Percorso personale, referti e appuntamenti",
    icon: UserRound,
  },
];

const ROLE_HOME: Record<AccessRole, string> = {
  admin: "/admin",
  segreteria: "/segreteria",
  medico: "/medico",
  paziente: "/area-paziente",
};

function inferRoleFromPath(path: string | null): AccessRole {
  if (!path) return "admin";
  if (path.startsWith("/segreteria")) return "segreteria";
  if (path.startsWith("/medico")) return "medico";
  if (path.startsWith("/area-paziente")) return "paziente";
  return "admin";
}

function isSafeInternalPath(path: string | null | undefined): path is string {
  if (!path) return false;
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.includes("\\") || path.includes("\n") || path.includes("\r")) return false;
  return true;
}

function resolveRedirect(
  from: string | null,
  role: AccessRole,
  apiRedirect?: string,
): string {
  const fallback = isSafeInternalPath(apiRedirect) ? apiRedirect : ROLE_HOME[role];

  if (!isSafeInternalPath(from)) {
    return fallback;
  }

  const path = from.split("?")[0];
  const allowedPrefixes =
    role === "admin"
      ? ["/admin", "/segreteria", "/medico", "/area-paziente"]
      : [ROLE_HOME[role]];

  const isAllowed = allowedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  return isAllowed ? from : fallback;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  const [role, setRole] = useState<AccessRole>(() => inferRoleFromPath(fromParam));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = (await response.json().catch(() => null)) as LoginResponse | null;

      if (response.ok && data?.ok) {
        const target = resolveRedirect(fromParam, role, data.redirectUrl);
        window.location.assign(target);
        return;
      }

      if (response.status === 429 || data?.locked) {
        setError(
          data?.error ||
            `Accesso temporaneamente sospeso. Riprova tra ${data?.waitMinutes ?? 15} minuti.`,
        );
      } else if (response.status === 401) {
        setError(
          data?.error ||
            "Credenziali non valide o profilo non abilitato per l'area selezionata.",
        );
      } else {
        setError(
          data?.error ||
            "Impossibile completare l'accesso in questo momento. Riprova.",
        );
      }
    } catch {
      setError(
        "Errore di rete durante l'accesso. Controlla la connessione e riprova.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#f4f8fa] text-[#3d3d3c]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 0% 0%, rgba(28,74,92,0.10) 0%, transparent 65%), radial-gradient(55% 45% at 100% 100%, rgba(128,161,178,0.18) 0%, transparent 70%), linear-gradient(180deg, #f7fafb 0%, #eef5f8 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Torna alla home di Cocoora">
            <Logo className="h-8 w-auto sm:h-10" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#80a1b2]/40 bg-white/70 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1c4a5c] transition-colors hover:border-[#1c4a5c] hover:bg-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Torna al sito
          </Link>
        </header>

        <div className="my-auto grid w-full gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:py-12">
          <section className="relative overflow-hidden rounded-[2rem] bg-[#03354b] p-7 text-white shadow-[0_30px_80px_-40px_rgba(3,53,75,0.8)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 70% at 0% 0%, rgba(128,161,178,0.30) 0%, transparent 62%), radial-gradient(60% 60% at 100% 100%, rgba(28,74,92,0.85) 0%, transparent 75%)",
              }}
            />
            <div className="noise pointer-events-none absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-[#80a1b2]/20" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c5dbe3]">
                <LockKeyhole className="h-3.5 w-3.5" />
                Accesso riservato
              </span>

              <h1 className="mt-7 max-w-md font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
                Connessi alla tua salute.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#d8e7ec]/85">
                Un unico punto di accesso per direzione, segreteria, medici e
                pazienti Cocoora. Ogni profilo vede esclusivamente i dati e gli
                strumenti della propria area.
              </p>

              <div className="mt-8 space-y-3.5">
                {[
                  "Sessioni firmate HMAC-SHA256 e cookie HttpOnly",
                  "Accesso differenziato per ruolo e area protetta",
                  "Sessione attiva per 7 giorni, con logout immediato",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#80a1b2]/40 bg-[#80a1b2]/15">
                      <ShieldCheck className="h-3 w-3 text-[#c5dbe3]" />
                    </span>
                    <p className="text-[13px] leading-relaxed text-[#d8e7ec]/85">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-9 border-t border-white/15 pt-5">
                <p className="text-[11px] leading-relaxed text-[#a8c4cf]">
                  Per assistenza sull&apos;accesso scrivi a{" "}
                  <a
                    href="mailto:info@cocoora.it"
                    className="font-semibold text-white underline decoration-[#80a1b2]/60 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    info@cocoora.it
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[2rem] border border-[#dce8ed] bg-white p-6 shadow-[0_28px_70px_-40px_rgba(3,53,75,0.45)] sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#80a1b2]">
                    Cocoora Centro Medico
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#03354b] sm:text-3xl">
                    Accedi alla tua area
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#3d3d3c]/75">
                    Seleziona il tipo di accesso e inserisci le credenziali
                    assegnate.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1c4a5c] text-white shadow-[0_12px_28px_-14px_rgba(28,74,92,0.8)]">
                  <LockKeyhole className="h-5 w-5" />
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <fieldset>
                  <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1c4a5c]">
                    Tipo di accesso
                  </legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {ACCESS_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isSelected = role === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setRole(option.id);
                            setError(null);
                          }}
                          className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#1c4a5c] bg-[#1c4a5c] text-white shadow-[0_14px_30px_-18px_rgba(28,74,92,0.9)]"
                              : "border-[#dce8ed] bg-[#f9fcfd] text-[#03354b] hover:border-[#80a1b2] hover:bg-white"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-white/15 text-white"
                                : "bg-[#e8f1f4] text-[#1c4a5c]"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold leading-snug">
                              {option.label}
                            </span>
                            <span
                              className={`mt-1 block text-[10.5px] leading-relaxed ${
                                isSelected ? "text-white/70" : "text-[#3d3d3c]/60"
                              }`}
                            >
                              {option.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1c4a5c]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nome@cocoora.it"
                      className="w-full rounded-xl border border-[#d5e3e8] bg-[#fbfdfe] px-4 py-3 text-sm text-[#03354b] outline-none transition-all placeholder:text-[#80a1b2]/70 focus:border-[#1c4a5c] focus:bg-white focus:ring-4 focus:ring-[#1c4a5c]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1c4a5c]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Inserisci la password"
                      className="w-full rounded-xl border border-[#d5e3e8] bg-[#fbfdfe] px-4 py-3 pr-12 text-sm text-[#03354b] outline-none transition-all placeholder:text-[#80a1b2]/70 focus:border-[#1c4a5c] focus:bg-white focus:ring-4 focus:ring-[#1c4a5c]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#80a1b2] transition-colors hover:bg-[#eef5f8] hover:text-[#1c4a5c]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[12px] leading-relaxed text-rose-800"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1c4a5c] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(28,74,92,0.9)] transition-all duration-300 hover:bg-[#03354b] hover:shadow-[0_20px_44px_-18px_rgba(3,53,75,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Accesso in corso...
                    </>
                  ) : (
                    <>
                      Accedi
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#eef3f5] pt-5 text-[10.5px] text-[#3d3d3c]/55">
                <ShieldCheck className="h-3.5 w-3.5 text-[#80a1b2]" />
                <span>Connessione protetta · Cookie HttpOnly · SameSite Lax</span>
              </div>
            </div>
          </section>
        </div>

        <footer className="pb-2 text-center text-[10px] leading-relaxed text-[#3d3d3c]/50">
          Cocoora Centro Medico — accesso riservato a personale autorizzato e
          pazienti registrati.
        </footer>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#f4f8fa]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1c4a5c] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
