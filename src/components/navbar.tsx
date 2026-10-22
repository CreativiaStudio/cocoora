"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { NAV_NODES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "./ui";
import { useShop } from "./providers";

// ── Dati condivisi Megamenu / Drawer "Aree Mediche" ─────────────────────────
type MegamenuLink = { label: string; href: string };
type MegamenuGroup = { heading?: string; links: MegamenuLink[] };
type AreeColumn = { title: string; href: string; groups: MegamenuGroup[] };

const TOPBAR_HOURS = "Lun–Ven 8:00–20:00 · Sab 9:00–14:00";

const AREE_MEDICHE_COLUMNS: AreeColumn[] = [
  {
    title: "Medicina Estetica & Rigenerativa",
    href: "/servizi/medicina-estetica",
    groups: [
      {
        heading: "Viso & Rigenerazione",
        links: [
          { label: "Filler acido ialuronico", href: "/trattamenti/filler-acido-ialuronico" },
          { label: "Tossina botulinica", href: "/trattamenti/tossina-botulinica" },
          { label: "Biorivitalizzazione", href: "/trattamenti/biorivitalizzazione" },
          { label: "Biostimolatori (Polilattico)", href: "/trattamenti/acido-polilattico" },
          { label: "Peeling chimico", href: "/trattamenti/peeling-chimico" },
          { label: "PRX senza aghi", href: "/trattamenti/prx" },
        ],
      },
      {
        heading: "Corpo & Silhouette",
        links: [
          { label: "Criolipolisi", href: "/trattamenti/cryoliposculpt" },
          { label: "Carbossiterapia", href: "/trattamenti/carbossiterapia" },
          { label: "Mesoterapia", href: "/trattamenti/mesoterapia" },
          { label: "Intralipoterapia", href: "/trattamenti/intralipoterapia" },
          { label: "Valutazione Lipedema & Linfedema", href: "/servizi/medicina-estetica#lipedema" },
        ],
      },
      {
        heading: "Laser & Tecnologie",
        links: [
          { label: "Laser & Luce Pulsata", href: "/trattamenti/piattaforma-laser" },
          { label: "Laser Resurfacing & Cicatrici", href: "/trattamenti/piattaforma-laser" },
          { label: "Ultrasuoni CFU", href: "/trattamenti/ultrasuoni-cfu" },
        ],
      },
    ],
  },
  {
    title: "Odontoiatria & Ortodonzia",
    href: "/servizi/odontoiatria",
    groups: [
      {
        heading: "Ortodonzia Invisibile & Sviluppo",
        links: [
          { label: "Allineatori Trasparenti Adulti", href: "/trattamenti/invisalign-adulti" },
          { label: "Allineatori Adolescenti", href: "/trattamenti/invisalign-adolescenti" },
          { label: "Ortodonzia Intercettiva Bambini", href: "/trattamenti/invisalign-bambini" },
        ],
      },
      {
        heading: "Clinica Dentale & Estetica",
        links: [
          { label: "Estetica del Sorriso & Faccette", href: "/trattamenti/estetica-dentale" },
          { label: "Igiene & Prevenzione", href: "/trattamenti/igiene" },
          { label: "Implantologia a Carico Immediato", href: "/trattamenti/implantologia" },
          { label: "Gnatologia, Bruxismo & Bite", href: "/trattamenti/gnatologia-bruxismo-bite" },
          { label: "Conservativa & Endodonzia", href: "/trattamenti/conservativa" },
        ],
      },
    ],
  },
  {
    title: "Visite Specialistiche",
    href: "/visite",
    groups: [
      {
        heading: "Specialistiche per la Famiglia",
        links: [
          { label: "Cardiologia & ECG", href: "/visite/cardiologia" },
          { label: "Ginecologia & Ostetricia", href: "/visite/ginecologia" },
          { label: "Senologia & Prevenzione", href: "/visite/senologia" },
          { label: "Ecografia Clinica Avanzata", href: "/visite/ecografia" },
          { label: "Oculistica Specialistica", href: "/visite/oculistica" },
          { label: "Pediatria Generale", href: "/visite/pediatria" },
          { label: "Psicologia & Benessere", href: "/visite" },
          { label: "Medicina dello Sport", href: "/visite" },
        ],
      },
    ],
  },
];

