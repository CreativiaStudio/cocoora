"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ButtonLink, Badge } from "@/components/ui";
import {
  Sparkles,
  Clock,
  GraduationCap,
  MapPin,
  Phone,
  ArrowRight,
  Quote,
  Scan,
  Activity,
  Zap,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const principles = [
  {
    title: "Precisione Clinica",
    text: "Diagnostica digitale di ultima generazione, scanner 3D e protocolli validati a supporto di ogni decisione terapeutica.",
  },
  {
    title: "Ascolto Autentico",
    text: "Nessun consulto affrettato. Ogni visita inizia con il dialogo: raccogliamo la tua storia clinica e personale prima di ogni diagnosi.",
  },
  {
    title: "Prevenzione Reale",
    text: "Un approccio predittivo multidisciplinare per intercettare i bisogni prima della comparsa del sintomo. La longevità attiva.",
  },
  {
    title: "Il Tempo Giusto",
    text: "Agende con tempi dedicati e dilatati per consentire visite approfondite e spiegazioni chiare, nel pieno rispetto del tuo tempo.",
  },
];

const rooms = [
  {
    number: "01",
    title: "Studio 1",
    subtitle: "Odontoiatria Digitale & Ortodonzia",
    description:
      "Postazione clinica ergonomica con scanner intraorale 3D e diagnostica radiologica digitale integrata. Lo spazio di riferimento per i trattamenti di ortodonzia digitale e implantologia guidata.",
    equipment: ["Scanner 3D iTero Element 5D", "Ortopanoramica Digitale HD", "Simulazione Digitale Sorriso"],
    image: "/images/dental-operatory.jpg",
    icon: Scan,
  },
  {
    number: "02",
    title: "Studio 2",
    subtitle: "Medicina Estetica & Laserterapia",
    description:
      "Ambiente luminoso dedicato ai percorsi di medicina estetica rigenerativa, con piattaforma laser combinata viso-corpo e tecnologie di rimodellamento non invasivo.",
    equipment: ["Piattaforma Laser Multi-Manipolo", "Cryoliposculpt Corpo", "Biostimolazione Rigenerativa"],
    image: "/images/laser-technology.jpg",
    icon: Zap,
  },
  {
    number: "03",
    title: "Studio 3",
    subtitle: "Poliambulatorio & Diagnostica",
    description:
      "Ambulatorio multidisciplinare dotato di ecografo HD ed elettrocardiografo digitale, dedicato alle visite specialistiche con i nostri medici e docenti universitari.",
    equipment: ["Ecografo HD Multidisciplinare", "Elettrocardiografo Digitale", "Refertazione Digitale Integrata"],
    image: "/images/diagnostics-lab.jpg",
    icon: Activity,
  },
];

const universities = [
  {
    name: "Università degli Studi di Napoli Federico II",
    role: "Collaborazione Clinico-Scientifica",
    detail:
      "Docenti universitari e specialisti ospedalieri convenzionati operano regolarmente nel nostro centro, garantendo protocolli diagnostici all'apice della ricerca medica contemporanea.",
    badge: "Docenti & Ricerca Clinica",
  },
  {
    name: "Università della Campania Luigi Vanvitelli",
    role: "Protocolli Specialistici Integrati",
    detail:
      "Condivisione di linee guida cliniche validate per la prevenzione cardiovascolare, metabolica e ginecologica, per unire rigore accademico e tempestività ambulatoriale.",
    badge: "Linee Guida Validate",
  },
];

export default function ChiSiamoPage() {
  return (
    <main className="bg-canvas text-charcoal">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-dark-navy">
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-lounge.jpg"
            alt="Interno Cocoora Studio Medico Polispecialistico"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy via-dark-navy/80 to-dark-navy/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/80 via-dark-navy/10 to-dark-navy/60" />
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-slate-accent/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-40 sm:px-10">
          <Badge className="mb-8 border border-white/20 bg-white/10 px-4 py-1.5 text-teal-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Lo Studio &amp; La Visione
          </Badge>

          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Uno studio medico pensato come
            <span className="mt-1 block italic text-teal-200">un luogo per respirare.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-[1.75] text-teal-100/85 sm:text-xl">
            A Napoli, in via Giovanni De Bonis 81, il nostro centro nasce per ridefinire l&apos;esperienza sanitaria:
            eccellenza clinica multispecialistica, docenti universitari e un&apos;accoglienza calda e riservata
            ispirata ai più alti standard europei.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <ButtonLink
              href="#stanze"
              size="lg"
              className="bg-white px-8 text-dark-navy hover:bg-teal-50"
            >
              Esplora gli Ambienti
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/contatti"
              size="lg"
              variant="outline-dark"
              className="border-white/30 bg-white/5 px-8 backdrop-blur-sm hover:bg-white/10"
            >
              Prenota una Visita
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ============ LA NOSTRA FILOSOFIA ============ */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionEyebrow>Il Metodo</SectionEyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-[1.1] text-teal-900 sm:text-5xl">
            La nostra filosofia
          </h2>
          <p className="mt-6 text-base leading-[1.8] text-charcoal/70 sm:text-lg">
            Un metodo di cura che unisce rigore scientifico e sensibilità umana,
            applicato in ogni ambulatorio, in ogni consulto e in ogni dettaglio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, idx) => (
            <div
              key={p.title}
              className="group flex flex-col rounded-3xl border border-teal-100 bg-white p-8 shadow-[0_18px_50px_-28px_rgba(3,53,75,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_30px_70px_-24px_rgba(3,53,75,0.32)]"
            >
              <span className="mb-8 font-serif text-3xl font-semibold text-slate-accent/60">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight text-teal-900">
                {p.title}
              </h3>
              <p className="text-[15px] leading-[1.75] text-charcoal/70">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ GLI SPAZI DEL CENTRO ============ */}
      <section id="stanze" className="relative overflow-hidden bg-dark-navy py-28">
        <div className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[30rem] w-[30rem] rounded-full bg-slate-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-teal-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mx-auto mb-20 max-w-2xl text-center">
            <SectionEyebrow tone="dark">I Nostri Ambienti</SectionEyebrow>
            <h2 className="font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
              Gli Spazi di Cocoora
            </h2>
            <p className="mt-6 text-base leading-[1.8] text-teal-100/80 sm:text-lg">
              Tre ambienti clinici indipendenti, ciascuno progettato con una specifica vocazione specialistica
              e curato nei materiali, nell&apos;insonorizzazione e nell&apos;illuminazione naturale per il massimo comfort.
            </p>
          </div>

          <div className="space-y-24 lg:space-y-32">
            {rooms.map((room, idx) => {
              const Icon = room.icon;
              const reversed = idx % 2 === 1;
              return (
                <div
                  key={room.number}
                  className={`flex flex-col items-center gap-10 lg:gap-16 ${
                    reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  <div className="group relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] lg:w-1/2">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={room.image}
                        alt={room.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/60 via-transparent to-transparent" />
                    </div>
                    <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                        Ambiente {room.number}
                      </span>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <Icon className="h-5 w-5 text-teal-200" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-accent">
                      {room.subtitle}
                    </span>
                    <h3 className="mt-3 font-serif text-3xl font-semibold leading-[1.15] text-white sm:text-4xl">
                      {room.title}
                    </h3>
                    <p className="mt-5 text-base leading-[1.8] text-teal-100/80">
                      {room.description}
                    </p>

                    <ul className="mt-8 flex flex-wrap gap-2.5">
                      {room.equipment.map((eq) => (
                        <li
                          key={eq}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-teal-100 backdrop-blur-sm"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
                          {eq}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="section-alt relative overflow-hidden py-28">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <Quote className="mx-auto mb-8 h-10 w-10 text-slate-accent" strokeWidth={1.2} />
          <p className="font-serif text-3xl font-medium italic leading-[1.5] text-teal-900 sm:text-4xl">
            &ldquo;La medicina deve ritrovare il suo tempo. Il tempo di ascoltare,
            di osservare, di comprendere prima di agire. Nel nostro centro abbiamo costruito
            uno spazio dove la tecnologia più avanzata convive con la lentezza
            necessaria a prendersi davvero cura di una persona.&rdquo;
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-slate-accent/60" />
          <div className="mt-8 flex flex-col items-center gap-1.5">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-900">
              Manifesto Clinico
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/60">
              Équipe Medica &amp; Governance — Cocoora Studio Medico Polispecialistico
            </span>
          </div>
        </div>
      </section>

      {/* ============ DIREZIONE SANITARIA — DOTT.SSA ELISA RUSSO ============ */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionEyebrow>La Direzione Sanitaria</SectionEyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-[1.1] text-teal-900 sm:text-5xl">
            Dott.ssa Elisa Russo
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-accent">
            Odontoiatra e Specialista in Ortodonzia — Direttrice Sanitaria
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Monogramma istituzionale */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-dark-navy shadow-[0_35px_80px_-30px_rgba(3,53,75,0.55)]">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-teal-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-slate-accent/25 blur-3xl" />
            <div className="relative flex h-full flex-col items-center justify-center gap-5">
              <span className="font-serif text-7xl font-semibold tracking-tight text-teal-200">
                ER
              </span>
              <div className="h-px w-14 bg-white/25" />
              <span className="px-8 text-center text-xs font-semibold uppercase tracking-[0.24em] text-teal-100/75">
                Direzione Sanitaria
              </span>
            </div>
          </div>

          {/* Visione e presentazione */}
          <div>
            <Quote className="mb-6 h-8 w-8 text-slate-accent" strokeWidth={1.4} />
            <p className="font-serif text-2xl font-medium italic leading-[1.5] text-teal-900 sm:text-[1.7rem]">
              &ldquo;Curare significa prima di tutto prendersi una responsabilità: verso la
              persona che abbiamo di fronte, verso l&apos;équipe che coordino e verso la
              qualità di ogni decisione clinica.&rdquo;
            </p>
            <div className="mt-8 space-y-5">
              <p className="text-base leading-[1.8] text-charcoal/70">
                Odontoiatra e Specialista in Ortodonzia, la Dott.ssa Elisa Russo ricopre il ruolo di
                Direttrice Sanitaria: garantisce il rispetto dei protocolli clinici, l&apos;appropriatezza
                delle prescrizioni e la qualità di ogni percorso di cura offerto nel nostro centro.
              </p>
              <p className="text-base leading-[1.8] text-charcoal/70">
                Sotto la sua direzione, l&apos;équipe multidisciplinare lavora in modo coordinato:
                ogni piano terapeutico nasce dal confronto tra specialisti e viene condiviso con il
                paziente in modo chiaro e trasparente, nel segno del rigore clinico e dell&apos;etica medica.
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Rigore clinico e protocolli validati",
                "Etica medica e appropriatezza prescrittiva",
                "Coordinamento multidisciplinare dell'équipe",
                "Attenzione autentica alla persona",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm font-medium text-charcoal/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ CATTEDRE UNIVERSITARIE ============ */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionEyebrow>Governance Clinica</SectionEyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-[1.1] text-teal-900 sm:text-5xl">
            Docenti Universitari &amp; Ricerca Clinica
          </h2>
          <p className="mt-6 text-base leading-[1.8] text-charcoal/70 sm:text-lg">
            La qualità clinica del nostro centro si fonda sul legame diretto con le cattedre
            universitarie campane, garanzia di aggiornamento costante, seconda opinione
            qualificata e sicurezza terapeutica.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {universities.map((u) => (
            <div
              key={u.name}
              className="flex flex-col justify-between rounded-3xl border border-teal-100 bg-white p-9 shadow-[0_18px_50px_-28px_rgba(3,53,75,0.28)] transition-all duration-300 hover:border-teal-200 hover:shadow-[0_30px_70px_-24px_rgba(3,53,75,0.32)]"
            >
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800">
                  <GraduationCap className="h-4 w-4" />
                  {u.badge}
                </div>
                <h3 className="font-serif text-2xl font-semibold leading-tight text-teal-900 sm:text-[1.75rem]">
                  {u.name}
                </h3>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-accent">
                  {u.role}
                </p>
                <p className="mt-5 text-[15px] leading-[1.8] text-charcoal/70">{u.detail}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 border-t border-teal-100 pt-5 text-xs font-medium text-teal-800">
                <CheckCircle2 className="h-4 w-4 text-slate-accent" />
                Specialisti accreditati e convenzionati attivi in sede
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ DOVE SIAMO & COME RAGGIUNGERCI ============ */}
      <section className="section-alt border-t border-teal-100 py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionEyebrow align="left">La Sede di Napoli</SectionEyebrow>
              <h2 className="font-serif text-4xl font-semibold leading-[1.1] text-teal-900 sm:text-5xl">
                Uno studio facilmente raggiungibile, nel cuore della città
              </h2>
              <p className="mt-6 text-base leading-[1.8] text-charcoal/70 sm:text-lg">
                Il nostro centro si trova in <strong className="font-semibold text-teal-900">Via Giovanni De Bonis 81</strong>, in una
                posizione riservata e strategica tra Posillipo e Chiaia. Un ambiente esclusivo ma comodo da
                raggiungere da ogni zona di Napoli.
              </p>

              <div className="mt-10 space-y-6">
                <ContactRow icon={MapPin} title="Indirizzo">
                  Via Giovanni De Bonis 81, Napoli (NA)
                </ContactRow>
                <ContactRow icon={Phone} title="Centralino & WhatsApp Dedicato">
                  Tel:{" "}
                  <a href="tel:08118182091" className="font-medium text-teal-800 hover:underline">
                    081 18182091
                  </a>{" "}
                  · Risposta tempestiva per appuntamenti ed emergenze
                </ContactRow>
                <ContactRow icon={Clock} title="Orari di Apertura">
                  Lun–Ven 8:00–20:00 (Orario continuato), Sab 9:00–14:00
                </ContactRow>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy p-10 text-white shadow-[0_40px_80px_-30px_rgba(3,53,75,0.6)] sm:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-slate-accent/20 blur-3xl" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">
                  Prenotazioni &amp; Accoglienza
                </span>
                <h3 className="mt-4 font-serif text-3xl font-semibold leading-[1.15] sm:text-4xl">
                  Vivi l&apos;esperienza Cocoora
                </h3>
                <p className="mt-5 text-[15px] leading-[1.8] text-teal-100/80">
                  Che tu desideri iniziare un percorso con i nostri specialisti o richiedere una valutazione per il
                  tuo sorriso o il tuo benessere, il nostro team è a tua completa disposizione.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href="/contatti"
                    size="md"
                    className="bg-white text-dark-navy hover:bg-teal-50"
                  >
                    Prenota una Visita
                  </ButtonLink>
                  <ButtonLink
                    href="/club"
                    size="md"
                    variant="outline-dark"
                    className="border-white/25 bg-white/5 hover:bg-white/10"
                  >
                    Scopri i Piani Salute
                  </ButtonLink>
                </div>

                <div className="mt-9 border-t border-white/10 pt-5 text-xs leading-relaxed text-teal-100/60">
                  * Orario continuato: Lun–Ven 8:00–20:00 · Sab 9:00–14:00. Il nostro team
                  risponde tempestivamente a ogni richiesta di appuntamento.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionEyebrow({
  children,
  tone = "light",
  align = "center",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  return (
    <p
      className={`mb-5 text-xs font-semibold uppercase tracking-[0.28em] ${
        tone === "dark" ? "text-teal-200" : "text-slate-accent"
      } ${align === "center" ? "text-center" : "text-left"}`}
    >
      {children}
    </p>
  );
}

function ContactRow({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white shadow-sm">
        <Icon className="h-5 w-5 text-teal-800" strokeWidth={1.6} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-teal-900">{title}</h4>
        <p className="mt-1 text-sm leading-[1.7] text-charcoal/70">{children}</p>
      </div>
    </div>
  );
}
