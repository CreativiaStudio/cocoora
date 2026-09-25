import Link from "next/link";
import { Clock, Instagram, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";
import { Container } from "./ui";

const legalLinks = [
  { label: "Privacy Policy", href: "/contatti" },
  { label: "Cookie Policy", href: "/contatti" },
  { label: "Termini e Condizioni", href: "/contatti" },
];

const dipartimenti = [
  { label: "Odontoiatria Digitale & Invisalign", href: "/servizi/odontoiatria" },
  { label: "Medicina Estetica & Rigenerativa", href: "/servizi/medicina-estetica" },
  { label: "Diagnostica per Immagini & Cardiologia", href: "/servizi/diagnostica" },
  { label: "Senologia & Ginecologia", href: "/servizi/diagnostica" },
  { label: "Pediatria", href: "/servizi/diagnostica" },
];

const percorsiClub = [
  { label: "I Nostri Medici", href: "/medici" },
  { label: "Cocoora Club Memberships", href: "/club" },
  { label: "Cocoora Precision (DNA & Microbiota)", href: "/precision" },
  { label: "Cartella Clinica Digitale h24", href: "/chi-siamo" },
  { label: "Il Concetto di Amico Medico", href: "/chi-siamo" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark-navy text-teal-100">
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <Container className="relative py-16 lg:py-20">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-accent">
            <ShieldCheck className="h-4 w-4" />
            Poliambulatorio Polispecialistico Autorizzato ATS — Direzione Sanitaria Specialistica
          </span>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="white" className="h-16 w-auto" />
            <p className="mt-6 max-w-sm font-serif text-xl italic leading-relaxed text-white/90">
              &ldquo;{SITE.claim}&rdquo;
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-teal-200/75">
              Un unico hub multidisciplinare per la tua salute: azzeriamo attese,
              burocrazia e complessità per ripristinare il vero rapporto
              fiduciario tra medico e paziente.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-teal-200/85">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                {SITE.fullAddress}
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                {SITE.hours}
              </p>
            </div>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Cocoora"
              className="mt-7 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <FooterColumn title="Dipartimenti Clinici" links={dipartimenti} />
          <FooterColumn title="Il Tuo Percorso" links={percorsiClub} />

          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
              Contatti &amp; Prenotazioni
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm text-teal-100/85">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-slate-accent" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-slate-accent" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                Lun–Ven · 8:00–20:00
                <br />
                Sab · 9:00–14:00
              </li>
            </ul>
            <Link
              href="/contatti"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-teal-900 transition-all hover:-translate-y-0.5 hover:bg-teal-50"
            >
              Prenota una visita
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-teal-200/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Cocoora Studio Medico Polispecialistico. Tutti i diritti riservati.</p>
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

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
        {title}
      </h4>
      <ul className="mt-5 space-y-3">
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
