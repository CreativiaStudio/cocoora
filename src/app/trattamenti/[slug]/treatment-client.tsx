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
  ClipboardList,
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
  type LucideIcon,
} from "lucide-react";
import { useCms } from "@/components/providers";
import { getDoctorsByTreatment } from "@/lib/doctors";
import { CLUB_TIERS } from "@/lib/club";
import { SITE } from "@/lib/site";
import type { Treatment } from "@/lib/types";
import { trackLead } from "@/lib/tracking";
import { Button, Container } from "@/components/ui";
import { Logo } from "@/components/logo";

// ─────────────────────────────────────────────────────────────────────────
// Dati di fallback — 4 card "A cosa serve?" (problema / inestetismo)
// ─────────────────────────────────────────────────────────────────────────

type ProblemCard = { title: string; description: string; icon?: string };

/**
 * Mappa ogni slug del catalogo a 4 card cliniche specifiche
 * (problema / inestetismo affrontato dal trattamento).
 */
const TREATMENT_PROBLEMS: Record<string, ProblemCard[]> = {
  "biorivitalizzazione": [
    { title: "Pelle spenta e disidratata", description: "Perdita di luminosità e idratazione profonda, con un colorito che appare opaco e stanco." },
    { title: "Ridotta elasticità cutanea", description: "Mancanza di tono ed elasticità, con pelle che appare meno compatta al tatto." },
    { title: "Rughette sottili da disidratazione", description: "Segni superficiali legati alla carenza di idratazione, più evidenti su viso, collo e décolleté." },
    { title: "Prevenzione del bioaging", description: "Sostegno medico alla qualità cutanea per accompagnare nel tempo i naturali processi di invecchiamento." },
  ],
  "biorigenerazione": [
    { title: "Tessuti cutanei devitalizzati", description: "Pelle che ha perso vitalità e freschezza, con qualità tissutale in progressivo declino." },
    { title: "Perdita di compattezza", description: "Tessuti meno sostenuti e tonici, con una sensazione generale di cedimento cutaneo." },
    { title: "Texture irregolare", description: "Superficie cutanea non uniforme, con pori dilatati e zone di diversa consistenza." },
    { title: "Sostegno ai processi rigenerativi", description: "Approccio orientato alla salute e alla vitalità cutanea, con protocolli medici personalizzati." },
  ],
  "acido-polilattico": [
    { title: "Riduzione del collagene", description: "Deplezione progressiva di collagene che indebolisce la struttura di sostegno della pelle." },
    { title: "Lassità cutanea progressiva", description: "Segni di cedimento dei tessuti su viso e corpo, con perdita di definizione dei contorni." },
    { title: "Sostegno dei tessuti", description: "Necessità di un effetto strutturale profondo e naturale, ottenuto per biostimolazione." },
    { title: "Ridefinizione di ovale e profili", description: "Miglioramento progressivo del sostegno nelle aree selezionate dal medico in fase di valutazione." },
  ],
  "filler-acido-ialuronico": [
    { title: "Perdita di volume del volto", description: "Svuotamento di zigomi, guance e regioni del terzo medio che altera le proporzioni naturali." },
    { title: "Rughe profonde e solchi", description: "Solchi naso-labiali, rughe marionette e linee profonde che appesantiscono l'espressione." },
    { title: "Contorni da ridefinire", description: "Profilo mandibolare, mento e labbra che richiedono armonizzazione dei contorni." },
    { title: "Asimmetrie delle proporzioni", description: "Disarmonie lievi o moderate del volto, da valorizzare nel rispetto dell'anatomia." },
  ],
  "tossina-botulinica": [
    { title: "Rughe frontali", description: "Linee orizzontali della fronte che rendono l'espressione marcata anche a riposo." },
    { title: "Rughe glabellari", description: "Le pieghe verticali tra le sopracciglia che danno un aspetto corrugato o severo." },
    { title: "Zampe di gallina", description: "Rughe dinamiche del contorno occhi, evidenti soprattutto quando si sorride." },
    { title: "Espressività da preservare", description: "Obiettivo medico di attenuare le rughe dinamiche mantenendo naturalezza ed espressività." },
  ],
  "medicina-rigenerativa": [
    { title: "Declino della qualità tissutale", description: "Tessuti che perdono progressivamente struttura, elasticità e funzionalità." },
    { title: "Necessità di sostegno rigenerativo", description: "Protocolli medici per accompagnare i processi fisiologici di rigenerazione." },
    { title: "Invecchiamento delle strutture cutanee", description: "Approccio orientato alla salute della pelle, oltre al solo risultato estetico." },
    { title: "Recupero del trofismo dei tessuti", description: "Miglioramento globale della qualità dei tessuti valutato caso per caso dal medico." },
  ],
  "peeling-medicali": [
    { title: "Macchie e discromie", description: "Iperpigmentazioni e segni del fotoinvecchiamento che rendono il colorito non uniforme." },
    { title: "Texture irregolare", description: "Superficie cutanea ruvida e spenta, con perdita di luminosità." },
    { title: "Imperfezioni e segni dell'acne", description: "Esiti cicatriziali superficiali e imperfezioni cutanee selezionabili dal medico." },
    { title: "Fotoinvecchiamento", description: "Segni precoci e cumulativi dell'esposizione solare, con esfoliazione controllata e progressiva." },
  ],
  "prx": [
    { title: "Perdita di luminosità", description: "Pelle opaca e spenta che desidera ritrovare luce senza trattamenti invasivi." },
    { title: "Compattezza ridotta", description: "Mancanza di tono e texture irregolare su viso, collo e décolleté." },
    { title: "Paura degli aghi", description: "Biostimolazione cutanea senza aghi, delicata e adatta anche a chi teme i trattamenti iniettivi." },
    { title: "Esigenza di zero downtime", description: "Percorso non invasivo che consente di tornare subito alle attività quotidiane." },
  ],
  "cryoliposculpt": [
    { title: "Adiposità localizzate resistenti", description: "Accumuli adiposi su addome e fianchi che non rispondono a dieta ed esercizio fisico." },
    { title: "Culotte de cheval e interno coscia", description: "Zone tipicamente femminili con accumuli localizzati difficili da rimodellare." },
    { title: "Area sottoglutea e banana roll", description: "Rilievi adiposi del distretto gluteo che alterano il profilo corporeo." },
    { title: "Ridefinizione non chirurgica del profilo", description: "Percorso medico non invasivo dedicato a ridefinire le forme delle aree trattate." },
  ],
  "carbossiterapia": [
    { title: "Cellulite e pelle a buccia d'arancia", description: "Inestetismo legato a microcircolo e qualità dei tessuti, su glutei, cosce e addome." },
    { title: "Microcircolo periferico rallentato", description: "Ristagno e scarsa ossigenazione dei tessuti nelle aree trattate." },
    { title: "Perdita di tono dei tessuti", description: "Sostegno alla qualità cutanea in protocolli dedicati al miglioramento dei tessuti." },
    { title: "Adiposità localizzate in protocollo combinato", description: "Integrazione medica con altri trattamenti per il rimodellamento corporeo personalizzato." },
  ],
  "mesoterapia": [
    { title: "Cellulite e ritenzione idrica", description: "Gonfiore e inestetismo cutaneo su gambe, glutei e addome." },
    { title: "Gambe pesanti", description: "Sensazione di pesantezza legata al microcircolo, soprattutto nei mesi caldi." },
    { title: "Texture cutanea da migliorare", description: "Qualità superficiale della pelle con microiniezioni superficiali mirate." },
    { title: "Adiposità localizzate iniziali", description: "Accumuli di lieve entità da inquadrare in un protocollo medico progressivo." },
  ],
  "intralipoterapia": [
    { title: "Piccole adiposità localizzate", description: "Accumuli circoscritti accuratamente selezionati dal medico in sede di visita." },
    { title: "Adiposità sottomentoniera", description: "Rilievo adiposo del collo che appesantisce il profilo del volto." },
    { title: "Depositi resistenti a dieta e sport", description: "Aree che non rispondono ai protocolli nutrizionali e all'attività fisica." },
    { title: "Rimodellamento corporeo non chirurgico", description: "Approccio medico iniettivo per la riduzione mirata, senza chirurgia." },
  ],
  "ultrasuoni-cfu": [
    { title: "Lassità cutanea lieve o moderata", description: "Perdita di tono dei tessuti che desidera un approccio non chirurgico." },
    { title: "Sottomento e profilo mandibolare", description: "Definizione del contouring mandibolare e dell'area sottomentoniera." },
    { title: "Collo e viso con tono ridotto", description: "Stimolazione del rimodellamento del collagene a profondità selezionate." },
    { title: "Aree corporee da compattare", description: "Miglioramento di tono, compattezza e definizione sulle zone indicate dal medico." },
  ],
  "piattaforma-laser": [
    { title: "Macchie e pigmentazioni (QS NPP)", description: "Discromie e pigmentazioni selezionate trattate con tecnologia laser dedicata." },
    { title: "Texture e rughe sottili (Erbium:YAG)", description: "Resurfacing superficiale per una pelle più uniforme e levigata." },
    { title: "Rossori e fotodanneggiamento (CPL)", description: "Rossori diffusi, macchie solari e segni del danno solare cronico." },
    { title: "Cicatrici da acne e rughe (Laser CO₂)", description: "Resurfacing più profondo per cicatrici, texture e segni marcati." },
  ],
  "invisalign-adulti": [
    { title: "Affollamento dentale", description: "Denti storti o sovrapposti che compromettono igiene ed estetica del sorriso." },
    { title: "Diastemi e spazi interdentali", description: "Spazi tra i denti da chiudere con un allineamento graduale e controllato." },
    { title: "Malocclusione", description: "Rapporti scorretti tra le arcate da correggere con allineatori trasparenti." },
    { title: "Allineamento estetico discreto", description: "Percorso ortodontico quasi invisibile, compatibile con la vita professionale adulta." },
  ],
  "invisalign-adolescenti": [
    { title: "Allineamento in fase di crescita", description: "Intervento ortodontico nel momento evolutivo più favorevole." },
    { title: "Affollamento e spazi", description: "Denti storti o distanziati da correggere con allineatori dedicati agli adolescenti." },
    { title: "Overbite e overjet", description: "Morso profondo o sporgenza dell'arcata superiore da guidare nella crescita." },
    { title: "Estetica in età sociale", description: "Apparecchio trasparente che rispetta la vita sociale e scolastica." },
  ],
  "invisalign-bambini": [
    { title: "Malocclusioni precoci", description: "Intercettazione ortodontica dei problemi di morso nella dentizione mista." },
    { title: "Affollamento in prevenzione", description: "Guida dell'eruzione dentale per prevenire disallineamenti futuri." },
    { title: "Sviluppo delle arcate", description: "Sostegno alla crescita armonica di mascellare e mandibola." },
    { title: "Abitudini orali dannose", description: "Correzione di succhiamento, respirazione orale e deglutizione atipica." },
  ],
  "igiene": [
    { title: "Tartaro e placca batterica", description: "Accumuli che solo una detartrasi professionale può rimuovere." },
    { title: "Gengive che sanguinano", description: "Segni iniziali di infiammazione gengivale da trattare precocemente." },
    { title: "Alitosi", description: "Odore sgradevole persistente spesso legato a depositi batterici." },
    { title: "Macchie superficiali", description: "Discromie da caffè, tè e fumo che opacizzano lo smalto." },
  ],
  "conservativa": [
    { title: "Carie dentali", description: "Lesioni cariose da trattare con otturazioni estetiche conservative." },
    { title: "Erosione dello smalto", description: "Perdita di sostanza dentale legata ad abrasione o erosione acida." },
    { title: "Denti fratturati o usurati", description: "Ricostruzione di scheggiature e usura delle superfici masticatorie." },
    { title: "Sensibilità dentale", description: "Fastidio a caldo e freddo da inquadrare e trattare con terapia conservativa." },
  ],
  "endodonzia": [
    { title: "Pulpite profonda", description: "Infiammazione della polpa dentale con dolore intenso e persistente." },
    { title: "Ascesso dentale", description: "Infezione periapicale che richiede devitalizzazione e trattamento canalare." },
    { title: "Traumi dentali", description: "Lesioni della polpa conseguenti a eventi traumatici del dente." },
    { title: "Dolore dentale persistente", description: "Sintomatologia che richiede diagnosi endodontica e cura canalare." },
  ],
  "parodontologia": [
    { title: "Gengive infiammate", description: "Sanguinamento, rossore e gonfiore gengivale da trattare precocemente." },
    { title: "Recessioni gengivali", description: "Retrazione della gengiva con esposizione della radice dentale." },
    { title: "Mobilità dentale", description: "Perdita di stabilità dei denti legata al riassorbimento osseo." },
    { title: "Tasche parodontali", description: "Approfondimento del solco gengivale con accumulo batterico subgengivale." },
  ],
  "estetica-dentale": [
    { title: "Denti discromici", description: "Macchie e scolorimenti che rendono il sorriso spento." },
    { title: "Scheggiature e forme irregolari", description: "Contorni dentali asimmetrici da armonizzare." },
    { title: "Diastemi", description: "Spazi interdentali visibili che possono essere chiusi esteticamente." },
    { title: "Vecchie otturazioni antiestetiche", description: "Restauri metallici o datati da sostituire con materiali biocompatibili." },
  ],
  "implantologia": [
    { title: "Denti mancanti", description: "Edentulia singola o multipla da riabilitare con impianti osteointegrati." },
    { title: "Edentulia parziale o totale", description: "Riabilitazione protesica su impianti per restituire funzione masticatoria." },
    { title: "Protesi mobili instabili", description: "Dentiere da stabilizzare con ancoraggio implantare." },
    { title: "Prevenzione del riassorbimento osseo", description: "L'impianto sostiene l'osso alveolare preservando la struttura della mandibola." },
  ],
  "gnatologia-bruxismo-bite": [
    { title: "Bruxismo e serramento", description: "Digrignamento notturno e serramento che usurano i denti." },
    { title: "Dolori mandibolari e ATM", description: "Fastidi all'articolazione temporo-mandibolare con rumori e blocchi." },
    { title: "Cefalee muscolotensive", description: "Mal di testa e tensioni cervicali di origine masticatoria." },
    { title: "Usura dentale", description: "Consumo delle superfici occlusali da proteggere con bite personalizzato." },
  ],
};

