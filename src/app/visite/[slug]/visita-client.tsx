"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
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

function scrollToLead() {
  const el = document.getElementById("prenota") || document.getElementById("lead");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function VisitaClient({ visita }: { visita: VisitaSpecialistica }) {
  const { openDiscover } = useShop();

  return (
    <>
      <main className="pb-20 md:pb-0 bg-canvas text-charcoal">
        {/* 1 — Hero Section (Image-First su mobile / Split 50/50 desktop) */}
        <HeroSection visita={visita} onOpenDiscover={openDiscover} />

        {/* 2 — Che cos'è e come funziona? */}
        {visita.whatIs && <WhatIsSection visita={visita} />}

        {/* 3 — A cosa serve / Esigenze & Sintomi (Griglia 2x2 simmetrica) */}
        {visita.problemsGrid && visita.problemsGrid.length > 0 && (
          <ProblemsSection visita={visita} />
        )}

        {/* 4 — Come si svolge la visita? (Timeline 3 colonne pareggiate senza icone) */}
        {visita.timelineSteps && visita.timelineSteps.length > 0 && (
          <TimelineSection visita={visita} />
        )}

        {/* 5 — Risultati e Refertazione (Immagine a sinistra, Testo a destra) */}
        {visita.results && (visita.results.description || (visita.results.paragraphs && visita.results.paragraphs.length > 0)) && (
          <ResultsSection visita={visita} />
        )}

        {/* 6 — Form Lead dedicato */}
        <LeadSection visita={visita} />

        {/* 7 — Domande Frequenti (FAQ a 2 colonne) */}
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
    <section className="relative overflow-hidden bg-canvas pb-16 pt-10 sm:pb-20 sm:pt-14">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna testo: su mobile sotto l'immagine, su desktop colonna sinistra */}
          <div className="order-last lg:order-first">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              {visita.categoryName}
            </p>

            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-dark-navy sm:text-5xl lg:text-6xl">
              {visita.title} <span className="italic font-normal text-teal-700">a Napoli</span>
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-charcoal/80">
              {visita.tagline}
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={onOpenDiscover}
                className="inline-flex items-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(3,53,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900"
              >
                Iscriviti gratuitamente al Cocoora Club <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Colonna immagine: su mobile in cima ("Image-First"), su desktop colonna destra */}
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
    <section className="bg-canvas py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna sinistra — immagine gesto clinico / tecnologia */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src={image}
              alt={`${visita.title} — come funziona`}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>

          {/* Colonna destra — testi clinici */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-800">
              Approfondimento Clinico
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
              {whatIs?.title || `In cosa consiste la ${visita.title}?`}
            </h2>
            <div className="mt-5 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal/75">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 3 — "A cosa serve / Esigenze & Sintomi" (Griglia 2x2 simmetrica a 4 box)
// ─────────────────────────────────────────────────────────────────────────

function ProblemsSection({ visita }: { visita: VisitaSpecialistica }) {
  const problems = visita.problemsGrid.slice(0, 4);

  return (
    <section className="bg-teal-50/50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            {visita.problemsTitle || "A cosa serve questa visita specialistica?"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
            I nostri specialisti valutano ciascun caso con attenzione clinica ed esami mirati in sede.
          </p>
        </div>

        {/* Griglia a 4 box simmetrica (2x2) */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-6 transition-shadow duration-300 hover:shadow-md"
            >
              <span className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                <Check className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-bold text-teal-900">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                  {p.description || "Valutazione specialistica dedicata condotta con strumentazione clinica in sede."}
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-400" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 4 — "Come si svolge la visita?" (Timeline 3 colonne pareggiate senza icone)
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
    <section className="bg-white py-16 sm:py-20 border-t border-teal-100/40">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            {visita.timelineTitle || "Come si svolge la visita specialistica?"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
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
// BLOCCO 5 — "Risultati e Refertazione" (Immagine a sinistra, Testo a destra)
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
    <section className="bg-canvas py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna sinistra — immagine risultato clinico */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src={image}
              alt={`${visita.title} — esito e refertazione`}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>

          {/* Colonna destra — trasparenza clinica e refertazione */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-800">
              Refertazione &amp; Continuità
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
              {results.title}
            </h2>
            <div className="mt-5 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal/75">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 6 — Form Lead dedicato (#prenota / #lead)
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
    if (!form.nome.trim() || !form.cognome.trim() || !form.telefono.trim() || !form.email.trim() || !form.privacy) {
      setError("Compila tutti i campi obbligatori e accetta l'informativa sulla privacy.");
      return;
    }
    setError("");
    trackLead({
      email: form.email,
      name: `${form.nome} ${form.cognome}`.trim(),
    });
    setSent(true);
  };

  return (
    <section id="prenota" className="scroll-mt-20 bg-canvas py-16 sm:py-20">
      <Container>
        <div className="rounded-[2.5rem] border border-teal-200/70 bg-gradient-to-br from-teal-50/80 via-white to-teal-50/50 p-8 shadow-lg sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Colonna sinistra — messaggio rassicurante */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                RICHIEDI UNA VALUTAZIONE
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
                Prenota {visita.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/75">
                Lasciaci i tuoi contatti: la nostra segreteria clinica ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare la tua visita specialistica, senza impegno.
              </p>
              <div className="mt-6 flex items-start gap-3 text-sm text-charcoal/65">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <p>
                  I tuoi dati sono trattati nel pieno rispetto della normativa privacy. Potrai scegliere il canale di contatto che preferisci.
                </p>
              </div>
            </div>

            {/* Colonna destra — form */}
            <div>
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-teal-100 bg-white/80 p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">
                    Richiesta inviata
                  </h3>
                  <p className="mt-2 text-sm text-charcoal/70">
                    Grazie {form.nome}! Ti ricontatteremo a breve
                    {form.contatto === "WhatsApp" && " su WhatsApp"}
                    {form.contatto === "Telefono" && " telefonicamente"}
                    {form.contatto === "Email" && " via email"} per concordare la visita.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  className="rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-sm sm:p-8"
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">
                        Nome *
                      </span>
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
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">
                        Cognome *
                      </span>
                      <input
                        type="text"
                        value={form.cognome}
                        onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                        placeholder="Cognome"
                        required
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">
                        Telefono *
                      </span>
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
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">
                        Email *
                      </span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="nome@email.it"
                        required
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

                  <label className="mt-5 flex items-start gap-3 text-sm text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={form.privacy}
                      onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      Ho letto l&apos;
                      <Link
                        href="/contatti"
                        className="font-medium text-teal-800 underline underline-offset-2 hover:text-dark-navy"
                      >
                        informativa sulla privacy
                      </Link>{" "}
                      e acconsento al trattamento dei dati personali *
                    </span>
                  </label>

                  <label className="mt-3 flex items-start gap-3 text-sm text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={form.whatsappConsent}
                      onChange={(e) =>
                        setForm({ ...form, whatsappConsent: e.target.checked })
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      Desidero ricevere comunicazioni e aggiornamenti personalizzati su WhatsApp da Cocoora
                    </span>
                  </label>

                  {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(3,53,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900"
                  >
                    Invia Richiesta di Prenotazione <ArrowRight className="h-4 w-4" />
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
// BLOCCO 7 — Domande frequenti (accordion a 2 colonne)
// ─────────────────────────────────────────────────────────────────────────

function FaqSection({ faq }: { faq: Faq[] }) {
  if (!faq.length) return null;

  const half = Math.ceil(faq.length / 2);
  const columns = [faq.slice(0, half), faq.slice(half)].filter((c) => c.length > 0);

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            Domande frequenti
          </h2>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-4 md:grid-cols-2">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-teal-100 bg-white p-6 transition-colors open:border-teal-200 open:bg-teal-50/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-teal-900 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-teal-400 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{f.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 8 — Geo-Local SEO Napoli
// ─────────────────────────────────────────────────────────────────────────

function LocalSeoSection({ visita }: { visita: VisitaSpecialistica }) {
  const localSeo = visita.localSeo;

  return (
    <section className="bg-canvas py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-[2.5rem] border border-teal-100 bg-white shadow-[0_24px_60px_-32px_rgba(3,53,75,0.35)]">
          <div className="grid lg:grid-cols-2">
            {/* Sinistra — foto centro */}
            <div className="relative min-h-[260px] w-full lg:min-h-full">
              <Image
                src="/images/centro/foto-8.webp"
                alt={`${localSeo.title} — Il Centro Cocoora`}
                fill
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover"
              />
            </div>

            {/* Destra — testo + CTA */}
            <div className="p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                VISITE SPECIALISTICHE A NAPOLI
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
                {localSeo.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/75">
                {localSeo.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-charcoal/70">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-700" /> Via Generale Giovanni De Bonis 81, Napoli
                </span>
                <span>🕒 Lun–Ven 8:00–20:00 · Sab 9:00–14:00</span>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={scrollToLead}
                  className="inline-flex items-center gap-2 rounded-full bg-dark-navy px-7 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-teal-900 hover:-translate-y-0.5"
                >
                  {localSeo.cta || "Richiedi una valutazione"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
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
