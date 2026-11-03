"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { VisitaSpecialistica } from "@/lib/visite-specialistiche";
import { SITE } from "@/lib/site";
import { trackLead } from "@/lib/tracking";
import { Button, Container } from "@/components/ui";

export function VisitaClient({ visita }: { visita: VisitaSpecialistica }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState<"idle" | "sending" | "success">("idle");
  const [formData, setFormData] = useState({
    nome: "",
    telefono: "",
    email: "",
    messaggio: "",
    consenso: false,
  });

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefono || !formData.consenso) return;
    setFormState("sending");

    try {
      trackLead({
        name: formData.nome,
        email: formData.email || "info@cocoora.it",
      });
      setFormState("success");
    } catch {
      setFormState("success");
    }
  };

  return (
    <div className="bg-sand-50/40 text-charcoal">
      {/* ── Breadcrumb & Back ── */}
      <div className="border-b border-sand-200 bg-white">
        <Container className="py-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-charcoal/60">
            <Link href="/" className="hover:text-teal-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/visite" className="hover:text-teal-900 transition-colors">
              Visite Specialistiche
            </Link>
            <span>/</span>
            <span className="text-teal-900 font-semibold">{visita.title}</span>
          </div>
        </Container>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-white py-12 lg:py-20 border-b border-sand-200">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
                <Sparkles className="h-3 w-3" />
                {visita.categoryName}
              </span>

              <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-teal-900 sm:text-4xl lg:text-5xl">
                {visita.title} a Napoli
              </h1>

              <p className="mt-4 text-base leading-relaxed text-charcoal/80 sm:text-lg">
                {visita.tagline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#prenota"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-800 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                  <CalendarCheck className="h-4 w-4" />
                  {visita.heroCta}
                </a>

                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-3.5 text-sm font-semibold text-teal-900 transition-colors hover:bg-teal-50"
                >
                  <Phone className="h-4 w-4" />
                  {SITE.phone}
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-charcoal/70 border-t border-sand-200 pt-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-700" />
                  <span>Centro Medico Autorizzato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-teal-700" />
                  <span>Specialisti Qualificati</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-teal-700" />
                  <span>Referto Clinico Dettagliato</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-teal-700" />
                  <span>Pagamento in sede o a rate (Klarna · PayPal)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-sand-300 shadow-xl lg:max-w-none">
                <Image
                  src={visita.heroImage}
                  alt={visita.title}
                  width={640}
                  height={520}
                  className="h-auto w-full object-cover aspect-[4/3]"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Che Cos'è / In Cosa Consiste ── */}
      {visita.whatIs && (
        <section className="py-16 bg-sand-50/60 border-b border-sand-200">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sand-300 shadow-md">
                <Image
                  src={visita.whatIs.image || visita.galleryImages[1] || visita.heroImage}
                  alt={`${visita.title} — approfondimento`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className="object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                  Approfondimento Clinico
                </span>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                  {visita.whatIs.title}
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal/80 sm:text-base">
                  {visita.whatIs.paragraphs && visita.whatIs.paragraphs.length > 0 ? (
                    visita.whatIs.paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>{visita.whatIs.description}</p>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Quando è Indicata (Problems Grid) ── */}
      {visita.problemsGrid && visita.problemsGrid.length > 0 && (
        <section className="py-16 bg-white border-b border-sand-200">
          <Container>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Esigenze & Sintomi
              </span>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                {visita.problemsTitle}
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visita.problemsGrid.map((p, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-2xl border border-sand-200 bg-sand-50/40 p-6 transition-all hover:border-teal-200 hover:shadow-sm"
                >
                  <h3 className="font-serif text-lg font-semibold text-teal-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-charcoal/70 sm:text-sm">
                    {p.description || "Valutazione specialistica preventiva condotta in clinica con strumentazione dedicata."}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Come si Svolge la Visita (Timeline Steps) ── */}
      {visita.timelineSteps && visita.timelineSteps.length > 0 && (
        <section className="py-16 bg-sand-50/60 border-b border-sand-200">
          <Container>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Percorso Specialistico
              </span>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                {visita.timelineTitle}
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {visita.timelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col rounded-3xl border border-sand-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-sm font-bold text-teal-800 border border-teal-200">
                    {step.stepNumber || `0${idx + 1}`}
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-teal-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-charcoal/70 sm:text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Risultati e Refertazione ── */}
      {visita.results && (visita.results.description || (visita.results.paragraphs && visita.results.paragraphs.length > 0)) && (
        <section className="py-16 bg-white border-b border-sand-200">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                  Refertazione & Esito
                </span>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                  {visita.results.title}
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal/80 sm:text-base">
                  {visita.results.paragraphs && visita.results.paragraphs.length > 0 ? (
                    visita.results.paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>{visita.results.description}</p>
                  )}
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sand-300 shadow-md">
                <Image
                  src={visita.results.image || visita.galleryImages[2] || visita.galleryImages[1] || visita.heroImage}
                  alt={`${visita.title} — esito e refertazione`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── FAQ ── */}
      {visita.faq && visita.faq.length > 0 && (
        <section className="py-16 bg-sand-50/60 border-b border-sand-200">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                  Chiarimenti & Informazioni
                </span>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                  Domande Frequenti
                </h2>
              </div>

              <div className="mt-8 space-y-3">
                {visita.faq.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-sand-200 bg-white overflow-hidden transition-all shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-teal-900 sm:text-base"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-teal-700 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-sand-100 bg-sand-50/30 px-5 py-4 text-xs leading-relaxed text-charcoal/80 sm:text-sm">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Local SEO Napoli ── */}
      {visita.localSeo && (
        <section className="py-16 bg-white border-b border-sand-200">
          <Container>
            <div className="mx-auto max-w-3xl rounded-3xl border border-teal-100 bg-teal-50/40 p-8 sm:p-10">
              <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Cocoora Centro Medico · Napoli</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                {visita.localSeo.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/80 sm:text-base">
                {visita.localSeo.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-charcoal/70">
                <span>📍 {SITE.address}</span>
                <span>•</span>
                <span>📞 {SITE.phone}</span>
                <span>•</span>
                <span>🕒 Lun–Ven 8:00–20:00 · Sab 9:00–14:00</span>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Form Prenotazione / Contatto ── */}
      <section id="prenota" className="py-16 lg:py-24 bg-sand-100/60">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xl">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Richiesta Informazioni e Prenotazione
              </span>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                Prenota {visita.title}
              </h2>
              <p className="mt-2 text-xs text-charcoal/70 sm:text-sm">
                Compila i dati: la segreteria clinica Cocoora ti ricontatterà per concordare data, orario e dettagli.
              </p>
              <div className="mt-4 rounded-2xl bg-teal-50/70 p-3.5 border border-teal-100/80 text-xs text-teal-900 text-left flex items-start gap-2.5">
                <CreditCard className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-charcoal/80">
                  <strong>Zero anticipo alla prenotazione:</strong> il saldo avviene comodamente in clinica con Bancomat/Carta oppure, per pacchetti e piani di cura, in <strong>3 rate a tasso zero con Klarna o PayPal</strong>.
                </p>
              </div>
            </div>

            {formState === "success" ? (
              <div className="mt-8 rounded-2xl bg-teal-50 border border-teal-200 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-teal-900">
                  Richiesta Inviata con Successo
                </h3>
                <p className="mt-2 text-xs text-charcoal/70 sm:text-sm">
                  Grazie {formData.nome}. La segreteria di Cocoora ti contatterà al numero {formData.telefono} nelle prossime ore.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/80 mb-1">
                    Nome e Cognome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Mario Rossi"
                    className="w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/80 mb-1">
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="333 1234567"
                      className="w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal/80 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="mario@email.it"
                      className="w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/80 mb-1">
                    Note o preferenze di contatto
                  </label>
                  <textarea
                    rows={3}
                    value={formData.messaggio}
                    onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                    placeholder="Preferenza orario mattina/pomeriggio, eventuali richieste..."
                    className="w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="consenso"
                    required
                    checked={formData.consenso}
                    onChange={(e) => setFormData({ ...formData, consenso: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-sand-300 text-teal-800 focus:ring-teal-700"
                  />
                  <label htmlFor="consenso" className="text-xs text-charcoal/70 leading-relaxed">
                    Ho letto l&apos;informativa sulla privacy e acconsento al trattamento dei dati personali per essere ricontattato in merito alla richiesta.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-teal-800 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50"
                >
                  <CalendarCheck className="h-4 w-4" />
                  {formState === "sending" ? "Invio in corso..." : "Invia Richiesta di Prenotazione"}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
