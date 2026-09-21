"use client";

import { useCallback, useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { pushConsentUpdate } from "@/lib/tracking";
import type { ConsentState } from "@/lib/types";
import { Button } from "./ui";

const STORAGE_KEY = "cocoora_consent_v1";

const DEFAULT_DENIED: ConsentState = {
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

const GRANTED: ConsentState = {
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

  useEffect(() => {
    setVisible(loadStored() === null);
  }, []);

  const apply = useCallback((consent: ConsentState) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    }
    pushConsentUpdate(consent);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-3xl animate-fade-up rounded-3xl border border-teal-100 bg-white/95 p-5 shadow-[0_24px_70px_-24px_rgba(3,53,75,0.5)] backdrop-blur-md sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 sm:flex">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-teal-900">La tua privacy, la nostra priorità</p>
            <p className="mt-1 text-sm leading-relaxed text-charcoal/80">
              Utilizziamo i cookie per migliorare l'esperienza, analizzare il traffico e
              personalizzare i contenuti. Puoi accettare tutti i cookie o scegliere le tue preferenze.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button size="sm" onClick={() => apply(GRANTED)}>
                Accetta tutti
              </Button>
              <Button size="sm" variant="secondary" onClick={() => apply(DEFAULT_DENIED)}>
                Solo necessari
              </Button>
              <button
                type="button"
                onClick={() => apply(DEFAULT_DENIED)}
                className="text-xs text-charcoal/50 underline-offset-2 hover:underline"
              >
                Rifiuta
              </button>
            </div>
          </div>
          <button
            type="button"
            aria-label="Chiudi"
            onClick={() => setVisible(false)}
            className="text-charcoal/40 transition-colors hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
