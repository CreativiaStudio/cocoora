"use client";

import { useState, type FormEvent } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { useShop } from "./providers";
import { trackLead } from "@/lib/tracking";
import { Button } from "./ui";

export function DiscoverModal() {
  const { discoverOpen, closeDiscover } = useShop();
  const [done, setDone] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [form, setForm] = useState({ nome: "", email: "" });
  const [error, setError] = useState("");

  if (!discoverOpen) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) {
      setError("Compila nome ed email per generare il tuo profilo.");
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
    setForm({ nome: "", email: "" });
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">
              Inizia gratis
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Crea il tuo profilo sanitario digitale in 2 minuti e accedi
              all'ecosistema Cocoora con il piano Discover (€0).
            </p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-teal-900">Nome</span>
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                  placeholder="Il tuo nome"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-teal-900">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                  placeholder="nome@email.it"
                />
              </label>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Genera il mio profilo
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-teal-900">
              Profilo creato!
            </h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Benvenuto {form.nome}. Il tuo profilo digitale è attivo.
            </p>
            <div className="mt-4 rounded-2xl bg-teal-50 px-6 py-3 font-mono text-lg font-semibold tracking-widest text-teal-800">
              {profileId}
            </div>
            <p className="mt-4 text-xs text-charcoal/60">
              Scarica l'app Cocoora e accedi con la tua email per iniziare.
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
