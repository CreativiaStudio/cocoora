"use client";

/**
 * Pagina "Il Centro" — Cocoora Centro Medico (Napoli)
 *
 * Note di allineamento al Brand Vault (adattamenti rispetto al brief):
 * - Le statistiche non verificate ("18+ medici", "14 branche") sono state sostituite con dati certi.
 * - "0 Attese Burocratiche" è stato rimosso perché vietato ("Zero Attese").
 * - Le "4 card pilastri" diventano "La nostra filosofia" ("Pilastri" è vietato).
 * - La destinazione degli Studi segue la mappa CRM decisa nella call del 23/10.
 * - "Longevità e prevenzione predittiva" è formulato senza promettere score o diagnosi automatiche.
 * - La palette segue i colori ufficiali: #1C4A5C, #03354B, #80A1B2, #3D3D3C, #FFFFFF.
 * - I testi vanno sottoposti alla revisione di Silvia Monticelli prima della pubblicazione.
 */

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Container, Badge } from "@/components/ui";
import { useCms, useShop } from "@/components/providers";

const NAVY = "#03354B";
const TEAL = "#1C4A5C";
const SLATE = "#80A1B2";
const BODY = "#3D3D3C";

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

type Category = "accoglienza" | "studi" | "clinica";

interface Photo {
  src: string;
  title: string;
  caption: string;
  category: Category;
  span: string;
}

const CATEGORY_LABEL: Record<Category, string> = {
  accoglienza: "Accoglienza & Lounge",
  studi: "Studi Medici & Consulti",
  clinica: "Aree Cliniche & Tecnologia",
};

