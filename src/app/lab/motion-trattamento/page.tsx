"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  FileCheck,
  HeartHandshake,
  Info,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui";
import { Logo } from "@/components/logo";
import { MEDICINA_ESTETICA_TREATMENTS } from "@/lib/treatments-medicina";
import { SITE } from "@/lib/site";
import type { Treatment } from "@/lib/types";

// Selettore Trattamenti Demo per testare il catalogo live
const DEMO_TREATMENTS = [
  { slug: "filler-acido-ialuronico", label: "Filler Acido Ialuronico" },
  { slug: "tossina-botulinica", label: "Tossina Botulinica" },
  { slug: "biorivitalizzazione", label: "Biorivitalizzazione" },
  { slug: "cryoliposculpt", label: "Cryoliposculpt" },
];

const APPLICATION_ICONS: LucideIcon[] = [
  Sparkles,
  ShieldCheck,
  SearchCheck,
  HeartHandshake,
];

function scrollToLead() {
  document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" });
}

export default function MotionTrattamentoPage() {
  const [selectedSlug, setSelectedSlug] = useState("filler-acido-ialuronico");

  const currentTreatment =
    MEDICINA_ESTETICA_TREATMENTS.find((t) => t.slug === selectedSlug) ??
    MEDICINA_ESTETICA_TREATMENTS[0];

  return (
    <div className="relative min-h-screen bg-[#F8FAF9] text-[#03354B] selection:bg-[#2A7F89] selection:text-white">
      {/* ================================================================ */}
      {/* TOP LUXURY CONCIERGE HEADER & SELECTOR (Luminoso in Vetro)       */}
      {/* ================================================================ */}
      <header className="sticky top-0 z-50 border-b border-teal-900/10 bg-white/85 backdrop-blur-2xl transition-all duration-300 shadow-[0_4px_25px_-5px_rgba(3,53,75,0.06)]">
        <Container className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link
              href="/lab/motion-home"
              className="group inline-flex items-center gap-2.5 rounded-full border border-teal-900/10 bg-teal-50/80 px-4 py-2 text-xs font-medium text-[#03354B] backdrop-blur-md transition-all hover:border-[#2A7F89] hover:bg-white hover:text-dark-navy"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#2A7F89] transition-transform group-hover:-translate-x-1" />
              <span>Demo Home</span>
            </Link>

            <div className="hidden md:block h-5 w-px bg-teal-900/15" />

            <Link href="/" className="hidden sm:flex items-center">
              <Logo variant="dark" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Treatment Live Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            <span className="hidden lg:inline text-[10px] font-mono uppercase tracking-[0.22em] text-teal-800/80 font-semibold">
              Catalogo:
            </span>
            <div className="flex items-center gap-1 rounded-full bg-teal-900/5 p-1 border border-teal-900/10 backdrop-blur-md">
              {DEMO_TREATMENTS.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => setSelectedSlug(item.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    selectedSlug === item.slug
                      ? "bg-[#03354B] text-white font-semibold shadow-sm"
                      : "text-charcoal/75 hover:text-[#03354B] hover:bg-white/80"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={scrollToLead}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#03354B] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#2A7F89] hover:shadow-md hover:-translate-y-0.5"
          >
            <span>Richiedi Valutazione</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Container>
      </header>

      {/* ================================================================ */}
      {/* 1 · HERO SECTION: SFUMATURE MORBIDE & OVERLAY CAUSTICO           */}
      {/* ================================================================ */}
      <HeroSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 2 · METODOLOGIA & COME FUNZIONA: WARM ALABASTER (Blocco 2 Silvia) */}
      {/* ================================================================ */}
      <WhatIsSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 3 · A COSA SERVE: 4 APPLICAZIONI IN VETRO LIQUIDO (Blocco 3)     */}
      {/* ================================================================ */}
      <ProblemsSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 4 · COME SI SVOLGE LA SEDUTA: SPINA CRONOLOGICA (Blocco 4 Silvia)*/}
      {/* ================================================================ */}
      <TimelineSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 5 · QUALI RISULTATI ASPETTARSI: EDITORIAL DOUBLE SPREAD (Blocco 5)*/}
      {/* ================================================================ */}
      <ResultsSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 6 · PRIVATE MEDICAL CONCIERGE FORM (Blocco 6 Silvia)             */}
      {/* ================================================================ */}
      <LeadSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 7 · DOMANDE FREQUENTI: ACCORDION SILK (Blocco 7 Silvia)           */}
      {/* ================================================================ */}
      <FaqSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* 8 · GEO-LOCAL SEO NAPOLI: SEDE & CONTATTI (Blocco 8 Silvia)      */}
      {/* ================================================================ */}
      <LocalSeoSection treatment={currentTreatment} />

      {/* ================================================================ */}
      {/* STICKY MOBILE CONCIERGE BAR                                      */}
      {/* ================================================================ */}
      <StickyMobileBar treatment={currentTreatment} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 1 — HERO SECTION: SFUMATURE MORBIDE & OVERLAY MATERICO
