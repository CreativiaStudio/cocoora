"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Loader2,
  Lock,
  RotateCcw,
  Shield,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";

export interface RoleOption {
  id: "admin" | "agenzia" | "segreteria" | "medico" | "paziente";
  name: string;
  badge: string;
  icon: string;
  dest: string;
  accent: string;
  description: string;
}

export const ROLES: RoleOption[] = [
  {
    id: "admin",
    name: "Admin (Direzione Sanitaria)",
    badge: "Controllo Totale",
    icon: "🏛️",
    dest: "/admin",
    accent: "from-teal-600 to-emerald-700",
    description: "Calendario 4 studi, medici, CRM cartelle, flussi cassa e incassi",
  },
  {
    id: "agenzia",
    name: "Agenzia Silvia (SEO & Contenuti)",
    badge: "Vista Marketing",
    icon: "🌐",
    dest: "/admin",
    accent: "from-sky-600 to-indigo-700",
    description: "Analytics server-side, GSC / GA4 / GTM, SEO trattamenti e video Reels",
  },
  {
    id: "segreteria",
    name: "Segreteria (Reception CRM)",
    badge: "Front-Desk",
    icon: "📋",
    dest: "/segreteria",
    accent: "from-cyan-600 to-teal-700",
    description: "Desk accoglienza live, check-in di oggi, cassa desk e stampa referti",
  },
  {
    id: "medico",
    name: "Area Medico Specialista",
    badge: "Cartella Studio",
    icon: "🩺",
    dest: "/medico",
    accent: "from-emerald-600 to-teal-800",
    description: "Agenda visite assegnate, cartella clinica e note specialistiche",
  },
  {
    id: "paziente",
    name: "Fascicolo Paziente",
    badge: "Area Personale",
    icon: "👤",
    dest: "/area-paziente",
    accent: "from-indigo-600 to-purple-700",
    description: "Referti PDF scaricabili, storico visite e abbonamento Club",
  },
];

export function DemoRoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [minimized, setMinimized] = useState<boolean>(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);
  const [currentSessionRole, setCurrentSessionRole] = useState<string>("admin");

  // Rileva ruolo attivo
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user?.role) {
          setCurrentSessionRole(d.user.role);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Il simulatore appare nelle aree gestionali o quando si sta navigando tra le viste
  const isBackoffice =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/segreteria") ||
    pathname.startsWith("/medico") ||
    pathname.startsWith("/area-paziente");

  if (!isBackoffice) {
    return null;
  }

  // Determina il ruolo attivo visualizzato
  const getActiveRole = (): RoleOption => {
    if (pathname.startsWith("/medico")) return ROLES[3];
    if (pathname.startsWith("/segreteria")) return ROLES[2];
    if (pathname.startsWith("/area-paziente")) return ROLES[4];
    if (pathname.startsWith("/admin")) {
      return currentSessionRole === "agenzia" ? ROLES[1] : ROLES[0];
    }
    return ROLES[0];
  };

  const activeRole = getActiveRole();

  const handleToggleMinimize = () => {
    setMinimized(!minimized);
  };

  const handleSwitch = async (role: RoleOption) => {
    setSwitchingTo(role.id);

    try {
      // Chiama l'API per aggiornare la sessione istantaneamente con il nuovo ruolo
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role.id }),
      });

      const data = await res.json();
      if (data.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        window.location.href = role.dest;
      }
    } catch {
      window.location.href = role.dest;
    }
  };

  return (
    <aside
      aria-label="Simulatore Ruoli Cocoora"
      className="fixed bottom-5 right-5 z-[99999] font-sans select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {minimized ? (
        /* ── Pillola Minimizzata Compatta ── */
        <button
          type="button"
          onClick={handleToggleMinimize}
          className="flex items-center gap-2.5 rounded-full border border-teal-400/50 bg-[#091e28]/95 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-teal-300 hover:shadow-2xl cursor-pointer"
        >
          <span className="text-base">{activeRole.icon}</span>
          <span className="text-slate-200">Vista:</span>
          <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-teal-300 border border-teal-500/40 font-bold">
            {activeRole.name.split(" ")[0]}
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-300 ml-1" />
        </button>
      ) : (
        /* ── Pannello Espanso Elegante ── */
        <div className="w-[340px] sm:w-[430px] rounded-2xl border border-teal-500/30 bg-[#091e28]/98 p-4 text-white shadow-2xl backdrop-blur-xl transition-all ring-1 ring-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 border border-teal-500/30 text-base">
                🎭
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide text-white">
                  Simulatore 5 Viste Live (Mario &amp; Agenzia)
                </h4>
                <p className="text-[11px] text-teal-200/80">
                  Passa all&apos;istante tra tutti i 5 livelli operativi per rifinire e testare
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleMinimize}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Riduci a icona"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Griglia Ruoli */}
          <div className="mt-3 grid grid-cols-1 gap-2">
            {ROLES.map((role) => {
              const isActive = activeRole.id === role.id;
              const isSwitching = switchingTo === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  disabled={isSwitching}
                  onClick={() => handleSwitch(role)}
                  className={`group relative flex items-center justify-between rounded-xl border p-2.5 sm:p-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? "border-teal-400 bg-teal-900/50 shadow-lg ring-1 ring-teal-400/50"
                      : "border-slate-700/70 bg-[#122834] hover:border-teal-400/60 hover:bg-[#16303e]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} text-base shadow-md ring-1 ring-white/10`}
                    >
                      {role.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {role.name}
                        </span>
                        {isActive ? (
                          <span className="rounded-full bg-teal-400/20 border border-teal-400/50 px-2 py-0.2 text-[9px] font-semibold text-teal-300">
                            Attivo
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-700/60 border border-slate-600/50 px-1.5 py-0.2 text-[9px] font-medium text-slate-300">
                            {role.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] leading-tight mt-0.5 ${
                          isActive ? "text-teal-100" : "text-slate-300"
                        }`}
                      >
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs ml-2">
                    {isSwitching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-teal-300" />
                    ) : isActive ? (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"></span>
                    ) : (
                      <span className="text-slate-400 group-hover:text-teal-300 group-hover:translate-x-0.5 transition-transform text-sm">
                        →
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Informativo */}
          <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-teal-500/20 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Token autenticati al volo · Zero logout</span>
            </span>
            <button
              type="button"
              onClick={handleToggleMinimize}
              className="text-teal-300 hover:text-teal-200 font-semibold hover:underline cursor-pointer"
            >
              Minimizza
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
