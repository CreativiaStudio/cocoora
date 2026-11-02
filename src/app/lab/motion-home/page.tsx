"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/ui";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Atmosphere } from "@/components/motion/atmosphere";
import { ThreadSpine, type ThreadSection } from "@/components/motion/thread-spine";
import { NodeMarquee } from "@/components/motion/node-marquee";
import {
  MaskLines,
  Reveal,
  RevealItem,
  RevealStagger,
  ScrollWords,
} from "@/components/motion/reveal";
import { ConnectedPath, type PathStep } from "@/components/motion/connected-path";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { HeroOrbitalStage } from "@/components/motion/orbit/hero-orbital-stage";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PanoramicAreasBlades } from "@/components/motion/panoramic-areas-blades";
import { ScrollExpandCinema } from "@/components/motion/scroll-expand-cinema";
import { GlassMatrixDrum } from "@/components/motion/glass-matrix-drum";
import { CLUB_TIERS } from "@/lib/club";

const SCENES: ThreadSection[] = [
  { id: "home-hero", label: "01 · Hero Orbitale" },
  { id: "home-manifesto", label: "02 · Manifesto Clinico" },
  { id: "home-cinema", label: "03 · Esperienza Immersiva" },
  { id: "home-aree", label: "04 · Aree Mediche" },
  { id: "home-matrice", label: "05 · Scelta Clinica" },
  { id: "home-ecosistema", label: "06 · Ecosistema Digitale" },
  { id: "home-percorsi", label: "07 · Percorsi Salute" },
  { id: "home-footer", label: "08 · Contatti e Sede" },
];

const CERTIFIED_MARQUEE_ITEMS = [
  "Docenti Università Federico II & Vanvitelli a Napoli",
  "Direzione Sanitaria Dott.ssa Elisa Russo",
  "Orario continuato Lun–Ven 8:00–20:00 · Sab 9:00–14:00",
  "Equipe Multidisciplinare Integrata",
  "Referti e Dossier Clinico Digitale 24/7",
  "Prevenzione e Percorsi Salute Personalizzati",
];

const CLUB_STEPS: PathStep[] = [
  {
    title: "Profilo sanitario digitale",
    description:
      "Crea il tuo profilo sanitario digitale in pochi minuti dall'app Cocoora: la tua storia clinica e i tuoi parametri sempre protetti e consultabili.",
    icon: UserRound,
  },
  {
    title: "Specialista, sede e orario",
    description:
      "Scegli il medico specialista, la sede di Napoli e l'orario più comodo per te con conferma immediata.",
    icon: CalendarDays,
  },
  {
    title: "Referti e dossier sempre con te",
    description:
      "Consulta esami, referti diagnostici e piani di prevenzione nella tua area riservata, sincronizzata con la direzione sanitaria.",
    icon: FileText,
  },
];

const MANIFESTO_TEXT =
  "La salute non è un evento isolato, né un'emergenza da rincorrere nel momento del bisogno. È un percorso consapevole, continuo e personalizzato che si costruisce giorno dopo giorno. A Napoli abbiamo creato un centro medico in cui competenze universitarie d'eccellenza, diagnostica avanzata e ascolto umano si incontrano in un unico luogo armonioso.";

