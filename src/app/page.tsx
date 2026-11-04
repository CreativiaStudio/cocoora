"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Instagram,
  MessageCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCms, useShop } from "@/components/providers";
import { INSTAGRAM_POSTS, MANIFESTO } from "@/lib/site";
import { CLUB_TIERS } from "@/lib/club";
import type { ClubTier } from "@/lib/types";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";
import { DiscoverHorizontalCard, PaidTierCard } from "@/components/sections/club-showcase";
import { ReelsSection } from "@/components/sections/reels";
import { HeroCinema } from "@/components/motion/hero-cinema";
import { AreasShowcase } from "@/components/sections/area-showcase";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";


function EyebrowBar({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`h-px w-12 bg-gradient-to-r from-transparent ${dark ? "to-white/50" : "to-[#80a1b2]/70"}`}
      />
      <SectionLabel className="mb-0">{children}</SectionLabel>
      <span
        className={`h-px w-12 bg-gradient-to-l from-transparent ${dark ? "to-white/50" : "to-[#80a1b2]/70"}`}
      />
    </div>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (faq.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-canvas py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>Domande frequenti</SectionLabel>
          <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.3rem)] font-semibold leading-[1.06] tracking-[-0.028em] text-[#00344b]">
            Le risposte <span className="italic font-normal text-[#5d8497]">che cerchi</span>
          </h2>
        </Reveal>
        <RevealStagger className="mx-auto mt-12 flex max-w-3xl flex-col gap-4">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <RevealItem key={item.q}>
                <div className="rounded-2xl border border-[#80a1b2]/25 bg-white/85 shadow-[0_16px_40px_-30px_rgba(3,53,75,0.35)] backdrop-blur-md transition-colors hover:border-[#80a1b2]/50">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="font-serif text-lg font-semibold leading-snug text-[#1c4a5c] sm:text-xl">
                      {item.q}
                    </span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-[#1c4a5c] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-[15px] leading-[1.75] text-charcoal/80">{item.a}</p>
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </Container>
    </section>
  );
}