const PHOTOS: Photo[] = [
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-20.webp", title: "Reception", caption: "Il desk di accoglienza, dove la segreteria segue ogni paziente dall'arrivo alla visita.", category: "accoglienza", span: "md:col-span-2" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-3.webp", title: "Sala d'attesa", caption: "La sala d'attesa del centro.", category: "accoglienza", span: "" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-18.webp", title: "Accoglienza", caption: "La segreteria accoglie i pazienti e organizza appuntamenti e percorsi.", category: "accoglienza", span: "" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-14.webp", title: "Studio di consulto", caption: "Lo studio di consulto, in una vista frontale.", category: "studi", span: "md:col-span-2" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-5.webp", title: "Corridoio clinico", caption: "Il corridoio che collega gli ambienti clinici del centro.", category: "clinica", span: "md:col-span-2" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-8.webp", title: "Riunito odontoiatrico", caption: "La postazione odontoiatrica dello Studio 1.", category: "clinica", span: "md:row-span-2" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-7.webp", title: "Strumentazione", caption: "Un dettaglio della strumentazione clinica.", category: "clinica", span: "" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-4.webp", title: "Accoglienza", caption: "Uno scorcio dell'area di accoglienza.", category: "accoglienza", span: "" },
  { src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-2.webp", title: "Dettagli", caption: "Un dettaglio degli spazi comuni.", category: "accoglienza", span: "" },
];

const FILOSOFIA = [
  {
    icon: HeartHandshake,
    title: "Il tempo giusto per l'ascolto",
    text: "Ogni visita parte da un colloquio. Comprendere la persona, la sua storia e le sue esigenze è il primo atto di cura.",
  },
  {
    icon: Users,
    title: "Approccio multidisciplinare",
    text: "Medicina Estetica, Odontoiatria e Visite Specialistiche dialogano sotto un'unica Direzione Sanitaria, con un unico riferimento: il Centro.",
  },
  {
    icon: Sparkles,
    title: "Prevenzione nel tempo",
    text: "Con i Percorsi Salute del Cocoora Club, la prevenzione diventa un percorso consapevole, seguito con cura, nel tempo.",
  },
];

const STUDI = [
  {
    n: "Studio 1",
    title: "Odontoiatria e Ortodonzia",
    img: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-9.webp",
    text: "La postazione odontoiatrica fissa del centro, dedicata alla salute della bocca: dalla visita con OPT all'igiene orale, dall'ortodonzia con allineatori trasparenti alle cure conservative e implantari.",
  },
  {
    n: "Studio 2",
    title: "Medicina Estetica",
    img: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-6.webp",
    text: "Lo studio dedicato ai trattamenti per il corpo e la silhouette, tra cui la criolipolisi, gli ultrasuoni focalizzati e la carbossiterapia.",
  },
  {
    n: "Studio 3",
    title: "Medicina Estetica e Laser",
    img: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-10.webp",
    text: "Lo studio che ospita la piattaforma laser per i trattamenti di viso e pelle, oltre ai trattamenti di medicina estetica e rigenerativa.",
  },
  {
    n: "Studio 4",
    title: "Visite Specialistiche",
    img: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-11.webp",
    text: "Lo studio dedicato alle visite specialistiche e agli esami ecografici: oculistica, cardiologia, ginecologia ed ecografia.",
  },
];

export default function ChiSiamoPage() {
  const shop = useShop() as unknown as { openDiscover?: () => void; openBooking?: () => void };
  const { pages } = useCms();
  const page = pages.find((p) => p.path === "/chi-siamo");
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => (i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length)),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  const handleClub = () => {
    if (shop?.openDiscover) shop.openDiscover();
    else if (shop?.openBooking) shop.openBooking();
  };

  const current = active !== null ? PHOTOS[active] : null;
  const heroTitle =
    page?.h1 &&
    page.h1 !== "Connessi alla tua salute." &&
    page.h1 !== "Connessi alla tua salute"
      ? page.h1
      : "Connessi alla tua salute";
  const filosofiaTitle =
    page?.h2 && page.h2 !== "La salute ritrova il suo tempo"
      ? page.h2
      : "La tua salute, la nostra Attenzione";

  return (
    <main className="bg-white" style={{ color: BODY }}>
      {/* 1. HERO */}
      <section className="relative isolate flex min-h-[85vh] items-end overflow-hidden bg-dark-navy">
        <Image
          src="https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp"
          alt="L'ingresso di Cocoora Centro Medico a Napoli"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[center_16%]"
        />
        {/* Overlay direzionale marcato a sinistra sotto al testo e sfumato verso destra per far vedere la foto e il logo */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03354B]/95 via-[#03354B]/75 to-[#03354B]/20" />
        {/* Vignettatura verticale in testa e in fondo */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#03354B] via-transparent to-[#03354B]/40" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
        <Container className="w-full pb-16 pt-40 md:pb-24">
          <Badge className="mb-6 inline-flex border border-white/30 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
            Il Centro Medico · Napoli
          </Badge>
          <h1 className="max-w-4xl font-serif text-4xl leading-[1.05] text-white sm:text-5xl md:text-7xl">
            {heroTitle}
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-white/85 md:text-lg">
            <p>
              Cocoora è un centro medico che riunisce competenze, tecnologia e servizi dedicati alla
              salute e al benessere, in un ambiente accogliente e curato.
            </p>
            <p>
              Ascoltiamo le tue esigenze, ti aiutiamo a orientarti tra le prestazioni e curiamo
              l&apos;organizzazione degli appuntamenti. Selezioniamo i professionisti e favoriamo la
              collaborazione tra specialisti quando il tuo percorso richiede competenze diverse.
            </p>
            <p>
              L&apos;organizzazione e gli strumenti del centro sostengono il lavoro dei medici e
              facilitano l&apos;accesso alle cure. Dalla prenotazione alla visita, Cocoora è il tuo
              punto di riferimento, con informazioni chiare, attenzione alla tua riservatezza e
              rispetto per il tuo tempo.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. FILOSOFIA */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: SLATE }}>
              La nostra filosofia
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl" style={{ color: TEAL }}>
              {filosofiaTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Ascoltiamo le tue esigenze, ti aiutiamo a orientarti tra le prestazioni e curiamo
              l&apos;organizzazione degli appuntamenti. Selezioniamo i professionisti e favoriamo la
              collaborazione tra specialisti quando il tuo percorso richiede competenze diverse.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {FILOSOFIA.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="group rounded-3xl border bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: `${SLATE}40` }}
              >
                <div
                  className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${SLATE}22`, color: TEAL }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl" style={{ color: NAVY }}>
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. GALLERIA */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "#F5F8FA" }}>
        <Container>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: SLATE }}>
              Gli Spazi del Centro
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl" style={{ color: TEAL }}>
              Esplora il nostro centro
            </h2>
          </div>

          {/* Griglia simmetrica a 3 colonne, senza scritte sulla foto, con overlay di ingrandimento su hover */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PHOTOS.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setActive(i)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-teal-100/70 bg-slate-100 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/30"
                aria-label={`Ingrandisci foto: ${p.title}`}
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Overlay di ingrandimento al passaggio del mouse */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03354B]/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 p-4 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#03354B] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Maximize2 className="h-5 w-5" />
                  </span>
                  <span className="mt-3 rounded-full bg-[#03354B]/85 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                    Clicca per ingrandire
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* LIGHTBOX */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm md:p-10"
          style={{ backgroundColor: `${NAVY}F2` }}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6"
            aria-label="Foto precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6"
            aria-label="Foto successiva"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <figure className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-[16/10]">
              <Image src={current.src} alt={current.caption} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="mt-5 text-center text-white">
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "#C9DAE3" }}>
                {CATEGORY_LABEL[current.category]}
              </span>
              <p className="mt-2 font-serif text-2xl">{current.title}</p>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80">{current.caption}</p>
            </figcaption>
          </figure>
        </div>
      )}

      {/* 4. AMBIENTI CLINICI */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: SLATE }}>
              Gli ambienti clinici
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl" style={{ color: TEAL }}>
              Quattro studi, una sola regia clinica
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Nel nostro centro ogni studio ha una destinazione precisa.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {STUDI.map((s) => (
              <article
                key={s.n}
                className="group overflow-hidden rounded-3xl border bg-white"
                style={{ borderColor: `${SLATE}40` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.img}
                    alt={`${s.n} — ${s.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
                <div className="p-7 md:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: SLATE }}>
                    {s.n}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl" style={{ color: NAVY }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 leading-relaxed">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div
            className="mt-8 flex flex-col gap-4 rounded-3xl p-7 md:flex-row md:items-center md:p-9"
            style={{ backgroundColor: `${SLATE}1A` }}
          >
            <ShieldCheck className="h-8 w-8 shrink-0" style={{ color: TEAL }} strokeWidth={1.5} />
            <p className="leading-relaxed">
              <strong style={{ color: NAVY }}>Riservatezza e sicurezza.</strong> Le prenotazioni
              sono organizzate in modo che ogni studio e ogni apparecchiatura siano dedicati a un
              solo paziente alla volta, con il tempo necessario alla sanificazione tra una visita e
              l&apos;altra.
            </p>
          </div>
        </Container>
      </section>

      {/* 5. CTA FINALE */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border bg-white md:grid md:grid-cols-2" style={{ borderColor: `${SLATE}40` }}>
            <div className="relative min-h-[280px]">
              <Image
                src="https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-20.webp"
                alt="La reception di Cocoora Centro Medico"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: SLATE }}>
                Vieni a trovarci
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl" style={{ color: TEAL }}>
                Il tuo benessere senza ostacoli
              </h2>
              <ul className="mt-8 space-y-4">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: TEAL }} />
                  <span>Via Generale Giovanni De Bonis, 81 — 80123 Napoli (NA)</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: TEAL }} />
                  <span>
                    Lun–Ven 9:00–19:00 (Orario continuato)
                    <br />
                    Sabato chiuso
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0" style={{ color: TEAL }} />
                  <a href="tel:+390818182091" className="hover:underline">
                    081 18182091
                  </a>
                </li>
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleClub}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  Iscriviti gratuitamente al Cocoora Club
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="https://wa.me/3908118182091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-medium transition-colors hover:bg-slate-50"
                  style={{ borderColor: TEAL, color: TEAL }}
                >
                  Contatta la segreteria
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
