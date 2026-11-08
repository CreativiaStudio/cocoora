"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function TelemetryProvider() {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(Date.now());
  const currentPathRef = useRef<string>(pathname);

  // Invia il tempo di permanenza trascorso sulla pagina precedente
  const sendTimeOnPage = (path: string, durationSec: number) => {
    if (durationSec < 2) return; // ignora rimbalzi istantanei minori di 2s
    const payload = JSON.stringify({
      type: "time_on_page",
      pathname: path,
      durationSeconds: Math.round(durationSec),
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", payload);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  };

  // Monitora il cambio route
  useEffect(() => {
    const prevPath = currentPathRef.current;
    const now = Date.now();
    const elapsedSeconds = (now - pageStartTimeRef.current) / 1000;

    // Se cambia route, invia durata della pagina precedente
    if (prevPath && prevPath !== pathname) {
      sendTimeOnPage(prevPath, elapsedSeconds);
    }

    // Registra page_view della nuova pagina
    currentPathRef.current = pathname;
    pageStartTimeRef.current = now;

    // Invia page view server side
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        pathname,
      }),
    }).catch(() => {});
  }, [pathname]);

  // Gestione chiusura tab o navigazione esterna (beforeunload / visibilitychange)
  useEffect(() => {
    const handleUnload = () => {
      const elapsedSeconds = (Date.now() - pageStartTimeRef.current) / 1000;
      sendTimeOnPage(currentPathRef.current, elapsedSeconds);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const elapsedSeconds = (Date.now() - pageStartTimeRef.current) / 1000;
        sendTimeOnPage(currentPathRef.current, elapsedSeconds);
      } else {
        pageStartTimeRef.current = Date.now();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Intercettatore globale click su CTA (WhatsApp, Chiamate, data-track-cta)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button");
      if (!target) return;

      let ctaId: string | null = target.getAttribute("data-track-cta");
      let ctaLabel: string | null = target.getAttribute("data-track-label") || target.textContent?.trim() || null;

      const href = target.getAttribute("href") || "";

      if (!ctaId) {
        if (href.startsWith("tel:")) {
          ctaId = "cta_chiama_telefono";
          ctaLabel = "Chiamata Diretta Centro";
        } else if (href.includes("wa.me") || href.includes("whatsapp")) {
          ctaId = "cta_whatsapp_chat";
          ctaLabel = "Contatto WhatsApp Live";
        } else if (href === "/club" || href.startsWith("/club/")) {
          ctaId = "cta_club_navigazione";
        } else if (href === "/medici" || href.startsWith("/medici/")) {
          ctaId = "cta_medici_visite";
        }
      }

      if (ctaId) {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "cta_click",
            pathname: window.location.pathname,
            ctaId,
            ctaLabel: ctaLabel?.slice(0, 50),
          }),
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null;
}
