"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Cookie, HelpCircle, Shield, Sliders, X } from "lucide-react";
import { pushConsentUpdate } from "@/lib/tracking";
import type { ConsentState } from "@/lib/types";

const STORAGE_KEY = "cocoora_consent_v1";

const DEFAULT_DENIED: ConsentState = {
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

const ALL_GRANTED: ConsentState = {
  ad_storage: "granted",
  analytics_storage: "granted",
  functionality_storage: "granted",
  personalization_storage: "granted",
  security_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

function loadStored(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);

  // Stati personalizzazione granulare
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored === null) {
      setVisible(true);
    } else {
      // Inizializza gli stati con quanto salvato in precedenza
      setAnalyticsConsent(stored.analytics_storage === "granted");
      setMarketingConsent(stored.ad_storage === "granted");
    }

    // Listener per riaprire il banner dal footer o dalla Cookie Policy
    const handleOpen = () => {
      setVisible(true);
      setCustomizing(true);
    };

    window.addEventListener("cocoora_open_cookie_preferences", handleOpen);
    return () => {
      window.removeEventListener("cocoora_open_cookie_preferences", handleOpen);
    };
  }, []);

  const apply = useCallback((consent: ConsentState) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      // Salva anche cookie leggero per compatibilità server
      document.cookie = `${STORAGE_KEY}=${consent.analytics_storage === "granted" ? "analytics" : "denied"}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent("cocoora_consent_changed", { detail: consent }));
    }
    pushConsentUpdate(consent);
    setVisible(false);
    setCustomizing(false);
  }, []);

  const handleAcceptAll = () => {
    apply(ALL_GRANTED);
  };

  const handleOnlyNecessary = () => {
    apply(DEFAULT_DENIED);
  };

  const handleSavePreferences = () => {
    const customConsent: ConsentState = {
      ad_storage: marketingConsent ? "granted" : "denied",
      analytics_storage: analyticsConsent ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: marketingConsent ? "granted" : "denied",
      security_storage: "granted",
      ad_user_data: marketingConsent ? "granted" : "denied",
      ad_personalization: marketingConsent ? "granted" : "denied",
    };
    apply(customConsent);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-3xl animate-fade-up rounded-3xl border border-teal-200/80 bg-white/98 p-5 shadow-[0_24px_70px_-20px_rgba(3,53,75,0.6)] backdrop-blur-xl sm:p-6 text-charcoal">
        {/* Banner Principale */}
        {!customizing ? (
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 sm:flex border border-teal-100">
              <Cookie className="h-6 w-6 text-teal-700" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-600"></span>
                <p className="text-sm font-bold text-teal-950 font-serif">
                  La tua salute e la tua privacy sono la nostra priorità
                </p>
              </div>

              <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-charcoal/85">
                Utilizziamo cookie tecnici per garantire il funzionamento sicuro del portale medico.
                Con il tuo consenso, utilizziamo inoltre strumenti analitici e di misurazione per
                comprendere l&apos;efficacia delle informazioni e migliorare i percorsi di salute.
                I tuoi dati sanitari non sono mai oggetto di profilazione commerciale.
              </p>

              <div className="mt-2 text-[11px] text-teal-800/80 flex items-center gap-2">
                <Link
                  href="/privacy-policy"
                  className="underline hover:text-teal-950 transition-colors"
                >
                  Informativa Privacy Sanitaria
                </Link>
                <span>·</span>
                <Link
                  href="/cookie-policy"
                  className="underline hover:text-teal-950 transition-colors"
                >
                  Cookie Policy Completa
                </Link>
              </div>

              {/* Bottoni Azione */}
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
                >
                  Accetta tutti
                </button>

                <button
                  type="button"
                  onClick={handleOnlyNecessary}
                  className="rounded-xl border border-teal-200 bg-teal-50/70 px-4 py-2.5 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  Solo necessari
                </button>

                <button
                  type="button"
                  onClick={() => setCustomizing(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-teal-800 hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Personalizza</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              aria-label="Chiudi e rifiuta non necessari"
              onClick={handleOnlyNecessary}
              className="text-charcoal/40 transition-colors hover:text-charcoal cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Modale / Cassetto di Personalizzazione Granulare */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-teal-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-teal-700" />
                <h3 className="font-serif text-base font-bold text-teal-950">
                  Gestione Granulare dei Consensi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="text-xs text-teal-700 hover:underline cursor-pointer"
              >
                Torna al riepilogo
              </button>
            </div>

            <p className="text-xs text-charcoal/80 leading-relaxed">
              Scegli quali categorie di strumenti di misurazione autorizzare. I cookie tecnici
              necessari rimangono sempre attivi per garantire la sicurezza del portale.
            </p>

            <div className="space-y-3">
              {/* 1. Tecnici */}
              <div className="flex items-start justify-between rounded-xl border border-teal-100 bg-teal-50/40 p-3">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950">Cookie Tecnici &amp; Sicurezza</span>
                    <span className="rounded-md bg-teal-200/60 px-1.5 py-0.2 text-[10px] font-semibold text-teal-900">
                      Obbligatori
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-charcoal/70">
                    Indispensabili per navigare, autenticarsi nell&apos;area riservata e registrare il consenso.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="mt-1 h-4 w-4 rounded accent-teal-700 cursor-not-allowed opacity-70"
                />
              </div>

              {/* 2. Analitici */}
              <div className="flex items-start justify-between rounded-xl border border-teal-100 bg-white p-3 hover:border-teal-200 transition">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950">Statistiche &amp; Analytics (GA4)</span>
                    <span className="rounded-md bg-sky-100 px-1.5 py-0.2 text-[10px] font-semibold text-sky-800">
                      IP Anonimizzato
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-charcoal/70">
                    Consentono a Cocoora di misurare le visite, le pagine più lette e il tempo di permanenza per migliorare il sito.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-teal-700 cursor-pointer"
                />
              </div>

              {/* 3. Marketing */}
              <div className="flex items-start justify-between rounded-xl border border-teal-100 bg-white p-3 hover:border-teal-200 transition">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950">Misurazione Campagne Pubblicitarie</span>
                    <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800">
                      Facoltativi
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-charcoal/70">
                    Utilizzati per valutare le campagne promozionali istituzionali (Google Ads, Meta Pixel). Nessun dato clinico viene mai tracciato.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-teal-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Footer Azioni Personalizzazione */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-teal-100 pt-3">
              <button
                type="button"
                onClick={handleOnlyNecessary}
                className="text-xs text-charcoal/60 hover:text-charcoal underline cursor-pointer"
              >
                Rifiuta tutti i non necessari
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition cursor-pointer"
                >
                  Salva le mie preferenze
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition cursor-pointer"
                >
                  Accetta tutti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
