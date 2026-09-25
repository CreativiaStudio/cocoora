"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, ButtonLink, Container, Badge } from "@/components/ui";
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Clock,
  ScanLine,
  Stethoscope,
  Microscope,
  Dna,
  GraduationCap,
  MapPin,
  Phone,
  Calendar,
  ArrowRight,
  Quote,
  Building2,
  Sofa,
  Scan,
  Activity,
  Zap,
  Award,
  CheckCircle2,
} from "lucide-react";

const serif = { fontFamily: '"Cormorant Garamond", "EB Garamond", Garamond, serif' };

const principles = [
  {
    icon: ScanLine,
    title: "Precisione Clinica",
    text: "Diagnostica digitale di ultima generazione, scanner 3D e protocolli validati a supporto di ogni decisione terapeutica.",
    accent: "text-amber-600",
    ring: "ring-amber-200/60",
    bg: "bg-amber-50",
  },
  {
    icon: HeartHandshake,
    title: "Ascolto Autentico",
    text: "Nessun consulto affrettato. Ogni visita inizia con il dialogo: raccogliamo la tua storia clinica e personale prima di ogni diagnosi.",
    accent: "text-rose-500",
    ring: "ring-rose-200/60",
    bg: "bg-rose-50",
  },
  {
    icon: ShieldCheck,
    title: "Prevenzione Reale",
    text: "Un approccio predittivo multidisciplinare per intercettare i bisogni prima della comparsa del sintomo. La longevità attiva.",
    accent: "text-emerald-600",
    ring: "ring-emerald-200/60",
    bg: "bg-emerald-50",
  },
  {
    icon: Clock,
    title: "Il Tempo Giusto",
    text: "Agende con tempi dedicati dilatati per consentire visite approfondite e spiegazioni chiare. Zero attese snervanti in sala.",
    accent: "text-sky-600",
    ring: "ring-sky-200/60",
    bg: "bg-sky-50",
  },
];

const rooms = [
  {
    number: "01",
    title: "Reception & Private Lounge",
    subtitle: "L'accoglienza come primo atto di cura",
    description:
      "Materiali naturali, essenze delicate, luce soffusa e una saletta riservata per consulenze e preventivi in totale privacy. L'atmosfera che allontana l'ansia clinica.",
    equipment: ["Saletta Privacy Dedicata", "Consulenza Personalizzata", "Area Relax con Infusi Biologici"],
    image: "/images/clinic-lounge.jpg",
    icon: Sofa,
  },
  {
    number: "02",
    title: "Studio 1 — Odontoiatria Digitale & Ortodonzia",
    subtitle: "Precisione millimetrica per il tuo sorriso",
    description:
      "Postazione chirurgica ergonomica, scanner intraorale 3D iTero di ultima generazione e diagnostica radiologica integrata. Lo spazio di riferimento per i trattamenti Invisalign Diamond.",
    equipment: ["Scanner 3D iTero Element 5D", "Ortopanoramica Digitale HD", "Simulazione Digitale Sorriso"],
    image: "/images/dental-operatory.jpg",
    icon: Scan,
  },
  {
    number: "03",
    title: "Studio 2 — Medicina Estetica & Laserterapia",
    subtitle: "Tecnologie d'avanguardia e luce naturale",
    description:
      "Poltrona anatomica riscaldata, piattaforma laser combinata viso-corpo e tecnologia Cryoliposculpt in un ambiente luminoso, pensato per esaltare l'armonia naturale.",
    equipment: ["Piattaforma Laser Multi-Manipolo", "Cryoliposculpt Corpo", "Poltrona Anatomica Ergonomica"],
    image: "/images/laser-technology.jpg",
    icon: Zap,
  },
  {
    number: "04",
    title: "Studio 3 — Poliambulatorio & Diagnostica Rapida",
    subtitle: "Diagnosi specialistica in un'unica seduta",
    description:
      "Ambulatorio cardiologico, ecografico e ginecologico dotato di ecografo HD multidisciplinare, dedicato alle visite con i nostri specialisti e docenti universitari.",
    equipment: ["Ecografo HD Multidisciplinare", "Elettrocardiografo Digitale", "Studio Docenti Universitari"],
    image: "/images/diagnostics-lab.jpg",
    icon: Activity,
  },
  {
    number: "05",
    title: "Stanza Consulenza & Longevità Clinica",
    subtitle: "La medicina predittiva e lo stile di vita",
    description:
      "Lo spazio dedicato ai percorsi Cocoora Precision: interpretazione congiunta dei test genomici DNA 5, sequenziamento del microbiota e piani nutrizionali sartoriali.",
    equipment: ["Postazione Consulenza Genomica", "Analisi Bioimpedenziometrica", "Refertazione Multidisciplinare"],
    image: "/images/doctor-consultation.jpg",
    icon: Dna,
  },
];

