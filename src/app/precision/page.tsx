"use client";

import Image from "next/image";
import {
  Dna,
  FlaskConical,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Activity,
  Award,
  Microscope,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";
import { useShop } from "@/components/providers";
import { PRECISION_PROGRAMS, DNA_COMBOS, MICROBIOTA_KITS } from "@/lib/precision";
import { formatPrice } from "@/lib/utils";

const PROGRAM_ICONS: LucideIcon[] = [Sparkles, Activity, HeartHandshake];

export default function PrecisionPage() {
  const { openDiscover } = useShop();

  return (
    <>
      {/* ── Banner Hero ──────────────────────────────────────────────── */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/dna-genomics.jpg"
          alt="Genomica predittiva DNA 5 e sequenziamento del microbiota Cocoora Precision"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-dark-navy/35" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-20 pt-8 sm:pt-12">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <SectionLabel>Cocoora Precision</SectionLabel>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl md:text-7xl">
              La biologia individuale,
              <span className="block italic text-primary-teal">letta con precisione.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Genomica predittiva DNA 5 e sequenziamento del microbiota NGS: due dataset che,
              incrociati dai nostri clinici, disegnano un protocollo di longevità costruito
              esclusivamente su di te.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Badge className="border border-teal-200 bg-teal-50 text-teal-800 shadow-sm">
                <Dna className="h-3.5 w-3.5" />
                Genomica &amp; Medicina della Longevità
              </Badge>
              <Badge className="border border-teal-200 bg-teal-50 text-teal-800 shadow-sm">
                <Award className="h-3.5 w-3.5" />
                Laboratorio Certificato ISO
              </Badge>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button onClick={openDiscover} size="lg" className="group">
                Prenota Consulenza Genomica
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <ButtonLink href="#dna5" variant="secondary" size="lg">
                Esplora i Profili DNA 5
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Il Metodo ────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <Container>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
            <div>
              <SectionLabel>Il Metodo</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-dark-navy sm:text-5xl">
                Due mappe, un unico
                <span className="italic text-primary-teal"> disegno biologico.</span>
              </h2>
              <p className="mt-6 text-base leading-[1.8] text-charcoal/75">
                Il pannello DNA 5 analizza cinque assi predittivi — nutrizione, fitness, skin
                aging, detossificazione e sensibilità — mentre il sequenziamento NGS del
                microbiota rivela la composizione batterica in altissima risoluzione.
                L&apos;incrocio dei due referti guida ogni protocollo Cocoora, dalla medicina
                estetica alla medicina funzionale.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Referto clinico interpretato da medico specialista",
                  "Piano nutrizionale e dermo-cosmetico personalizzato",
                  "Follow-up incluso a 90 giorni",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-charcoal/80">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50">
                      <Check className="h-3.5 w-3.5 text-teal-700" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center py-6">
              <div className="absolute h-72 w-72 rounded-full bg-teal-500/20 blur-3xl sm:h-96 sm:w-96" />
              <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-dark-navy via-primary-teal to-teal-700 shadow-[0_40px_80px_-30px_rgba(3,53,75,0.6)] sm:h-96 sm:w-96">
                <div className="absolute h-[86%] w-[86%] rounded-full border border-dashed border-white/25" />
                <div className="absolute -right-3 top-10 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
                  DNA 5
                </div>
                <div className="absolute -left-3 bottom-12 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
                  Microbiota NGS
                </div>
                <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-xl">
                  <Dna className="h-14 w-14 text-white" strokeWidth={1.1} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Precision Programs ───────────────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>I Programmi</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-dark-navy sm:text-5xl">
              Precision Programs
            </h2>
            <p className="mt-5 text-base leading-[1.8] text-charcoal/70 sm:text-lg">
              Tre percorsi diagnostico-terapeutici costruiti sul referto genomico, per la
              pelle, la nutrizione e l&apos;equilibrio femminile.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PRECISION_PROGRAMS.map((program, idx) => {
              const Icon = PROGRAM_ICONS[idx % PROGRAM_ICONS.length];
              const startingPrice = Math.min(...program.options.map((o) => o.price));
              return (
                <div
                  key={program.id}
                  className="group flex flex-col rounded-3xl border border-teal-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
                      <Icon className="h-6 w-6 text-teal-700" strokeWidth={1.5} />
                    </div>
                    <Badge className="border border-teal-200 bg-teal-50 text-[10px] text-teal-800">
                      Consulenza Inclusa
                    </Badge>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl font-semibold text-dark-navy">
                    {program.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-accent">
                    {program.tagline}
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.75] text-charcoal/70">
                    {program.description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-teal-100 pt-6">
                    {program.options.map((opt) => (
                      <li key={opt.id} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" strokeWidth={2.5} />
                        <span className="flex-1">{opt.name}</span>
                        <span className="font-semibold text-dark-navy">{formatPrice(opt.price)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-teal-100 pt-6">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-accent">
                        A partire da
                      </span>
                      <span className="font-serif text-2xl font-semibold text-dark-navy">
                        {formatPrice(startingPrice)}
                      </span>
                    </div>
                    <Button onClick={openDiscover} size="sm">
                      Prenota
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── I 7 Profili DNA 5 ────────────────────────────────────────── */}
      <section id="dna5" className="scroll-mt-24 bg-white py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Genomica Predittiva</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-dark-navy sm:text-5xl">
              I 7 Profili DNA 5
            </h2>
            <p className="mt-5 text-base leading-[1.8] text-charcoal/70 sm:text-lg">
              Un solo prelievo, sette letture biologiche: la mappa genetica che orienta ogni
              scelta clinica ed estetica del percorso Cocoora.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DNA_COMBOS.map((combo) => (
              <div
                key={combo.id}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 transition-all hover:bg-white hover:shadow-md"
              >
                <Dna className="h-6 w-6 text-slate-accent" strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-dark-navy">
                  {combo.name}
                </h3>
                <p className="mt-3 text-sm leading-[1.7] text-charcoal/70">{combo.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 border-t border-slate-200/80 pt-4">
                  {combo.areas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary-teal"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Microbiota Kits ──────────────────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Sequenziamento NGS</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-dark-navy sm:text-5xl">
              Microbiota Kits
            </h2>
            <p className="mt-5 text-base leading-[1.8] text-charcoal/70 sm:text-lg">
              Analisi metagenomica di nuova generazione per leggere l&apos;ecologia batterica
              con precisione clinica.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {MICROBIOTA_KITS.map((kit, idx) => {
              const Icon = idx % 2 === 1 ? Microscope : FlaskConical;
              return (
                <div
                  key={kit.id}
                  className="flex flex-col rounded-3xl border border-teal-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
                    <Icon className="h-6 w-6 text-teal-700" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-semibold text-dark-navy">
                    {kit.name}
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.75] text-charcoal/70">
                    {kit.description}
                  </p>
                  <ul className="mt-6 space-y-3 border-t border-teal-100 pt-6">
                    {kit.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button onClick={openDiscover} variant="secondary" size="sm" className="w-full">
                      Richiedi Kit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Box di Conversione: Signature Longevity ──────────────────── */}
      <section className="bg-white py-24">
        <Container>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-dark-navy p-10 text-center text-white shadow-[0_25px_60px_-20px_rgba(0,52,75,0.4)] sm:p-14">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-slate-accent/20 blur-3xl" />
            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6 text-teal-200" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Incluso nel{" "}
                <span className="italic text-teal-200">Percorso Signature Longevity</span>
              </h2>
              <p className="mt-6 font-serif text-5xl font-semibold text-white sm:text-6xl">
                1.190€
              </p>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.8] text-teal-100/80">
                Genomica DNA 5, sequenziamento del microbiota NGS e consulenza
                multidisciplinare confluiscono nel programma annuale di riferimento di Cocoora,
                il percorso più completo per chi desidera investire nella propria longevità in
                modo sistemico.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={openDiscover}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-dark-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50"
                >
                  Scopri il Percorso Signature
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
