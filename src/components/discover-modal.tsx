"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useShop } from "./providers";
import { trackLead } from "@/lib/tracking";
import { Button } from "./ui";

export function DiscoverModal() {
  const { discoverOpen, closeDiscover } = useShop();
  const [done, setDone] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", telefono: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [trackingAccepted, setTrackingAccepted] = useState(false);
  const [error, setError] = useState("");

  if (!discoverOpen) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.telefono.trim()) {
      setError("Compila tutti i campi per generare il tuo profilo.");
      return;
    }
    if (!privacyAccepted || !trackingAccepted) {
      setError("Accetta entrambe le informative per procedere con l'iscrizione.");
      return;
    }
    setError("");
    trackLead({ email: form.email, name: form.nome });
    setProfileId(`CCR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setDone(true);
  };

  const reset = () => {
    setDone(false);
    setProfileId("");
    setForm({ nome: "", email: "", telefono: "" });
    setPrivacyAccepted(false);
    setTrackingAccepted(false);
    setError("");
    closeDiscover();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark-navy/50 backdrop-blur-sm animate-fade-in"
        onClick={reset}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl animate-fade-up">
        <button
          type="button"
          aria-label="Chiudi"
          onClick={reset}
          className="absolute right-4 top-4 rounded-full p-2 text-charcoal/50 transition-colors hover:bg-teal-50 hover:text-charcoal"
        >
          <X className="h-5 w-5" />
        </button>

        {!done ? (
          <>
            <h3 className="font-serif text-2xl font-semibold text-teal-900">
              Iscriviti gratuitamente al Cocoora Club
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Crea il tuo profilo sanitario digitale in 2 minuti ed entra nel
              Cocoora Club con il piano Discover (€0).
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3.5">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-teal-900">
                  Nome e cognome
                </span>
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full rounded-xl border border-teal-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal-600"
                  placeholder="Nome e cognome"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-teal-900">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-teal-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal-600"
                  placeholder="nome@email.it"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-teal-900">
                  Telefono
                </span>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full rounded-xl border border-teal-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal-600"
                  placeholder="+39 333 1234567"
                />
              </label>
              <div className="space-y-2 pt-1 text-xs text-charcoal/80">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-teal-300 text-teal-700 focus:ring-teal-600"
                  />
                  <span>
                    Ho letto e accetto la Privacy Policy e il trattamento dei dati personali.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackingAccepted}
                    onChange={(e) => setTrackingAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-teal-300 text-teal-700 focus:ring-teal-600"
                  />
                  <span>
                    Acconsento alla misurazione dell&apos;apertura delle comunicazioni e al monitoraggio dei click nelle email informative e promozionali.
                  </span>
                </label>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Iscriviti al Club
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <h3 className="font-serif text-2xl font-semibold text-teal-900">
              Iscrizione completata!
            </h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Benvenuto {form.nome}. Il tuo profilo Cocoora Club è attivo.
            </p>
            <div className="mt-4 rounded-2xl bg-teal-50 px-6 py-3 font-mono text-lg font-semibold tracking-widest text-teal-800">
              {profileId}
            </div>
            <p className="mt-4 text-xs text-charcoal/60">
              Scarica l&apos;app Cocoora e accedi con la tua email per iniziare a usufruire di tutti i vantaggi del Club.
            </p>
            <Button className="mt-6" onClick={reset}>
              Chiudi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