function PhilosophySection({
  title,
  bodyParagraphs,
  closing,
}: {
  title: string;
  bodyParagraphs: string[];
  closing: string | null;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const reduced = reducedMotion === true;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 25%"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.25], [reduced ? 0 : 32, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.22], [reduced ? 1 : 0.2, 1]);

  const bodyY = useTransform(scrollYProgress, [0.12, 0.42], [reduced ? 0 : 36, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0.12, 0.42], [reduced ? 1 : 0.2, 1]);

  const cardY = useTransform(scrollYProgress, [0.25, 0.6], [reduced ? 0 : 44, 0]);
  const cardScale = useTransform(scrollYProgress, [0.25, 0.6], [reduced ? 1 : 0.96, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0.25, 0.55], [reduced ? 1 : 0.25, 1]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-canvas py-28 sm:py-36">
      {/* Glow e atmosfera luminosa editoriale */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 h-[420px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(128,161,178,0.18),transparent)] blur-3xl"
      />

      {/* Linea verticale guida di design */}
      <div className="mx-auto mb-10 h-16 w-px bg-gradient-to-b from-[#80a1b2]/60 via-[#80a1b2]/30 to-transparent" />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow & Titolo */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            className="flex flex-col items-center"
          >
            <EyebrowBar>La nostra filosofia</EyebrowBar>
            <h2 className="mt-6 text-center font-serif text-[clamp(2.35rem,4.2vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.028em] text-[#00344b]">
              Il tuo benessere,{" "}
              <span className="italic font-normal text-[#5d8497]">
                senza ostacoli
              </span>
            </h2>
          </motion.div>

          {/* Paragrafi con tipografia editoriale prestigiosa (3 righe e 3 righe simmetriche) */}
          <motion.div
            style={{ y: bodyY, opacity: bodyOpacity }}
            className="mt-10 space-y-7 text-center"
          >
            <p className="mx-auto max-w-2xl text-lg sm:text-[21px] leading-[1.75] text-charcoal/80 font-light">
              <span className="sm:block">Il nostro centro supera l&apos;idea tradizionale di visita medica.</span>
              <span className="sm:block">Qui l&apos;efficienza non è solo organizzazione, è la cornice</span>
              <span className="sm:block">che permette alla medicina di esprimersi al meglio.</span>
            </p>

            <p className="mx-auto max-w-3xl text-lg sm:text-[21px] leading-[1.75] text-charcoal/80 font-light">
              <span className="sm:block">Abbiamo azzerato attese, burocrazia e complessità per permetterti di vivere</span>
              <span className="sm:block">un percorso di salute fluido e immediato. Dedichiamo ogni risorsa, ogni spazio</span>
              <span className="sm:block">e ogni tecnologia alla qualità del rapporto tra te e il tuo specialista.</span>
            </p>
          </motion.div>

          {/* Closing quote: centerpiece editoriale frosted glass (2 righe simmetriche) */}
          {closing && (
            <motion.div
              style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
              className="mt-12 sm:mt-14"
            >
              <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-[#80a1b2]/30 bg-gradient-to-b from-white/95 to-[#f2f7f9]/85 p-8 sm:p-12 shadow-[0_24px_70px_-28px_rgba(0,52,75,0.12)] backdrop-blur-md">
                {/* Watermark decorativo della virgoletta */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-7 select-none font-serif text-[130px] font-bold leading-none text-[#80a1b2]/12 sm:-right-1 sm:-top-10 sm:text-[170px]"
                >
                  &ldquo;
                </span>

                {/* Accento luminoso superiore */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#80a1b2]/40 to-transparent"
                />

                <blockquote className="relative z-10 mx-auto max-w-2xl font-serif text-2xl sm:text-3xl lg:text-[32px] italic text-[#00344b] leading-snug">
                  <span className="sm:block">La tua salute merita attenzione, dedizione</span>
                  <span className="sm:block">e, soprattutto, nessun ostacolo.</span>
                </blockquote>

                <div className="relative z-10 mt-6 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-[#80a1b2]/40" />
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#5d8497]">
                    Visione Clinica Cocoora
                  </span>
                  <span className="h-px w-8 bg-[#80a1b2]/40" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  const { pages } = useCms();
  const home = pages.find((p) => p.path === "/");
  const { openDiscover, openCheckout } = useShop();

  const chooseTier = (tier: ClubTier, gender?: "uomo" | "donna") => {
    if (tier.free) {
      openDiscover();
      return;
    }
    openCheckout(tier, gender);
  };

  const paragraphs = MANIFESTO.paragraphs;
  const bodyParagraphs = paragraphs.slice(0, -1);
  const closing = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1] : null;

  return (
    <div className="bg-canvas">
      {/* 1 · Hero */}
      <HeroCinema h1={home?.h1} openDiscover={openDiscover} />

      {/* 2 · La nostra filosofia */}
      <PhilosophySection
        title={home?.h2 ?? MANIFESTO.h2}
        bodyParagraphs={bodyParagraphs}
        closing={closing}
      />


      {/* 4 · Aree cliniche */}
      <AreasShowcase />

      {/* 5 · Club & Precision */}
      <section className="relative overflow-hidden bg-canvas px-2.5 py-6 sm:px-4 sm:py-10">
        <div className="relative isolate overflow-hidden rounded-[1.85rem] bg-[#002231] py-20 text-white shadow-[0_36px_90px_-36px_rgba(0,34,49,0.65)] sm:rounded-[2.5rem] sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(28,74,92,0.75),transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(128,161,178,0.28),transparent)]"
          />
          <div aria-hidden className="noise pointer-events-none absolute inset-0 -z-10 opacity-40" />
          <Container className="relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-white/40" />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c5dbe3]">
                      Cocoora Club &amp; Precision
                    </span>
                  </div>
                  <h2 className="mt-6 font-serif text-[clamp(2.35rem,4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.028em]">
                    Dalla prevenzione
                    <span className="block italic font-normal text-[#c5dbe3]">alla medicina predittiva</span>
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-[1.75] text-white/75 sm:text-[17px]">
                    Scegli il tuo percorso annuale, da Discover (gratuito) a Signature, oppure approfondisci la
                    tua salute con test genetici DNA 5 e sequenziamento del microbiota, per una prevenzione
                    realmente predittiva.
                  </p>
                  <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                    <ButtonLink href="/club" variant="white" size="lg">
                      Scopri il Club <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>
              <div className="lg:col-span-6">
                <Reveal delay={0.12}>
                  <div className="relative aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] sm:aspect-[5/4] lg:ml-auto lg:aspect-[4/5]">
                    <Image
                      src="/images/dna-genomics.jpg"
                      alt="Diagnostica predittiva e radiologia clinica avanzata nel centro Cocoora"
                      fill
                      sizes="(min-width: 1024px) 500px, 92vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#002231]/85 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex justify-center">
                      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                        DNA 5 · Microbiota · Biomarcatori Clinici
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 6 · Percorsi Salute */}
      <section id="percorsi" className="bg-white py-24 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionLabel>Percorsi Salute</SectionLabel>
            <h2 className="font-serif text-[clamp(2.25rem,3.9vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.028em] text-[#00344b]">
              La salute <span className="italic font-normal text-[#5d8497]">come stile di vita</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/75">
              Perché prendersi cura di sé non sia un&apos;emergenza, ma un percorso consapevole.
            </p>
          </Reveal>

          {/* 1. Card Discover Orizzontale Compatta */}
          <div className="mt-10">
            <DiscoverHorizontalCard onChoose={openDiscover} />
          </div>

          {/* 2. Griglia a 4 colonne compatta e perfettamente simmetrica */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_TIERS.filter((t: ClubTier) => !t.free).map((tier: ClubTier) => (
              <PaidTierCard
                key={tier.id}
                tier={tier}
                onChoose={chooseTier}
              />
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-charcoal/60">
            Il percorso include una singola consulenza per ciascuna specialità. Membership nominativa non
            trasferibile. Validità annuale.
          </p>

          <div className="mt-8 flex justify-center">
            <ButtonLink href="/club" variant="secondary">
              Scopri tutti i Percorsi Salute <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* 7 · FAQ */}
      <FaqSection faq={home?.faq ?? []} />

      {/* 8 · CTA finale */}
      <section id="contatti" className="bg-canvas px-2.5 py-6 sm:px-4 sm:py-10">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#002231] px-6 py-20 text-center text-white shadow-[0_36px_90px_-36px_rgba(0,34,49,0.65)] sm:rounded-[2.5rem] sm:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(128,161,178,0.3),transparent)]"
            />
            <div aria-hidden className="noise pointer-events-none absolute inset-0 -z-10 opacity-40" />
            <div className="mx-auto max-w-2xl">
              <Badge className="bg-white/15 text-white">
                <ShieldCheck className="h-3.5 w-3.5" /> Accoglienza dedicata · Napoli
              </Badge>
              <h2 className="mt-6 font-serif text-[clamp(2.3rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.028em]">
                Prenota il tuo <span className="italic font-normal text-[#c5dbe3]">primo check-up</span>
              </h2>
              <p className="mt-5 text-base leading-[1.75] text-white/75 sm:text-[17px]">
                In pochi click dal tuo profilo digitale, con l&apos;accompagnamento della nostra segreteria
                clinica. Il tuo percorso di salute inizia qui.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3.5 sm:flex-row">
                <Button onClick={openDiscover} variant="white" size="lg">
                  Inizia gratis <ArrowRight className="h-4 w-4" />
                </Button>
                <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                  Prenota Visita
                </ButtonLink>
              </div>
              <p className="mt-8 text-xs tracking-wide text-white/55">
                Lun–Ven 8:00–20:00 (Orario continuato), Sab 9:00–14:00
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 9 · Reels e Instagram */}
      <ReelsSection />

      <section className="bg-canvas pb-24 pt-8 sm:pb-28">
        <Container>
          <Reveal className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c4a5c] text-white">
                <Instagram className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[#00344b]">@cocoora</p>
                <p className="text-sm text-charcoal/65">Connessi alla tua salute, ogni giorno.</p>
              </div>
            </div>
            <ButtonLink href="https://www.instagram.com/" variant="secondary">
              Seguici su Instagram <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
          <RevealStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {INSTAGRAM_POSTS.slice(0, 6).map((post) => (
              <RevealItem key={post.id}>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl border border-[#80a1b2]/20"
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#002231]/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c5dbe3]">
                      {post.tag}
                    </span>
                    <div className="mt-1 flex items-center gap-3 text-xs text-white">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> {post.likes}
                      </span>
                      {typeof post.comments === "number" && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>
    </div>
  );
}