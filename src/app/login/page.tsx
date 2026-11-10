"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { SMART_DOCTORS, type AppRole } from "@/lib/auth-session";

interface RoleCard {
  id: AppRole;
  label: string;
  badge: string;
  icon: typeof Shield;
  description: string;
}

const ROLES: RoleCard[] = [
  {
    id: "admin",
    label: "Admin & Direzione",
    badge: "Livello 1",
    icon: Shield,
    description: "Direzione Sanitaria, incrocio stanze, medici e cassa",
  },
  {
    id: "agenzia",
    label: "Agenzia SEO & Contenuti",
    badge: "Livello 2",
    icon: Globe,
    description: "Pannello Silvia: SEO, pagine, video reels, tracking e analytics",
  },
  {
    id: "segreteria",
    label: "Segreteria & Reception",
    badge: "Livello 3",
    icon: Users,
    description: "Accoglienza pazienti, calendario live, check-in e cassa",
  },
  {
    id: "medico",
    label: "Area Medico Specialista",
    badge: "Livello 4",
    icon: Stethoscope,
    description: "Magic Link 1-Tap, PIN personale protetto e visite di oggi",
  },
  {
    id: "paziente",
    label: "Fascicolo Paziente",
    badge: "Livello 5",
    icon: UserCheck,
    description: "Referti PDF, stato abbonamento Club e storico visite",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const urlError = searchParams.get("error");

  const [selectedRole, setSelectedRole] = useState<AppRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modalità Medico
  const [doctorAuthMode, setDoctorAuthMode] = useState<"magic_link" | "smart_pin" | "password">("smart_pin");
  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState<string>(SMART_DOCTORS[0].slug);
  const [doctorPin, setDoctorPin] = useState("");
  const [generatedMagicLink, setGeneratedMagicLink] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);

  const handleSelectRole = (role: AppRole) => {
    setSelectedRole(role);
    setGeneratedMagicLink(null);
    setError(null);
    setEmail("");
    setPassword("");
  };

  // Richiesta Magic Link 1-Tap Medico
  const handleRequestMagicLink = async () => {
    setLoading(true);
    setError(null);
    setGeneratedMagicLink(null);

    try {
      const res = await fetch("/api/auth/doctor-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorSlug: selectedDoctorSlug }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Impossibile generare il Magic Link.");
      } else {
        setGeneratedMagicLink(data.magicLinkUrl);
      }
    } catch {
      setError("Errore di rete durante la richiesta del Magic Link.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let bodyPayload: Record<string, string>;

      if (selectedRole === "medico" && doctorAuthMode === "smart_pin") {
        bodyPayload = {
          doctorSlug: selectedDoctorSlug,
          pin: doctorPin,
        };
      } else {
        bodyPayload = { email, password };
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Errore durante l'autenticazione.");
        setLoading(false);
        return;
      }

      const destination = from || data.redirectUrl || "/admin";
      router.push(destination);
      router.refresh();
    } catch {
      setError("Errore di connessione. Riprova tra qualche istante.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03354b] text-white">
      {/* Glow depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(128,161,178,0.2) 0%, transparent 70%), radial-gradient(50% 45% at 85% 30%, rgba(28,74,92,0.6) 0%, transparent 70%), linear-gradient(180deg, #03354b 0%, #022434 100%)",
        }}
      />
      <div className="noise pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-12 sm:px-6">
        {/* Top Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-200/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al Sito Pubblico
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/60 px-3.5 py-1 text-xs text-teal-300 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Blindatura Anti-Brute Force Attiva (Max 5 tentativi)</span>
          </div>
        </div>

        <div className="grid gap-8 rounded-3xl border border-teal-500/20 bg-dark-navy/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10 lg:grid-cols-12">
          {/* Colonna Sinistra: 5 Ruoli */}
          <div className="lg:col-span-5 border-b border-teal-500/15 pb-6 lg:border-b-0 lg:border-r lg:pr-8">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-900/60 p-2 border border-teal-400/30 shadow-md">
                <Image
                  src="/cocoora-symbol.png"
                  alt="Cocoora"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-white tracking-wide">
                  Cocoora Centro Medico
                </h1>
                <p className="text-[10px] text-teal-200/70 uppercase tracking-widest">
                  Accesso Gestionale Riservato
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-teal-100/75">
              Seleziona il tuo profilo professionale per accedere all&apos;area dedicata.
            </p>

            <div className="mt-5 space-y-2">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r.id)}
                    className={`w-full text-left rounded-xl p-2.5 transition-all border ${
                      isSelected
                        ? "border-teal-400 bg-teal-800/40 text-white shadow-md shadow-teal-950/40"
                        : "border-teal-500/10 bg-teal-950/30 text-teal-200/70 hover:border-teal-500/30 hover:bg-teal-950/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-teal-300" : "text-teal-400/60"}`} />
                        <span className="text-xs font-semibold">{r.label}</span>
                      </div>
                      <span className="rounded-full bg-teal-500/10 px-1.5 py-0.2 text-[9px] font-mono text-teal-300 border border-teal-500/20">
                        {r.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-teal-200/60 line-clamp-1">{r.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colonna Destra: Modulo Autenticazione */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pl-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400">
                {selectedRole === "agenzia"
                  ? "Pannello Silvia & Marketing"
                  : selectedRole === "medico"
                  ? "Sicurezza Clinica Specialisti"
                  : "Autenticazione Operatori"}
              </span>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-white">
                {selectedRole === "agenzia"
                  ? "Area Agenzia SEO & Contenuti"
                  : selectedRole === "medico"
                  ? "Accesso Medico Blindato"
                  : "Entra nel pannello"}
              </h2>
              <p className="mt-1 text-xs text-teal-200/70">
                {selectedRole === "agenzia"
                  ? "Gestione keyword, pagine pubbliche, reels video e monitoraggio Silvia."
                  : selectedRole === "medico"
                  ? "Protezione crittografica con Magic Link 1-Tap a scadenza o PIN personale."
                  : "Inserisci le credenziali associate al tuo profilo professionale."}
              </p>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/60 p-3 text-xs text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Modalità Medico: 3 Metodi di Accesso Sicuro */}
            {selectedRole === "medico" && (
              <div className="mt-4 space-y-4">
                <div className="flex rounded-xl border border-teal-500/20 bg-teal-950/50 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorAuthMode("magic_link");
                      setGeneratedMagicLink(null);
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      doctorAuthMode === "magic_link"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-teal-300/70 hover:text-white"
                    }`}
                  >
                    ⚡ Magic Link 1-Tap
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorAuthMode("smart_pin");
                      setGeneratedMagicLink(null);
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      doctorAuthMode === "smart_pin"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-teal-300/70 hover:text-white"
                    }`}
                  >
                    🔢 PIN Personale
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorAuthMode("password");
                      setGeneratedMagicLink(null);
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      doctorAuthMode === "password"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-teal-300/70 hover:text-white"
                    }`}
                  >
                    Password
                  </button>
                </div>

                {/* Selettore Specialista per Medico */}
                <div>
                  <label className="block text-xs font-medium text-teal-200 mb-1.5">
                    Seleziona lo Specialista in Turno
                  </label>
                  <select
                    value={selectedDoctorSlug}
                    onChange={(e) => {
                      setSelectedDoctorSlug(e.target.value);
                      setGeneratedMagicLink(null);
                    }}
                    className="w-full rounded-xl border border-teal-500/30 bg-teal-950/80 py-2.5 px-3 text-xs text-white focus:border-teal-400 focus:outline-none"
                  >
                    {SMART_DOCTORS.map((doc) => (
                      <option key={doc.slug} value={doc.slug} className="bg-[#03354b]">
                        {doc.name} — {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MODALITÀ 1: MAGIC LINK 1-TAP (Inattaccabile da hacker) */}
                {doctorAuthMode === "magic_link" && (
                  <div className="rounded-2xl border border-teal-500/30 bg-teal-950/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span>Accesso Inattaccabile Zero Password</span>
                    </div>
                    <p className="text-[11px] text-teal-200/80 leading-relaxed">
                      Genera un token firmato HMAC-SHA256 valido <strong>15 minuti a uso singolo</strong>.
                      Impossibile da bucare via brute-force.
                    </p>

                    {generatedMagicLink ? (
                      <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Magic Link Sicuro Pronto all&apos;Uso!</span>
                        </div>
                        <p className="text-[11px] text-teal-200/80">
                          Clicca sul pulsante sottostante per aprire all&apos;istante la tua cartella clinica:
                        </p>
                        <a
                          href={generatedMagicLink}
                          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
                        >
                          <span>Entra Subito nell&apos;Area Medico (1-Tap)</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestMagicLink}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Zap className="h-4 w-4 text-amber-300" />
                        <span>{loading ? "Generazione token..." : "Genera Magic Link 1-Tap"}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Form con PIN o Password */}
            {(selectedRole !== "medico" || doctorAuthMode !== "magic_link") && (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {selectedRole === "medico" && doctorAuthMode === "smart_pin" ? (
                  <div>
                    <label className="block text-xs font-medium text-teal-200 mb-1.5">
                      PIN Personale Medico (6 cifre)
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300/50" />
                      <input
                        type="password"
                        maxLength={6}
                        required
                        value={doctorPin}
                        onChange={(e) => setDoctorPin(e.target.value)}
                        className="w-full rounded-xl border border-teal-500/30 bg-teal-950/60 py-2.5 pl-10 pr-4 text-xs font-mono text-white tracking-widest placeholder-teal-400/40 focus:border-teal-400 focus:outline-none"
                        placeholder="••••••"
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-teal-200/60 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                      <span>Blocco di sicurezza di 15 minuti attivo dopo 5 tentativi errati consecutivi.</span>
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-teal-200 mb-1.5">
                        Indirizzo Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300/50" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-teal-500/30 bg-teal-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-teal-400/40 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                          placeholder="nome@cocoora.it"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-teal-200 mb-1.5">
                        Password di Accesso
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300/50" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-teal-500/30 bg-teal-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-teal-400/40 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-semibold text-white shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-500 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifica credenziali in corso...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {selectedRole === "agenzia"
                          ? "Accedi all'Area Agenzia SEO"
                          : selectedRole === "medico"
                          ? "Verifica PIN & Sblocca Cartella"
                          : "Accedi alla Piattaforma"}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-teal-500/10 pt-3 text-[11px] text-teal-200/50">
              <p>
                Infrastruttura conforme all&apos;Art. 32 GDPR: rate limiting per IP, crittografia TLS 1.3
                e sessioni mediche circoscritte al turno di visita (12h).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#03354b] flex items-center justify-center text-teal-200 text-xs">
          Caricamento autenticazione...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