// ─────────────────────────────────────────────────────────────────────────
function HeroSection({ treatment }: { treatment: Treatment }) {
  const overline =
    treatment.whatIs?.overline ??
    (treatment.category === "odontoiatria"
      ? "ODONTOIATRIA SPECIALISTICA"
      : "MEDICINA ESTETICA & RIGENERAZIONE");

  const title = treatment.title;
  const intro = treatment.tagline || treatment.description;
  const ctaLabel = treatment.heroCta || "Richiedi una valutazione";
  const heroImage =
    treatment.heroImage ?? "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg";

  return (
    <section
      id="trattamento-hero"
      className="relative overflow-hidden bg-gradient-to-b from-[#EAF3F5] via-[#F3F8F9] to-[#FAF8F5] pt-14 pb-24 sm:pt-20 sm:pb-32 border-b border-teal-900/10"
    >
      {/* OVERLAY 1: Texture Micro-Mesh Geometrico Architettonico */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#2A7F89_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07]"
      />

      {/* OVERLAY 2: Sfumatura Caustica Superiore (Luce Mediterranea) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-1/4 h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-teal-300/30 via-cyan-200/20 to-transparent blur-[110px]"
      />

      {/* OVERLAY 3: Sfumatura Caustica Inferiore Sinistra */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-emerald-200/25 via-teal-200/15 to-transparent blur-[100px]"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Colonna Testo (7 col) */}
          <div className="order-last lg:order-first lg:col-span-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-teal-900/15 bg-white/80 px-4 py-1.5 backdrop-blur-xl mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#2A7F89] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-950 font-semibold">
                {overline}
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight text-[#03354B] leading-[1.03] mb-6 drop-shadow-xs">
              {title}
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-[#1E252B]/85 max-w-2xl mb-8 font-light font-sans">
              {intro}
            </p>

            {/* Prestige Medical Badges */}
            <div className="mb-10 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-900/10 bg-white/90 px-4 py-2 text-xs font-medium text-[#03354B] shadow-sm backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-[#2A7F89]" />
                <span>Valutazione clinica preliminare</span>
              </div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-900/10 bg-white/90 px-4 py-2 text-xs font-medium text-[#03354B] shadow-sm backdrop-blur-md">
                <UserCheck className="h-4 w-4 text-[#2A7F89]" />
                <span>Protocollo anatomico personalizzato</span>
              </div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-900/10 bg-white/90 px-4 py-2 text-xs font-medium text-[#03354B] shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-[#2A7F89]" />
                <span>Armonia naturale e rigore etico</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={scrollToLead}
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#03354B] px-9 py-4 text-sm font-semibold text-white shadow-[0_16px_36px_-12px_rgba(3,53,75,0.4)] transition-all duration-300 hover:bg-[#2A7F89] hover:shadow-[0_20px_45px_-12px_rgba(42,127,137,0.5)] hover:-translate-y-0.5"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={`tel:${SITE.phoneRaw}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-900/15 bg-white/80 px-7 py-4 text-sm font-medium text-[#03354B] backdrop-blur-md transition-all hover:bg-white hover:border-[#2A7F89]"
              >
                <Phone className="h-4 w-4 text-[#2A7F89]" />
                <span>{SITE.phone}</span>
              </a>
            </div>
          </div>

          {/* Colonna Immagine Hero (5 col) */}
          <div className="order-first lg:order-last lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-[0_30px_70px_-20px_rgba(3,53,75,0.22)]">
              <Image
                src={heroImage}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              {/* Vignetta Caustica Leggera */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#03354B]/60 via-transparent to-transparent" />

              {/* Floating Frosted Tag */}
              <div className="absolute bottom-6 inset-x-6 rounded-2xl border border-white/60 bg-white/90 p-5 backdrop-blur-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2A7F89] text-white shadow-sm">
                    <Stethoscope className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-serif font-semibold text-[#03354B]">
                      Consulenza Specialistica
                    </p>
                    <p className="text-xs text-charcoal/70 font-light mt-0.5">
                      Inquadramento fisionomico prima di ogni procedura
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 2 — METODOLOGIA & COME FUNZIONA: WARM ALABASTER LINEN
// ─────────────────────────────────────────────────────────────────────────
function WhatIsSection({ treatment }: { treatment: Treatment }) {
  const whatIs = treatment.whatIs;
  const title =
    whatIs?.title ?? `Che cos'è ${treatment.title.toLowerCase()} e come funziona?`;

  const paragraphs = whatIs?.paragraphs?.length
    ? whatIs.paragraphs
    : whatIs?.description
      ? [whatIs.description]
      : [treatment.description];

  const callout =
    whatIs?.callout ??
    "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.";

  const image = whatIs?.image ?? "/images/trattamenti/medicina-estetica/filler-viso-napoli-2.jpg";

  return (
    <section
      id="trattamento-funzionamento"
      className="relative py-24 sm:py-36 bg-[#FAF8F5] text-[#03354B] overflow-hidden"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-18">
          {/* Colonna Sinistra — Immagine Gesto Medico */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-teal-900/10 bg-white shadow-[0_25px_60px_-15px_rgba(3,53,75,0.1)]">
              <Image
                src={image}
                alt={`${treatment.title} - Metodo clinico`}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03354B]/50 via-transparent to-transparent" />

              <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/95 px-4 py-1.5 backdrop-blur-md text-xs font-semibold text-[#03354B] shadow-md">
                <FileCheck className="h-4 w-4 text-[#2A7F89]" />
                <span>Protocollo Clinico Certificato</span>
              </div>
            </div>
          </div>

          {/* Colonna Destra — Testi Verbatim Silvia */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#2A7F89]" />
              <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-teal-900 font-bold">
                02 · METODOLOGIA &amp; PRINCIPIO CLINICO
              </p>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03354B] mb-8 leading-[1.08]">
              {title}
            </h2>

            <div className="space-y-6 text-[#1E252B]/85 text-lg sm:text-xl leading-relaxed font-light">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Callout Box Luxury Liquid Glass */}
            <div className="mt-10 rounded-3xl border border-teal-200/90 bg-gradient-to-br from-white via-teal-50/50 to-white p-8 text-[#03354B] shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#2A7F89] text-white shadow-sm mt-1">
                  <Info className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#2A7F89] font-bold mb-1">
                    Personalizzazione Clinica
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed text-[#03354B] font-medium">
                    {callout}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 3 — A COSA SERVE: 4 APPLICAZIONI IN VETRO LIQUIDO
// ─────────────────────────────────────────────────────────────────────────
function ProblemsSection({ treatment }: { treatment: Treatment }) {
  const title = treatment.problemsTitle || `A cosa serve ${treatment.title}?`;
  const subtitle =
    treatment.problemsSubtitle ||
    "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.";

  const problems =
    treatment.problemsGrid && treatment.problemsGrid.length > 0
      ? treatment.problemsGrid.slice(0, 4)
      : [
          {
            title: "Armonizzazione volumi",
            description:
              "Intervento mirato sulle proporzioni per restituire freschezza e coerenza anatomica.",
          },
          {
            title: "Trattamento rughe e solchi",
            description:
              "Attenuazione progressiva dei segni superficiali e profondi nel rispetto della mobilità.",
          },
          {
            title: "Definizione contorni",
            description:
              "Miglioramento del disegno fisionomico con approccio mini-invasivo personalizzato.",
          },
          {
            title: "Qualità dei tessuti",
            description:
              "Sostegno strutturale guidato dal medico specialista in base alla biologia individuale.",
          },
        ];

  return (
    <section
      id="trattamento-applicazioni"
      className="relative py-24 sm:py-36 bg-[#F0F6F7] text-[#03354B] border-y border-teal-900/10 overflow-hidden"
    >
      {/* Sfumatura Caustica di Sfondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[750px] rounded-full bg-teal-200/30 blur-[150px]"
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-white px-4 py-1.5 shadow-xs mb-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-900 font-semibold">
              03 · INDICAZIONI &amp; APPLICAZIONI
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03354B] mb-6">
            {title}
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-[#1E252B]/75 font-light">
            {subtitle}
          </p>
        </div>

        {/* 4 Card Luminose in Vetro Satinato con Accento Smeraldo */}
        <div className="grid gap-8 sm:grid-cols-2">
          {problems.map((p, index) => {
            const Icon = APPLICATION_ICONS[index % APPLICATION_ICONS.length];
            return (
              <div
                key={p.title}
                className="group relative h-full rounded-[2rem] border border-teal-900/10 bg-white/95 p-9 shadow-[0_15px_40px_-15px_rgba(3,53,75,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-[#2A7F89] hover:shadow-[0_25px_50px_-15px_rgba(42,127,137,0.18)] hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4 mb-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#2A7F89] border border-teal-100 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2A7F89] group-hover:text-white shadow-xs">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="font-mono text-sm font-semibold text-teal-800/80 tracking-widest">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#03354B] mb-4 group-hover:text-[#2A7F89] transition-colors">
                  {p.title}
                </h3>

                <p className="text-base sm:text-lg leading-relaxed text-[#1E252B]/80 font-light">
                  {p.description}
                </p>

                <div className="mt-8 pt-6 border-t border-teal-900/10 flex items-center justify-between text-xs font-semibold text-[#2A7F89]">
                  <span>Valutabile in consulenza clinica</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 4 — COME SI SVOLGE LA SEDUTA: SPINA CRONOLOGICA LUMINOSA
// ─────────────────────────────────────────────────────────────────────────
function TimelineSection({ treatment }: { treatment: Treatment }) {
  const title =
    treatment.timelineTitle || `Come si svolge una seduta di ${treatment.title}?`;

  const steps =
    treatment.timelineSteps && treatment.timelineSteps.length > 0
      ? treatment.timelineSteps
      : treatment.steps && treatment.steps.length > 0
        ? treatment.steps.map((s, idx) => ({
            stepNumber: `0${idx + 1}`,
            title: s.title,
            description: s.description,
          }))
        : [
            {
              stepNumber: "01",
              title: "Analisi del volto",
              description:
                "Il medico raccoglie l’anamnesi, osserva proporzioni, dinamica espressiva e caratteristiche dei tessuti.",
            },
            {
              stepNumber: "02",
              title: "Trattamento mirato",
              description:
                "Se indicato, esegue le iniezioni nelle aree concordate, con modalità e quantità definite durante la visita.",
            },
            {
              stepNumber: "03",
              title: "Indicazioni e controllo",
              description:
                "Spiega quali reazioni transitorie possono comparire e fornisce indicazioni per il periodo successivo.",
            },
          ];

  const noteTitle = treatment.timelineNote?.title ?? "Ogni pelle è diversa";
  const noteText =
    treatment.timelineNote?.text ??
    "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo.";

  return (
    <section
      id="trattamento-seduta"
      className="relative py-24 sm:py-36 bg-[#FAF8F5] text-[#03354B] overflow-hidden"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-white px-4 py-1.5 mb-4 shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-900 font-bold">
              04 · PROTOCOLLO CLINICO
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03354B] mb-6">
            {title}
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-[#1E252B]/75 font-light">
            Nel nostro centro, il percorso medico viene pianificato su misura dopo un&apos;accurata
            valutazione clinica, con tempi dedicati e la massima attenzione al comfort.
          </p>
        </div>

        {/* 3 Step Monumentali in Bianco */}
        <div className="grid gap-8 md:grid-cols-3 relative">
          {steps.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="relative rounded-[2rem] border border-teal-900/10 bg-white p-9 shadow-[0_15px_40px_-15px_rgba(3,53,75,0.06)] transition-all duration-300 hover:border-[#2A7F89] hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03354B] font-serif text-lg font-bold text-teal-200 shadow-sm">
                  {step.stepNumber}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-teal-900 font-bold">
                  Fase {idx + 1}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-semibold text-[#03354B] mb-3">
                {step.title}
              </h3>

              <p className="text-base leading-relaxed text-[#1E252B]/80 font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance Pledge Box */}
        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-teal-200/80 bg-white p-8 sm:p-9 shadow-sm">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2A7F89] text-white shadow-sm">
              <Leaf className="h-6 w-6" />
            </span>
            <div>
              <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#03354B] mb-2">
                {noteTitle}
              </h4>
              <p className="text-base leading-relaxed text-[#1E252B]/80 font-light">
                {noteText}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 5 — QUALI RISULTATI ASPETTARSI: EDITORIAL DOUBLE SPREAD
// ─────────────────────────────────────────────────────────────────────────
function ResultsSection({ treatment }: { treatment: Treatment }) {
  const results = treatment.results;
  const title =
    results?.title ?? `${treatment.title}: quali risultati aspettarsi?`;

  const paragraphs = results?.paragraphs?.length
    ? results.paragraphs
    : results?.description
      ? [results.description]
      : [
          "L’effetto volumizzante può risultare visibile dopo il trattamento, ma il risultato va rivalutato dopo l’assestamento dei tessuti. Durata e risposta variano secondo prodotto, area e caratteristiche individuali.",
          "Un esito armonico dipende dalla proporzione rispetto ai lineamenti e non da un volume prefissato. La durata degli effetti è variabile e non si può stabilire per tutti un identico intervallo di mantenimento.",
          "Ogni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo.",
        ];

  const image =
    results?.image ?? "/images/trattamenti/medicina-estetica/filler-viso-napoli-3.jpg";

  return (
    <section
      id="trattamento-risultati"
      className="relative py-24 sm:py-36 bg-white text-[#03354B] border-t border-teal-900/10 overflow-hidden"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-18">
          {/* Colonna Sinistra — Immagine Risultato */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-teal-900/10 bg-slate-100 shadow-[0_25px_60px_-15px_rgba(3,53,75,0.12)]">
              <Image
                src={image}
                alt={`${treatment.title} - Risultati e aspettative`}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03354B]/50 via-transparent to-transparent" />

              <div className="absolute bottom-6 inset-x-6 rounded-2xl border border-white/60 bg-white/95 p-5 backdrop-blur-xl shadow-md">
                <p className="text-sm font-serif font-semibold text-[#03354B]">
                  Etica &amp; Trasparenza Clinica
                </p>
                <p className="text-xs text-[#1E252B]/75 font-light mt-1">
                  Nessuna promessa irrealistica: percorsi medici fondati sull&apos;anatomia.
                </p>
              </div>
            </div>
          </div>

          {/* Colonna Destra — Testi Verbatim Silvia */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-teal-50 px-4 py-1.5 mb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-900 font-semibold">
                05 · ETICA &amp; TRASPARENZA CLINICA
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03354B] mb-8 leading-[1.08]">
              {title}
            </h2>

            <div className="space-y-6 text-[#1E252B]/85 text-lg sm:text-xl leading-relaxed font-light mb-10">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* 3 Pilastri Lussuosi Lavorati in Bianco */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-teal-900/10 bg-teal-50/50 p-5 shadow-xs">
                <Check className="h-5 w-5 text-[#2A7F89] mb-3" />
                <p className="text-sm font-semibold text-[#03354B] font-serif">
                  Armonia Naturale
                </p>
                <p className="text-xs text-[#1E252B]/75 font-light mt-1">
                  Rispetto assoluto della mimica facciale.
                </p>
              </div>
              <div className="rounded-2xl border border-teal-900/10 bg-teal-50/50 p-5 shadow-xs">
                <Clock className="h-5 w-5 text-[#2A7F89] mb-3" />
                <p className="text-sm font-semibold text-[#03354B] font-serif">
                  Assestamento
                </p>
                <p className="text-xs text-[#1E252B]/75 font-light mt-1">
                  Rivalutazione dopo la stabilizzazione.
                </p>
              </div>
              <div className="rounded-2xl border border-teal-900/10 bg-teal-50/50 p-5 shadow-xs">
                <ShieldCheck className="h-5 w-5 text-[#2A7F89] mb-3" />
                <p className="text-sm font-semibold text-[#03354B] font-serif">
                  Limiti Chiari
                </p>
                <p className="text-xs text-[#1E252B]/75 font-light mt-1">
                  Condivisione sincera delle possibilità.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 6 — PRIVATE MEDICAL CONCIERGE FORM (#lead)
// ─────────────────────────────────────────────────────────────────────────
type ContactPreference = "WhatsApp" | "Telefono" | "Email";

function LeadSection({ treatment }: { treatment: Treatment }) {
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

  const overline = treatment.leadForm?.overline ?? "RICHIEDI UNA VALUTAZIONE";
  const title = treatment.leadForm?.title ?? `Hai domande su ${treatment.title}?`;
  const subtitle =
    treatment.leadForm?.subtitle ??
    "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica, senza impegno.";
  const ctaText = treatment.leadForm?.cta ?? "Richiedi ora";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cognome || !form.telefono || !form.email || !form.privacy) {
      setError("Compila tutti i campi obbligatori contrassegnati da asterisco (*) e accetta la privacy.");
      return;
    }
    setError("");
    setSent(true);
  };

  const inputClass =
    "w-full rounded-2xl border border-teal-200/90 bg-white px-5 py-4 text-sm text-[#03354B] placeholder:text-charcoal/40 outline-none transition-all focus:border-[#2A7F89] focus:ring-2 focus:ring-[#2A7F89]/20";

  return (
    <section
      id="lead"
      className="scroll-mt-24 py-24 sm:py-36 bg-[#F4F8F9] text-[#03354B] border-t border-teal-900/10"
    >
      <Container>
        <div className="overflow-hidden rounded-[3rem] border border-teal-900/15 bg-gradient-to-br from-white via-teal-50/40 to-white p-8 sm:p-16 shadow-[0_30px_70px_-20px_rgba(3,53,75,0.1)] backdrop-blur-2xl">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-18 items-center">
            {/* Colonna Sinistra — Rassicurazione Clinica */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-white px-4 py-1.5 shadow-xs mb-6">
                <span className="h-2 w-2 rounded-full bg-[#2A7F89]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-950 font-semibold">
                  {overline}
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03354B] mb-6 leading-tight">
                {title}
              </h2>

              <p className="text-lg sm:text-xl leading-relaxed text-[#1E252B]/80 font-light mb-10">
                {subtitle}
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4 text-sm text-[#1E252B]/85">
                  <ShieldCheck className="h-5 w-5 text-[#2A7F89] shrink-0 mt-0.5" />
                  <span>Dati trattati in conformità al GDPR e al segreto professionale medico.</span>
                </div>
                <div className="flex items-start gap-4 text-sm text-[#1E252B]/85">
                  <Stethoscope className="h-5 w-5 text-[#2A7F89] shrink-0 mt-0.5" />
                  <span>Direzione Sanitaria della Dott.ssa Elisa Russo.</span>
                </div>
                <div className="flex items-start gap-4 text-sm text-[#1E252B]/85">
                  <Clock className="h-5 w-5 text-[#2A7F89] shrink-0 mt-0.5" />
                  <span>Accoglienza dedicata e puntuale negli studi di Napoli.</span>
                </div>
              </div>
            </div>

            {/* Colonna Destra — Form Interattivo */}
            <div className="lg:col-span-7">
              {sent ? (
                <div className="rounded-3xl border border-teal-900/10 bg-white p-12 text-center shadow-md">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-[#2A7F89] mb-6">
                    <Check className="h-10 w-10" />
                  </span>
                  <h3 className="font-serif text-3xl font-semibold text-[#03354B] mb-3">
                    Richiesta Ricevuta con Successo
                  </h3>
                  <p className="text-[#1E252B]/80 text-base max-w-md mx-auto leading-relaxed font-light">
                    Grazie {form.nome}! Il nostro team medico ti ricontatterà al più presto{" "}
                    {form.contatto === "WhatsApp" && "su WhatsApp "}
                    {form.contatto === "Telefono" && "telefonicamente "}
                    {form.contatto === "Email" && "tramite email "}
                    per fornirti tutte le informazioni e concordare la tua valutazione specialistica.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-3xl border border-teal-900/10 bg-white p-8 sm:p-10 shadow-sm"
                  noValidate
                >
                  <div className="grid gap-5 sm:grid-cols-2 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#03354B] uppercase tracking-wider mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        placeholder="Nome"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#03354B] uppercase tracking-wider mb-2">
                        Cognome *
                      </label>
                      <input
                        type="text"
                        value={form.cognome}
                        onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                        placeholder="Cognome"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#03354B] uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="nome@esempio.it"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#03354B] uppercase tracking-wider mb-2">
                        Telefono *
                      </label>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        placeholder="+39 ..."
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Preferenza Canale di Contatto */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[#03354B] uppercase tracking-wider mb-2.5">
                      Come preferisci essere ricontattato?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["WhatsApp", "Telefono", "Email"] as ContactPreference[]).map((canal) => (
                        <button
                          key={canal}
                          type="button"
                          onClick={() => setForm({ ...form, contatto: canal })}
                          className={`flex items-center justify-center gap-2.5 rounded-2xl border py-3.5 px-3 text-xs font-semibold transition-all ${
                            form.contatto === canal
                              ? "border-[#2A7F89] bg-teal-50 text-[#03354B] shadow-xs"
                              : "border-teal-200/80 bg-white text-charcoal/70 hover:border-teal-400"
                          }`}
                        >
                          {canal === "WhatsApp" && <MessageCircle className="h-4 w-4 text-[#2A7F89]" />}
                          {canal === "Telefono" && <Phone className="h-4 w-4 text-[#2A7F89]" />}
                          {canal === "Email" && <Mail className="h-4 w-4 text-[#2A7F89]" />}
                          <span>{canal}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consensi Privacy */}
                  <div className="space-y-3.5 mb-8">
                    <label className="flex items-start gap-3.5 text-xs text-charcoal/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.privacy}
                        onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                        required
                        className="mt-0.5 h-4 w-4 rounded border-teal-300 text-[#2A7F89] focus:ring-[#2A7F89]"
                      />
                      <span>
                        Ho letto l&apos;informativa sulla privacy e acconsento al trattamento dei dati personali per la richiesta informativa. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3.5 text-xs text-charcoal/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.whatsappConsent}
                        onChange={(e) => setForm({ ...form, whatsappConsent: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-teal-300 text-[#2A7F89] focus:ring-[#2A7F89]"
                      />
                      <span>
                        Desidero ricevere risposte rapide e aggiornamenti clinici via WhatsApp dal team Cocoora.
                      </span>
                    </label>
                  </div>

                  {error && <p className="mb-4 text-xs font-medium text-red-500">{error}</p>}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#03354B] py-4 text-sm font-semibold text-white shadow-[0_16px_36px_-12px_rgba(3,53,75,0.4)] transition-all hover:bg-[#2A7F89] hover:-translate-y-0.5"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
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
// BLOCCO 7 — DOMANDE FREQUENTI: ACCORDION SILK
// ─────────────────────────────────────────────────────────────────────────
function FaqSection({ treatment }: { treatment: Treatment }) {
  const faq = treatment.faq ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faq.length) return null;

  return (
    <section
      id="trattamento-faq"
      className="relative py-24 sm:py-36 bg-[#FAF8F5] text-[#03354B] overflow-hidden"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-white px-4 py-1.5 mb-4 shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-900 font-bold">
              07 · CHIAREZZA &amp; INFORMAZIONE
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03354B] mb-5">
            Domande Frequenti
          </h2>
          <p className="text-lg text-[#1E252B]/75 font-light">
            Risposte trasparenti ai dubbi più comuni prima di una consulenza medica.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faq.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-teal-900/10 bg-white shadow-xs transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-5 p-7 text-left transition-colors hover:bg-teal-50/40"
                >
                  <span className="font-serif text-xl sm:text-2xl font-semibold text-[#03354B]">
                    {item.q}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#03354B] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#2A7F89] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-teal-900/10 px-7 pt-4 pb-7 text-base sm:text-lg leading-relaxed text-[#1E252B]/80 font-light bg-teal-50/20">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 8 — GEO-LOCAL SEO NAPOLI: SEDE & CONTATTI
// ─────────────────────────────────────────────────────────────────────────
function LocalSeoSection({ treatment }: { treatment: Treatment }) {
  const localSeo = treatment.localSeo;
  const overline =
    localSeo?.overline ??
    (treatment.category === "odontoiatria"
      ? "ODONTOIATRIA A NAPOLI"
      : "MEDICINA ESTETICA A NAPOLI");

  const title = localSeo?.title ?? `${treatment.title} a Napoli`;
  const description =
    localSeo?.description ??
    "Nel nostro centro a Napoli, in Via Generale Giovanni De Bonis 81 (Posillipo/Fuorigrotta), ogni percorso comincia da una valutazione medica personalizzata. Una posizione riservata e facilmente raggiungibile in auto e con i mezzi pubblici, con parcheggio nelle immediate vicinanze.";

  const cta = localSeo?.cta ?? "Richiedi una valutazione";

  return (
    <section
      id="trattamento-sede"
      className="relative py-24 sm:py-36 bg-[#F4F8F9] text-[#03354B] border-t border-teal-900/10"
    >
      <Container>
        <div className="overflow-hidden rounded-[3rem] border border-teal-900/15 bg-white shadow-[0_25px_60px_-20px_rgba(3,53,75,0.1)]">
          <div className="grid lg:grid-cols-12 items-stretch">
            {/* Foto Architettonica Sede (5 col) */}
            <div className="relative min-h-[350px] lg:col-span-5">
              <Image
                src="/images/centro/foto-2.webp"
                alt="Cocoora Centro Medico - Napoli"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03354B]/60 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/60 bg-white/90 p-5 backdrop-blur-xl shadow-md">
                <p className="text-sm font-serif font-semibold text-[#03354B]">
                  Cocoora Centro Medico Napoli
                </p>
                <p className="text-xs text-[#1E252B]/75 font-light mt-0.5">
                  Via Generale Giovanni De Bonis, 81 (Posillipo / Fuorigrotta)
                </p>
              </div>
            </div>

            {/* Dettagli & Prenotazione (7 col) */}
            <div className="p-8 sm:p-14 lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 bg-teal-50 px-4 py-1.5 mb-6 w-fit">
                <span className="text-[11px] font-mono uppercase tracking-wider text-teal-950 font-semibold">
                  {overline}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#03354B] mb-6">
                {title}
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-[#1E252B]/85 font-light mb-10 whitespace-pre-line">
                {description}
              </p>

              <div className="space-y-4 mb-10 text-sm sm:text-base text-[#1E252B]/85">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-[#2A7F89] shrink-0 mt-0.5" />
                  <span>{SITE.fullAddress}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-[#2A7F89] shrink-0 mt-0.5" />
                  <span>{SITE.hours}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-[#2A7F89] shrink-0 mt-0.5" />
                  <span>Centralino: {SITE.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={scrollToLead}
                  className="inline-flex items-center gap-3 rounded-full bg-[#03354B] px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2A7F89] hover:-translate-y-0.5"
                >
                  <span>{cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-teal-900/15 bg-white px-7 py-4 text-sm font-semibold text-[#03354B] shadow-xs transition-all hover:bg-teal-50"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span>WhatsApp Diretto</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Link Ritorno Demo Home */}
        <div className="mt-14 text-center">
          <Link
            href="/lab/motion-home"
            className="inline-flex items-center gap-2.5 text-sm font-medium text-teal-800 transition-colors hover:text-[#03354B]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna all&apos;esperienza immersiva di Demo Home</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STICKY MOBILE CONCIERGE BAR
// ─────────────────────────────────────────────────────────────────────────
function StickyMobileBar({ treatment }: { treatment: Treatment }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-900/10 bg-white/95 p-4 backdrop-blur-2xl shadow-[0_-10px_35px_-5px_rgba(3,53,75,0.1)] md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#03354B] font-serif">
            {treatment.title}
          </p>
          <p className="text-[11px] text-[#2A7F89]">Valutazione Specialistica</p>
        </div>
        <button
          type="button"
          onClick={scrollToLead}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#03354B] px-5 py-2.5 text-xs font-bold text-white shadow-sm active:scale-95 transition-all"
        >
          <span>Prenota</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
