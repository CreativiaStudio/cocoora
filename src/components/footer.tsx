"use client";

import Link from "next/link";
import { ArrowRight, Clock, Instagram, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";
import { useShop } from "./providers";
import { Container } from "./ui";

const legalLinks = [
  { label: "Privacy Policy", href: "/contatti" },
  { label: "Cookie Policy", href: "/contatti" },
  { label: "Termini e Condizioni", href: "/contatti" },
];

const areeMediche = [
  { label: "Medicina Estetica & Rigenerativa", href: "/servizi/medicina-estetica" },
  { label: "Odontoiatria & Ortodonzia", href: "/servizi/odontoiatria" },
  { label: "Visite Specialistiche", href: "/visite" },
];

const percorsiClub = [
  { label: "I Nostri Medici", href: "/medici" },
  { label: "Cocoora Club Memberships", href: "/club" },
  { label: "Cocoora Precision (DNA & Microbiota)", href: "/precision" },
  { label: "Area Paziente & Referti", href: "/area-paziente" },
  { label: "La Nostra Filosofia", href: "/chi-siamo" },
];

export function Footer() {
  const { openBooking } = useShop();

  return (
    <footer className="relative overflow-hidden bg-dark-navy text-teal-100">
      {/* Mesh di profondità e luce scura */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 12% 0%, rgba(128,161,178,0.16) 0%, transparent 70%), radial-gradient(50% 45% at 92% 18%, rgba(28,74,92,0.55) 0%, transparent 70%), radial-gradient(70% 55% at 50% 115%, rgba(28,74,92,0.65) 0%, transparent 70%), linear-gradient(180deg, #03354b 0%, #022a3d 100%)",
        }}
      />
      <div className="noise pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-accent/50 to-transparent" />

      <Container className="relative py-10 sm:py-12 lg:py-14">
        {/* 1 · Fascia Orizzontale Moderna: Logo + Badge Sanitario + Canali Rapidi */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Logo variant="white" className="h-8 sm:h-9 w-auto max-w-[170px] object-contain" />
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-accent" />
              Centro Medico Autorizzato · Napoli
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-teal-100 transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Phone className="h-3.5 w-3.5 text-slate-accent" />
              <span>{SITE.phone}</span>
            </a>

            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Cocoora"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-dark-navy shadow-sm transition-all hover:bg-teal-50 hover:-translate-y-0.5"
            >
              Prenota Visita
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Separatore leggero */}
        <div className="my-7 sm:my-8 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        {/* 2 · Corpo di Navigazione Compatto a 3 Colonne */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {/* Colonna 1: Aree Mediche */}
          <div>
            <FooterHeading>Aree Mediche</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {areeMediche.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-xs sm:text-[13px] leading-relaxed text-teal-100/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonna 2: Il Tuo Percorso */}
          <div>
            <FooterHeading>Il Tuo Percorso</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {percorsiClub.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-xs sm:text-[13px] leading-relaxed text-teal-100/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonna 3: Sede & Orari Sintetici */}
          <div>
            <FooterHeading>Sede &amp; Orari</FooterHeading>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px] text-teal-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-accent" />
                <span>{SITE.fullAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-slate-accent" />
                <span>Lun–Ven 8:00–20:00 (Continuato) · Sab 9:00–14:00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-accent" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 · Bottom Bar Legale & Direzione Sanitaria */}
        <div className="mt-8 sm:mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-teal-200/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cocoora Centro Medico · Dir. Sanitaria Dott.ssa Elisa Russo</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {legalLinks.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-teal-200/35 transition-colors hover:text-white"
            >
              Area Agenzia
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-accent">
      {children}
    </h4>
  );
}