export function Navbar() {
  const { openBooking } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
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
      {/* ── 1. Top Bar Istituzionale & Accesso Rapido ───────────────────── */}
      <div className="bg-dark-navy border-b border-white/10 text-[11px] sm:text-xs text-teal-100/90 py-1.5 px-4 sm:px-8 lg:px-10 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Docenti universitari e orari */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-medium text-teal-200/90 truncate">
              Docenti Università Federico II &amp; Vanvitelli a Napoli
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-teal-200/75 whitespace-nowrap">
              <Clock className="h-3 w-3 text-slate-accent" />
              {TOPBAR_HOURS}
            </span>
          </div>

          {/* Contatti diretti e Area Paziente */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
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
              href="/area-paziente"
              onClick={closeAll}
              className="hidden sm:flex items-center gap-1.5 font-medium text-slate-accent hover:text-white transition-colors"
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
            "relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 transition-all duration-300 ease-in-out",
            scrolled ? "h-16" : "h-20 sm:h-22"
          )}
          onMouseLeave={scheduleClose}
        >
          {/* Logo Brand ingrandito, senza payoff */}
          <Link href="/" aria-label="Cocoora — Home" onClick={closeAll} className="shrink-0 flex items-center">
            <Logo
              variant="dark"
              className={cn(
                "w-auto transition-all duration-300 ease-in-out",
                scrolled ? "h-9 sm:h-10" : "h-11 sm:h-13"
              )}
            />
          </Link>

          {/* ── Desktop Navigation a 4 Voci Principali ─────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_NODES.map((node) => (
              <div key={node.label} onMouseEnter={() => openMenu(node.label)}>
                <button
                  type="button"
                  onClick={() => {
                    if (openDesktop === node.label) {
                      setOpenDesktop(null);
                    } else {
                      openMenu(node.label);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    "text-charcoal/85 hover:text-dark-navy hover:bg-slate-50/90",
                    openDesktop === node.label && "bg-slate-100 text-dark-navy font-semibold shadow-xs"
                  )}
                  aria-expanded={openDesktop === node.label}
                >
                  {node.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      openDesktop === node.label && "rotate-180 text-teal-800"
                    )}
                  />
                </button>
              </div>
            ))}
          </nav>

          {/* CTA Permanente Destra */}
          <div className="hidden lg:flex items-center gap-3">
            <Button onClick={() => openBooking()} size="md">
              Prenota Visita
            </Button>
          </div>

          {/* ── MEGAMENU DESKTOP UNIFICATO ───────────────────────────── */}
          {/* Posizionato esattamente dall'inizio del logo (left-5/8/10) alla fine del tasto Prenota Visita (right-5/8/10) */}
          <div
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onMouseLeave={scheduleClose}
            className={cn(
              "hidden lg:block absolute left-5 sm:left-8 lg:left-10 right-5 sm:right-8 lg:right-10 top-full z-40 pt-2 transition-all duration-200 ease-out",
              openDesktop
                ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
                : "pointer-events-none translate-y-2 opacity-0 scale-[0.99]"
            )}
          >
            <div className="overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/95 backdrop-blur-2xl shadow-[0_40px_120px_-20px_rgba(3,53,75,0.28)] ring-1 ring-teal-950/5">
              {openDesktop === "Aree Mediche" && <MegamenuAreeMediche onClose={closeAll} />}
              {openDesktop === "I Medici" && <MegamenuMedici onClose={closeAll} onOpenBooking={openBooking} />}
              {openDesktop === "Il Centro" && <MegamenuCentro onClose={closeAll} />}
              {openDesktop === "Percorsi Salute" && <MegamenuPercorsiSalute onClose={closeAll} />}
            </div>
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
            <Logo variant="dark" className="h-10 w-auto" />
            <button
              type="button"
              aria-label="Chiudi menu"
              onClick={closeAll}
              className="rounded-full p-2 text-charcoal/60 transition-colors hover:bg-teal-50 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Recapito Istituzionale Mobile */}
          <div className="bg-teal-50/70 border-b border-teal-100/70 px-6 py-2.5 text-xs text-teal-900">
            Docenti Università Federico II &amp; Vanvitelli · {TOPBAR_HOURS}
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
                    <span>{node.label}</span>
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
                    <div className="overflow-hidden pl-2">
                      {node.label === "Aree Mediche" ? (
                        <div className="flex flex-col gap-2">
                          {AREE_MEDICHE_COLUMNS.map((column) => (
                            <div key={column.title} className="rounded-xl bg-slate-50/80 px-3 py-2.5">
                              <Link
                                href={column.href}
                                onClick={closeAll}
                                className="text-sm font-semibold text-dark-navy hover:text-teal-800"
                              >
                                {column.title}
                              </Link>
                              <div className="mt-1.5 flex flex-col gap-1">
                                {column.groups.map((group, groupIndex) => (
                                  <div key={groupIndex} className="flex flex-col gap-1">
                                    {group.heading && (
                                      <p className="mt-1 px-2 text-[10px] font-bold uppercase tracking-wider text-teal-800/80">
                                        {group.heading}
                                      </p>
                                    )}
                                    {group.links.map((link) => (
                                      <Link
                                        key={`${group.heading ?? column.title}-${link.label}`}
                                        href={link.href}
                                        onClick={closeAll}
                                        className="rounded-lg px-2 py-1.5 text-sm font-medium text-charcoal/80 transition-colors hover:bg-teal-50 hover:text-teal-900"
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="rounded-xl bg-dark-navy px-3 py-2.5 text-white">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                              Medicina del Futuro &amp; Percorsi
                            </p>
                            <Link
                              href="/precision"
                              onClick={closeAll}
                              className="mt-1.5 block text-sm font-semibold hover:text-teal-200"
                            >
                              Cocoora Precision (Genomica &amp; Longevità)
                            </Link>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              <Link
                                href="/precision"
                                onClick={closeAll}
                                className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium hover:bg-white/20"
                              >
                                DNA 5
                              </Link>
                              <Link
                                href="/precision"
                                onClick={closeAll}
                                className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium hover:bg-white/20"
                              >
                                Kit Microbiota
                              </Link>
                            </div>
                            <Link
                              href="/club"
                              onClick={closeAll}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-400 px-4 py-2 text-xs font-bold text-dark-navy hover:bg-teal-300 transition-colors"
                            >
                              Trova il tuo percorso <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
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
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Bar Mobile Azioni Rapide */}
          <div className="border-t border-teal-100 p-5 space-y-2.5 bg-slate-50/70">
            <Button
              onClick={() => {
                closeAll();
                openBooking();
              }}
              className="w-full"
              size="md"
            >
              Prenota Visita
            </Button>
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

// ── MEGAMENU 1: AREE MEDICHE (4 Colonne) ────────────────────────────────────
function MegamenuAreeMediche({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 lg:p-10">
        {/* Colonne 1–3: Aree cliniche con sottovoci */}
        {AREE_MEDICHE_COLUMNS.map((column) => (
          <div key={column.title}>
            <Link
              href={column.href}
              onClick={onClose}
              className="font-bold text-xs uppercase tracking-wider text-slate-accent hover:text-teal-800 flex items-center gap-1.5 transition-colors"
            >
              {column.title}
              <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
            <div className="flex flex-col">
              {column.groups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {group.heading && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800/90 pb-1 border-b border-teal-100/50 mt-3">
                      {group.heading}
                    </p>
                  )}
                  <ul className="mt-1.5">
                    {group.links.map((link) => (
                      <li key={`${group.heading ?? column.title}-${link.label}`}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="text-[13px] text-dark-navy/90 hover:text-teal-700 hover:translate-x-1 transition-all flex items-center justify-between py-0.5 group"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3 w-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-teal-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Colonna 4: Dark Luxury Glass — Cocoora Precision */}
        <div className="bg-gradient-to-br from-dark-navy to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-teal-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
              Medicina del Futuro &amp; Percorsi
            </p>
            <Link
              href="/precision"
              onClick={onClose}
              className="mt-2.5 block font-serif text-sm font-semibold leading-snug hover:text-teal-200 transition-colors"
            >
              Cocoora Precision (Genomica &amp; Longevità)
            </Link>
            <p className="mt-2 text-[11px] leading-relaxed text-teal-100/70">
              Medicina predittiva e longevità attiva, guidata dai dati.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link
                href="/precision"
                onClick={onClose}
                className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium hover:bg-white/20 transition-colors"
              >
                DNA 5
              </Link>
              <Link
                href="/precision"
                onClick={onClose}
                className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium hover:bg-white/20 transition-colors"
              >
                Kit Microbiota
              </Link>
            </div>
          </div>
          <Link
            href="/club"
            onClick={onClose}
            className="mt-4 inline-flex items-center justify-between gap-2 rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-bold text-dark-navy hover:bg-teal-300 transition-colors"
          >
            Trova il tuo percorso <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Barra inferiore istituzionale */}
      <div className="border-t border-slate-100/80 bg-slate-50/70 backdrop-blur-md px-8 py-3.5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 text-charcoal/75">
          <Clock className="h-3.5 w-3.5 text-teal-700 shrink-0" />
          <span>
            <strong className="font-semibold text-dark-navy">Connessi alla tua salute.</strong>{" "}
            Un unico hub multidisciplinare a Napoli · Direzione Sanitaria Dott.ssa Elisa Russo
          </span>
        </span>
        <Link
          href="/club"
          onClick={onClose}
          className="font-semibold text-teal-900 hover:text-dark-navy flex items-center gap-1 whitespace-nowrap transition-colors"
        >
          Cocoora — Il tuo Percorso di Salute <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── MEGAMENU 2: I MEDICI ───────────────────────────────────────────────────
function MegamenuMedici({
  onClose,
  onOpenBooking,
}: {
  onClose: () => void;
  onOpenBooking: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-7 lg:p-8">
        <Link
          href="/medici"
          onClick={onClose}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
              Il Team Clinico
            </span>
            <h4 className="mt-2 font-serif text-lg font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
              L&apos;Équipe Specialistica
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
              Oltre 17 medici e chirurghi coordinati per un percorso clinico multidisciplinare e integrato.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-800">
                Odontoiatria
              </span>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-800">
                Medicina Estetica
              </span>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-800">
                Cardiologia & Specialistiche
              </span>
            </div>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 group-hover:gap-2.5 transition-all">
            Scopri l&apos;équipe completa <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          href="/medici#docenti"
          onClick={onClose}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
              Eccellenza Accademica
            </span>
            <h4 className="mt-2 font-serif text-lg font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
              Docenti Universitari &amp; Ospedalieri
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
              Professori e dirigenti medici delle Università Federico II, Luigi Vanvitelli e dei principali presidi campani.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-dark-navy">
                Univ. Federico II
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-dark-navy">
                Univ. Vanvitelli
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-dark-navy">
                Poli Ospedalieri
              </span>
            </div>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 group-hover:gap-2.5 transition-all">
            Conosci i docenti <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <div className="rounded-2xl bg-gradient-to-br from-dark-navy to-teal-950 p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              Direzione Sanitaria
            </span>
            <h4 className="mt-2 font-serif text-base font-semibold text-white">
              Dott.ssa Elisa Russo
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-teal-100/75">
              Presa in carico personalizzata e supervisione di ogni piano terapeutico nel centro.
            </p>
          </div>
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-bold text-dark-navy hover:bg-teal-300 transition-colors"
            >
              Prenota con uno Specialista <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
              href="tel:08118182091"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-teal-300" /> Centralino 081 18182091
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100/80 bg-slate-50/70 backdrop-blur-md px-8 py-3.5 flex items-center justify-between text-xs text-charcoal/75">
        <span className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-teal-700 shrink-0" />
          <span>Ricevimento su appuntamento: <strong className="text-dark-navy">Lun–Ven 8:00–20:00 · Sab 9:00–14:00</strong></span>
        </span>
        <Link
          href="/medici"
          onClick={onClose}
          className="font-semibold text-teal-900 hover:text-dark-navy flex items-center gap-1 transition-colors"
        >
          Visualizza tutti i medici <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── MEGAMENU 3: IL CENTRO ──────────────────────────────────────────────────
function MegamenuCentro({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-7 lg:p-8">
        <Link
          href="/chi-siamo"
          onClick={onClose}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
              Chi Siamo
            </span>
            <h4 className="mt-2 font-serif text-lg font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
              La Filosofia del Centro
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
              Uno spazio medico integrato a Napoli pensato per offrire prevenzione, diagnosi e trattamenti in totale serenità.
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 group-hover:gap-2.5 transition-all">
            Scopri la filosofia <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          href="/chi-siamo#spazi"
          onClick={onClose}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
              Gli Ambienti
            </span>
            <h4 className="mt-2 font-serif text-lg font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
              Gli Spazi Clinici: Studio 1, 2, 3
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
              Unità operative dedicate per odontoiatria avanzata, medicina estetica e studi diagnostici specialistici.
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 group-hover:gap-2.5 transition-all">
            Esplora gli spazi <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          href="/contatti"
          onClick={onClose}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
              Sede &amp; Accoglienza
            </span>
            <h4 className="mt-2 font-serif text-lg font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
              Via De Bonis 81, Napoli
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
              Facilmente raggiungibile da Fuorigrotta, Posillipo e Vomero. Accesso riservato e standard clinici elevati.
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 group-hover:gap-2.5 transition-all">
            Indicazioni &amp; Mappa <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      {/* Recapito Sede */}
      <div className="border-t border-slate-100/80 bg-slate-50/70 backdrop-blur-md px-8 py-3.5 flex items-center justify-between gap-4 text-xs text-charcoal/75">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-teal-700 shrink-0" />
          <span>
            Sede: <strong className="text-dark-navy">Via Generale Giovanni De Bonis 81, Napoli</strong> (Cavalleggeri / Fuorigrotta)
          </span>
        </span>
        <Link
          href="/contatti"
          onClick={onClose}
          className="font-semibold text-teal-900 hover:text-dark-navy flex items-center gap-1 whitespace-nowrap transition-colors"
        >
          Come raggiungerci <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── MEGAMENU 4: PERCORSI SALUTE (COCOORA CLUB) ──────────────────────────────
function MegamenuPercorsiSalute({ onClose }: { onClose: () => void }) {
  const percorsi = [
    {
      label: "Discover",
      href: "/club#discover",
      description: "Il primo passo per entrare nel mondo della prevenzione Cocoora.",
    },
    {
      label: "Access",
      href: "/club#access",
      description: "Accesso strutturato alle prestazioni specialistiche e diagnostiche del centro.",
    },
    {
      label: "Care",
      href: "/club#care",
      description: "Prevenzione periodica e continuità assistenziale durante tutto l'anno.",
    },
    {
      label: "Experience",
      href: "/club#experience",
      description: "Percorso avanzato multidisciplinare per il benessere completo.",
    },
    {
      label: "Signature",
      href: "/club#signature",
      description: "Il percorso esclusivo e onnicomprensivo di longevità e salute dedicata.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Intestazione con panoramica */}
      <div className="border-b border-teal-100/70 bg-gradient-to-r from-teal-50/80 via-white to-teal-50/50 px-7 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-accent">
            Percorsi Salute Cocoora
          </span>
          <h4 className="font-serif text-base font-semibold text-dark-navy mt-0.5">
            Panoramica Percorsi
          </h4>
          <p className="text-xs text-charcoal/65 mt-1">
            I percorsi annuali dedicati alla prevenzione continua per singoli e famiglie.
          </p>
        </div>
        <Link
          href="/club"
          onClick={onClose}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-dark-navy px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-900 transition-colors"
        >
          Scopri il Club <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Le 5 tappe del percorso */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-7 lg:p-8">
        {percorsi.map((percorso) => (
          <Link
            key={percorso.href}
            href={percorso.href}
            onClick={onClose}
            className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-teal-400 hover:shadow-sm"
          >
            <h5 className="font-serif text-sm font-semibold text-dark-navy group-hover:text-teal-800 transition-colors">
              {percorso.label}
            </h5>
            <p className="mt-1.5 text-[11px] leading-relaxed text-charcoal/60">
              {percorso.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 group-hover:gap-2 transition-all">
              Scopri <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
