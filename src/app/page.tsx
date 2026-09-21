"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  HeartHandshake,
  Instagram,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useCms, useShop } from "@/components/providers";
import {
  INSTAGRAM_POSTS,
  MANIFESTO,
  NAV_NODES,
  TRUST_METRICS,
} from "@/lib/site";
import { SHOWROOM_TILES } from "@/lib/clinic";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";
import { ClubShowcase } from "@/components/sections/club-showcase";
import { ReelsSection } from "@/components/sections/reels";

const ECOSYSTEM_FEATURES = [
  {
    id: "registrazione",
    icon: UserRound,
    title: "Registrazione in 2 min",
    description:
      "Crea il tuo profilo sanitario digitale in pochi minuti, direttamente dall'app Cocoora.",
  },
  {
    id: "prenotazione",
    icon: CalendarDays,
    title: "Specialista, sede e orario",
    description:
      "Scegli lo specialista, la sede e l'orario più comodi per te, in un unico click.",
  },
  {
    id: "referti",
    icon: FileText,
    title: "Referti digitali sempre con te",
    description:
      "Consulta referti e documenti in un'area riservata sicura, disponibile 24/7.",
  },
];

const PILLARS = NAV_NODES.find((n) => n.label === "Servizi")?.children ?? [];

export default function HomePage() {
  const { pages } = useCms();
  const { openDiscover } = useShop();
  const home = pages.find((p) => p.path === "/");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge className="lg:mx-0 mx-auto">
                Studio Medico Polispecialistico d&apos;Eccellenza — Milano
              </Badge>
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl lg:text-6xl xl:text-7xl">
                {home?.h1 ?? "Connessi alla tua salute."}
              </h1>
              <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-charcoal/75 lg:mx-0">
                Abbiamo azzerato attese, burocrazia e complessità per permetterti di
                vivere un percorso di salute fluido e immediato. La tua salute merita
                attenzione, dedizione e, soprattutto, nessun ostacolo.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" onClick={openDiscover}>
                  Inizia gratis con il Club <Plus className="h-4 w-4" />
                </Button>
                <ButtonLink href="/contatti" variant="secondary" size="lg">
                  Prenota Visita
                </ButtonLink>
              </div>

              <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-3 sm:gap-4 lg:mx-0">
                {TRUST_METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="glass rounded-2xl border border-white/60 px-4 py-5 shadow-[0_16px_40px_-24px_rgba(3,53,75,0.4)]"
                  >
                    <p className="font-serif text-2xl font-semibold text-teal-800 sm:text-3xl">
                      {m.value}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-charcoal/60">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-30px_rgba(3,53,75,0.45)]">
                <Image
                  src="/images/hero-clinic.jpg"
                  alt="Reception della clinica Cocoora a Milano"
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/30 via-transparent to-transparent" />
              </div>
              <div className="glass absolute -bottom-6 -left-6 hidden max-w-[240px] rounded-2xl border border-white/60 p-5 shadow-[0_24px_60px_-24px_rgba(3,53,75,0.4)] sm:block">
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="h-5 w-5 text-teal-700" />
                  <p className="text-sm font-semibold text-teal-900">Amico Medico</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/65">
                  Un punto di riferimento fidato, dalla prima visita a ogni fase del
                  tuo percorso di salute.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── L'Amico Medico & Manifesto ───────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.35)] lg:order-none">
              <Image
                src="/images/doctor-consultation.jpg"
                alt="Consulto medico empatico a Cocoora — l'Amico Medico"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
            </div>
            <div>
              <SectionLabel>L&apos;Amico Medico</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
                {home?.h2 ?? MANIFESTO.h2}
              </h2>
              <div className="mt-6 space-y-5">
                {MANIFESTO.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === MANIFESTO.paragraphs.length - 1
                        ? "border-l-2 border-teal-600 pl-5 font-serif text-xl italic leading-relaxed text-teal-800"
                        : "text-base leading-relaxed text-charcoal/75"
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-8">
                <ButtonLink href="/chi-siamo" variant="secondary">
                  Scopri il Metodo Cocoora <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Ecosistema Digitale ──────────────────────────────────────── */}
      <section id="ecosistema" className="relative overflow-hidden bg-teal-50/60 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Ecosistema Digitale</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Il tuo tempo, la nostra priorità
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Prenota, consulta, gestisci in un click. Il nostro ecosistema
              digitale trasforma il modo di accedere alle cure.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ECOSYSTEM_FEATURES.map((f, i) => {
              const Icon: LucideIcon = f.icon;
              return (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-3xl border border-white bg-white/70 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.35)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 font-serif text-2xl font-semibold text-teal-900">
                    <span className="mr-2 text-slate-accent">{String(i + 1).padStart(2, "0")}</span>
                    {f.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── I 3 Grandi Pilastri Clinici ──────────────────────────────── */}
      <section id="servizi" className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Le Nostre Aree</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              I 3 Pilastri Clinici Cocoora
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Una rete di professionisti d&apos;eccellenza pronta a rispondere a ogni
              tua esigenza, dalla prevenzione quotidiana alla diagnostica avanzata.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.href}
                href={pillar.href}
                className="group relative flex h-[420px] flex-col overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_70px_-24px_rgba(3,53,75,0.45)]"
              >
                {pillar.image && (
                  <Image
                    src={pillar.image}
                    alt={pillar.label}
                    fill
                    sizes="(min-width: 1024px) 400px, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/30 to-transparent" />
                <div className="relative mt-auto p-7 text-white">
                  <h3 className="font-serif text-2xl font-semibold leading-tight">
                    {pillar.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-teal-100/85">
                    {pillar.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-all group-hover:gap-2.5">
                    Scopri di più <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Tecnologie & Showroom ─────────────────────────────────────── */}
      <section className="bg-teal-50/60 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Tecnologie & Showroom</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Le tecnologie di punta Cocoora
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Ogni strumento è selezionato per garantire appropriatezza clinica,
              precisione diagnostica e risultati estetici armoniosi.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SHOWROOM_TILES.map((tile) => (
              <div
                key={tile.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    sizes="(min-width: 1024px) 280px, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-teal-900">
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                    {tile.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Cocoora Club & Precision Preview ─────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-navy py-24 text-white">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionLabel>Cocoora Club &amp; Precision</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Dalla prevenzione alla medicina predittiva
              </h2>
              <p className="mt-5 text-base leading-relaxed text-teal-200/85">
                Scegli il tuo percorso di membership, da <strong className="text-white">Discover</strong>{" "}
                (gratuito) a <strong className="text-white">Signature Longevity</strong>, oppure
                approfondisci la tua salute con test genetici DNA 5 e sequenziamento
                del microbiota, per una prevenzione realmente predittiva.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href="/club" variant="white" size="lg">
                  Scopri il Club <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/precision" variant="outline-dark" size="lg">
                  Scopri Precision
                </ButtonLink>
              </div>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/dna-genomics.jpg"
                alt="Genomica predittiva Cocoora Precision — doppia elica del DNA"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/60 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Reels Verticali ──────────────────────────────────────────── */}
      <ReelsSection />

      {/* ── Cocoora Club Showcase ────────────────────────────────────── */}
      <ClubShowcase />

      {/* ── Instagram Feed ───────────────────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <SectionLabel>Instagram</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                Segui il mondo Cocoora
              </h2>
            </div>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-dark-navy sm:inline-flex"
            >
              <Instagram className="h-4 w-4" /> @cocoora
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-teal-200 via-teal-400 to-teal-700"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram className="h-7 w-7 text-white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-dark-navy/80 p-3 text-xs text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                  {post.caption}
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ Clinica ──────────────────────────────────────────────── */}
      <FaqSection faq={home?.faq ?? []} />

      {/* ── CTA Finale ───────────────────────────────────────────────── */}
      <section id="contatti" className="bg-canvas pb-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-16 text-center text-white sm:px-16">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <Badge className="bg-white/15 text-white">
                <ShieldCheck className="h-3.5 w-3.5" /> Prenotazione senza attese
              </Badge>
              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Prenota il tuo primo check-up
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                In meno di 2 minuti, senza attese e senza burocrazia. Il tuo
                percorso di salute inizia qui.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={openDiscover}>
                  Inizia gratis <Plus className="h-4 w-4" />
                </Button>
                <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                  Prenota Visita
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
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
            <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
              Le domande più frequenti sui nostri servizi
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-teal-100 bg-white p-6 transition-colors open:border-teal-300"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-teal-900">
                  {f.q}
                  <Sparkles className="h-4 w-4 shrink-0 text-slate-accent transition-transform group-open:rotate-90" />
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
