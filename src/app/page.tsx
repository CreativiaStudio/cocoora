"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Heart,
  Instagram,
  MessageCircle,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useCms, useShop } from "@/components/providers";
import {
  INSTAGRAM_POSTS,
  MANIFESTO,
  NAV_NODES,
} from "@/lib/site";
import { CLUB_TIERS } from "@/lib/club";
import type { ClubTier, NavChild } from "@/lib/types";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";
import { TierCard } from "@/components/sections/club-showcase";
import { ReelsSection } from "@/components/sections/reels";
import { HeroCarousel } from "@/components/hero-carousel";

const CLUB_ENTRY_FEATURES = [
  {
    id: "registrazione",
    icon: UserRound,
    title: "Profilo sanitario digitale",
    description:
      "Crea il tuo profilo sanitario digitale in pochi minuti, direttamente dall'app Cocoora.",
  },
  {
    id: "prenotazione",
    icon: CalendarDays,
    title: "Specialista, sede e orario",
    description:
      "Scegli lo specialista, la sede e l'orario più comodi per te, in un unico click.",
  },
  {
    id: "referti",
    icon: FileText,
    title: "Referti digitali sempre con te",
    description:
      "Consulta referti e documenti in un'area riservata sicura, disponibile 24/7.",
  },
];

// Aree Mediche in evidenza — ordine tassativo:
// 1° Medicina Estetica & Rigenerativa · 2° Odontoiatria e Ortodonzia · 3° Visite Specialistiche
const AREE_MEDICHE: NavChild[] = [
  {
    label: "Medicina Estetica & Rigenerativa",
    href: "/servizi/medicina-estetica",
    description:
      "Viso (Biostimolazione, Filler, Tossina botulinica), Corpo (Criolipolisi, Ultrasuoni CFU) e Laser medicali.",
    image: "/images/aesthetic-skin.jpg",
  },
  {
    label: "Odontoiatria & Ortodonzia",
    href: "/servizi/odontoiatria",
    description:
      "Allineatori Trasparenti, Ortodonzia Specialistica, Estetica del Sorriso, Igiene & Prevenzione.",
    image: "/images/invisalign-smile.jpg",
  },
  {
    label: "Visite Specialistiche",
    href: "/visite",
    description:
      "Cardiologia, Ginecologia, Senologia, Ecografia, Oculistica, Pediatria, Psicologia e Medicina dello Sport.",
    image: "/images/diagnostics-lab.jpg",
  },
];

