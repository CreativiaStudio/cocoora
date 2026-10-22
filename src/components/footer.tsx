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

const dipartimenti = [
  { label: "Odontoiatria & Ortodonzia", href: "/servizi/odontoiatria" },
  { label: "Medicina Estetica & Rigenerativa", href: "/servizi/medicina-estetica" },
  { label: "Visite Specialistiche & Diagnostica", href: "/servizi/diagnostica" },
  { label: "Senologia & Ginecologia", href: "/visite/senologia" },
  { label: "Cardiologia & Ecografia", href: "/visite/cardiologia" },
];

const percorsiClub = [
  { label: "I Nostri Medici", href: "/medici" },
  { label: "Area Paziente & Calendario", href: "/area-paziente" },
  { label: "Cocoora Club Memberships", href: "/club" },
  { label: "Cocoora Precision (DNA & Microbiota)", href: "/precision" },
  { label: "La Filosofia Cocoora", href: "/chi-siamo" },
];

export function Footer() {
  const { openBooking } = useShop();
  return (
    <footer className="relative overflow-hidden bg-dark-navy text-teal-100">
      {/* Ambient depth: mesh di luci scure */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 12% 0%, rgba(128,161,178,0.16) 0%, transparent 70%), radial-gradient(50% 45% at 92% 18%, rgba(28,74,92,0.55) 0%, transparent 70%), radial-gradient(70% 55% at 50% 115%, rgba(28,74,92,0.65) 0%, transparent 70%), linear-gradient(180deg, #03354b 0%, #022a3d 100%)",
        }}
      />
      <div className="noise pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-slate-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-[#1c4a5c]/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-accent/60 to-transparent" />

      <Container className="relative py-16 lg:py-20">
        {/* Badge ATS centrato con separatori raffinati */}
        <div className="flex items-center gap-5">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-white/20 sm:block" />
          <span
            className="mx-auto inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-center text-[11px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-white/90 backdrop-blur-sm sm:mx-0 sm:text-xs"
            style={{
              boxShadow:
                "0 10px 30px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-accent" />
            Centro Medico Autorizzato — Direzione Sanitaria Specialistica
          </span>
          <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-white/20 sm:block" />
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
          {/* Brand */}
          <div>
            <Logo variant="white" className="h-10 sm:h-11 lg:h-12 w-auto max-w-[75%] object-contain" />
            <p className="mt-6 max-w-xs font-serif text-xl italic leading-snug text-white">
              &ldquo;{SITE.claim}&rdquo;
            </p>
            <span className="mt-4 block h-px w-10 bg-slate-accent/70" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-teal-200/75">
              Un unico hub multidisciplinare per la tua salute: azzeriamo attese,
              burocrazia e complessità per ripristinare il vero rapporto
              fiduciario tra medico e paziente.
            </p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Cocoora"
              className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:shadow-[0_10px_24px_-10px_rgba(128,161,178,0.6)]"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <FooterColumn title="Dipartimenti Clinici" links={dipartimenti} />
          <FooterColumn title="Il Tuo Percorso" links={percorsiClub} />

          {/* Contatti */}
          <div>
            <FooterHeading>Contatti &amp; Prenotazioni</FooterHeading>
            <ul className="mt-6 space-y-3.5 text-sm leading-relaxed text-teal-100/85">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                <span>{SITE.fullAddress}</span>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-slate-accent" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 break-all transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-slate-accent" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                <span>
                  Lun–Ven · 8:00–20:00
                  <br />
                  Sab · 9:00–14:00
                </span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => openBooking()}
              className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-dark-navy shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-[0_18px_36px_-12px_rgba(128,161,178,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-accent"
            >
              Prenota una visita
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-teal-200/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Cocoora Centro Medico. Tutti i diritti riservati.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-teal-200/40 transition-colors hover:text-white"
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
    <div>
      <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
        {children}
      </h4>
      <span className="mt-3 block h-px w-8 bg-gradient-to-r from-slate-accent/80 to-transparent" />
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul className="mt-6 space-y-3.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm leading-relaxed text-teal-100/85 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}