const universities = [
  {
    name: "Università degli Studi di Napoli Federico II",
    role: "Collaborazione Clinico-Scientifica",
    detail:
      "Docenti universitari e specialisti ospedalieri convenzionati operano regolarmente presso Cocoora, garantendo protocolli diagnostici all'apice della ricerca medica contemporanea.",
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
    <main className="bg-stone-50 text-stone-900">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-emerald-950">
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-lounge.jpg"
            alt="Interno Cocoora Studio Medico Polispecialistico"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/75 to-emerald-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-transparent to-emerald-950/70" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-40 sm:px-10">
          <Badge className="mb-6 border border-amber-300/40 bg-amber-50/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-amber-200 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Lo Studio & La Visione
          </Badge>

          <h1
            style={serif}
            className="max-w-4xl text-5xl font-medium leading-[1.08] text-white sm:text-6xl lg:text-7xl"
          >
            Uno studio medico pensato come
            <span className="block italic text-amber-200">un luogo per respirare.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-stone-200 sm:text-xl">
            A Napoli, in via Giovanni De Bonis 81, Cocoora nasce per ridefinire l&apos;esperienza sanitaria:
            eccellenza clinica multispecialistica, docenti universitari e un&apos;accoglienza calda e riservata
            ispirata ai più alti standard europei.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink
              href="#stanze"
              size="lg"
              className="rounded-full bg-amber-200 px-8 text-emerald-950 hover:bg-amber-100"
            >
              Esplora i 5 Ambienti
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/contatti"
              size="lg"
              variant="outline-dark"
              className="rounded-full border-stone-300/40 bg-white/5 px-8 text-white backdrop-blur-sm hover:bg-white/10"
            >
              Prenota una Visita
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ============ METODO & 4 PRINCIPI ============ */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            La Filosofia Clinica
          </span>
          <h2 style={serif} className="mt-4 text-4xl font-medium text-emerald-950 sm:text-5xl">
            Quattro pilastri di cura
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-stone-600">
            Un metodo di cura che unisce rigore scientifico e sensibilità umana,
            applicato in ogni ambulatorio, in ogni consulto e in ogni dettaglio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group rounded-3xl border border-stone-200 bg-white p-8 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${p.bg} ring-1 ${p.ring}`}
                >
                  <Icon className={`h-6 w-6 ${p.accent}`} strokeWidth={1.6} />
                </div>
                <h3 style={serif} className="mb-3 text-2xl font-medium text-emerald-950">
                  {p.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-stone-600">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ GLI SPAZI DI COCOORA ============ */}
      <section id="stanze" className="bg-emerald-950 py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mx-auto mb-20 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Architettura Sanitaria Sartoriale
            </span>
            <h2 style={serif} className="mt-4 text-4xl font-medium text-white sm:text-5xl">
              Gli Spazi di Cocoora
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-stone-300">
              Cinque ambienti indipendenti, ciascuno progettato con una specifica vocazione clinica
              e curato nei materiali, nell&apos;insonorizzazione e nell&apos;illuminazione naturale per il massimo comfort.
            </p>
          </div>

          <div className="space-y-24">
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
                  <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl lg:w-1/2">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={room.image}
                        alt={room.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
                    </div>
                    <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                        Ambiente {room.number}
                      </span>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-200/10 ring-1 ring-amber-200/30">
                      <Icon className="h-5 w-5 text-amber-200" strokeWidth={1.6} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                      {room.subtitle}
                    </span>
                    <h3
                      style={serif}
                      className="mt-3 text-3xl font-medium text-white sm:text-4xl"
                    >
                      {room.title}
                    </h3>
                    <p className="mt-5 text-base font-light leading-relaxed text-stone-300">
                      {room.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2.5">
                      {room.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-stone-200 backdrop-blur-sm"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="relative overflow-hidden bg-stone-100 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <Quote className="mx-auto mb-8 h-10 w-10 text-amber-600/50" strokeWidth={1.2} />
          <p
            style={serif}
            className="text-3xl font-medium italic leading-relaxed text-emerald-950 sm:text-4xl"
          >
            &ldquo;La medicina deve ritrovare il suo tempo. Il tempo di ascoltare,
            di osservare, di comprendere prima di agire. A Cocoora abbiamo costruito
            uno spazio dove la tecnologia più avanzata convive con la lentezza
            necessaria a prendersi davvero cura di una persona.&rdquo;
          </p>
          <div className="mt-10 flex flex-col items-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-800">
              Dr. Simone Papagno
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-700">
              Direzione Sanitaria — Cocoora Studio Medico Polispecialistico
            </span>
          </div>
        </div>
      </section>

      {/* ============ GOVERNANCE & CATTEDRE UNIVERSITARIE ============ */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            Governance Clinica
          </span>
          <h2 style={serif} className="mt-4 text-4xl font-medium text-emerald-950 sm:text-5xl">
            Direzione Sanitaria & Docenti Universitari
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-stone-600">
            La qualità clinica di Cocoora nasce da una direzione sanitaria rigorosa e
            dal legame diretto con le cattedre universitarie campane, garanzia di aggiornamento
            costante, seconda opinione qualificata e sicurezza terapeutica.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {universities.map((u) => (
            <div
              key={u.name}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-8 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
                  <GraduationCap className="h-4 w-4" />
                  {u.badge}
                </div>
                <h3 style={serif} className="text-2xl font-medium text-emerald-950">
                  {u.name}
                </h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
                  {u.role}
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-stone-600">
                  {u.detail}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-stone-100 text-xs font-medium text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Specialisti accreditati e convenzionati attivi in sede
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ DOVE SIAMO & COME RAGGIUNGERCI ============ */}
      <section className="bg-stone-100/70 border-t border-stone-200/60 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                La Sede di Napoli
              </span>
              <h2 style={serif} className="mt-3 text-4xl font-medium text-emerald-950 sm:text-5xl">
                Uno studio facilmente raggiungibile, nel cuore della città
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-stone-600">
                Cocoora si trova in <strong>Via Giovanni De Bonis 81</strong>, in una posizione riservata
                e strategica tra Posillipo e Chiaia. Un ambiente esclusivo ma comodo da raggiungere da ogni zona di Napoli.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
                    <MapPin className="h-5 w-5 text-emerald-900" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Indirizzo</h4>
                    <p className="text-sm text-stone-600">Via Giovanni De Bonis 81, Napoli (NA)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
                    <Phone className="h-5 w-5 text-emerald-900" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Centralino & WhatsApp Dedicato</h4>
                    <p className="text-sm text-stone-600">
                      Tel: <a href="tel:08118182091" className="font-medium text-emerald-900 hover:underline">081 18182091</a> · Risposta tempestiva per appuntamenti ed emergenze
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
                    <Clock className="h-5 w-5 text-emerald-900" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Orari di Apertura</h4>
                    <p className="text-sm text-stone-600">
                      Lunedì – Venerdì: 09:00 – 19:30 · Sabato: su appuntamento per urgenze e prime visite
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 p-10 text-white shadow-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                Prima Visita Senza Attese
              </span>
              <h3 style={serif} className="mt-3 text-3xl font-medium sm:text-4xl">
                Vivi l&apos;esperienza Cocoora
              </h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-stone-300">
                Che tu desideri iniziare un percorso con i nostri specialisti o richiedere una valutazione per il tuo sorriso o il tuo benessere, il nostro team è a tua completa disposizione.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/contatti"
                  size="md"
                  className="rounded-full bg-amber-200 text-emerald-950 hover:bg-amber-100"
                >
                  Prenota Visita Entro 72h
                </ButtonLink>
                <ButtonLink
                  href="/club"
                  size="md"
                  variant="outline-dark"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Scopri i Piani Salute
                </ButtonLink>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 text-xs text-stone-400">
                * Garanzia di appuntamento entro 72 ore lavorative per ogni prima visita medica o diagnostica.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}