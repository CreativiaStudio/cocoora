"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  ChevronDown,
  Dna,
  GraduationCap,
  HeartPulse,
  Menu,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { NAV_NODES, SITE } from "@/lib/site";
import type { NavNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ButtonLink } from "./ui";

// Mappatura icone tematiche per ogni tipologia di voce del menu
function getCategoryIcon(label: string, href: string): LucideIcon {
  const l = label.toLowerCase();
  const h = href.toLowerCase();

  if (l.includes("odontoiatria") || l.includes("invisalign") || l.includes("sorriso")) return Smile;
  if (l.includes("estetica") || l.includes("rigenerativa")) return Sparkles;
  if (l.includes("diagnostica") || l.includes("cardiologia") || l.includes("ecografia")) return HeartPulse;
  if (l.includes("specialisti") || l.includes("medici") || h.includes("/medici")) return GraduationCap;
  if (l.includes("club") || l.includes("percorsi") || h.includes("/club")) return ShieldCheck;
  if (l.includes("precision") || l.includes("dna") || l.includes("microbiota") || h.includes("/precision")) return Dna;
  if (l.includes("chi siamo") || l.includes("studio") || l.includes("metodo")) return Building2;
  if (l.includes("trattamenti")) return Activity;

  return Stethoscope;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out",
        "bg-white/95 backdrop-blur-md border-b border-slate-200/80",
        scrolled
          ? "shadow-[0_8px_30px_-15px_rgba(0,52,75,0.18)]"
          : "shadow-xs"
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 transition-all duration-300 ease-in-out",
          scrolled ? "h-16 sm:h-16 lg:h-16" : "h-20 sm:h-24 lg:h-24"
        )}
      >
        <Link href="/" aria-label="Cocoora — Home" onClick={closeAll} className="shrink-0 flex items-center">
          <Logo
            variant="dark"
            className={cn(
              "w-auto transition-all duration-300 ease-in-out",
              scrolled ? "h-8 sm:h-9" : "h-11 sm:h-12 lg:h-13"
            )}
          />
        </Link>

        {/* ── Desktop Navigation ────────────────────────────────────── */}
        <nav className="hidden items-center gap-1.5 lg:flex" onMouseLeave={scheduleClose}>
          {NAV_NODES.map((node) =>
            node.children ? (
              <div key={node.label} className="relative" onMouseEnter={() => openMenu(node.label)}>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    openDesktop === node.label
                      ? "bg-slate-100/90 text-dark-navy font-semibold shadow-xs"
                      : "text-charcoal/80 hover:text-dark-navy hover:bg-slate-50"
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

                {/* ── WOW Megamenu Panel ───────────────────────────────── */}
                <div
                  className={cn(
                    "absolute left-1/2 top-full z-40 w-[min(940px,94vw)] -translate-x-1/2 pt-3 transition-all duration-250 ease-out",
                    openDesktop === node.label
                      ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
                      : "pointer-events-none translate-y-3 opacity-0 scale-[0.98]"
                  )}
                >
                  <div className="overflow-hidden rounded-[2.25rem] border border-slate-200/90 bg-white shadow-[0_35px_100px_-25px_rgba(0,52,75,0.28)] backdrop-blur-2xl">
                    {/* Top Header del Megamenu */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-7 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-accent">
                          {node.label} • POLIAMBULATORIO COCOORA NAPOLI
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50/80 px-3 py-0.5 text-[11px] font-medium text-teal-900">
                        <ShieldCheck className="h-3 w-3 text-teal-700" /> Zero Liste d&apos;Attesa
                      </span>
                    </div>

                    {/* Corpo del Megamenu: Voci a sinistra + Vetrina a destra */}
                    <div className="flex">
                      {/* Colonna Sinistra — Griglia Voci con Icone dedicate */}
                      <div className="flex-1 p-6 lg:p-7">
                        <div className="grid gap-2">
                          {node.children.map((child) => (
                            <MegaDropdownItem key={child.href} child={child} onClick={closeAll} />
                          ))}
                        </div>

                        {/* CTA Footer interna */}
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <Link
                            href={node.children[0]?.href ?? "#"}
                            onClick={closeAll}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 transition-colors hover:text-dark-navy"
                          >
                            Panoramica completa della sezione <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                          <span className="text-[11px] text-charcoal/50">
                            Direzione Sanitaria Specialistica
                          </span>
                        </div>
                      </div>

                      {/* Colonna Destra — Vetrina Spotlight Editoriale */}
                      <MegaEditorialPanel node={node} onClose={closeAll} />
                    </div>

                    {/* Bottom Bar di Garanzia Sanitaria */}
                    <div className="flex items-center justify-between border-t border-slate-100/90 bg-slate-50/90 px-7 py-3 text-xs text-charcoal/70">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-slate-accent" />
                          Convenzioni Università Federico II & Vanvitelli
                        </span>
                        <span className="hidden sm:flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-slate-accent" />
                          Referti digitali 24/7 in App
                        </span>
                      </div>
                      <Link
                        href="tel:08118182091"
                        className="inline-flex items-center gap-1.5 font-semibold text-teal-900 hover:text-dark-navy transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-teal-700" /> Tel: 081 18182091
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={node.label}
                href={node.href ?? "#"}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-charcoal/80 transition-colors hover:text-dark-navy hover:bg-slate-50"
              >
                {node.label}
              </Link>
            )
          )}
        </nav>

        {/* Tasto Prenota Desktop */}
        <div className="hidden lg:block">
          <ButtonLink href="/contatti" size="md">
            Prenota Visita
          </ButtonLink>
        </div>

        {/* Pulsante Menu Mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white/70 text-teal-800 backdrop-blur-sm lg:hidden hover:bg-white transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Slide-Over ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-dark-navy/40 backdrop-blur-sm"
          onClick={closeAll}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
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

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="flex flex-col gap-1">
              {NAV_NODES.map((node) =>
                node.children ? (
                  <li key={node.label} className="border-b border-teal-100/70 py-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileAccordion((v) => (v === node.label ? null : node.label))
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-charcoal transition-colors hover:bg-teal-50 hover:text-teal-700"
                      aria-expanded={mobileAccordion === node.label}
                    >
                      {node.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          mobileAccordion === node.label && "rotate-180 text-teal-800"
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
                        {node.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeAll}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal/80 transition-colors hover:bg-teal-50 hover:text-teal-700"
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
                ) : (
                  <li key={node.label} className="border-b border-teal-100/70 py-1.5">
                    <Link
                      href={node.href ?? "#"}
                      onClick={closeAll}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-charcoal transition-colors hover:bg-teal-50 hover:text-teal-700"
                    >
                      {node.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="border-t border-teal-100 p-6 space-y-3 bg-slate-50/60">
            <ButtonLink href="/contatti" className="w-full" size="lg">
              Prenota Visita
            </ButtonLink>
            <a
              href="tel:08118182091"
              className="flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white py-3 text-xs font-semibold text-teal-900 shadow-xs hover:border-teal-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-teal-700" /> Chiama: 081 18182091
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Singolo elemento interattivo del Megamenu Desktop ───────────────────────
function MegaDropdownItem({
  child,
  onClick,
}: {
  child: NonNullable<NavNode["children"]>[number];
  onClick: () => void;
}) {
  const Icon = getCategoryIcon(child.label, child.href);

  return (
    <Link
      href={child.href}
      onClick={onClick}
      className="group flex items-start gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-slate-50/90 border border-transparent hover:border-slate-200/70"
    >
      {/* Icon box satinata */}
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50/90 text-teal-900 border border-teal-100/80 shadow-xs transition-all duration-300 group-hover:bg-dark-navy group-hover:text-white group-hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-serif text-[15px] font-semibold text-dark-navy transition-colors group-hover:text-teal-800">
            {child.label}
          </span>
          <ArrowRight className="h-4 w-4 text-slate-accent opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
        {child.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-charcoal/60 line-clamp-1">
            {child.description}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Vetrina Editoriale Spotlight (Colonna Destra del Megamenu) ──────────────
function MegaEditorialPanel({
  node,
  onClose,
}: {
  node: NavNode;
  onClose: () => void;
}) {
  // Prendi il primo child con immagine oppure usa l'immagine clinica lounge come fallback
  const featured = node.children?.find((c) => c.image) || node.children?.[0];
  const imageSrc = featured?.image || "/images/clinic-lounge.jpg";

  return (
    <div className="w-[340px] shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50/80 via-white to-teal-50/30 p-6 flex flex-col justify-between">
      <div>
        {/* Card visiva immersiva */}
        <div className="group/card relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/60 bg-teal-50">
          <Image
            src={imageSrc}
            alt={featured?.label || node.label}
            fill
            sizes="340px"
            className="object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/85 via-dark-navy/20 to-transparent" />
          
          {/* Badge glassmorphism in alto */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-950 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-teal-600" /> Focus Reparto
          </span>

          {/* Label in overlay sul fondo */}
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              {node.label}
            </p>
            <p className="font-serif text-base font-semibold leading-snug text-white drop-shadow-xs line-clamp-1">
              {featured?.label}
            </p>
          </div>
        </div>

        {/* Spiegazione clinica */}
        <p className="mt-4 text-xs leading-relaxed text-charcoal/70">
          {featured?.description || "Protocolli medici personalizzati, attrezzature digitali all&apos;avanguardia e continuità terapeutica con i migliori specialisti campani."}
        </p>
      </div>

      {/* Bottone d'azione verso il reparto */}
      <Link
        href={featured?.href || "#"}
        onClick={onClose}
        className="mt-5 inline-flex items-center justify-between rounded-xl border border-teal-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-teal-900 shadow-xs hover:border-teal-400 hover:bg-teal-50/50 hover:text-dark-navy transition-all duration-200"
      >
        <span>Esplora {featured?.label || "il reparto"}</span>
        <ArrowRight className="h-3.5 w-3.5 text-teal-700" />
      </Link>
    </div>
  );
}
