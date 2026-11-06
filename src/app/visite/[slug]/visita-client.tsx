"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { VisitaSpecialistica } from "@/lib/visite-specialistiche";
import type { Faq } from "@/lib/types";
import { SITE } from "@/lib/site";
import { trackLead } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { Button, Container } from "@/components/ui";
import { useShop } from "@/components/providers";

type ContactPreference = "WhatsApp" | "Telefono" | "Email";

const CONTACT_OPTIONS: { value: ContactPreference; icon: LucideIcon }[] = [
  { value: "WhatsApp", icon: MessageCircle },
  { value: "Telefono", icon: Phone },
  { value: "Email", icon: Mail },
];

export function VisitaClient({ visita }: { visita: VisitaSpecialistica }) {
  const { openDiscover } = useShop();
  const scrollToLead = () => {
    const el = document.getElementById("prenota");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main className="pb-20 md:pb-0 bg-canvas text-charcoal">
        {/* 1 — Hero Split 50/50 Image-First Luxury */}
        <HeroSection visita={visita} onOpenDiscover={openDiscover} />

        {/* 2 — Che cos'è e come funziona */}
        {visita.whatIs && <WhatIsSection visita={visita} />}

        {/* 3 — Esigenze & Sintomi affrontati */}
        {visita.problemsGrid && visita.problemsGrid.length > 0 && (
          <ProblemsSection visita={visita} />
        )}

        {/* 4 — Come si svolge la visita (Timeline) */}
        {visita.timelineSteps && visita.timelineSteps.length > 0 && (
          <TimelineSection visita={visita} />
        )}

        {/* 5 — Risultati e Refertazione */}
        {visita.results && (visita.results.description || (visita.results.paragraphs && visita.results.paragraphs.length > 0)) && (
          <ResultsSection visita={visita} />
        )}

        {/* Banner Funnel: Inizia con il Percorso Base Cocoora (0€) */}
        <DiscoverFunnelPush onOpenDiscover={openDiscover} />

        {/* 6 — Form di Prenotazione Dedicato */}
        <LeadSection visita={visita} />

        {/* 7 — Domande Frequenti (FAQ) */}
        {visita.faq && visita.faq.length > 0 && <FaqSection faq={visita.faq} />}

        {/* 8 — Geo-Local SEO Napoli */}
        {visita.localSeo && <LocalSeoSection visita={visita} />}

        {/* Link di ritorno */}
        <div className="bg-canvas pb-8">
          <Container>
            <Link
              href="/visite"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy"
            >
              <ArrowLeft className="h-4 w-4" /> Tutte le visite specialistiche
            </Link>
          </Container>
        </div>
      </main>

      {/* Barra mobile fissa per iscrizione Cocoora Club */}
      <StickyMobileCtaBar onOpenDiscover={openDiscover} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 1 — Hero Section (Image-First su mobile / Split 50/50 desktop)
// ─────────────────────────────────────────────────────────────────────────

function HeroSection({
  visita,
  onOpenDiscover,
}: {
  visita: VisitaSpecialistica;
  onOpenDiscover: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas pb-16 pt-10 sm:pb-20 sm:pt-14 border-b border-teal-100/60">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna testo: su mobile sotto l'immagine, su desktop sinistra */}
          <div className="order-last lg:order-first">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
              <Stethoscope className="h-3.5 w-3.5 text-teal-700" />
              {visita.categoryName}
            </span>

            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-dark-navy sm:text-5xl lg:text-6xl">
              {visita.title} <span className="italic font-normal text-teal-700">a Napoli</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-charcoal/80 sm:text-lg">
              {visita.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenDiscover}
                className="inline-flex items-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(3,53,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900"
              >
                Iscriviti gratuitamente al Cocoora Club <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-3.5 text-sm font-medium text-teal-900 shadow-sm transition-colors hover:bg-teal-50"
              >
                <Phone className="h-4 w-4 text-teal-700" />
                {SITE.phone}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-teal-100/80 pt-6 text-xs text-charcoal/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                <span>Centro Medico Autorizzato</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-teal-700" />
                <span>Specialisti Qualificati</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-teal-700" />
                <span>Referto a 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-teal-700" />
                <span>Rate Klarna / PayPal</span>
              </div>
            </div>
          </div>

          {/* Colonna immagine: su mobile in cima ("Image-First"), su desktop destra */}
          <div className="order-first lg:order-last relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] shadow-xl sm:aspect-[4/5] lg:mx-0 lg:max-w-none">
            <Image
              src={visita.heroImage}
              alt={visita.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/25 via-transparent to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 2 — "Che cos'è e come funziona?"
// ─────────────────────────────────────────────────────────────────────────

function WhatIsSection({ visita }: { visita: VisitaSpecialistica }) {
  const whatIs = visita.whatIs;
  const image = whatIs?.image || visita.galleryImages?.[1] || visita.heroImage;

  const paragraphs = whatIs?.paragraphs?.length
    ? whatIs.paragraphs
    : whatIs?.description
    ? [whatIs.description]
    : [visita.description];

  return (
    <section className="bg-white py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md border border-teal-100/60">
            <Image
              src={image}
              alt={`${visita.title} — come funziona`}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-800">
              Approfondimento Clinico
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
              {whatIs?.title || `In cosa consiste la ${visita.title}?`}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal/75">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 3 — "A cosa serve / Esigenze & Sintomi" (Griglia Card Sagomate)
// ─────────────────────────────────────────────────────────────────────────

function ProblemsSection({ visita }: { visita: VisitaSpecialistica }) {
  return (
    <section className="bg-teal-50/40 py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Esigenze &amp; Sintomi
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            {visita.problemsTitle || "Quando è indicata questa visita?"}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-charcoal/70">
            I nostri specialisti valutano ciascun caso con attenzione clinica ed esami mirati in sede.
          </p>
        </div>

        {/* Griglia a 4 box perfettamente simmetrica (2x2) */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {visita.problemsGrid.map((p, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Check className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-bold text-teal-950">{p.title}</h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-charcoal/70">
                  {p.description || "Valutazione specialistica dedicata condotta con strumentazione clinica in sede."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 4 — "Come si svolge la visita?" (Timeline simmetrica senza icone)
// ─────────────────────────────────────────────────────────────────────────

function TimelineStepCard({
  step,
  index,
}: {
  step: { stepNumber?: string; title: string; description: string };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isLong = step.description.length > 160;
  const showFull = expanded || isHovered;
  const num = step.stepNumber || String(index + 1).padStart(2, "0");

  return (
    <div
      onClick={() => isLong && setExpanded((prev) => !prev)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-teal-100/80 bg-gradient-to-b from-white via-white to-teal-50/25 p-6 sm:p-7 shadow-[0_10px_30px_-18px_rgba(3,53,75,0.08)] transition-all duration-300 hover:border-teal-300 hover:shadow-[0_20px_40px_-20px_rgba(3,53,75,0.16)] hover:-translate-y-1 h-full select-none",
        isLong && "cursor-pointer"
      )}
    >
      <div>
        {/* Intestazione: Numero scenico in corsivo elegante + Indicatore Fase */}
        <div className="flex items-center justify-between mb-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-teal-100/50 font-serif text-3xl font-light italic tracking-tight text-teal-950 shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:border-teal-400">
            {num}
          </span>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 border border-teal-100">
            Fase {index + 1}
          </span>
        </div>

        {/* Titolo dello step */}
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-teal-950 leading-snug">
          {step.title}
        </h3>

        {/* Descrizione con altezza pareggiata e apertura al click / hover */}
        <div className="relative mt-3">
          <p
            className={cn(
              "text-sm leading-relaxed text-charcoal/75 transition-all duration-300",
              !showFull && isLong && "line-clamp-4"
            )}
          >
            {step.description}
          </p>
        </div>
      </div>

      {/* Trigger espansione per card con testo lungo */}
      {isLong ? (
        <div className="mt-5 pt-3.5 border-t border-teal-100/60 flex items-center justify-between text-[11px] font-semibold text-teal-800 transition-colors group-hover:text-dark-navy">
          <span>{showFull ? "Mostra meno" : "Leggi tutto"}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300 text-teal-600",
              showFull && "rotate-180"
            )}
          />
        </div>
      ) : (
        <div className="mt-5 pt-3.5 border-t border-transparent" />
      )}
    </div>
  );
}

function TimelineSection({ visita }: { visita: VisitaSpecialistica }) {
  return (
    <section className="bg-white py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Percorso Specialistico
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            {visita.timelineTitle || "Come si svolge la visita specialistica?"}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-charcoal/70">
            Un iter chiaro, tempi dedicati all&apos;ascolto e refertazione puntuale.
          </p>
        </div>

        {/* Timeline simmetrica a 3 colonne pareggiate */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {visita.timelineSteps.map((step, idx) => (
            <TimelineStepCard
              key={step.stepNumber || idx}
              step={step}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 5 — "Risultati e Refertazione"
// ─────────────────────────────────────────────────────────────────────────

function ResultsSection({ visita }: { visita: VisitaSpecialistica }) {
  const results = visita.results;
  const image = results?.image || visita.galleryImages?.[2] || visita.galleryImages?.[1] || visita.heroImage;
  const paragraphs = results?.paragraphs?.length
    ? results.paragraphs
    : results?.description
    ? [results.description]
    : [];

  return (
    <section className="bg-canvas py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-800">
              Refertazione &amp; Continuità
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
              {results.title}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal/75">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md border border-teal-100/60">
            <Image
              src={image}
              alt={`${visita.title} — esito e refertazione`}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BANNER CONVERSIONE — "Inizia con il Percorso Base Cocoora (€0)"
// ─────────────────────────────────────────────────────────────────────────

function DiscoverFunnelPush({ onOpenDiscover }: { onOpenDiscover: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#002231] via-[#00344b] to-[#011e2b] py-14 sm:py-16 text-white border-y border-teal-800/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-slate-accent/15 blur-3xl"
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl rounded-3xl border border-teal-400/20 bg-white/5 p-7 backdrop-blur-md sm:p-10 shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-500/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200">
            <UserCheck className="h-3.5 w-3.5 text-teal-300" />
            Consigliato per nuovi pazienti · €0
          </div>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Inizia con il Percorso Base Cocoora
          </h2>
          <p className="mt-3 text-base leading-relaxed text-teal-100/85">
            Prima di effettuare la tua prima visita specialistica o acquistare un percorso continuativo, crea gratuitamente il tuo profilo clinico digitale in 2 minuti:
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-teal-50/90">
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
              <span>Accesso prioritario all&apos;agenda degli specialisti</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
              <span>Cartella clinica e referti digitali sempre disponibili</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
              <span>Sblocco percorsi con rateizzazione a tasso zero (Klarna / PayPal)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
              <span>Nessun costo fisso, attivazione gratuita immediata</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={onOpenDiscover}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-dark-navy shadow-lg transition-all hover:bg-teal-50 hover:-translate-y-0.5 cursor-pointer"
            >
              Attiva il Percorso Base Gratis (€0) <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-teal-200/70 text-center sm:text-left">
              Richiede solo nome ed email · Nessuna carta di credito richiesta
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 6 — Form Lead (#prenota) Conforme GDPR & Flessibilità Pagamento
// ─────────────────────────────────────────────────────────────────────────

function LeadSection({ visita }: { visita: VisitaSpecialistica }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    telefono: "",
    email: "",
    contatto: "WhatsApp" as ContactPreference,
    privacy: false,
    whatsappConsent: false,
  });

  const inputClass =
    "w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.telefono.trim() || !form.privacy) {
      setError("Compila i campi obbligatori (nome, telefono) e accetta l'informativa sulla privacy.");
      return;
    }
    setError("");
    trackLead({
      email: form.email || "info@cocoora.it",
      name: `${form.nome} ${form.cognome}`.trim(),
    });
    setSent(true);
  };

  return (
    <section id="prenota" className="scroll-mt-20 bg-white py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="rounded-[2.5rem] border border-teal-200/70 bg-gradient-to-br from-teal-50/80 via-white to-teal-50/50 p-8 shadow-lg sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Colonna sinistra — rassicurazione & condizioni */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Richiesta Informazioni &amp; Prenotazione
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
                Prenota {visita.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/75">
                Lasciaci i tuoi contatti: la nostra segreteria clinica ti ricontatterà per confermare data, orario e dettagli della valutazione medica.
              </p>

              <div className="mt-6 rounded-2xl bg-white/90 p-4 border border-teal-100 shadow-2xs space-y-2 text-xs text-charcoal/80">
                <p className="font-semibold text-teal-950 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-teal-700" />
                  Zero Anticipo Online &amp; Saldo Flessibile
                </p>
                <p className="leading-relaxed">
                  Nessun pagamento anticipato adesso: il saldo avviene in clinica il giorno della visita (Carta, Bancomat, Contanti). Per piani terapeutici e pacchetti diagnostici è attiva la <strong>rateizzazione in 3 rate a tasso zero con Klarna e PayPal</strong>.
                </p>
              </div>

              <div className="mt-6 flex items-start gap-3 text-xs text-charcoal/65">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <p>
                  I tuoi dati personali e sanitari sono protetti e trattati nel pieno rispetto della normativa GDPR.
                </p>
              </div>
            </div>

            {/* Colonna destra — form interattivo */}
            <div>
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-teal-100 bg-white/80 p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">
                    Richiesta Inviata
                  </h3>
                  <p className="mt-2 text-sm text-charcoal/70">
                    Grazie {form.nome}! Ti ricontatteremo a breve
                    {form.contatto === "WhatsApp" && " su WhatsApp"}
                    {form.contatto === "Telefono" && " telefonicamente"}
                    {form.contatto === "Email" && " via email"} per concordare la visita.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-sm sm:p-8" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">Nome *</span>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        placeholder="Nome"
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">Cognome</span>
                      <input
                        type="text"
                        value={form.cognome}
                        onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                        placeholder="Cognome"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">Telefono *</span>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        placeholder="+39 333 ..."
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="nome@email.it"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <fieldset className="mt-5">
                    <legend className="mb-2 block text-xs font-medium text-teal-900">
                      Canale di contatto preferito
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {CONTACT_OPTIONS.map(({ value, icon: Icon }) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                            form.contatto === value
                              ? "border-teal-600 bg-teal-50 text-teal-900 font-semibold"
                              : "border-teal-200 bg-white text-charcoal/70 hover:border-teal-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="contatto"
                            value={value}
                            checked={form.contatto === value}
                            onChange={() => setForm({ ...form, contatto: value })}
                            className="sr-only"
                          />
                          <Icon className="h-4 w-4 text-teal-700" />
                          {value}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="mt-5 flex items-start gap-3 text-xs sm:text-sm text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={form.privacy}
                      onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      Ho letto l&apos;
                      <Link href="/contatti" className="font-medium text-teal-800 underline underline-offset-2 hover:text-dark-navy">
                        informativa privacy
                      </Link>{" "}
                      e acconsento al trattamento dei dati personali *
                    </span>
                  </label>

                  <label className="mt-3 flex items-start gap-3 text-xs sm:text-sm text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={form.whatsappConsent}
                      onChange={(e) => setForm({ ...form, whatsappConsent: e.target.checked })}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      Acconsento a ricevere comunicazioni e promemoria appuntamenti tramite WhatsApp
                    </span>
                  </label>

                  {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}

                  <Button type="submit" size="lg" className="mt-6 w-full">
                    Invia Richiesta di Prenotazione
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 7 — Domande Frequenti (FAQ Accordion)
// ─────────────────────────────────────────────────────────────────────────

function FaqSection({ faq }: { faq: Faq[] }) {
  return (
    <section className="bg-canvas py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            Domande Frequenti
          </h2>
          <div className="mt-10 divide-y divide-teal-100/80 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm sm:p-8">
            {faq.map((item, idx) => (
              <FaqItem key={idx} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FaqItem({ item }: { item: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 text-left font-serif text-lg font-medium text-teal-900 transition-colors hover:text-dark-navy"
      >
        <span>{item.q}</span>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-teal-600 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="mt-3 text-sm leading-relaxed text-charcoal/75 animate-fade-in">
          {item.a}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 8 — Local SEO Napoli
// ─────────────────────────────────────────────────────────────────────────

function LocalSeoSection({ visita }: { visita: VisitaSpecialistica }) {
  return (
    <section className="bg-white py-16 sm:py-20 border-b border-teal-100/60">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-teal-200/80 bg-teal-50/40 p-8 sm:p-10">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>Cocoora Centro Medico · Napoli</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
            {visita.localSeo.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/80 sm:text-base">
            {visita.localSeo.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-charcoal/70">
            <span>📍 Via Generale Giovanni De Bonis 81, Napoli</span>
            <span>🕒 Lun–Ven 8:00–20:00 · Sab 9:00–14:00</span>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Mobile Sticky CTA Bar
// ─────────────────────────────────────────────────────────────────────────

function StickyMobileCtaBar({
  onOpenDiscover,
}: {
  onOpenDiscover: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-100 bg-white/95 p-3.5 backdrop-blur-md md:hidden shadow-lg">
      <div className="flex items-center gap-3">
        <a
          href={`tel:${SITE.phone}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-800"
          aria-label="Chiama centro"
        >
          <Phone className="h-4 w-4" />
        </a>
        <Button onClick={onOpenDiscover} size="md" className="flex-1 font-semibold">
          Iscriviti gratuitamente al Cocoora Club
        </Button>
      </div>
    </div>
  );
}
