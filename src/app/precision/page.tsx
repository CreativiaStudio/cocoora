"use client";

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
} from "lucide-react";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";
import { useShop } from "@/components/providers";
import { PRECISION_PROGRAMS, DNA_COMBOS, MICROBIOTA_KITS } from "@/lib/precision";

export default function PrecisionPage() {
  const { openDiscover } = useShop();

  return (
    <main className="relative overflow-hidden bg-[#05100c] text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,120,0.10),_transparent_55%)]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[560px] w-[560px] rounded-full bg-emerald-800/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[480px] w-[480px] rounded-full bg-amber-500/10 blur-[160px]" />

      <section className="relative border-b border-amber-200/10 pb-28 pt-36">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <SectionLabel className="justify-center text-amber-200/80">
              Cocoora Precision
            </SectionLabel>
            <h1 className="mt-8 font-serif text-5xl font-light leading-[1.05] tracking-tight text-stone-50 sm:text-6xl md:text-7xl">
              La biologia individuale,
              <br />
              <span className="italic text-amber-200">letta con precisione svizzera.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-stone-300/90">
              Genomica predittiva DNA 5 e sequenziamento del microbiota di nuova
              generazione (NGS): due dataset che, incrociati dai nostri clinici,
              disegnano un protocollo di longevità costruito esclusivamente su di te.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Badge className="border-amber-200/30 bg-amber-100/5 text-amber-100">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                Consulenza Medica Inclusa
              </Badge>
              <Badge className="border-emerald-200/20 bg-emerald-100/5 text-emerald-100">
                <Award className="mr-1.5 h-3.5 w-3.5" />
                Laboratorio Certificato ISO
              </Badge>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Button onClick={openDiscover} className="group">
                Prenota la Consulenza Genomica
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <ButtonLink href="#dna5" variant="outline">
                Esplora i Profili DNA 5
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative border-b border-amber-200/10 py-24">
        <Container>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
            <div>
              <SectionLabel className="text-amber-200/80">Il Metodo</SectionLabel>
              <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-stone-50 sm:text-5xl">
                Due mappe, un unico
                <span className="italic text-amber-200"> disegno biologico.</span>
              </h2>
              <p className="mt-6 text-base font-light leading-relaxed text-stone-300/85">
                Il pannello DNA 5 analizza cinque assi predittivi — nutrizione,
                fitness, skin aging, detossificazione e sensibilità — mentre il
                sequenziamento NGS del microbiota intestinale rivela la composizione
                batterica in altissima risoluzione. L'incrocio dei due referti guida
                ogni protocollo Cocoora, dalla dermatologia estetica alla medicina
                funzionale.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Referto clinico interpretato da medico specialista",
                  "Piano nutrizionale e dermo-cosmetico personalizzato",
                  "Follow-up incluso a 90 giorni",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-light text-stone-200/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/10 via-transparent to-emerald-500/10 blur-2xl" />
              <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-amber-200/20 bg-emerald-950/60 sm:h-96 sm:w-96">
                <div className="absolute h-[85%] w-[85%] rounded-full border border-dashed border-amber-200/15" />
                <Dna className="h-20 w-20 text-amber-200/80" strokeWidth={0.9} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative border-b border-amber-200/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center text-amber-200/80">
              I Programmi
            </SectionLabel>
            <h2 className="mt-6 font-serif text-4xl font-light text-stone-50 sm:text-5xl">
              Precision Programs
            </h2>
            <p className="mt-5 text-base font-light text-stone-300/85">
              Tre percorsi diagnostico-terapeutici costruiti sul referto genomico,
              per la pelle, la nutrizione e l'equilibrio ormonale femminile.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PRECISION_PROGRAMS.map((program: any, idx: number) => {
              const icons = [Sparkles, Activity, HeartHandshake];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={program.id ?? program.name}
                  className="group relative flex flex-col rounded-[2px] border border-amber-200/15 bg-gradient-to-b from-emerald-950/80 to-[#05100c] p-8 transition-colors hover:border-amber-200/40"
                >
                  <div className="absolute right-6 top-6">
                    <Badge className="border-amber-200/30 bg-amber-100/5 text-[10px] uppercase tracking-wider text-amber-100">
                      Consulenza Inclusa
                    </Badge>
                  </div>
                  <Icon className="h-8 w-8 text-amber-200/80" strokeWidth={1} />
                  <h3 className="mt-6 font-serif text-2xl font-light text-stone-50">
                    {program.name}
                  </h3>
                  {program.subtitle && (
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-300/70">
                      {program.subtitle}
                    </p>
                  )}
                  <p className="mt-4 text-sm font-light leading-relaxed text-stone-300/85">
                    {program.description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-amber-200/10 pt-6">
                    {(program.options ?? program.features ?? []).map((opt: any) => (
                      <li
                        key={typeof opt === "string" ? opt : opt.label}
                        className="flex items-start gap-2.5 text-sm font-light text-stone-200/90"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                        <span>{typeof opt === "string" ? opt : opt.label}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-center justify-between border-t border-amber-200/10 pt-6">
                    <span className="font-serif text-2xl font-light text-amber-100">
                      {program.price}
                    </span>
                    <Button onClick={openDiscover} size="sm" variant="outline">
                      Prenota
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="dna5" className="relative border-b border-amber-200/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center text-amber-200/80">
              Genomica Predittiva
            </SectionLabel>
            <h2 className="mt-6 font-serif text-4xl font-light text-stone-50 sm:text-5xl">
              I 7 Profili DNA 5
            </h2>
            <p className="mt-5 text-base font-light text-stone-300/85">
              Un solo prelievo, sette letture biologiche: la mappa genetica che
              orienta ogni scelta clinica ed estetica del percorso Cocoora.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DNA_COMBOS.map((combo: any) => (
              <div
                key={combo.id ?? combo.name}
                className="relative flex flex-col rounded-[2px] border border-amber-200/15 bg-emerald-950/50 p-6 transition-colors hover:border-amber-200/40"
              >
                <Dna className="h-6 w-6 text-amber-200/70" strokeWidth={1.1} />
                <h3 className="mt-4 font-serif text-xl font-light text-stone-50">
                  {combo.name}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-stone-300/80">
                  {combo.description}
                </p>
                {combo.focus && (
                  <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] text-emerald-300/70">
                    {combo.focus}
                  </span>
                )}
                {combo.price && (
                  <span className="mt-4 border-t border-amber-200/10 pt-4 font-serif text-lg font-light text-amber-100">
                    {combo.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative border-b border-amber-200/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center text-amber-200/80">
              Sequenziamento NGS
            </SectionLabel>
            <h2 className="mt-6 font-serif text-4xl font-light text-stone-50 sm:text-5xl">
              Microbiota Kits
            </h2>
            <p className="mt-5 text-base font-light text-stone-300/85">
              Analisi metagenomica di nuova generazione per leggere l'ecologia
              batterica intestinale con precisione clinica.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {MICROBIOTA_KITS.map((kit: any, idx: number) => {
              const Icon = idx === 1 ? Microscope : FlaskConical;
              return (
                <div
                  key={kit.id ?? kit.name}
                  className="group relative flex flex-col rounded-[2px] border border-amber-200/15 bg-gradient-to-b from-emerald-950/80 to-[#05100c] p-8 transition-colors hover:border-amber-200/40"
                >
                  <Icon className="h-8 w-8 text-amber-200/80" strokeWidth={1} />
                  <h3 className="mt-6 font-serif text-2xl font-light text-stone-50">
                    {kit.name}
                  </h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-stone-300/85">
                    {kit.description}
                  </p>
                  {kit.parameters && (
                    <ul className="mt-6 space-y-3 border-t border-amber-200/10 pt-6">
                      {kit.parameters.map((p: string) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5 text-sm font-light text-stone-200/90"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-8 flex items-center justify-between border-t border-amber-200/10 pt-6">
                    <span className="font-serif text-2xl font-light text-amber-100">
                      {kit.price}
                    </span>
                    <Button onClick={openDiscover} size="sm" variant="outline">
                      Richiedi Kit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative py-28">
        <Container>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[2px] border border-amber-200/25 bg-gradient-to-br from-emerald-950 via-[#0a1c15] to-[#05100c] p-10 text-center shadow-[0_0_80px_-20px_rgba(212,175,120,0.25)] sm:p-14">
            <Award className="mx-auto h-9 w-9 text-amber-200" strokeWidth={1} />
            <h3 className="mt-6 font-serif text-3xl font-light text-stone-50 sm:text-4xl">
              Incluso nel <span className="italic text-amber-200">Percorso Signature Longevity</span>
            </h3>
            <p className="mt-4 text-3xl font-serif font-light text-amber-100">1.190€</p>
            <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-stone-300/85">
              Genomica DNA 5, sequenziamento del microbiota NGS e consulenza
              multidisciplinare confluiscono nel programma annuale di riferimento
              di Cocoora Studio Medico Polispecialistico, il percorso più completo
              per chi desidera investire nella propria longevità in modo sistemico.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button onClick={openDiscover} className="group">
                Scopri il Percorso Signature
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}