"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  Globe,
  Lock,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";

interface PortalItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  href: string;
  pdfHref: string;
  pdfName: string;
  icon: typeof Shield;
  colorClasses: {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    btn: string;
  };
}

const PORTALS: PortalItem[] = [
  {
    id: "direzione",
    title: "Direzione Sanitaria & STP",
    subtitle: "Controllo di gestione, cassa Stripe, Scatola Nera e CRM pazienti.",
    badge: "LIVELLO 1 · CONFIDENZIALE",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    href: "/accesso-direzione",
    pdfHref: "/guide-accesso/Guida-Accesso-Direzione-Sanitaria.pdf",
    pdfName: "PDF Direzione",
    icon: Shield,
    colorClasses: {
      bg: "bg-[#06282E] text-white",
      border: "border-amber-400/30",
      iconBg: "bg-amber-400/20 text-amber-300",
      iconColor: "text-amber-400",
      btn: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold",
    },
  },
  {
    id: "reception",
    title: "Desk & Accoglienza Pazienti",
    subtitle: "Check-in banco, flussi sala d'attesa, cassa e ricevute in sede.",
    badge: "LIVELLO 3 · CLINICA",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    href: "/accesso-reception",
    pdfHref: "/guide-accesso/Guida-Accesso-Reception-Desk.pdf",
    pdfName: "PDF Desk",
    icon: Users,
    colorClasses: {
      bg: "bg-white text-slate-900",
      border: "border-slate-200 hover:border-emerald-300",
      iconBg: "bg-emerald-50 text-emerald-700",
      iconColor: "text-emerald-700",
      btn: "bg-[#0F4C5C] hover:bg-[#0A373E] text-white font-medium",
    },
  },
  {
    id: "marketing",
    title: "Content Studio & Partner Silvia",
    subtitle: "Pannello SEO, telemetria visitatori unici reali, audit log e video reels.",
    badge: "LIVELLO 2 · MARKETING",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    href: "/accesso-marketing",
    pdfHref: "/guide-accesso/Guida-Accesso-Marketing-Silvia.pdf",
    pdfName: "PDF Silvia",
    icon: Globe,
    colorClasses: {
      bg: "bg-[#0B0F19] text-white",
      border: "border-indigo-500/30 hover:border-indigo-400/60",
      iconBg: "bg-indigo-500/20 text-indigo-300",
      iconColor: "text-indigo-400",
      btn: "bg-indigo-600 hover:bg-indigo-500 text-white font-medium",
    },
  },
  {
    id: "medici",
    title: "Specialisti & Medici Ambulatorio",
    subtitle: "Smart PIN rapido su tablet studio touch, cartella clinica e visite di oggi.",
    badge: "LIVELLO 4 · AMBULATORIO",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    href: "/accesso-medici",
    pdfHref: "/guide-accesso/Guida-Accesso-Medici-Ambulatorio.pdf",
    pdfName: "PDF Medici",
    icon: Stethoscope,
    colorClasses: {
      bg: "bg-white text-slate-900",
      border: "border-slate-200 hover:border-teal-300",
      iconBg: "bg-teal-50 text-teal-700",
      iconColor: "text-teal-700",
      btn: "bg-[#0F4C5C] hover:bg-[#0A373E] text-white font-medium",
    },
  },
];

function LoginGatewayContent() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  return (
    <div className="h-screen max-h-screen w-screen bg-[#FAF8F5] text-[#1F2421] flex flex-col justify-between p-2 sm:p-4 overflow-hidden">
      {/* Header bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between shrink-0 py-1 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna al sito Cocoora</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="/guide-accesso/COCOORA-MASTER-ACCESSI-CREDENZIALI.pdf"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-semibold transition-all shadow-xs"
            title="Scarica il Dossier Master completo con tutti gli accessi e credenziali per la Direzione"
          >
            <FileText className="w-3 h-3 text-amber-700" />
            <span>Dossier Master Direzione (PDF)</span>
            <Download className="w-3 h-3 text-amber-700" />
          </a>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Gateway SSL</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col justify-center min-h-0 my-auto py-1">
        <div className="text-center max-w-xl mx-auto mb-3 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F4C5C]/10 border border-[#0F4C5C]/20 text-[#0F4C5C] text-[10px] font-bold tracking-wider uppercase mb-1.5">
            <Shield className="w-3 h-3" />
            SISTEMA DI CONTROLLO ACCESSI SEPARATI
          </div>
          <h1 className="text-xl sm:text-2xl font-serif text-[#0F4C5C] font-bold tracking-tight">
            Gateway di Accesso Riservato
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Ciascun ruolo dispone di un <strong>URL indipendente</strong>, credenziali distinte e manuale PDF dedicato.
          </p>
        </div>

        {/* Griglia 4 Portali Compatta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            const targetHref = fromParam
              ? `${portal.href}?from=${encodeURIComponent(fromParam)}`
              : portal.href;

            return (
              <div
                key={portal.id}
                className={`rounded-2xl p-3.5 sm:p-4 border shadow-sm transition-all duration-150 flex flex-col justify-between ${portal.colorClasses.bg} ${portal.colorClasses.border}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${portal.colorClasses.iconBg}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold font-serif tracking-tight">
                        {portal.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border shrink-0 ${portal.badgeColor}`}
                    >
                      {portal.badge}
                    </span>
                  </div>

                  <p className="text-xs opacity-75 leading-relaxed line-clamp-2 mb-2.5">
                    {portal.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-current/10 flex items-center justify-between gap-2">
                  <Link
                    href={targetHref}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-center text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${portal.colorClasses.btn}`}
                  >
                    <span>Entra nel Portale</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={portal.pdfHref}
                    download
                    className="px-2.5 py-1.5 rounded-lg border border-current/20 hover:bg-black/5 text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors"
                    title={`Scarica ${portal.pdfName}`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>{portal.pdfName}</span>
                    <Download className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-1.5 px-2 text-center text-[10px] text-slate-500 shrink-0">
        Cocoora Centro Medico Autorizzato · Presidio Sanitario Cifrato · GDPR Art. 32
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-[#0F4C5C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginGatewayContent />
    </Suspense>
  );
}
