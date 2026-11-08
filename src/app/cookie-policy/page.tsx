import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, Info, Lock, ShieldCheck, Sliders } from "lucide-react";
import { Container } from "@/components/ui";
import { CookiePreferencesTrigger } from "@/components/cookie-preferences-trigger";

export const metadata: Metadata = {
  title: "Cookie Policy & Gestione Tracciamenti | Cocoora",
  description:
    "Informativa estesa sull'uso dei cookie e delle tecnologie di tracciamento conforme alle linee guida del Garante Privacy e a Google Consent Mode v2.",
};

const COOKIES_TABLE = [
  {
    name: "cocoora_consent_v1",
    provider: "Cocoora (Prima Parte)",
    purpose: "Memorizza lo stato delle preferenze espresse dall'utente nel banner cookie.",
    duration: "12 mesi",
    category: "Tecnico Necessario",
  },
  {
    name: "cocoora_session",
    provider: "Cocoora (Prima Parte)",
    purpose: "Mantiene la sessione protetta per gli accessi autenticati di medici, segreteria e pazienti.",
    duration: "7 giorni",
    category: "Tecnico Necessario",
  },
  {
    name: "_ga, _ga_*",
    provider: "Google LLC (GA4)",
    purpose: "Analisi aggregata delle visite, tempo di permanenza e pagine consultate (IP anonimizzato).",
    duration: "14 mesi",
    category: "Analitico (Previa Autorizzazione)",
  },
  {
    name: "_gcl_au",
    provider: "Google LLC",
    purpose: "Tracciamento dell'efficacia delle campagne pubblicitarie istituzionali Google.",
    duration: "90 giorni",
    category: "Marketing (Previa Autorizzazione)",
  },
  {
    name: "_fbp",
    provider: "Meta Platforms Ireland Ltd",
    purpose: "Misurazione e ottimizzazione delle campagne promozionali Meta/Instagram.",
    duration: "90 giorni",
    category: "Marketing (Previa Autorizzazione)",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#2c3338] antialiased">
      {/* Header */}
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
            <Cookie className="h-4 w-4 text-amber-300" />
            <span>Linee Guida Cookie e Tracciamento Garante Privacy (10 Giugno 2021)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Informativa sull&apos;Uso dei Cookie e Tracciamenti
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-teal-100/80">
            Trasparenza totale su come utilizziamo i cookie tecnici essenziali, le metriche statistiche
            e i pixel di misurazione nel rispetto della tua privacy.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CookiePreferencesTrigger />
            <span className="text-xs text-teal-200/60">
              Puoi modificare o revocare la tua scelta in qualsiasi istante.
            </span>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-12 text-sm sm:text-[15px] leading-relaxed text-charcoal/85">
          {/* 1. Cosa sono i cookie */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              1. Cosa sono i Cookie e gli Strumenti di Tracciamento?
            </h2>
            <p>
              I cookie sono piccoli file di testo che i siti web visitati inviano al terminale del
              visitatore (computer, tablet, smartphone), dove vengono memorizzati per essere poi
              ritrasmessi agli stessi siti alla visita successiva. Oltre ai cookie, possono essere
              impiegate tecnologie affini come web beacon, tag o archiviazione locale (localStorage)
              per garantire il corretto funzionamento delle sessioni e la sicurezza della piattaforma.
            </p>
          </section>

          {/* 2. Categorie di Cookie Utilizzati */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              2. Categorie di Cookie Adottate da Cocoora
            </h2>

            <div className="space-y-4">
              {/* Tecnici */}
              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Sempre Attivi
                  </span>
                  <h3 className="text-base font-bold text-teal-950">
                    Cookie Tecnici Strettamente Necessari
                  </h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  Questi cookie sono indispensabili per consentire la navigazione sul sito,
                  memorizzare la preferenza sul consenso privacy e mantenere attiva l&apos;area
                  riservata del paziente e del medico. Ai sensi della normativa vigente, per
                  l&apos;installazione di tali cookie <strong>non è richiesto il preventivo consenso</strong> dell&apos;utente.
                </p>
              </div>

              {/* Analitici */}
              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-800 uppercase tracking-wider">
                    Subordinati al Consenso
                  </span>
                  <h3 className="text-base font-bold text-teal-950">
                    Cookie Analitici e Statistiche di Traffico
                  </h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  Permettono di raccogliere dati aggregati su quante persone visitano il sito,
                  quali pagine risultano più consultate e il tempo medio di permanenza. Utilizziamo
                  Google Analytics 4 configurato con <strong>mascheramento parziale dell&apos;indirizzo IP</strong>.
                  Questi strumenti vengono attivati unicamente qualora l&apos;utente ne autorizzi
                  l&apos;impiego dal banner.
                </p>
              </div>

              {/* Marketing */}
              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Subordinati al Consenso
                  </span>
                  <h3 className="text-base font-bold text-teal-950">
                    Cookie di Profilazione e Marketing (Pixel Terze Parti)
                  </h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  Utilizzati per misurare l&apos;efficacia delle campagne pubblicitarie istituzionali
                  di Cocoora su motori di ricerca e canali social (Google Ads, Meta Pixel).
                  Sono <strong>disattivati di default</strong> e non raccolgono mai informazioni
                  relative allo stato di salute dei pazienti o ai trattamenti sanitari prenotati.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Google Consent Mode v2 */}
          <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-base">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
              <span>Integrazione con Google Consent Mode v2</span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
              La nostra architettura adotta lo standard europeo Google Consent Mode v2:
              prima dell&apos;interazione dell&apos;utente con il banner, tutti i parametri di consenso
              (<code>analytics_storage</code>, <code>ad_storage</code>, <code>ad_user_data</code>,{" "}
              <code>ad_personalization</code>) sono impostati a <code>&apos;denied&apos;</code>.
              Nessun dato viene trasmesso prima dell&apos;accettazione esplicita.
            </p>
          </section>

          {/* 4. Tabella dei Cookie */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              3. Tabella Dettagliata dei Cookie Utilizzati
            </h2>
            <div className="overflow-x-auto rounded-xl border border-teal-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-teal-50 text-teal-900 font-semibold border-b border-teal-100">
                  <tr>
                    <th className="p-3.5">Nome Cookie</th>
                    <th className="p-3.5">Fornitore</th>
                    <th className="p-3.5">Finalità</th>
                    <th className="p-3.5">Durata</th>
                    <th className="p-3.5">Categoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50 bg-white">
                  {COOKIES_TABLE.map((row) => (
                    <tr key={row.name}>
                      <td className="p-3.5 font-mono font-semibold text-teal-900">{row.name}</td>
                      <td className="p-3.5 text-charcoal/80">{row.provider}</td>
                      <td className="p-3.5 text-charcoal/80">{row.purpose}</td>
                      <td className="p-3.5 text-charcoal/70">{row.duration}</td>
                      <td className="p-3.5 font-medium text-teal-800">{row.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Come gestire o disabilitare i cookie nel browser */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              4. Gestione dei Cookie Tramite Browser
            </h2>
            <p>
              È possibile gestire o bloccare i cookie direttamente dalle impostazioni del proprio
              browser. Di seguito i collegamenti alle guide ufficiali:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-teal-100 bg-white p-3.5 hover:border-teal-300 transition"
              >
                <strong>Google Chrome:</strong> Guida alla gestione e rimozione dei cookie
              </a>
              <a
                href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-teal-100 bg-white p-3.5 hover:border-teal-300 transition"
              >
                <strong>Apple Safari:</strong> Gestione cookie e tracciamento cross-site
              </a>
              <a
                href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-teal-100 bg-white p-3.5 hover:border-teal-300 transition"
              >
                <strong>Mozilla Firefox:</strong> Protezione antitracciamento e privacy
              </a>
              <a
                href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-teal-100 bg-white p-3.5 hover:border-teal-300 transition"
              >
                <strong>Microsoft Edge:</strong> Gestione e cancellazione cookie
              </a>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