const MEDICINA_FALLBACK_PROBLEMS: ProblemCard[] = [
  { title: "Qualità della pelle", description: "Luminosità, idratazione e texture cutanea da migliorare con un percorso medico personalizzato." },
  { title: "Tono e compattezza", description: "Sostegno dei tessuti e contrasto progressivo dei segni di lassità cutanea." },
  { title: "Inestetismi localizzati", description: "Aree specifiche di viso o corpo da trattare con tecnologie mediche selezionate." },
  { title: "Valutazione medica dedicata", description: "Ogni percorso comincia dall'ascolto e da un inquadramento clinico della persona." },
];

const ODONTOIATRIA_FALLBACK_PROBLEMS: ProblemCard[] = [
  { title: "Funzione masticatoria", description: "Recupero della corretta funzione di denti e arcate con terapie odontoiatriche mirate." },
  { title: "Estetica del sorriso", description: "Armonia e luminosità del sorriso valorizzate nel rispetto dell'anatomia." },
  { title: "Salute di denti e gengive", description: "Prevenzione e trattamento delle patologie orali con protocolli specialistici." },
  { title: "Valutazione odontoiatrica dedicata", description: "Ogni percorso comincia da una visita con il medico specialista." },
];

export function getTreatmentProblems(treatment: Treatment): ProblemCard[] {
  return (
    TREATMENT_PROBLEMS[treatment.slug] ??
    (treatment.category === "odontoiatria"
      ? ODONTOIATRIA_FALLBACK_PROBLEMS
      : MEDICINA_FALLBACK_PROBLEMS)
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helper condivisi
// ─────────────────────────────────────────────────────────────────────────

const PROBLEM_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  search: SearchCheck,
  leaf: Leaf,
  info: Info,
  heart: HeartHandshake,
  stethoscope: Stethoscope,
  clipboard: ClipboardList,
};

const TIMELINE_ICONS: LucideIcon[] = [ClipboardList, Sparkles, ShieldCheck];

type TimelineStep = { stepNumber: string; title: string; description: string };

const DEFAULT_TIMELINE: TimelineStep[] = [
  {
    stepNumber: "01",
    title: "Valutazione medica",
    description:
      "Inquadramento clinico, analisi delle condizioni di partenza e verifica delle controindicazioni.",
  },
  {
    stepNumber: "02",
    title: "Trattamento",
    description:
      "Esecuzione della seduta con protocollo personalizzato, definito dal medico in fase di valutazione.",
  },
  {
    stepNumber: "03",
    title: "Indicazioni e monitoraggio post-seduta",
    description:
      "Indicazioni per la gestione dei giorni successivi e controlli programmati per monitorare la risposta.",
  },
];

function getTimelineSteps(treatment: Treatment): TimelineStep[] {
  if (treatment.timelineSteps?.length) {
    return treatment.timelineSteps.map((s, i) => ({
      stepNumber: s.stepNumber ?? String(i + 1).padStart(2, "0"),
      title: s.title,
      description: s.description,
    }));
  }
  if (treatment.steps?.length) {
    return treatment.steps.map((s, i) => ({
      stepNumber: String(i + 1).padStart(2, "0"),
      title: s.title,
      description: s.description,
    }));
  }
  return DEFAULT_TIMELINE;
}

/** Articolo determinativo corretto davanti al nome del trattamento. */
function withArticle(name: string): string {
  const lower = name.toLowerCase().trim();
  return /^[aeiouàèéìòù]/.test(lower) ? `l'${lower}` : `il ${lower}`;
}

function scrollToLead() {
  document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" });
}

function categoryLabel(treatment: Treatment): string {
  return treatment.category === "odontoiatria" ? "ODONTOIATRIA" : "MEDICINA ESTETICA";
}

function heroFallbackImage(treatment: Treatment): string {
  return treatment.category === "odontoiatria"
    ? "/images/dental-operatory.jpg"
    : "/images/aesthetic-skin.jpg";
}

// ─────────────────────────────────────────────────────────────────────────
// Trattamento — Layout standardizzato SEO a 8 blocchi (spec Silvia Monticelli)
// ─────────────────────────────────────────────────────────────────────────

export function TreatmentClient({ treatment }: { treatment: Treatment }) {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === `/trattamenti/${treatment.slug}`);
  const canvasMode = page?.canvasMode ?? false;

  // Il titolo clinico e i testi provengono dalla scheda o dall'override del CMS/SEO backend
  const h1 = page?.h1 || treatment.title;
  const intro = page?.h2 || treatment.tagline || treatment.description;
  const heroImage = page?.heroImage || treatment.heroImage || heroFallbackImage(treatment);
  const faq = page?.faq?.length ? page.faq : treatment.faq ?? [];

  if (canvasMode) {
    // Modalità Canvas No-Menu per Google Ads: nessun menu di navigazione globale,
    // così i crawler non raggiungono pagine con termini policy-sensitive.
    return (
      <div className="min-h-screen bg-canvas">
        <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/80 backdrop-blur-md">
          <Container className="flex h-16 items-center justify-between">
            <Link href="/">
              <Logo variant="dark" />
            </Link>
            <Button size="sm" onClick={scrollToLead}>
              Prenota una visita
            </Button>
          </Container>
        </header>
        <main>
          <HeroSection treatment={treatment} h1={h1} intro={intro} heroImage={heroImage} />
          <WhatIsSection treatment={treatment} />
          <ProblemsSection treatment={treatment} />
          <TimelineSection treatment={treatment} />
          <ResultsSection treatment={treatment} />
          <LeadSection treatment={treatment} />
          <FaqSection faq={faq} />
          <LocalSeoSection treatment={treatment} />
        </main>
        <StickyMobileCtaBar />
      </div>
    );
  }

  return (
    <>
      <main className="pb-20 md:pb-0">
        {/* 1 — Hero */}
        <HeroSection treatment={treatment} h1={h1} intro={intro} heroImage={heroImage} />
        {/* 2 — Che cos'è e come funziona? */}
        <WhatIsSection treatment={treatment} />
        {/* 3 — A cosa serve? (4 card problema/inestetismo) */}
        <ProblemsSection treatment={treatment} />
        {/* 4 — Come si svolge una seduta? (timeline 3 step) */}
        <TimelineSection treatment={treatment} />
        {/* 5 — Quali risultati aspettarsi? */}
        <ResultsSection treatment={treatment} />
        {/* 6 — Form lead dedicato */}
        <LeadSection treatment={treatment} />
        {/* 7 — Domande frequenti */}
        <FaqSection faq={faq} />
        {/* 8 — Geo-Local SEO Napoli */}
        <LocalSeoSection treatment={treatment} />
        <div className="bg-canvas pb-8">
          <Container>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy"
            >
              <ArrowLeft className="h-4 w-4" /> Torna alla home
            </Link>
          </Container>
        </div>
      </main>
      <StickyMobileCtaBar />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 1 — Hero Section (2 colonne desktop / stack mobile)
// ─────────────────────────────────────────────────────────────────────────

function HeroSection({
  treatment,
  h1,
  intro,
  heroImage,
}: {
  treatment: Treatment;
  h1: string;
  intro: string;
  heroImage?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas pb-16 pt-10 sm:pb-20 sm:pt-14">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna testo: su mobile sotto l'immagine, su desktop colonna sinistra */}
          <div className="order-last lg:order-first">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              {treatment.whatIs?.overline ?? categoryLabel(treatment)}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-dark-navy sm:text-5xl lg:text-6xl">
              {h1}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-charcoal/80">{intro}</p>

            <div className="mt-8">
              <button
                type="button"
                onClick={scrollToLead}
                className="inline-flex items-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(3,53,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900"
              >
                Richiedi una valutazione <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Colonna immagine: su mobile in cima ("Image-First"), su desktop colonna destra */}
          <div className="order-first lg:order-last relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] shadow-xl sm:aspect-[4/5] lg:mx-0 lg:max-w-none">
            <Image
              src={heroImage ?? treatment.heroImage ?? heroFallbackImage(treatment)}
              alt={treatment.title}
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

function QuickCard({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href?: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-teal-900">{title}</span>
        <span className="block truncate text-xs text-charcoal/60">{subtitle}</span>
      </span>
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-teal-400" />
    </>
  );
  const classes =
    "group flex items-center gap-3.5 rounded-2xl border border-teal-100 bg-white p-4 transition-all duration-300 hover:border-teal-300 hover:shadow-md";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <div className={classes}>{inner}</div>;
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 2 — "Che cos'è e come funziona?"
// ─────────────────────────────────────────────────────────────────────────

function WhatIsSection({ treatment }: { treatment: Treatment }) {
  const whatIs = treatment.whatIs;
  const title =
    whatIs?.title ??
    `Che cos'è ${withArticle(treatment.title)} e come funziona?`;

  const paragraphs = whatIs?.paragraphs?.length
    ? whatIs.paragraphs
    : whatIs?.description
      ? [whatIs.description]
      : [treatment.description];

  const callout =
    whatIs?.callout ??
    (treatment.category === "odontoiatria"
      ? "Materiali, tecnologie e protocolli vengono selezionati dal medico in base alla situazione clinica individuale e agli obiettivi definiti durante la valutazione."
      : "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.");

  return (
    <section className="bg-canvas py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna sinistra — immagine gesto medico / tecnologia */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src={whatIs?.image ?? "/images/laser-technology.jpg"}
              alt={`${treatment.title} — come funziona`}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>

          {/* Colonna destra — testi + callout */}
          <div>
            {whatIs?.overline && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-800">
                {whatIs.overline}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
              {title}
            </h2>
            <div className="mt-5 space-y-4">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-base leading-relaxed text-charcoal/75">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-teal-200/80 bg-teal-50/80 p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Info className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm leading-relaxed text-teal-900/85">{callout}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 3 — "A cosa serve?" (griglia 2x2 di 4 card)
// ─────────────────────────────────────────────────────────────────────────

function ProblemsSection({ treatment }: { treatment: Treatment }) {
  const problems: ProblemCard[] = treatment.problemsGrid?.length
    ? treatment.problemsGrid
    : getTreatmentProblems(treatment);

  const subtitle =
    treatment.category === "odontoiatria"
      ? "Il medico valuta se il percorso è indicato per queste condizioni, definendo obiettivi realistici e personalizzati durante la visita."
      : "Il medico valuta se il trattamento è indicato per queste condizioni, definendo obiettivi realistici e personalizzati durante la valutazione.";

  return (
    <section className="bg-teal-50/50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            A cosa serve {withArticle(treatment.title)}?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">{subtitle}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {problems.slice(0, 4).map((p) => {
            const Icon = PROBLEM_ICONS[p.icon ?? ""] ?? Sparkles;
            return (
              <div
                key={p.title}
                className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-6 transition-shadow duration-300 hover:shadow-md"
              >
                <span className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-bold text-teal-900">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
                    {p.description}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-400" />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 4 — "Come si svolge una seduta?" (timeline 3 step)
// ─────────────────────────────────────────────────────────────────────────

function TimelineSection({ treatment }: { treatment: Treatment }) {
  const steps = getTimelineSteps(treatment).slice(0, 3);

  const note = treatment.timelineNote ??
    (treatment.category === "odontoiatria"
      ? {
          title: "Ogni sorriso è diverso",
          text: "Il medico valuta la risposta individuale e definisce l'eventuale necessità di ulteriori sedute o controlli nel tempo.",
        }
      : {
          title: "Ogni pelle è diversa",
          text: "Il medico valuta la risposta della pelle e definisce l'eventuale necessità di ulteriori sedute.",
        });

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            Come si svolge una seduta di {withArticle(treatment.title)}?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
            Nel nostro centro, il trattamento viene definito in base alle condizioni{" "}
            {treatment.category === "odontoiatria"
              ? "cliniche"
              : "della pelle"}{" "}
            e agli obiettivi individuali durante la valutazione medica.
          </p>
        </div>

        {/* Timeline — verticale su mobile, orizzontale su desktop */}
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => {
            const Icon = TIMELINE_ICONS[i] ?? Sparkles;
            return (
              <div key={step.stepNumber} className="relative flex gap-5 md:block">
                {/* Linea di collegamento verticale (mobile) */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-14 h-[calc(100%-2rem)] w-px bg-teal-100 md:hidden"
                  />
                )}
                <div className="flex shrink-0 items-center gap-3 md:mb-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 font-serif text-base font-bold text-teal-700">
                    {step.stepNumber}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                </div>
                <div className="md:mt-0">
                  <h3 className="font-serif text-xl font-semibold text-teal-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Box finale rassicurante */}
        <div className="mx-auto mt-12 flex max-w-3xl items-start gap-4 rounded-2xl border border-teal-100 bg-teal-50/60 p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-serif text-lg font-semibold text-teal-900">{note.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-charcoal/70">{note.text}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCCO 5 — "Quali risultati aspettarsi?"
// ─────────────────────────────────────────────────────────────────────────

function ResultsSection({ treatment }: { treatment: Treatment }) {
  const results = treatment.results;
  const title = results?.title ?? `${treatment.title}: quali risultati aspettarsi?`;

  const paragraphs = results?.paragraphs?.length
    ? results.paragraphs
    : results?.description
      ? [results.description]
      : treatment.category === "odontoiatria"
        ? [
            "I risultati dipendono dalla situazione clinica di partenza, dalla risposta individuale e dal percorso definito dal medico specialista.",
            "Controlli periodici e una corretta igiene domiciliare aiutano a mantenere nel tempo i risultati ottenuti.",
            "La valutazione medica consente di definire obiettivi realistici e il protocollo più appropriato per il singolo caso.",
          ]
        : [
            "I risultati dipendono dalle condizioni iniziali della pelle, dalla risposta individuale e dal protocollo definito dal medico.",
            "Un percorso di mantenimento personalizzato aiuta a preservare nel tempo i risultati ottenuti.",
            "La valutazione medica consente di definire obiettivi realistici e il trattamento più appropriato per le caratteristiche della tua pelle.",
          ];

  return (
    <section className="bg-canvas py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Colonna sinistra — immagine risultato */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src={results?.image ?? "/images/doctor-consultation.jpg"}
              alt={`${treatment.title} — risultati`}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>

          {/* Colonna destra — trasparenza clinica */}
          <div>
            {results?.overline && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-800">
                {results.overline}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
              {title}
            </h2>
            <div className="mt-5 space-y-4">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-base leading-relaxed text-charcoal/75">
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
// BLOCCO 6 — Form Lead dedicato (#lead)
// ─────────────────────────────────────────────────────────────────────────

type ContactPreference = "Email" | "WhatsApp" | "Telefono";

const CONTACT_OPTIONS: { value: ContactPreference; icon: LucideIcon }[] = [
  { value: "Email", icon: Mail },
  { value: "WhatsApp", icon: MessageCircle },
  { value: "Telefono", icon: Phone },
];

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
  const title =
    treatment.leadForm?.title ?? `Hai domande su ${withArticle(treatment.title)}?`;
  const subtitle =
    treatment.leadForm?.subtitle ??
    "Lasciaci i tuoi contatti: il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica, senza impegno.";

  const inputClass =
    "w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !form.nome.trim() ||
      !form.cognome.trim() ||
      !form.telefono.trim() ||
      !form.email.trim() ||
      !form.privacy
    ) {
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
    <section id="lead" className="scroll-mt-20 bg-canvas py-16 sm:py-20">
      <Container>
        <div className="rounded-[2.5rem] border border-teal-200/70 bg-gradient-to-br from-teal-50/80 via-white to-teal-50/50 p-8 shadow-lg sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Colonna sinistra — messaggio rassicurante */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                {overline}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/75">{subtitle}</p>
              <div className="mt-6 flex items-start gap-3 text-sm text-charcoal/65">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <p>
                  I tuoi dati sono trattati nel rispetto della normativa privacy. Potrai
                  scegliere il canale di contatto che preferisci.
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
                    {form.contatto === "Email" && " via email"} per confermare la tua
                    valutazione medica.
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

                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-xs font-medium text-teal-900">
                      Email *
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="nome@esempio.it"
                      required
                      className={inputClass}
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-xs font-medium text-teal-900">
                      Telefono *
                    </span>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      placeholder="+39 ..."
                      required
                      className={inputClass}
                    />
                  </label>

                  <fieldset className="mt-5">
                    <legend className="mb-2 block text-xs font-medium text-teal-900">
                      Come preferisci essere contattato?
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {CONTACT_OPTIONS.map(({ value, icon: Icon }) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                            form.contatto === value
                              ? "border-teal-600 bg-teal-50 text-teal-900"
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
                      Desidero ricevere comunicazioni e aggiornamenti personalizzati su
                      WhatsApp da Cocoora
                    </span>
                  </label>

                  {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(3,53,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900"
                  >
                    Richiedi ora <ArrowRight className="h-4 w-4" />
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

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
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
    "Nel nostro centro a Napoli, in Via Generale Giovanni De Bonis 81 (Posillipo/Fuorigrotta), ogni percorso comincia da una valutazione medica personalizzata. Una posizione centrale e facilmente raggiungibile in auto e con i mezzi pubblici, con parcheggio nelle vicinanze.";

  return (
    <section className="bg-canvas py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-[2.5rem] border border-teal-100 bg-white shadow-[0_24px_60px_-32px_rgba(3,53,75,0.35)]">
          <div className="grid lg:grid-cols-2">
            {/* Sinistra — foto panorama / centro */}
            <div className="relative min-h-[260px] w-full lg:min-h-full">
              <Image
                src={localSeo?.image ?? "/images/hero-clinic.jpg"}
                alt={`${title} — Il Centro Cocoora`}
                fill
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover"
              />
            </div>

            {/* Destra — testo + CTA */}
            <div className="p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                {overline}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/75">
                {description}
              </p>

              <div className="mt-6 space-y-3">
                <p className="flex items-start gap-3 text-sm text-charcoal/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  {SITE.fullAddress}
                </p>
                <p className="flex items-start gap-3 text-sm text-charcoal/70">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  {SITE.phone} — Lun–Ven 8:00–20:00 (orario continuato), Sab 9:00–14:00
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={scrollToLead}
                  className="inline-flex items-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(3,53,75,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900"
                >
                  Richiedi una valutazione <ArrowRight className="h-4 w-4" />
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
// Sticky CTA mobile — smooth scroll all'ancora #lead (senza popup)
// ─────────────────────────────────────────────────────────────────────────

function StickyMobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-100 bg-white/95 p-3 shadow-[0_-10px_25px_-5px_rgba(3,53,75,0.15)] backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={scrollToLead}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dark-navy px-8 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-teal-900"
      >
        Richiedi una valutazione <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
