import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Informativa Privacy & Trattamento Dati Sanitari (GDPR)",
  description:
    "Informativa completa sul trattamento dei dati personali e sanitari ai sensi del Regolamento UE 2016/679 (GDPR) per i pazienti e gli utenti di Cocoora Centro Medico.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#2c3338] antialiased">
      {/* Hero Header */}
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
            <span>Conforme al Regolamento UE 2016/679 (GDPR) e Codice Privacy D.Lgs. 196/2003</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Informativa sul Trattamento dei Dati Personali e Sanitari
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-teal-100/80">
            Documento redatto a tutela della riservatezza dei pazienti di Cocoora Centro Medico e
            degli utenti dei servizi sanitari e percorsi salute Cocoora Club e Precision.
          </p>
          <p className="mt-3 text-xs text-teal-200/60 font-mono">
            Ultimo aggiornamento formale: Maggio 2026 · Versione: 2.1 (Approvata per revisione legale)
          </p>
        </Container>
      </section>

      {/* Main Body */}
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-12 text-sm sm:text-[15px] leading-relaxed text-charcoal/85">
          {/* Premessa */}
          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              Premessa Fondamentale sulla Tutela dei Dati Sanitari
            </h2>
            <p className="mt-3 text-charcoal/80 leading-relaxed">
              La tutela della privacy e la riservatezza delle informazioni cliniche costituiscono un
              valore etico e deontologico primario per Cocoora. Trattiamo i dati relativi alla salute
              (art. 9 GDPR) con la massima cura e con misure tecniche e organizzative avanzate,
              garantendo la totale separazione tra l&apos;accesso clinico dei medici curanti e
              l&apos;operatività amministrativa o di marketing.
            </p>
          </div>

          {/* 1. Titolari del Trattamento */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              1. Titolari del Trattamento e Ripartizione dei Ruoli
            </h2>
            <p>
              In relazione alle diverse attività erogate attraverso la struttura medica e la
              piattaforma digitale, operano in qualità di Titolari autonomi del trattamento:
            </p>

            <div className="grid gap-6 sm:grid-cols-2 mt-4">
              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs">
                <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Attività Clinica &amp; Sanitaria
                </span>
                <h3 className="mt-2 text-base font-bold text-teal-950">
                  COCOORA STP S.r.l.
                </h3>
                <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">
                  Titolare del trattamento per tutte le prestazioni sanitarie, visite specialistiche,
                  cartelle cliniche, anamnesi, diagnostica, refertazione e prescrizioni terapeutiche.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-charcoal/70">
                  <p><strong>Sede Operativa:</strong> {SITE.fullAddress}</p>
                  <p><strong>Direzione Sanitaria:</strong> Dott.ssa Elisa Russo</p>
                  <p><strong>Email Privacy:</strong> privacy@cocoora.it</p>
                  <p><strong>Telefono:</strong> {SITE.phone}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs">
                <span className="inline-block rounded-md bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-800 uppercase tracking-wider">
                  Membership &amp; Servizi Digitali
                </span>
                <h3 className="mt-2 text-base font-bold text-teal-950">
                  PRIMECARE S.r.l.
                </h3>
                <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">
                  Titolare del trattamento per la gestione contabile, fatturazione degli abbonamenti
                  Cocoora Club, concierge non clinico e infrastruttura applicativa web/PWA.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-charcoal/70">
                  <p><strong>Sede Legale:</strong> Napoli (NA), Italia</p>
                  <p><strong>Email Contabile:</strong> amministrazione@cocoora.it</p>
                  <p><strong>Contatto DPO:</strong> dpo@cocoora.it</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Categorie di Dati Trattati */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              2. Categorie di Dati Personali Trattati
            </h2>
            <p>Raccogliamo ed elaboriamo le seguenti tipologie di dati:</p>
            <ul className="list-disc pl-5 space-y-2 text-charcoal/80">
              <li>
                <strong>Dati Identificativi e Anagrafici:</strong> nome, cognome, codice fiscale, data
                e luogo di nascita, residenza, documento di riconoscimento.
              </li>
              <li>
                <strong>Dati di Contatto:</strong> recapito telefonico, indirizzo email, contatti per
                promemoria visite via SMS o WhatsApp autorizzato.
              </li>
              <li>
                <strong>Dati Particolari relativi alla Salute (Art. 9 GDPR):</strong> anamnesi medica
                e familiare, sintomi riferiti, parametri biometrici, esiti di visite specialistiche,
                diagnosi, referti strumentali (ecografie, laser, diagnostica), dati genetici o di
                microbiota (esclusivamente per i percorsi Cocoora Precision previo consenso specifico).
              </li>
              <li>
                <strong>Dati Finanziari e Contabili:</strong> dettagli di fatturazione, acconti e
                ricevute sanitarie. I dati di carte di credito sono gestiti direttamente dai gateway di
                pagamento certificati PCI-DSS (Stripe); nessun dato finanziario completo transita o
                viene memorizzato sui server di Cocoora.
              </li>
              <li>
                <strong>Dati di Navigazione Tecnica:</strong> log di sistema, indirizzo IP anonimizzato,
                data e orario degli accessi al portale per motivi di sicurezza informatica.
              </li>
            </ul>
          </section>

          {/* 3. Basi Giuridiche e Finalità */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              3. Finalità del Trattamento e Basi Giuridiche
            </h2>
            <div className="overflow-x-auto rounded-xl border border-teal-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-teal-50 text-teal-900 font-semibold border-b border-teal-100">
                  <tr>
                    <th className="p-3.5">Finalità</th>
                    <th className="p-3.5">Base Giuridica (GDPR)</th>
                    <th className="p-3.5">Obbligatorietà</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50 bg-white">
                  <tr>
                    <td className="p-3.5 font-medium text-teal-950">
                      Erogazione di visite mediche, diagnosi, prevenzione e percorsi di cura
                    </td>
                    <td className="p-3.5 text-charcoal/80">
                      Art. 9, par. 2, lett. h) GDPR (Finalità di medicina preventiva, diagnosi, assistenza o terapia sanitaria)
                    </td>
                    <td className="p-3.5 text-emerald-700 font-semibold">
                      Necessario per l&apos;atto medico
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-teal-950">
                      Gestione prenotazioni, accesso al fascicolo digitale e comunicazioni di servizio
                    </td>
                    <td className="p-3.5 text-charcoal/80">
                      Art. 6, par. 1, lett. b) GDPR (Esecuzione del contratto o misure precontrattuali)
                    </td>
                    <td className="p-3.5 text-emerald-700 font-semibold">
                      Necessario per il servizio
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-teal-950">
                      Adempimenti fiscali, fatturazione e conservazione cartelle cliniche
                    </td>
                    <td className="p-3.5 text-charcoal/80">
                      Art. 6, par. 1, lett. c) GDPR (Obbligo legale e normativa sanitaria nazionale)
                    </td>
                    <td className="p-3.5 text-rose-700 font-semibold">
                      Obbligatorio per legge
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-teal-950">
                      Analisi statistica aggregata e sicurezza dell&apos;infrastruttura
                    </td>
                    <td className="p-3.5 text-charcoal/80">
                      Art. 6, par. 1, lett. f) GDPR (Legittimo interesse a garantire sicurezza e stabilità)
                    </td>
                    <td className="p-3.5 text-charcoal/70">
                      Trattamento anonimizzato
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-teal-950">
                      Newsletter informative di salute e promozioni Cocoora
                    </td>
                    <td className="p-3.5 text-charcoal/80">
                      Art. 6, par. 1, lett. a) GDPR (Consenso esplicito e separato dell&apos;interessato)
                    </td>
                    <td className="p-3.5 text-charcoal/70">
                      Facoltativo (mai vincolante per la cura)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Segregazione degli Accessi e Misure di Sicurezza */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              4. Misure di Sicurezza e Segregazione dei Ruoli (Privacy by Design)
            </h2>
            <p>
              In ottemperanza al principio di minimizzazione e integrità (artt. 5 e 25 GDPR),
              Cocoora adotta una rigida architettura a compartimenti stagni:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mt-2">
              <div className="rounded-xl border border-teal-100 bg-white p-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-teal-900">
                  Personale Medico Curante
                </h3>
                <p className="mt-1 text-xs text-charcoal/80">
                  Accesso completo e riservato alle sole cartelle e anamnesi dei pazienti affidati al
                  proprio percorso terapeutico, protetto da autenticazione forte e vincolato al
                  segreto professionale.
                </p>
              </div>
              <div className="rounded-xl border border-teal-100 bg-white p-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-teal-900">
                  Personale di Segreteria &amp; Reception
                </h3>
                <p className="mt-1 text-xs text-charcoal/80">
                  Accesso ristretto alle agende, anagrafiche e stati dei pagamenti per il check-in e
                  l&apos;accoglienza, <strong>senza alcuna visibilità</strong> sui referti diagnostici
                  o sulle note cliniche private del medico.
                </p>
              </div>
            </div>
            <p className="text-xs text-charcoal/75">
              Tutti i dati trasmessi via web sono cifrati mediante protocollo HTTPS con certificati
              TLS 1.3. Il database clinico risiede in data center europei conformi a standard ISO
              27001 e SOC 2 Type II, con backup automatici cifrati e audit log di ogni accesso.
            </p>
          </section>

          {/* 5. Tempi di Conservazione */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              5. Periodo di Conservazione dei Dati
            </h2>
            <p>I dati personali vengono conservati per i tempi strettamente necessari previsti dalla legge:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-charcoal/80">
              <li>
                <strong>Documentazione sanitaria, cartelle e referti:</strong> conservati a tempo
                indeterminato, secondo le prescrizioni del Ministero della Salute e le linee guida
                nazionali sulla documentazione medica.
              </li>
              <li>
                <strong>Dati fiscali, amministrativi e contabili:</strong> conservati per 10 anni
                dalla data di emissione della fattura (art. 2220 c.c.).
              </li>
              <li>
                <strong>Dati per comunicazioni o promemoria visite:</strong> conservati per la durata
                del rapporto assistenziale o fino a disattivazione del profilo.
              </li>
            </ul>
          </section>

          {/* 6. Diritti dell'Interessato */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              6. Diritti dell&apos;Interessato (Artt. 15-22 GDPR)
            </h2>
            <p>
              In ogni momento, il paziente ha il diritto di esercitare i propri diritti riconosciuti dal GDPR:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-teal-100 bg-white p-3.5">
                <strong>Diritto di Accesso (Art. 15):</strong> Richiedere conferma dei dati trattati e ottenerne copia (compreso il fascicolo referti).
              </div>
              <div className="rounded-xl border border-teal-100 bg-white p-3.5">
                <strong>Diritto di Rettifica (Art. 16):</strong> Aggiornare o rettificare dati anagrafici errati o incompleti.
              </div>
              <div className="rounded-xl border border-teal-100 bg-white p-3.5">
                <strong>Diritto di Cancellazione (Art. 17):</strong> Richiedere la cancellazione dei dati non soggetti a obbligo legale di conservazione sanitaria.
              </div>
              <div className="rounded-xl border border-teal-100 bg-white p-3.5">
                <strong>Diritto di Limitazione e Portabilità (Artt. 18 e 20):</strong> Ricevere i propri dati in formato strutturato di uso comune.
              </div>
            </div>
            <p className="text-xs text-charcoal/80">
              Per esercitare i tuoi diritti puoi inviare una richiesta scritta a:{" "}
              <a href="mailto:privacy@cocoora.it" className="font-semibold text-teal-700 underline">
                privacy@cocoora.it
              </a>{" "}
              oppure contattare la Direzione Sanitaria presso la nostra sede di Napoli. Hai inoltre il diritto di proporre reclamo all&apos;Autorità Garante per la Protezione dei Dati Personali (
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
                www.garanteprivacy.it
              </a>
              ).
            </p>
          </section>

          {/* 7. Contatti Ufficiali */}
          <section className="rounded-2xl border border-teal-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              Contatti per la Protezione dei Dati
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-charcoal/80">
              Per chiarimenti, richieste di accesso ai referti o informazioni relative al trattamento:
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-xs text-charcoal/80">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-700" />
                {SITE.fullAddress}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-700" />
                {SITE.phone}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-700" />
                privacy@cocoora.it
              </span>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
