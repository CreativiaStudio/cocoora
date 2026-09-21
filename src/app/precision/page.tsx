"use client";

import Image from "next/image";
import { Check, Dna, FlaskConical, Sparkles } from "lucide-react";
import { useCms, useShop } from "@/components/providers";
import { DNA_COMBOS, MICROBIOTA_KITS, PRECISION_PROGRAMS } from "@/lib/precision";
import type { PrecisionOption } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

export default function PrecisionPage() {
  const { pages } = useCms();
  const { openDiscover } = useShop();
  const page = pages.find((p) => p.path === "/precision");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
        <div className="absolute inset-0">
          <Image
            src="/images/dna-genomics.jpg"
            alt="Genomica predittiva Cocoora Precision"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-navy/90 via-dark-navy/75 to-dark-navy/95" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Badge className="mx-auto bg-white/15 text-white">
              Medicina Predittiva e Longevity
            </Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {page?.h1 ?? "Conosci il tuo codice biologico, progetta il tuo futuro in salute."}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-teal-100/90">
              Cocoora Precision unisce diagnostica clinica, test genetici DNA 5 e
              sequenziamento del microbiota per costruire percorsi di prevenzione
              realmente personalizzati.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={openDiscover}>
                Richiedi una consulenza
              </Button>
              <ButtonLink href="#programmi" variant="outline-dark" size="lg">
                Scopri i percorsi
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── I 3 Percorsi Clinici Integrati ────────────────────────────── */}
      <section id="programmi" className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Percorsi Clinici Integrati</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Skin, Nutri e Donna Precision
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Tre programmi medici integrati che uniscono visita specialistica,
              diagnostica e test di precisione.
            </p>
          </div>

          <div className="mt-14 space-y-16">
            {PRECISION_PROGRAMS.map((program, i) => (
              <div key={program.id} className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-start lg:gap-12">
                <div className={cn("lg:sticky lg:top-28", i % 2 === 1 && "lg:order-2")}>
                  {program.image && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-[0_24px_60px_-28px_rgba(3,53,75,0.35)]">
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        sizes="(min-width: 1024px) 440px, 90vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-accent">
                    {program.tagline}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-semibold text-teal-900">
                    {program.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {program.description}
                  </p>
                </div>

                <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", i % 2 === 1 && "lg:order-1")}>
                  {program.options.map((option) => (
                    <PrecisionOptionCard key={option.id} option={option} onChoose={openDiscover} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── I 7 Profili DNA 5 ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-navy py-24 text-white">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Genomica Predittiva</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              I 7 Profili DNA 5
            </h2>
            <p className="mt-4 text-base leading-relaxed text-teal-200/85">
              Pannelli genetici mirati, ciascuno su 5 aree biologiche, per
              orientare prevenzione e stile di vita in modo scientifico.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DNA_COMBOS.map((combo) => (
              <div
                key={combo.id}
                className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-slate-accent">
                  <Dna className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold leading-snug text-white">
                  {combo.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-200/80">
                  {combo.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {combo.areas.map((area) => (
                    <li
                      key={area}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-teal-100/90"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── I 3 Kit Microbiota NGS ───────────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Sequenziamento NGS</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              I Kit Microbiota
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Test non invasivi a domicilio per analizzare l&apos;equilibrio del
              tuo microbioma intestinale, cutaneo o vaginale.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {MICROBIOTA_KITS.map((kit) => (
              <div
                key={kit.id}
                className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-teal-900">
                  {kit.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  {kit.description}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {kit.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" onClick={openDiscover}>
                  Richiedi il kit
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Finale ───────────────────────────────────────────────── */}
      <section className="bg-canvas pb-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-16 text-center text-white sm:px-16">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <Sparkles className="mx-auto h-9 w-9 text-slate-accent" />
              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Progetta il tuo percorso di precisione
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Il nostro team ti guida nella scelta del programma e dei test più
                adatti al tuo profilo di salute.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={openDiscover}>
                  Richiedi una consulenza
                </Button>
                <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                  Prenota Visita
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FaqSection faq={page?.faq ?? []} />
    </>
  );
}

function PrecisionOptionCard({
  option,
  onChoose,
}: {
  option: PrecisionOption;
  onChoose: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border bg-white p-6 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]",
        option.highlight ? "border-teal-500" : "border-teal-100"
      )}
    >
      {option.highlight && (
        <Badge className="mb-3 w-fit bg-teal-500 text-white">Più scelto</Badge>
      )}
      <h4 className="font-serif text-lg font-semibold leading-snug text-teal-900">
        {option.name}
      </h4>
      <p className="mt-2 font-serif text-2xl font-semibold text-teal-900">
        {formatPrice(option.price)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
        {option.description}
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {option.includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/75">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
            {item}
          </li>
        ))}
      </ul>
      <Button variant="secondary" className="mt-6 w-full" onClick={onChoose}>
        Richiedi informazioni
      </Button>
    </div>
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
            <h2 className="font-serif text-3xl font-semibold text-teal-900">FAQ</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-teal-100 bg-white p-6">
                <summary className="cursor-pointer list-none font-medium text-teal-900">
                  {f.q}
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
