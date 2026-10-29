"use client";

import { useEffect, useRef } from "react";

export type BookingHotkeysOptions = {
  enabled?: boolean;
  onFocusPatient?: () => void;
  onFocusService?: () => void;
  onConfirm?: () => void;
  onEscape?: () => void;
};

function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) return false;

  const tag = element.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    element.isContentEditable
  );
}

function isNativeActionTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) return false;
  const tag = element.tagName;
  return tag === "BUTTON" || tag === "A" || tag === "SUMMARY";
}

/**
 * Scorciatoie tastiera della segreteria:
 * "/" → cerca paziente, "S" → cerca prestazione,
 * "Invio" → conferma / prosegue, "Esc" → chiude il drawer.
 */
export function useBookingHotkeys(options: BookingHotkeysOptions): void {
  const handlersRef = useRef(options);
  const enabled = options.enabled ?? true;

  useEffect(() => {
    handlersRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing) return;

      const handlers = handlersRef.current;
      const key = event.key;

      if (key === "Escape") {
        handlers.onEscape?.();
        return;
      }

      const typing = isTypingTarget(event.target);
      const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

      if (!typing && !hasModifier && (key === "/" || event.code === "Slash")) {
        event.preventDefault();
        handlers.onFocusPatient?.();
        return;
      }

      if (
        !typing &&
        !hasModifier &&
        key.toLowerCase() === "s" &&
        key.length === 1
      ) {
        event.preventDefault();
        handlers.onFocusService?.();
        return;
      }

      if (key === "Enter") {
        if (typing || isNativeActionTarget(event.target)) return;
        event.preventDefault();
        handlers.onConfirm?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