export default function HomePage() {
  const { pages } = useCms();
  const { openDiscover, openCheckout } = useShop();
  const home = pages.find((p) => p.path === "/");

  const chooseTier = (tier: ClubTier) => {
    if (tier.free) {
      openDiscover();
      return;
    }
    openCheckout(tier);
  };

  return (
    <>
      {/* ── Hero Carousel ─────────────────────────────────────────────── */}
      <HeroCarousel h1={home?.h1} openDiscover={openDiscover} />

      {/* ── Manifesto ────────────────────────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Accent bar decorativa */}
            <div className="mb-10 flex items-center gap-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-teal-200" />
              <SectionLabel>La nostra filosofia</SectionLabel>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-teal-200" />
            </div>
            <h2 className="text-center font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              {home?.h2 ?? MANIFESTO.h2}
            </h2>
            <div className="mt-8 space-y-5">
              {MANIFESTO.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === MANIFESTO.paragraphs.length - 1
                      ? "border-l-2 border-teal-600 pl-5 font-serif text-xl italic leading-relaxed text-teal-800"
                      : "text-base leading-relaxed text-charcoal/75"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/chi-siamo" variant="secondary">
                Scopri il Metodo Cocoora <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Entra in Cocoora Club ─────────────────────────────────────── */}
      <section id="cocoora-club" className="section-alt relative overflow-hidden py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Entra in Cocoora Club</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Il tuo tempo, la nostra priorità
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Prenota, consulta, gestisci in un click. La tua salute digitale,
              sempre con te.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {CLUB_ENTRY_FEATURES.map((f, i) => {
              const Icon: LucideIcon = f.icon;
              return (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-3xl border border-white bg-white/70 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.35)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 font-serif text-2xl font-semibold text-teal-900">
                    <span className="mr-2 text-slate-accent">{String(i + 1).padStart(2, "0")}</span>
                    {f.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Aree Mediche in Evidenza ─────────────────────────────────── */}
      <section id="servizi" className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Aree Mediche in Evidenza</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Le Nostre Aree Mediche
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Una rete di professionisti pronta a rispondere a ogni tua esigenza,
              dalla prevenzione quotidiana alla diagnostica avanzata.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {AREE_MEDICHE.map((pillar) => (
              <Link
                key={pillar.href}
                href={pillar.href}
                className="group relative flex h-[420px] flex-col overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_70px_-24px_rgba(3,53,75,0.45)]"
              >
                {pillar.image && (
                  <Image
                    src={pillar.image}
                    alt={pillar.label}
                    fill
                    sizes="(min-width: 1024px) 400px, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/30 to-transparent" />
                <div className="relative mt-auto p-7 text-white">
                  <h3 className="font-serif text-2xl font-semibold leading-tight">
                    {pillar.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-teal-100/85">
                    {pillar.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-all group-hover:gap-2.5">
                    Scopri di più <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Cocoora Club & Precision Preview ─────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-navy py-24 text-white">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionLabel>Cocoora Club &amp; Precision</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Dalla prevenzione alla medicina predittiva
              </h2>
              <p className="mt-5 text-base leading-relaxed text-teal-200/85">
                Scegli il tuo percorso di membership, da <strong className="text-white">Discover</strong>{" "}
                (gratuito) a <strong className="text-white">Signature Longevity</strong>, oppure
                approfondisci la tua salute con test genetici DNA 5 e sequenziamento
                del microbiota, per una prevenzione realmente predittiva.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href="/club" variant="white" size="lg">
                  Scopri il Club <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/precision" variant="outline-dark" size="lg">
                  Scopri Precision
                </ButtonLink>
              </div>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/dna-genomics.jpg"
                alt="Genomica predittiva Cocoora Precision — doppia elica del DNA"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/60 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Video Corporate Ufficiale: Connessi alla tua salute ────────── */}
      <section className="bg-canvas py-20 border-t border-teal-100/60">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-10">
            <SectionLabel>Il Centro si racconta</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-teal-900 sm:text-4xl">
              Connessi alla tua salute
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-charcoal/70">
              Uno sguardo autentico dentro gli ambienti, le tecnologie cliniche e l&apos;équipe multidisciplinare di Cocoora Centro Medico a Napoli.
            </p>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] border border-teal-100/80 bg-dark-navy shadow-2xl">
            <Image
              src="/images/hero-clinic.jpg"
              alt="Anteprima del video corporate Cocoora Centro Medico"
              fill
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/40 to-dark-navy/20" />
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
              <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md shadow-lg transition-transform duration-300 hover:scale-105">
                <Play className="ml-1 h-7 w-7 text-white" />
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                  Il film del nostro centro
                </p>
                <p className="mt-2 text-xs sm:text-sm text-teal-100/80 max-w-md mx-auto">
                  Il video corporate in fase di post-produzione sarà presto disponibile in alta definizione.
                </p>
              </div>
              <span className="rounded-full border border-white/20 bg-dark-navy/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200 backdrop-blur-sm">
                Video Corporate Ufficiale
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Percorsi Salute (canvas bianco, carosello su mobile) ─────── */}
      <section id="percorsi" className="bg-white py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Percorsi Salute</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              La salute come stile di vita
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Un percorso annuale dedicato a chi sceglie la prevenzione costante:
              check-up, accesso prioritario e vantaggi per tutta la famiglia.
            </p>
          </div>

          {/* Mobile: scroll orizzontale a scorrimento · Desktop: griglia */}
          <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pt-6 pb-4 scrollbar-none lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0">
            {CLUB_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="w-[82%] shrink-0 snap-center sm:w-[56%] lg:w-auto"
              >
                <TierCard tier={tier} onChoose={chooseTier} variant="light" />
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <ButtonLink href="/club" variant="secondary" size="lg">
              Scopri tutti i Percorsi Salute <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ── FAQ Clinica ──────────────────────────────────────────────── */}
      <FaqSection faq={home?.faq ?? []} />

      {/* ── CTA Finale ───────────────────────────────────────────────── */}
      <section id="contatti" className="bg-canvas pb-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-16 text-center text-white sm:px-16">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <Badge className="bg-white/15 text-white">
                <ShieldCheck className="h-3.5 w-3.5" /> Prenotazione senza attese
              </Badge>
              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Prenota il tuo primo check-up
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                In meno di 2 minuti, senza attese e senza burocrazia. Il tuo
                percorso di salute inizia qui.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={openDiscover}>
                  Inizia gratis <Plus className="h-4 w-4" />
                </Button>
                <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                  Prenota Visita
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Pre-Footer · Reels Verticali 9:16 ────────────────────────── */}
      <ReelsSection />

      {/* ── Pre-Footer · Instagram Feed ──────────────────────────────── */}
      <section className="bg-canvas pb-24">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <SectionLabel>Instagram</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                Segui il mondo Cocoora
              </h2>
            </div>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-dark-navy sm:inline-flex"
            >
              <Instagram className="h-4 w-4" /> @cocoora
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl border border-teal-100/60 bg-teal-50"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge Instagram */}
                <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-dark-navy/40 text-white backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
                  <Instagram className="h-3.5 w-3.5" />
                </div>

                {/* Overlay hover */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-dark-navy/90 via-dark-navy/50 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                      {post.tag}
                    </span>
                    <Instagram className="h-4 w-4 text-white/80" />
                  </div>

                  <div className="flex items-center justify-center gap-5 text-white">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                      <Heart className="h-4 w-4 fill-current" />
                      {post.likes}
                    </span>
                    {typeof post.comments === "number" && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-xs font-medium leading-snug text-white/95">
                    {post.caption}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (faq.length === 0) return null;
  return (
    <section className="bg-canvas pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>Domande Frequenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
              Le domande più frequenti sui nostri servizi
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-teal-100 bg-white p-6 transition-colors open:border-teal-300"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-teal-900">
                  {f.q}
                  <Sparkles className="h-4 w-4 shrink-0 text-slate-accent transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
