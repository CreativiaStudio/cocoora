"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Lock,
  RotateCcw,
  Shield,
  Sparkles,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";

interface RoleOption {
  id: "admin" | "segreteria" | "paziente";
  name: string;
  badge: string;
  icon: string;
  dest: string;
  accent: string;
  description: string;
}

const ROLES: RoleOption[] = [
  {
    id: "admin",
    name: "Admin (Direzione Sanitaria)",
    badge: "Controllo Totale",
    icon: "🏛️",
    dest: "/admin",
    accent: "from-teal-600 to-emerald-700",
    description: "Medici, turni, stanze, matrice incrocio, video verticali e SEO",
  },
  {
    id: "segreteria",
    name: "Segretaria (Reception CRM)",
    badge: "Front-Desk",
    icon: "📋",
    dest: "/segreteria",
    accent: "from-sky-600 to-cyan-700",
    description: "Accoglienza live, sala d'attesa, caricamento referti e cassa",
  },
  {
    id: "paziente",
    name: "Paziente (Fascicolo Sanitario)",
    badge: "Area Personale",
    icon: "🩺",
    dest: "/area-paziente",
    accent: "from-indigo-600 to-teal-700",
    description: "Referti PDF, visite confermate, piano rate e prenotazione live",
  },
];

export function DemoRoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [minimized, setMinimized] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cocoora_role_minimized") === "true";
    }
    return false;
  });

  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  // Determina il ruolo attivo in base al path
  const getActiveRole = (): RoleOption => {
    if (pathname.startsWith("/admin")) return ROLES[0];
    if (pathname.startsWith("/segreteria")) return ROLES[1];
    if (pathname.startsWith("/area-paziente")) return ROLES[2];
    return ROLES[0];
  };

  const activeRole = getActiveRole();

  const handleToggleMinimize = () => {
    const next = !minimized;
    setMinimized(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("cocoora_role_minimized", String(next));
    }
  };

  const handleSwitch = (role: RoleOption) => {
    setSwitchingTo(role.id);
    router.push(role.dest);
    setTimeout(() => setSwitchingTo(null), 500);
  };

  return (
    <aside
      aria-label="Simulatore Ruoli Cocoora"
      className="fixed bottom-4 right-4 z-50 font-sans select-none"
    >
      {minimized ? (
        /* ── Pillola Minimizzata Compatta ── */
        <button
          type="button"
          onClick={handleToggleMinimize}
          className="flex items-center gap-2.5 rounded-full border border-teal-400/40 bg-navy-deep/95 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-teal-300"
        >
          <span className="text-base">{activeRole.icon}</span>
          <span className="text-slate-300">Simulatore:</span>
          <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-teal-300 border border-teal-500/30">
            {activeRole.name.split(" ")[0]}
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-400 ml-1" />
        </button>
      ) : (
        /* ── Pannello Espanso Elegante ── */
        <div className="w-[340px] sm:w-[420px] rounded-2xl border border-teal-500/30 bg-navy-deep/95 p-4 text-white shadow-2xl backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎭</span>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  Simulatore Ruoli Piattaforma
                </h4>
                <p className="text-[11px] text-slate-400">
                  Switcha all&apos;istante tra le 3 prospettive cliniche
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleMinimize}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
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
                  onClick={() => handleSwitch(role)}
                  className={`relative flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-teal-400/80 bg-teal-900/30 shadow-md"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} text-lg shadow-xs`}
                    >
                      {role.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {role.name}
                        </span>
                        {isActive && (
                          <span className="rounded-full bg-teal-400/20 border border-teal-400/40 px-1.5 py-0.2 text-[10px] font-semibold text-teal-300">
                            Attivo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-slate-500 text-xs ml-2">
                    {isActive ? "●" : "→"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Informativo */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-teal-400" />
              Ambiente Demo Interattivo Live
            </span>
            <button
              type="button"
              onClick={handleToggleMinimize}
              className="text-teal-400 hover:underline"
            >
              Minimizza
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
