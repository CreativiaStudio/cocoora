import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Termini e Condizioni di Utilizzo | Cocoora",
  description:
    "Termini e condizioni generali di erogazione delle prestazioni e utilizzo del portale digitale Cocoora Centro Medico.",
};

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#2c3338] antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-navy py-16 sm:py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 0%, rgba(128,161,178,0.2) 0%, transparent 70%), radial-gradient(50% 45% at 85% 30%, rgba(28,74,92,0.5) 0%, transparent 70%), linear-gradient(180deg, #03354b 0%, #022434 100%)",
          }}
        />
        <div className="noise pointer-events-none absolute inset-0 opacity-60" />

        <Container className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-200/80 transition-colors hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla Home
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/60 px-3.5 py-1 text-xs text-teal-300 backdrop-blur-md mb-4">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Condizioni Generali di Servizio e Regolamento Sanitario</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Termini e Condizioni di Servizio
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-teal-100/80">
            Regolamento per la prenotazione delle visite specialistiche, la fruizione dei percorsi
            salute Cocoora Club e l&apos;utilizzo dei servizi digitali.
          </p>
        </Container>
      </section>

      {/* Content */}
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-10 text-sm sm:text-[15px] leading-relaxed text-charcoal/85">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              1. Oggetto e Ambito di Applicazione
            </h2>
            <p>
              I presenti Termini disciplinano l&apos;accesso ai servizi digitali di Cocoora Centro
              Medico ({SITE.fullAddress}) gestito da COCOORA STP S.r.l. per le attività sanitarie e da
              PRIMECARE S.r.l. per la gestione dei servizi di membership e percorsi digitali.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              2. Prenotazione Visite e Politica di Disdetta
            </h2>
            <p>
              Le visite specialistiche e i trattamenti possono essere prenotati online attraverso il
              portale o presso la reception. Al fine di garantire il massimo rispetto per gli altri
              pazienti e per l&apos;organizzazione degli specialisti:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/80">
              <li>
                La cancellazione o modifica della data deve avvenire con almeno{" "}
                <strong>24 ore di anticipo</strong> rispetto all&apos;orario concordato.
              </li>
              <li>
                In caso di mancata presentazione senza preavviso, Cocoora si riserva la facoltà di
                trattenere l&apos;eventuale acconto versato a parziale copertura del blocco studio.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              3. Prestazioni Mediche e Consenso Informato
            </h2>
            <p>
              Ogni atto medico o prestazione specialistica è preceduto dalla raccolta del consenso
              informato specifico da parte del medico curante. L&apos;indicazione clinica e
              l&apos;idoneità a qualsiasi trattamento rimangono di esclusiva competenza e
              responsabilità del medico specialista.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              4. Pagamenti e Fatturazione Sanitaria
            </h2>
            <p>
              Tutti i corrispettivi sono espressi in Euro. Le spese sanitarie detraibili vengono
              regolarmente trasmesse al Sistema Tessera Sanitaria (STS) conformemente alla normativa
              vigente, salvo esplicita opposizione del paziente manifestata in fase di fatturazione.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
