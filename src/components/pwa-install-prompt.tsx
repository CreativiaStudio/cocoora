"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, Plus, Share, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "cocoora_pwa_dismissed";

export function PwaInstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }

    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      deferredPromptRef.current = promptEvent;
    };

    const handleAppInstalled = () => {
      setVisible(false);
      setShowSheet(false);
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Quando l'utente clicca dal Footer o dal Menu:
    // Se il browser supporta l'installazione nativa (Android/Chrome/Edge), parte subito il prompt a 1 click!
    const handleOpenManual = async () => {
      if (deferredPromptRef.current) {
        try {
          await deferredPromptRef.current.prompt();
          const choice = await deferredPromptRef.current.userChoice;
          if (choice.outcome === "accepted") {
            setVisible(false);
            setShowSheet(false);
          }
          deferredPromptRef.current = null;
          setDeferredPrompt(null);
          return;
        } catch (e) {
          console.error("Install prompt error", e);
        }
      }
      // Se siamo su iOS (Safari non permette il prompt da codice) o se il prompt non è pronto, apri il mini-avviso rapido
      setVisible(true);
      setShowSheet(true);
    };

    window.addEventListener("cocoora_open_pwa_install", handleOpenManual);

    if (!standalone && !dismissed) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("cocoora_open_pwa_install", handleOpenManual);
    };
  }, []);

  useEffect(() => {
    if (!showSheet) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSheet(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSheet]);

  const dismiss = useCallback(() => {
    setVisible(false);
    setShowSheet(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage non disponibile: la chiusura resta valida per la sessione corrente.
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowSheet(true);
      return;
    }

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
        setShowSheet(false);
      }
      setDeferredPrompt(null);
    } catch {
      setDeferredPrompt(null);
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt]);

  if (!mounted || !visible) return null;

  return (
    <>
      <div
        className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-md"
        role="complementary"
        aria-label="Installa l'app Cocoora"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#C5A880]/50 bg-white shadow-[0_18px_45px_-12px_rgba(3,53,75,0.35)]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#C5A880]" aria-hidden="true" />
          <button
            type="button"
            onClick={dismiss}
            aria-label="Chiudi il banner di installazione"
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-[#80A1B2] transition-colors hover:bg-[#1C4A5C]/5 hover:text-[#1C4A5C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 px-5 py-4 pr-12">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#C5A880]/40 bg-white p-1 shadow-sm">
              <Image
                src="/apple-touch-icon.png"
                alt="Cocoora Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide text-[#1C4A5C]">
                Cocoora sul tuo telefono
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#3D3D3C]">
                Salva l&apos;app sulla schermata Home e accedi al Cocoora Club in un tocco.
              </p>
              <button
                type="button"
                onClick={isIOS ? () => setShowSheet(true) : handleInstall}
                disabled={installing}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1C4A5C] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#03354B] disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] focus-visible:ring-offset-2"
              >
                <Download className="h-3.5 w-3.5" />
                {installing ? "Installazione…" : isIOS ? "Come installare" : "Installa"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSheet && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#03354B]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cocoora-pwa-sheet-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowSheet(false);
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl border border-[#C5A880]/40 bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#80A1B2]/25 px-5 py-4">
              <div>
                <Image
                  src="/cocoora-logo-horizontal.png"
                  alt="Cocoora Centro Medico"
                  width={150}
                  height={30}
                  className="h-7 w-auto object-contain"
                  priority
                />
                <h2
                  id="cocoora-pwa-sheet-title"
                  className="mt-2 text-base font-semibold text-[#1C4A5C]"
                >
                  {isIOS ? "Aggiungi Cocoora alla schermata Home" : "Installa l'app Cocoora"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSheet(false)}
                aria-label="Chiudi le istruzioni di installazione"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#80A1B2] transition-colors hover:bg-[#1C4A5C]/5 hover:text-[#1C4A5C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C4A5C]/5 text-[#1C4A5C]">
                  <Share className="h-4 w-4" />
                </div>
                <p className="pt-1.5 text-sm leading-relaxed text-[#3D3D3C]">
                  Tocca l&apos;icona Condividi in basso su Safari (quadrato con freccia in su).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C4A5C]/5 text-[#1C4A5C]">
                  <Plus className="h-4 w-4" />
                </div>
                <p className="pt-1.5 text-sm leading-relaxed text-[#3D3D3C]">
                  Scorri e tocca Aggiungi alla schermata Home.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#C5A880]/30 bg-white p-1 shadow-xs">
                  <Image
                    src="/apple-touch-icon.png"
                    alt="Icona Cocoora"
                    width={28}
                    height={28}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="pt-1.5 text-sm leading-relaxed text-[#3D3D3C]">
                  L&apos;icona ufficiale Cocoora in blu sarà salvata direttamente sulla tua schermata iniziale!
                </p>
              </div>
            </div>

            <div className="border-t border-[#80A1B2]/25 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowSheet(false)}
                className="w-full rounded-full bg-[#1C4A5C] px-4 py-2.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#03354B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] focus-visible:ring-offset-2"
              >
                Ho capito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
