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
    subtitle: "Controllo di gestione, cassa, Scatola Nera, supervisione e CRM pazienti.",
    badge: "LIVELLO 1 · CONFIDENZIALE",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    href: "/accesso-direzione",
    pdfHref: "/guide-accesso/Guida-Accesso-Direzione-Sanitaria.pdf",
    pdfName: "Manuale Direzione.pdf",
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
    subtitle: "Check-in rapido al banco, flussi sala d'attesa, cassa e ricevute in sede.",
    badge: "LIVELLO 3 · POSTAZIONE CLINICA",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    href: "/accesso-reception",
    pdfHref: "/guide-accesso/Guida-Accesso-Reception-Desk.pdf",
    pdfName: "Manuale Desk.pdf",
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
    subtitle: "Pannello editoriale SEO, telemetria visitatori reali, audit log e reels.",
    badge: "LIVELLO 2 · GROWTH PARTNER",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    href: "/accesso-marketing",
    pdfHref: "/guide-accesso/Guida-Accesso-Marketing-Silvia.pdf",
    pdfName: "Manuale Silvia.pdf",
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
    subtitle: "Smart PIN rapido su tablet touch, cartella clinica e visite di oggi.",
    badge: "LIVELLO 4 · AMBITO CLINICO",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    href: "/accesso-medici",
    pdfHref: "/guide-accesso/Guida-Accesso-Medici-Ambulatorio.pdf",
    pdfName: "Manuale Medici.pdf",
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2421] flex flex-col justify-between">
      {/* Header bar */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna al sito Cocoora</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Gateway Cifrato SSL/TLS</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F4C5C]/10 border border-[#0F4C5C]/20 text-[#0F4C5C] text-xs font-semibold tracking-wider uppercase mb-3">
            <Shield className="w-3.5 h-3.5" />
            SISTEMA DI CONTROLLO ACCESSI SEPARATI
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0F4C5C] font-bold tracking-tight">
            Gateway di Accesso Riservato
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Per tutelare la riservatezza sanitaria e garantire il massimo livello di protezione, ciascun ruolo dispone di un <strong>URL indipendente</strong>, credenziali distinte e manuale operativo dedicato.
          </p>
        </div>

        {/* Griglia 4 Portali */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            const targetHref = fromParam
              ? `${portal.href}?from=${encodeURIComponent(fromParam)}`
              : portal.href;

            return (
              <div
                key={portal.id}
                className={`rounded-2xl p-6 sm:p-8 border shadow-lg transition-all duration-200 flex flex-col justify-between ${portal.colorClasses.bg} ${portal.colorClasses.border}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${portal.colorClasses.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${portal.badgeColor}`}
                    >
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif mb-2 tracking-tight">
                    {portal.title}
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed mb-6">
                    {portal.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-current/10 space-y-3">
                  <Link
                    href={targetHref}
                    className={`w-full py-3 px-4 rounded-xl text-center text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${portal.colorClasses.btn}`}
                  >
                    <span>Entra nel Portale Dedicato</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-between text-xs opacity-75 pt-1">
                    <span className="font-mono text-[11px]">{portal.href}</span>
                    <a
                      href={portal.pdfHref}
                      download
                      className="inline-flex items-center gap-1.5 hover:underline font-medium"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{portal.pdfName}</span>
                      <Download className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Box Informativo / Guida PDF Totale */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Manuali Operativi Ufficiali in PDF Disponibili
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Scarica i singoli documenti con link diretto, credenziali ufficiali e istruzioni di configurazione per il personale.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <a
              href="/guide-accesso/Guida-Accesso-Direzione-Sanitaria.pdf"
              download
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>PDF Direzione</span>
            </a>
            <a
              href="/guide-accesso/Guida-Accesso-Reception-Desk.pdf"
              download
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>PDF Desk</span>
            </a>
            <a
              href="/guide-accesso/Guida-Accesso-Marketing-Silvia.pdf"
              download
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-700" />
              <span>PDF Silvia</span>
            </a>
            <a
              href="/guide-accesso/Guida-Accesso-Medici-Ambulatorio.pdf"
              download
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>PDF Medici</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <p>
          Cocoora Centro Medico Autorizzato · Presidio Sanitario Cifrato · Conforme GDPR Art. 32
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#0F4C5C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginGatewayContent />
    </Suspense>
  );
}
