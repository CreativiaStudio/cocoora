"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Dna,
  GraduationCap,
  HeartPulse,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NAV_NODES, SITE } from "@/lib/site";
import type { NavNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ButtonLink } from "./ui";

function getCategoryIcon(label: string, href: string): LucideIcon {
  const l = label.toLowerCase();
  const h = href.toLowerCase();

  if (l.includes("odontoiatria") || l.includes("invisalign") || l.includes("sorriso")) return Smile;
  if (l.includes("estetica") || l.includes("rigenerativa")) return Sparkles;
  if (l.includes("diagnostica") || l.includes("cardiologia") || l.includes("ecografia")) return HeartPulse;
  if (l.includes("specialisti") || l.includes("medici") || h.includes("/medici")) return GraduationCap;
  if (l.includes("club") || l.includes("piani") || l.includes("salute") || h.includes("/club")) return ShieldCheck;
  if (l.includes("precision") || l.includes("dna") || l.includes("microbiota") || h.includes("/precision")) return Dna;
  if (l.includes("chi siamo") || l.includes("studio") || l.includes("metodo") || l.includes("sede")) return Building2;
  if (l.includes("trattamenti")) return Activity;

  return Stethoscope;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDesktop(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDesktop(null), 150);
  };

  const closeAll = () => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setMobileAccordion(null);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      {/* ── 1. Top Bar di Garanzia & Accesso Rapido ────────────────────── */}
      <div className="bg-dark-navy border-b border-white/10 text-[11px] sm:text-xs text-teal-100/90 py-1.5 px-4 sm:px-8 lg:px-10 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Promessa clinica tangibile */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Prima visita garantita entro 72h
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline text-teal-200/75">
              Docenti Università Federico II & Vanvitelli a Napoli
            </span>
          </div>

          {/* Contatti diretti e Area Paziente */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:08118182091"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3 text-slate-accent" />
              <span>081 18182091</span>
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle className="h-3 w-3 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/club/discover"
              onClick={closeAll}
              className="flex items-center gap-1.5 font-medium text-slate-accent hover:text-white transition-colors"
            >
              <Lock className="h-3 w-3" />
              <span>Area Paziente</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Main Navbar Bianca Permanente ───────────────────────────── */}
      <div
        className={cn(
          "bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 ease-in-out",
          scrolled ? "shadow-[0_8px_30px_-15px_rgba(0,52,75,0.18)]" : "shadow-xs"
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 transition-all duration-300 ease-in-out",
            scrolled ? "h-16" : "h-20 sm:h-22"
          )}
        >
          {/* Logo Brand con claim leggibile */}
          <Link href="/" aria-label="Cocoora — Home" onClick={closeAll} className="shrink-0 flex items-center">
            <Logo
              variant="dark"
              className={cn(
                "w-auto transition-all duration-300 ease-in-out",
                scrolled ? "h-8 sm:h-9" : "h-10 sm:h-12"
              )}
            />
          </Link>

          {/* ── Desktop Navigation a 4 Macro-Pilastri ──────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={scheduleClose}>
            {NAV_NODES.map((node) => (
              <div key={node.label} className="relative" onMouseEnter={() => openMenu(node.label)}>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    node.label === "Piani Salute"
                      ? "text-teal-900 bg-teal-50/80 border border-teal-200/70 hover:bg-teal-100/70"
                      : "text-charcoal/80 hover:text-dark-navy hover:bg-slate-50/90",
                    openDesktop === node.label && "bg-slate-100 text-dark-navy font-semibold shadow-xs"
                  )}
                  aria-expanded={openDesktop === node.label}
                >
                  {node.label === "Piani Salute" && (
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
                  )}
                  {node.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      openDesktop === node.label && "rotate-180 text-teal-800"
                    )}
                  />
                </button>

                {/* ── Megamenu Pannello a Schermo Ampio ─────────────────── */}
                <div
                  className={cn(
                    "absolute left-1/2 top-full z-40 w-[min(960px,94vw)] -translate-x-1/2 pt-3 transition-all duration-250 ease-out",
                    openDesktop === node.label
                      ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
                      : "pointer-events-none translate-y-3 opacity-0 scale-[0.98]"
                  )}
                >
                  <div className="overflow-hidden rounded-[2.25rem] border border-slate-200/90 bg-white shadow-[0_35px_100px_-25px_rgba(0,52,75,0.28)] backdrop-blur-2xl">
                    {/* Render Megamenu specifico in base alla sezione */}
                    {node.label === "Visite & Trattamenti" && (
                      <MegamenuVisiteTrattamenti
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onClose={closeAll}
                      />
                    )}
                    {node.label === "I Medici" && <MegamenuMedici onClose={closeAll} />}
                    {node.label === "Lo Studio" && <MegamenuStudio onClose={closeAll} />}
                    {node.label === "Piani Salute" && <MegamenuPianiSalute onClose={closeAll} />}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* CTA Permanente Destra */}
          <div className="hidden lg:flex items-center gap-3">
            <ButtonLink href="/contatti" size="md">
              Prenota Visita
            </ButtonLink>
          </div>

          {/* Pulsante Menu Mobile */}
          <button
            type="button"
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white/80 text-teal-800 backdrop-blur-sm lg:hidden hover:bg-white transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Slide-Over & Navigation ─────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-dark-navy/50 backdrop-blur-sm" onClick={closeAll} />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header Mobile */}
          <div className="flex items-center justify-between border-b border-teal-100 px-6 py-5">
            <Logo variant="dark" className="h-9 w-auto" />
            <button
              type="button"
              aria-label="Chiudi menu"
              onClick={closeAll}
              className="rounded-full p-2 text-charcoal/60 transition-colors hover:bg-teal-50 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Banner Rassicurazione Mobile */}
          <div className="bg-teal-50/70 border-b border-teal-100/70 px-6 py-2.5 text-xs text-teal-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Prima visita garantita entro 72 ore a Napoli</span>
          </div>

          {/* Elenco Pagine Accordion */}
          <nav className="flex-1 overflow-y-auto px-5 py-5">
            <ul className="flex flex-col gap-1.5">
              {NAV_NODES.map((node) => (
                <li key={node.label} className="border-b border-slate-100 py-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileAccordion((v) => (v === node.label ? null : node.label))
                    }
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-base font-medium text-dark-navy transition-colors hover:bg-teal-50"
                  >
                    <span className="flex items-center gap-2.5">
                      {node.label === "Piani Salute" && (
                        <ShieldCheck className="h-4 w-4 text-teal-600" />
                      )}
                      {node.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-accent transition-transform duration-300",
                        mobileAccordion === node.label && "rotate-180"
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "grid overflow-hidden transition-all duration-300",
                      mobileAccordion === node.label
                        ? "grid-rows-[1fr] pb-2 opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="flex flex-col gap-1 overflow-hidden pl-2">
                      {node.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeAll}
                          className="rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal/80 transition-colors hover:bg-teal-50 hover:text-teal-900"
                        >
                          {child.label}
                          {child.description && (
                            <span className="mt-0.5 block text-xs font-normal text-charcoal/50">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Bar Mobile Azioni Rapide */}
          <div className="border-t border-teal-100 p-5 space-y-2.5 bg-slate-50/70">
            <ButtonLink href="/contatti" className="w-full" size="md">
              Prenota Visita
            </ButtonLink>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:08118182091"
                className="flex items-center justify-center gap-1.5 rounded-full border border-teal-200 bg-white py-2.5 text-xs font-semibold text-teal-900 shadow-xs"
              >
                <Phone className="h-3.5 w-3.5 text-teal-700" /> Chiama
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/60 py-2.5 text-xs font-semibold text-emerald-900 shadow-xs"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── MEGAMENU 1: VISITE & TRATTAMENTI ────────────────────────────────────────
function MegamenuVisiteTrattamenti({
  searchTerm,
  setSearchTerm,
  onClose,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col">
      {/* Barra di ricerca per sintomo in cima */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-7 py-3 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cosa ti serve? Es. mal di schiena, invisalign, cardiologo, filler..."
            className="w-full rounded-full border border-teal-200/70 bg-white py-1.5 pl-9 pr-4 text-xs text-charcoal placeholder:text-charcoal/45 focus:border-teal-700 focus:outline-none"
          />
        </div>
        <span className="text-[11px] font-semibold text-slate-accent tracking-wider uppercase hidden sm:inline">
          Poliambulatorio & Chirurgia Digitale
        </span>
      </div>

      {/* 4 Colonne per Ambito Clinico */}
      <div className="grid grid-cols-4 gap-6 p-7">
        {/* Colonna 1: Visite Specialistiche */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-accent mb-3 flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal-700" /> Visite Specialistiche
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/servizi/diagnostica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Cardiologia & ECG
              </Link>
            </li>
            <li>
              <Link href="/servizi/diagnostica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Senologia & Prevenzione Donna
              </Link>
            </li>
            <li>
              <Link href="/servizi/diagnostica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Ecografie & Diagnostica Rapida
              </Link>
            </li>
            <li>
              <Link href="/servizi/diagnostica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Pediatria & Cura della Crescita
              </Link>
            </li>
            <li>
              <Link href="/servizi/diagnostica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Ginecologia & Benessere Intimo
              </Link>
            </li>
            <li>
              <Link href="/servizi/diagnostica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Oculistica & Salute della Vista
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonna 2: Sorriso & Ortodonzia */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-accent mb-3 flex items-center gap-1.5">
            <Smile className="h-3.5 w-3.5 text-teal-700" /> Sorriso & Odontoiatria
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/servizi/odontoiatria" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700 flex items-center gap-1">
                <span>Invisalign Diamond</span>
                <span className="text-[9px] bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded-full font-bold">TOP</span>
              </Link>
            </li>
            <li>
              <Link href="/servizi/odontoiatria" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Ortodonzia Adulti & Bambini
              </Link>
            </li>
            <li>
              <Link href="/servizi/odontoiatria" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Implantologia & Chirurgia 3D
              </Link>
            </li>
            <li>
              <Link href="/servizi/odontoiatria" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Estetica Dentale & Sbiancamento
              </Link>
            </li>
            <li>
              <Link href="/servizi/odontoiatria" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Igiene Orale & Prevenzione Carie
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonna 3: Medicina Estetica */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-accent mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-700" /> Estetica & Rigenerativa
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/servizi/medicina-estetica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Ringiovanimento Viso Naturale
              </Link>
            </li>
            <li>
              <Link href="/servizi/medicina-estetica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Laserterapia & Macchie Cutanee
              </Link>
            </li>
            <li>
              <Link href="/servizi/medicina-estetica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Cryoliposculpt & Rimodellamento
              </Link>
            </li>
            <li>
              <Link href="/servizi/medicina-estetica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Biorivitalizzazione & Peeling
              </Link>
            </li>
            <li>
              <Link href="/servizi/medicina-estetica" onClick={onClose} className="font-medium text-dark-navy hover:text-teal-700">
                Carbossiterapia Medicale
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonna 4: Per Obiettivo & Precision */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-200/60 shadow-xs">
              Medicina del Futuro
            </span>
            <h5 className="font-serif text-sm font-semibold text-dark-navy mt-2.5">
              Cocoora Precision
            </h5>
            <p className="text-[11px] text-charcoal/65 mt-1 leading-relaxed">
              Test DNA 5 predittivo e sequenziamento microbiota per una longevità attiva.
            </p>
          </div>
          <Link
            href="/precision"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-dark-navy"
          >
            Scopri Precision <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Ponte di Conversione Inferiore */}
      <div className="border-t border-slate-100 bg-slate-50/90 px-7 py-3 flex items-center justify-between text-xs text-charcoal/75">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          <span>Molte di queste prestazioni sono <strong>già incluse</strong> nei nostri Piani Salute annuali.</span>
        </span>
        <Link
          href="/club"
          onClick={onClose}
          className="font-semibold text-teal-900 hover:text-dark-navy flex items-center gap-1"
        >
          Calcola quanto risparmi col Club <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── MEGAMENU 2: I MEDICI ───────────────────────────────────────────────────
function MegamenuMedici({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-7">
      <div className="grid grid-cols-12 gap-7">
        {/* Colonna Sinistra: Filosofia e Filtri */}
        <div className="col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-accent">
              Docenti & Specialisti Universitari
            </span>
            <h3 className="font-serif text-xl font-semibold text-dark-navy mt-1">
              Zero Liste d&apos;Attesa, Massimo Rigore Clinico
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
              Abbiamo stretto convenzioni con i docenti delle cattedre dell&apos;Università Federico II, Vanvitelli e dell&apos;Ospedale Cardarelli per garantirti una visita specialistica immediata, senza le attese del sistema pubblico.
            </p>
            <div className="mt-4 space-y-2 text-xs text-charcoal/80">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
                <span>Prima visita garantita entro 72 ore</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
                <span>Rapporto empatico e continuità terapeutica</span>
              </p>
            </div>
          </div>

          <Link
            href="/medici"
            onClick={onClose}
            className="mt-5 inline-flex items-center justify-between rounded-xl bg-dark-navy text-white px-5 py-3 text-xs font-semibold shadow-md hover:bg-teal-900 transition-colors"
          >
            <span>Esplora tutti gli specialisti</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Colonna Destra: 2 Medici in Evidenza */}
        <div className="col-span-7 grid grid-cols-2 gap-4">
          {/* Card 1: Ortodonzia */}
          <Link
            href="/medici/antonio-sorrentino"
            onClick={onClose}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-teal-50">
              <Image
                src="/images/doctors/antonio-sorrentino.jpg"
                alt="Dr. Antonio Sorrentino"
                fill
                sizes="200px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-teal-900 shadow-xs">
                Invisalign Diamond
              </span>
            </div>
            <h5 className="font-serif text-sm font-semibold text-dark-navy mt-3">
              Dr. Antonio Sorrentino
            </h5>
            <p className="text-[11px] text-teal-700 font-medium">Ortodonzia & Chirurgia Guidata</p>
            <p className="text-[10px] text-charcoal/50 mt-1">Docente Master Ortodonzia</p>
          </Link>

          {/* Card 2: Cardiologia */}
          <Link
            href="/medici/chiara-del-prete"
            onClick={onClose}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-teal-50">
              <Image
                src="/images/doctors/chiara-del-prete.jpg"
                alt="Dr.ssa Chiara Del Prete"
                fill
                sizes="200px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shadow-xs">
                Disponibile giovedì
              </span>
            </div>
            <h5 className="font-serif text-sm font-semibold text-dark-navy mt-3">
              Dr.ssa Chiara Del Prete
            </h5>
            <p className="text-[11px] text-teal-700 font-medium">Cardiologia & Prevenzione</p>
            <p className="text-[10px] text-charcoal/50 mt-1">Specialista Università Federico II</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── MEGAMENU 3: LO STUDIO ──────────────────────────────────────────────────
function MegamenuStudio({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-7">
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
            <Image
              src="/images/clinic-lounge.jpg"
              alt="Lounge Cocoora Napoli"
              fill
              sizes="340px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                Poliambulatorio Privato
              </p>
              <p className="font-serif text-sm font-semibold">Via G. De Bonis 81, Napoli</p>
            </div>
          </div>
        </div>

        <div className="col-span-7 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-accent">
              Standard di Clinica Svizzera a Napoli
            </span>
            <h4 className="font-serif text-lg font-semibold text-dark-navy">
              L&apos;Accoglienza dell&apos;Amico Medico
            </h4>
            <p className="text-xs leading-relaxed text-charcoal/70">
              Abbiamo creato uno spazio dove la medicina ritrova il suo tempo. Zero code, zero burocrazia, ambienti insonorizzati con luce naturale e le più evolute tecnologie diagnostiche e laser.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-charcoal/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-700" /> Posillipo / Fuorigrotta
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-700" /> Lun–Ven 8–20, Sab 9–14
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/chi-siamo"
              onClick={onClose}
              className="text-xs font-semibold text-dark-navy hover:text-teal-700 transition-colors"
            >
              Scopri la visione clinica &rarr;
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/contatti"
              onClick={onClose}
              className="text-xs font-semibold text-teal-800 hover:text-dark-navy transition-colors"
            >
              Indicazioni stradali & parcheggio &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MEGAMENU 4: PIANI SALUTE (COCOORA CLUB & PRECISION) ─────────────────────
function MegamenuPianiSalute({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col">
      {/* Top Banner del Club con il claim potente */}
      <div className="border-b border-teal-100/70 bg-gradient-to-r from-teal-50/80 via-white to-teal-50/50 px-7 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-6 w-6">
            <Image
              src="/brand/cocoora azzurro.webp"
              alt="Simbolo Cocoora"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-dark-navy">
              Cocoora Club: il tuo medico di fiducia, tutto l&apos;anno.
            </span>
            <span className="hidden sm:inline text-xs text-charcoal/60 ml-2">
              Senza attese, a quota annuale fissa o a rate.
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-teal-800 bg-white px-3 py-1 rounded-full border border-teal-200/60 shadow-xs">
          Zero Vincoli Nascosti
        </span>
      </div>

      {/* 4 Card dei Piani Annuali con gli asset grafici di Alessandra */}
      <div className="grid grid-cols-4 gap-4 p-7">
        {/* Piano 1: Discover */}
        <Link
          href="/club/discover"
          onClick={onClose}
          className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-teal-400 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
              Gratis
            </span>
            <div className="relative h-4 w-4 opacity-75">
              <Image src="/brand/cocoora azzurro.webp" alt="Discover" fill className="object-contain" />
            </div>
          </div>
          <h5 className="font-serif text-base font-semibold text-dark-navy mt-1">Discover</h5>
          <p className="text-lg font-bold text-teal-900 mt-1">0€ <span className="text-xs font-normal text-charcoal/50">/anno</span></p>
          <p className="text-[11px] text-charcoal/60 mt-1.5 leading-relaxed">
            Profilo sanitario digitale, referti h24 in App e catalogo visite.
          </p>
          <span className="mt-3 inline-block text-[11px] font-semibold text-teal-700 group-hover:underline">
            Inizia gratis &rarr;
          </span>
        </Link>

        {/* Piano 2: Access */}
        <Link
          href="/club/access"
          onClick={onClose}
          className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-teal-400 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Essenziale
            </span>
            <div className="relative h-4 w-4 opacity-75">
              <Image src="/brand/cocoora verde.webp" alt="Access" fill className="object-contain" />
            </div>
          </div>
          <h5 className="font-serif text-base font-semibold text-dark-navy mt-1">Access</h5>
          <p className="text-lg font-bold text-teal-900 mt-1">99€ <span className="text-xs font-normal text-charcoal/50">/anno</span></p>
          <p className="text-[11px] text-charcoal/60 mt-1.5 leading-relaxed">
            Visita specialistica di ingresso e prima diagnostica preventiva.
          </p>
          <span className="mt-3 inline-block text-[11px] font-semibold text-teal-700 group-hover:underline">
            Dettagli piano &rarr;
          </span>
        </Link>

        {/* Piano 3: Care (PIÙ SCELTO) */}
        <Link
          href="/club/care"
          onClick={onClose}
          className="group relative rounded-2xl border-2 border-teal-700 bg-gradient-to-b from-teal-50/50 to-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-800 text-white px-2 py-0.5 rounded-full">
              ★ Più Scelto
            </span>
            <div className="relative h-4 w-4">
              <Image src="/brand/Risorsa 2.webp" alt="Care" fill className="object-contain" />
            </div>
          </div>
          <h5 className="font-serif text-base font-semibold text-dark-navy mt-1">Care</h5>
          <p className="text-lg font-bold text-teal-900 mt-1">
            da 29€ <span className="text-xs font-normal text-charcoal/50">/mese</span>
          </p>
          <p className="text-[11px] text-charcoal/70 mt-1.5 leading-relaxed">
            Check-up completo, visite specialistiche e igiene dentale incluse.
          </p>
          <span className="mt-3 inline-block text-[11px] font-bold text-teal-800 group-hover:underline">
            Scegli il piano &rarr;
          </span>
        </Link>

        {/* Piano 4: Precision / Signature */}
        <Link
          href="/precision"
          onClick={onClose}
          className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-teal-400 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
              Genomica
            </span>
            <div className="relative h-4 w-4 opacity-75">
              <Image src="/brand/cocoora rosa.webp" alt="Precision" fill className="object-contain" />
            </div>
          </div>
          <h5 className="font-serif text-base font-semibold text-dark-navy mt-1">Precision</h5>
          <p className="text-lg font-bold text-dark-navy mt-1">DNA 5</p>
          <p className="text-[11px] text-charcoal/60 mt-1.5 leading-relaxed">
            Test DNA 5 e sequenziamento microbiota per longevità e prevenzione.
          </p>
          <span className="mt-3 inline-block text-[11px] font-semibold text-teal-700 group-hover:underline">
            Scopri Precision &rarr;
          </span>
        </Link>
      </div>

      {/* Ponte di Conversione Decisivo di Opus 5.5 */}
      <div className="border-t border-teal-100/80 bg-teal-50/60 px-7 py-3 flex items-center justify-between text-xs text-teal-950">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
          <span><strong>La prima visita vale come acconto:</strong> fai la visita e scala l&apos;importo se ti iscrivi al Club entro 30 giorni.</span>
        </span>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-teal-900 hover:underline flex items-center gap-1"
        >
          Hai dubbi? Chiedi su WhatsApp <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
        </a>
      </div>
    </div>
  );
}
