"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cpu,
  GraduationCap,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { useCms } from "@/components/providers";
import { getDoctorsByTreatment } from "@/lib/doctors";
import { CLUB_TIERS } from "@/lib/club";
import { SITE } from "@/lib/site";
import type { Treatment } from "@/lib/types";
import { trackLead } from "@/lib/tracking";
import { formatPrice } from "@/lib/utils";
import { Badge, Button, Container, SectionLabel } from "@/components/ui";
import { Logo } from "@/components/logo";

const PAYOFF = "La tua bellezza valorizzata nella sua forma più autentica — Naturally You.";

type ProblemCard = { title: string; description: string };

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

export function TreatmentClient({ treatment }: { treatment: Treatment }) {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === `/trattamenti/${treatment.slug}`);
  const canvasMode = page?.canvasMode ?? false;

  const h1 = page?.h1 ?? treatment.title;
  const h2 = page?.h2 ?? treatment.tagline;

  if (canvasMode) {
    return (
      <div className="min-h-screen bg-canvas">
        <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/80 backdrop-blur-md">
          <Container className="flex h-16 items-center justify-between">
            <Link href="/">
              <Logo variant="dark" />
            </Link>
            <Button size="sm" onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}>
              Prenota una visita
            </Button>
          </Container>
        </header>
        <CanvasContent treatment={treatment} h1={h1} h2={h2} faq={page?.faq ?? treatment.faq} />
      </div>
    );
  }

  const heroImage =
    treatment.category === "odontoiatria" ? "/images/dental-operatory.jpg" : "/images/aesthetic-skin.jpg";

  return (
    <>
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src={heroImage}
          alt={treatment.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Velo scuro leggero in alto per la leggibilità della navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
      </div>

      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12">
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Colonna testo */}
            <div className="text-center lg:text-left">
              <Badge className="lg:mx-0 mx-auto shadow-sm">
                {treatment.category === "odontoiatria" ? "Odontoiatria" : "Medicina Estetica"}
              </Badge>
              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-dark-navy sm:text-5xl lg:text-6xl">
                {h1}
              </h1>
              {treatment.category === "medicina-estetica" && (
                <p className="mt-3 font-serif text-lg italic text-teal-800">{PAYOFF}</p>
              )}
              <p className="mt-5 text-lg leading-relaxed text-charcoal/75">{h2}</p>
              <div className="mt-9">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Richiedi informazioni <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Colonna foto / media */}
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-teal-100 shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src={heroImage}
                alt={treatment.title}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/30 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>
      <TreatmentBody treatment={treatment} faq={page?.faq ?? treatment.faq} />
      <StickyMobileCtaBar />
    </>
  );
}

