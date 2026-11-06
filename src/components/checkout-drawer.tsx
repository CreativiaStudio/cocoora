"use client";

import { useState, type FormEvent } from "react";
import {
  Apple,
  Check,
  CreditCard,
  Landmark,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { useShop } from "./providers";
import { formatPrice, cn } from "@/lib/utils";
import {
  trackBeginCheckout,
  trackLead,
  trackPurchase,
  trackAddToCart,
} from "@/lib/tracking";
import { Button } from "./ui";

const PAYMENT_METHODS = [
  { id: "card", label: "Carta di Credito", sub: "Visa · Mastercard · Amex", badge: "Immediato", Icon: CreditCard },
  { id: "klarna", label: "Klarna", sub: "3 rate senza interessi a tasso zero", badge: "3 Rate a Tasso Zero", Icon: Wallet },
  { id: "paypal", label: "PayPal", sub: "Paga in 3 rate senza interessi o conto", badge: "Paga in 3 Rate", Icon: Wallet },
  { id: "applepay", label: "Apple Pay", sub: "Pagamento rapido Face/Touch ID", badge: "1-Click", Icon: Apple },
  { id: "googlepay", label: "Google Pay", sub: "Pagamento protetto Google", badge: "1-Click", Icon: Smartphone },
  { id: "revolut", label: "Revolut Pay", sub: "Paga in un click dall'app", badge: "Rapido", Icon: Landmark },
];

type Step = "lead" | "payment" | "success";

function persistLead(lead: { nome: string; cognome: string; email: string; telefono: string }) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem("cocoora_leads") ?? "[]";
    const leads = JSON.parse(raw) as unknown[];
    leads.push({ ...lead, createdAt: new Date().toISOString() });
    window.localStorage.setItem("cocoora_leads", JSON.stringify(leads));
  } catch {
    // ignore
  }
}