export default function MotionHomePage() {
  const annualTiers = CLUB_TIERS.filter((t) => !t.free);

  return (
    <SmoothScroll>
      <div className="relative min-h-screen text-charcoal selection:bg-primary-teal selection:text-white">
        {/* Layer atmosferico continuo: "La Marea" */}
        <Atmosphere />

        {/* Spina dorsale continua: "Il Filo" */}
        <ThreadSpine sections={SCENES} />

        {/* ================================================================ */}
        {/* 1 · HERO ORBITALE (La porta di benvenuto immersiva)              */}
        {/* ================================================================ */}
        <section
          id="home-hero"
          className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 pt-24 pb-16 text-white"
        >
          <HeroOrbitalStage />

          <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-white/10 px-4 py-1.5 backdrop-blur-md mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">
                Cocoora Centro Medico · Napoli
              </span>
            </div>

            <MaskLines
              as="h1"
              lines={[
                "Connessi alla tua salute.",
                "L'architettura della prevenzione.",
              ]}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white mb-7 text-center drop-shadow-sm"
            />

            <p className="max-w-2xl text-center text-base sm:text-lg leading-relaxed text-teal-100/90 mb-10">
              Un centro medico d'eccellenza a Napoli che unisce competenze universitarie,
              diagnostica avanzata e ascolto clinico autentico: un ecosistema
              pensato per accompagnarti nel tempo, non solo nel momento della visita.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="/club" variant="light">
                Scopri i Percorsi Salute
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>

              <MagneticButton href="/prenota" variant="glass">
                Prenota una visita
              </MagneticButton>
            </div>
          </div>

          {/* Nastro certificato */}
          <div className="relative z-10 mt-16 w-full border-t border-white/15 pt-4">
            <NodeMarquee
              items={CERTIFIED_MARQUEE_ITEMS}
              speed={28}
              tone="dark"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* 2 · MANIFESTO CLINICO (Rivelazione parola per parola)            */}
        {/* ================================================================ */}
        <section
          id="home-manifesto"
          className="relative px-6 py-28 sm:py-36 text-white"
        >
          <Container>
            <Reveal className="mx-auto mb-12 max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-200" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-100">
                  Il nostro impegno
                </span>
              </div>

              <h2 className="mt-6 font-serif text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-white">
                La salute è un percorso continuo
              </h2>
            </Reveal>

            <div className="mx-auto max-w-4xl text-center">
              <ScrollWords
                text={MANIFESTO_TEXT}
                className="font-serif text-xl sm:text-3xl lg:text-4xl font-medium leading-[1.42] tracking-tight text-teal-50 drop-shadow-sm"
              />
            </div>

            <Reveal className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-3">
              {[
                "Ascolto Clinico",
                "Competenza Universitaria",
                "Continuità di Cura",
                "Trasparenza",
                "Prevenzione su Misura",
              ].map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-100 backdrop-blur-md"
                >
                  {value}
                </span>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ================================================================ */}
        {/* 3 · CINEMA SCROLL EXPAND (La finestra a pieno schermo di Mario)  */}
        {/* ================================================================ */}
        <section id="home-cinema" className="relative">
          <ScrollExpandCinema />
        </section>

        {/* ================================================================ */}
        {/* 4 · LE NOSTRE AREE MEDICHE (Quinte Sceniche)                     */}
        {/* ================================================================ */}
        <section
          id="home-aree"
          className="relative px-4 py-24 sm:py-32"
        >
          <Container>
            <Reveal className="mx-auto mb-16 max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-800/30 bg-teal-900/20 px-4 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-teal" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-teal">
                  Specialità Integrate
                </span>
              </div>

              <h2 className="mt-6 font-serif text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-dark-navy">
                Le Nostre Aree Mediche
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-charcoal/80">
                Tre direttrici cliniche coordinate da una direzione sanitaria unica,
                per offrirti una visione di cura completa senza frammentazioni.
              </p>
            </Reveal>
          </Container>

          <PanoramicAreasBlades />
        </section>

        {/* ================================================================ */}
        {/* 5 · SCELTA CLINICA (Bussola Liquid Glass Matrice Silvia)          */}
        {/* ================================================================ */}
        <section id="home-matrice" className="relative">
          <GlassMatrixDrum />
        </section>

        {/* ================================================================ */}
        {/* 6 · ECOSISTEMA DIGITALE (Profilo, App & Referti)                 */}
        {/* ================================================================ */}
        <section
          id="home-ecosistema"
          className="relative px-6 py-28 sm:py-36"
        >
          <Container>
            <Reveal className="mx-auto mb-16 max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-white/40 px-4 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-teal" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-teal">
                  Ecosistema Digitale
                </span>
              </div>

              <h2 className="mt-6 font-serif text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-dark-navy">
                Tre passaggi, un solo filo
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-charcoal/80">
                Dalla prenotazione al referto: la tua esperienza in Cocoora è fluida,
                protetta e sempre a portata di mano.
              </p>
            </Reveal>

            <ConnectedPath steps={CLUB_STEPS} />

            <div className="mt-20">
              <RevealStagger className="grid gap-6 md:grid-cols-3">
                <RevealItem>
                  <SpotlightCard className="h-full rounded-3xl border border-teal-200/60 bg-white/70 p-8 shadow-sm backdrop-blur-md transition-shadow hover:shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-primary-teal mb-6">
                      <Microscope className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-dark-navy mb-3">
                      Diagnostica Avanzata
                    </h3>
                    <p className="text-sm leading-relaxed text-charcoal/75">
                      Tecnologie di precisione in sede: ecografie ad alta risoluzione,
                      OPT digitale, dermatoscopia e check-up di laboratorio integrati.
                    </p>
                  </SpotlightCard>
                </RevealItem>

                <RevealItem>
                  <SpotlightCard className="h-full rounded-3xl border border-teal-200/60 bg-white/70 p-8 shadow-sm backdrop-blur-md transition-shadow hover:shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-primary-teal mb-6">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-dark-navy mb-3">
                      Continuità di Cura
                    </h3>
                    <p className="text-sm leading-relaxed text-charcoal/75">
                      Il tuo percorso non si chiude con una singola prescrizione:
                      medici e specialisti dialogano tra loro per seguire i tuoi progressi.
                    </p>
                  </SpotlightCard>
                </RevealItem>

                <RevealItem>
                  <SpotlightCard className="h-full rounded-3xl border border-teal-200/60 bg-white/70 p-8 shadow-sm backdrop-blur-md transition-shadow hover:shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-primary-teal mb-6">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-dark-navy mb-3">
                      Privacy &amp; Sicurezza Sanitaria
                    </h3>
                    <p className="text-sm leading-relaxed text-charcoal/75">
                      Dossier clinico digitale conforme ai più rigorosi standard GDPR
                      sanitari: i tuoi referti consultabili 24/7 in massima sicurezza.
                    </p>
                  </SpotlightCard>
                </RevealItem>
              </RevealStagger>
            </div>
          </Container>
        </section>

        {/* ================================================================ */}
        {/* 7 · PERCORSI SALUTE ANNUALI (Nella Luce, fondo bianco puro)      */}
        {/* ================================================================ */}
        <section
          id="home-percorsi"
          className="relative px-6 py-28 sm:py-36 bg-white/85 backdrop-blur-md border-t border-teal-100/60"
        >
          <Container>
            <Reveal className="mx-auto mb-16 max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1">
                <Sparkles className="h-3.5 w-3.5 text-primary-teal" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-teal">
                  Prevenzione &amp; Longevità
                </span>
              </div>

              <h2 className="mt-6 font-serif text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-dark-navy">
                I Percorsi Salute Annuali
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-charcoal/80">
                La prevenzione non è un abbonamento commerciale: è un percorso
                strutturato verso la tua salute e longevità, guidato dalla direzione clinica.
              </p>
            </Reveal>

            <RevealStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {annualTiers.map((tier) => (
                <RevealItem key={tier.id}>
                  <div
                    className={`relative flex h-full flex-col justify-between rounded-3xl border p-7 transition-all duration-300 hover:shadow-xl ${
                      tier.badge
                        ? "border-primary-teal bg-gradient-to-b from-white to-teal-50/40 shadow-md ring-2 ring-primary-teal/20"
                        : "border-teal-100 bg-white shadow-sm"
                    }`}
                  >
                    {tier.badge ? (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-teal px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                        {tier.badge}
                      </div>
                    ) : null}

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-2xl font-semibold text-dark-navy">
                          {tier.name}
                        </h3>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-charcoal/70 min-h-[36px]">
                        {tier.description}
                      </p>

                      <div className="mt-5 border-t border-teal-100/70 pt-5">
                        <p className="text-2xl font-bold tracking-tight text-dark-navy">
                          {tier.priceLabel}
                        </p>
                      </div>

                      <ul className="mt-6 space-y-2.5 text-xs text-charcoal/80">
                        {tier.features.slice(0, 6).map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <Check className="h-4 w-4 shrink-0 text-primary-teal mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 border-t border-teal-100/70 pt-5">
                      <Link
                        href="/club"
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                          tier.badge
                            ? "bg-primary-teal text-white hover:bg-dark-navy"
                            : "bg-teal-50 text-primary-teal hover:bg-teal-100"
                        }`}
                      >
                        Dettagli Percorso
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>

            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-teal-100 bg-teal-50/50 p-5 text-center text-xs leading-relaxed text-charcoal/70">
              <p>
                <strong>Nota di trasparenza clinica:</strong> I Percorsi Salute Cocoora Club
                sono percorsi di prevenzione sanitaria su base annuale coordinati dalla
                Direzione Sanitaria (Dott.ssa Elisa Russo). Non costituiscono polizza
                assicurativa né abbonamento a consumo.
              </p>
            </div>
          </Container>
        </section>

        {/* ================================================================ */}
        {/* 8 · FOOTER (Marea Navy & Contatti)                               */}
        {/* ================================================================ */}
        <footer
          id="home-footer"
          className="relative overflow-hidden border-t border-white/10 bg-dark-navy pt-24 pb-12 text-white"
        >
          <Container>
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full border border-teal-300/30 bg-white/5 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-teal-300" />
                  </div>
                  <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                    Cocoora Centro Medico
                  </span>
                </div>

                <p className="mt-4 max-w-md text-sm leading-relaxed text-teal-100/75">
                  Un centro medico a Napoli dove competenze universitarie,
                  diagnostica avanzata e ascolto umano costruiscono insieme il
                  tuo percorso di salute consapevole, giorno dopo giorno.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Direzione Sanitaria Dott.ssa Elisa Russo",
                    "Orario continuato Lun–Ven 8:00–20:00",
                    "Sab 9:00–14:00",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-teal-100/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                  Aree di Cura
                </p>
                <ul className="mt-5 space-y-3 text-sm text-teal-100/80">
                  <li>
                    <Link
                      href="/servizi/medicina-estetica"
                      className="hover:text-white transition-colors"
                    >
                      Medicina Estetica &amp; Rigenerativa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servizi/odontoiatria"
                      className="hover:text-white transition-colors"
                    >
                      Odontoiatria Specialistica
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servizi/visite"
                      className="hover:text-white transition-colors"
                    >
                      Visite Specialistiche &amp; Diagnostica
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/club"
                      className="hover:text-white transition-colors"
                    >
                      Percorsi Salute Annuali
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                  Contatti &amp; Sede
                </p>
                <ul className="mt-5 space-y-3 text-sm text-teal-100/80">
                  <li>Napoli · Campania</li>
                  <li>Lun–Ven 8:00–20:00 · Sab 9:00–14:00</li>
                  <li className="pt-2">
                    <MagneticButton href="/prenota" variant="glass">
                      Prenota online
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </MagneticButton>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-teal-100/60 sm:flex-row">
              <p>
                © {new Date().getFullYear()} Cocoora Centro Medico · Tutti i
                diritti riservati.
              </p>
              <p className="tracking-[0.18em] uppercase text-teal-200/50">
                Demo Home · Champions League
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </SmoothScroll>
  );
}