function TreatmentBody({
  treatment,
  faq,
}: {
  treatment: Treatment;
  faq: { q: string; a: string }[];
}) {
  const problems = getTreatmentProblems(treatment);

  return (
    <>
      <section className="bg-canvas py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Il Trattamento</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                In cosa consiste
              </h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/75">
                {treatment.description}
              </p>
            </div>
            <div className="space-y-4">
              {treatment.steps.map((s, i) => (
                <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 font-serif text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-teal-900">{s.title}</p>
                    <p className="mt-1 text-sm text-charcoal/65">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {treatment.machines && treatment.machines.length > 0 && (
            <div className="mt-14 rounded-3xl border border-teal-100 bg-teal-50/50 p-8">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-teal-700" />
                <h3 className="font-serif text-xl font-semibold text-teal-900">Tecnologie e macchinari</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {treatment.machines.map((m) => (
                  <span key={m} className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 4 Card H2 — Problema / Inestetismo affrontato */}
      <section className="bg-teal-50/60 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Indicazioni Cliniche</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
              Quali inestetismi ed esigenze affronta {treatment.title}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => (
              <div
                key={p.title}
                className="flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold text-teal-900">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">{p.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <DoctorAndClubBox treatment={treatment} />

      <LeadSection />
      <FaqSection faq={faq} />
      <LocalNapoliSection treatment={treatment} />
      <div className="bg-canvas pb-24 md:pb-20">
        <Container>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy">
            <ArrowLeft className="h-4 w-4" /> Torna alla home
          </Link>
        </Container>
      </div>
    </>
  );
}

function CanvasContent({
  treatment,
  h1,
  h2,
  faq,
}: {
  treatment: Treatment;
  h1: string;
  h2: string;
  faq: { q: string; a: string }[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-serif text-4xl font-semibold leading-tight text-dark-navy sm:text-5xl">{h1}</h1>
      <p className="mt-4 text-lg text-charcoal/75">{h2}</p>
      <p className="mt-6 text-base leading-relaxed text-charcoal/75">{treatment.description}</p>

      <h2 className="mt-10 font-serif text-2xl font-semibold text-teal-900">Come funziona</h2>
      <div className="mt-5 space-y-4">
        {treatment.steps.map((s, i) => (
          <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 font-serif text-sm font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-teal-900">{s.title}</p>
              <p className="mt-1 text-sm text-charcoal/65">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      <DoctorAndClubBox treatment={treatment} />
      <LeadSection />
      <FaqSection faq={faq} />
    </main>
  );
}

function DoctorAndClubBox({ treatment }: { treatment: Treatment }) {
  const doctors = getDoctorsByTreatment(treatment.slug);
  const doctor = doctors[0];
  const recommendedTierId = doctor?.clubTierIds.find((id) => id !== "discover");
  const recommendedTier = recommendedTierId
    ? CLUB_TIERS.find((t) => t.id === recommendedTierId)
    : undefined;

  if (!doctor && !recommendedTier) return null;

  return (
    <section className="bg-teal-50/60 py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          {doctor && (
            <Link
              href={`/medici/${doctor.slug}`}
              className="group flex items-center gap-5 rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <Image src={doctor.image} alt={doctor.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-accent">
                  Specialista consigliato
                </p>
                <p className="mt-1 font-serif text-lg font-semibold leading-tight text-teal-900">
                  {doctor.name}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/60">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-accent" /> {doctor.branca}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                  Vedi profilo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )}

          {recommendedTier && (
            <Link
              href={`/club/${recommendedTier.id}`}
              className="group flex items-center gap-5 rounded-3xl border border-teal-200 bg-dark-navy p-6 text-white shadow-[0_16px_40px_-28px_rgba(3,53,75,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-slate-accent">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-accent">
                  Vantaggio Cocoora Club
                </p>
                <p className="mt-1 font-serif text-lg font-semibold leading-tight">
                  Compreso o scontato con {recommendedTier.name}
                </p>
                <p className="mt-1 text-xs text-teal-200/80">
                  Da {formatPrice(recommendedTier.price)}/anno — continuità di cura senza attese
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-all group-hover:gap-2.5">
                  Scopri il pacchetto <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}

type ContactPreference = "Email" | "WhatsApp" | "Telefono";

const CONTACT_OPTIONS: ContactPreference[] = ["Email", "WhatsApp", "Telefono"];

function LeadSection() {
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
    <section id="lead" className="bg-teal-50/60 py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_24px_60px_-28px_rgba(3,53,75,0.4)] backdrop-blur-md sm:p-10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">Richiesta inviata</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Grazie {form.nome}! Ti ricontatteremo a breve{form.contatto === "WhatsApp" && " su WhatsApp"}
                {form.contatto === "Telefono" && " telefonicamente"}
                {form.contatto === "Email" && " via email"} per confermare la tua valutazione medica.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">Richiedi informazioni</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Lascia i tuoi dati e il nostro team ti ricontatterà per una valutazione medica.
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-teal-900">Nome *</span>
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
                    <span className="mb-1.5 block text-xs font-medium text-teal-900">Cognome *</span>
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
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-teal-900">Telefono *</span>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+39 ..."
                    required
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-teal-900">Email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nome@esempio.it"
                    required
                    className={inputClass}
                  />
                </label>

                <fieldset>
                  <legend className="mb-2 block text-xs font-medium text-teal-900">
                    Preferenza di contatto
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {CONTACT_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          form.contatto === option
                            ? "border-teal-600 bg-teal-50 text-teal-900"
                            : "border-teal-200 bg-white text-charcoal/70 hover:border-teal-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="contatto"
                          value={option}
                          checked={form.contatto === option}
                          onChange={() => setForm({ ...form, contatto: option })}
                          className="h-3.5 w-3.5 text-teal-600 focus:ring-teal-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="flex items-start gap-3 text-sm text-charcoal/70">
                  <input
                    type="checkbox"
                    checked={form.privacy}
                    onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    Ho letto l&apos;
                    <Link href="/contatti" className="font-medium text-teal-800 underline underline-offset-2 hover:text-dark-navy">
                      informativa sulla privacy
                    </Link>{" "}
                    e acconsento al trattamento dei dati personali *
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm text-charcoal/70">
                  <input
                    type="checkbox"
                    checked={form.whatsappConsent}
                    onChange={(e) => setForm({ ...form, whatsappConsent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    Desidero ricevere comunicazioni e aggiornamenti personalizzati su
                    WhatsApp da Cocoora
                  </span>
                </label>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" size="lg">
                  Invia richiesta
                </Button>
              </form>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (faq.length === 0) return null;
  return (
    <section className="bg-canvas py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>Domande Frequenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900">FAQ</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-teal-100 bg-white p-6">
                <summary className="cursor-pointer list-none font-medium text-teal-900">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function LocalNapoliSection({ treatment }: { treatment: Treatment }) {
  const branch = treatment.category === "odontoiatria" ? "Odontoiatria" : "Medicina Estetica";

  return (
    <section className="bg-teal-50/60 py-20">
      <Container>
        <div className="rounded-[2rem] border border-teal-100 bg-white p-8 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] sm:p-10">
          <SectionLabel>Il Centro a Napoli</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            {branch} di precisione a Napoli — Via De Bonis 81 (Posillipo/Fuorigrotta)
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/75">
            Cocoora Studio Medico Polispecialistico ti accoglie in Via Generale Giovanni
            De Bonis 81 a Napoli, tra Posillipo e Fuorigrotta: una posizione centrale e
            facilmente raggiungibile in auto e con i mezzi pubblici, con parcheggio nelle
            vicinanze.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <div>
                <p className="text-sm font-medium text-teal-900">Indirizzo</p>
                <p className="mt-1 text-sm text-charcoal/65">{SITE.fullAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <div>
                <p className="text-sm font-medium text-teal-900">Telefono</p>
                <p className="mt-1 text-sm text-charcoal/65">{SITE.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <div>
                <p className="text-sm font-medium text-teal-900">Orari</p>
                <p className="mt-1 text-sm text-charcoal/65">{SITE.hours}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}>
              Richiedi informazioni <ArrowRight className="h-4 w-4" />
            </Button>
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white/70 px-8 py-4 text-base font-medium text-teal-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-white"
            >
              Come raggiungerci <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StickyMobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-100 bg-white/95 p-3 shadow-[0_-10px_25px_-5px_rgba(3,53,75,0.15)] backdrop-blur-md md:hidden">
      <Button
        className="w-full"
        size="lg"
        onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}
      >
        Richiedi Informazioni
      </Button>
    </div>
  );
}
