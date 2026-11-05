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
                    <span className="text-charcoal/60">Incasso Primecare SRL</span>
                  </div>
                )}
              </div>

              {/* Informazioni fiscali Primecare */}
              <div className="rounded-xl border border-teal-100 bg-white p-3.5 text-[11px] text-charcoal/75 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-teal-950">Fatturazione &amp; Incasso:</span>
                  <span className="font-semibold text-teal-900">PRIMECARE SRL</span>
                </div>
                <div className="flex justify-between text-[10px] text-charcoal/60">
                  <span>Accredito Bancario Ufficiale:</span>
                  <span className="font-mono">Banca Patrimoni Sella &amp; C.</span>
                </div>
              </div>

              {/* Metodi di Pagamento Accettati */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-900">Metodi di pagamento accettati</p>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Klarna &amp; PayPal 3 Rate</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(({ id, label, sub, Icon }) => (
                    <div
                      key={id}
                      className="flex items-center gap-2.5 rounded-xl border border-teal-100 bg-white p-2.5 text-left text-xs"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-teal-700" />
                      <div className="min-w-0">
                        <span className="block font-medium text-teal-950 leading-tight truncate">{label}</span>
                        <span className="block text-[10px] text-charcoal/50 truncate">{sub}</span>
                      </div>
                    </div>
                  ))}
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
                  Verrai reindirizzato alla cassa crittografata Stripe di <strong>PRIMECARE SRL</strong>. Paga subito con Carta o in <strong>3 rate a tasso zero</strong> con Klarna e PayPal.
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