export function CheckoutDrawer() {
  const { checkoutItem, closeCheckout } = useShop();
  const [method, setMethod] = useState("card");
  const [lead, setLead] = useState({ nome: "", cognome: "", email: "", telefono: "" });
  const [error, setError] = useState("");
  const [loadingStripe, setLoadingStripe] = useState(false);

  if (!checkoutItem) return null;

  const { tier, gender } = checkoutItem;
  const isSuMisura = tier.price === 0 && tier.priceLabel.toLowerCase().includes("misura");
  const activePrice = tier.genderToggle
    ? gender === "donna"
      ? (tier.priceDonna ?? tier.price)
      : (tier.priceUomo ?? tier.price)
    : tier.price;

  const startStripeCheckout = async () => {
    try {
      setLoadingStripe(true);
      setError("");

      if (lead.email || lead.nome) {
        persistLead(lead);
        trackLead({ email: lead.email, name: `${lead.nome} ${lead.cognome}`.trim() });
      }
      trackAddToCart({ item_id: tier.id, item_name: tier.name, price: activePrice });
      trackBeginCheckout([
        { item_id: tier.id, item_name: tier.name, price: activePrice },
      ]);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: tier.id,
          gender: gender || null,
          lead: lead.email || lead.nome ? lead : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Impossibile inizializzare il modulo di pagamento sicuro Stripe.");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err: unknown) {
      console.error("Errore checkout:", err);
      setError(err instanceof Error ? err.message : "Errore di connessione al circuito di pagamento Stripe. Riprova.");
    } finally {
      setLoadingStripe(false);
    }
  };

  const reset = () => {
    setLead({ nome: "", cognome: "", email: "", telefono: "" });
    setError("");
    setMethod("card");
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-dark-navy/40 backdrop-blur-sm animate-fade-in"
        onClick={reset}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
        <div className="flex items-start justify-between border-b border-teal-100 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
              Cocoora Club
            </p>
            <h3 className="mt-1 font-serif text-2xl font-semibold text-teal-900">
              {tier.name}
            </h3>
            <p className="mt-1 text-sm text-charcoal/70">
              {tier.genderToggle ? `${formatPrice(activePrice)} / anno` : tier.priceLabel}
              {gender ? ` · ${gender === "uomo" ? "Uomo" : "Donna"}` : ""}
            </p>
          </div>
          <button
            type="button"
            aria-label="Chiudi"
            onClick={reset}
            className="rounded-full p-2 text-charcoal/50 transition-colors hover:bg-teal-50 hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isSuMisura && (
            <div className="space-y-5">
              {/* Box Riepilogo Quota e Rate */}
              <div className="rounded-2xl bg-teal-50/80 p-4 border border-teal-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">Totale Quota</p>
                    <p className="font-serif text-3xl font-bold text-teal-950">
                      {formatPrice(activePrice)}
                    </p>
                  </div>
                  {activePrice > 0 && (
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                        Tasso Zero
                      </span>
                      <p className="text-xs text-charcoal/80 mt-1">
                        o <strong>3 rate da {formatPrice(Math.round(activePrice / 3))}</strong>
                      </p>
                    </div>
                  )}
                </div>
                {activePrice > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-teal-200/50 flex items-center justify-between text-[11px] text-teal-900 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Transazione Protetta SSL 256-bit
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="h-3 w-3" /> Attivazione Immediata
                    </span>
                  </div>
                )}
              </div>

              {/* Striscia Compatta Loghi Metodi di Pagamento Accettati */}
              <div className="rounded-xl border border-teal-100/90 bg-white p-3 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-teal-950 uppercase tracking-wide text-[10px]">
                    Metodi di pagamento accettati
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Anche in 3 Rate a Tasso Zero
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-2xs">
                    Visa
                  </span>
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-2xs">
                    Mastercard
                  </span>
                  <span className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50/80 px-2.5 py-1 text-[11px] font-bold text-sky-800 shadow-2xs">
                    Amex
                  </span>
                  <span className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-2xs">
                     Pay
                  </span>
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                    G Pay
                  </span>
                  <span className="inline-flex items-center rounded-md border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-bold text-pink-700 shadow-2xs">
                    Klarna <span className="ml-1 text-[9px] font-medium text-pink-600">3 rate</span>
                  </span>
                  <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 shadow-2xs">
                    PayPal <span className="ml-1 text-[9px] font-medium text-blue-600">3 rate</span>
                  </span>
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-2xs">
                    Revolut
                  </span>
                </div>
              </div>

              {/* Campi Rapidi Dati Ricevuta (Precompilazione opzionale) */}
              <div className="space-y-3 pt-1 border-t border-teal-100/70">
                <p className="text-xs font-semibold text-teal-950 flex items-center gap-1.5">
                  <span>Dati per ricevuta e attivazione</span>
                  <span className="text-[10px] font-normal text-charcoal/50">(inseribili anche su Stripe)</span>
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Nome e Cognome" value={lead.nome} onChange={(v) => setLead({ ...lead, nome: v })} />
                  <Field label="Telefono" type="tel" value={lead.telefono} onChange={(v) => setLead({ ...lead, telefono: v })} />
                </div>
                <Field label="Email per la ricevuta" type="email" value={lead.email} onChange={(v) => setLead({ ...lead, email: v })} />
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {error}
                </p>
              )}

              {/* CTA Principale E-commerce */}
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full flex items-center justify-center gap-2 text-sm sm:text-base py-3.5 shadow-md hover:shadow-lg transition-all"
                  size="lg"
                  disabled={loadingStripe}
                  onClick={startStripeCheckout}
                >
                  {loadingStripe ? (
                    "Apertura Cassa Protetta Stripe..."
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      <span>Procedi al Pagamento Sicuro ({formatPrice(activePrice)})</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-charcoal/60 leading-relaxed">
                  Verrai reindirizzato alla cassa crittografata e protetta Stripe. Paga subito con Carta o in <strong>3 rate a tasso zero</strong> con Klarna e PayPal.
                </p>
              </div>
            </div>
          )}

          {isSuMisura && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-charcoal/80">
                Il percorso {tier.name} viene costruito su misura sulle tue esigenze.
                Ti abbiamo registrato: sarai ricontattato dal nostro team.
              </p>
              <Button className="w-full" size="lg" onClick={reset}>
                Chiudi
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-teal-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600"
      />
    </label>
  );
}
