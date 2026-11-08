"use client";

import { Sliders } from "lucide-react";

export function CookiePreferencesTrigger({ className }: { className?: string }) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cocoora_open_cookie_preferences"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-500 cursor-pointer"
      }
    >
      <Sliders className="h-4 w-4" />
      <span>Personalizza Preferenze Cookie</span>
    </button>
  );
}
