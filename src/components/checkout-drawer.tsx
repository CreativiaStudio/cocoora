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
  const [step, setStep] = useState<Step>("lead");
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

  const submitLead = (e: FormEvent) => {
    e.preventDefault();
    if (!lead.nome.trim() || !lead.email.trim()) {
      setError("Compila almeno nome ed email per proseguire.");
      return;
    }
    setError("");
    persistLead(lead);
    trackLead({ email: lead.email, name: `${lead.nome} ${lead.cognome}`.trim() });
    trackAddToCart({ item_id: tier.id, item_name: tier.name, price: activePrice });
    trackBeginCheckout([
      { item_id: tier.id, item_name: tier.name, price: activePrice },
    ]);
    setStep("payment");
  };

  const startStripeCheckout = async () => {
    try {
      setLoadingStripe(true);
      setError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: tier.id,
          gender: gender || null,
          lead,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Impossibile inizializzare il modulo di pagamento sicuro.");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setStep("success");
    } catch (err: unknown) {
      console.error("Errore checkout:", err);
      setError(err instanceof Error ? err.message : "Errore di connessione al circuito di pagamento. Riprova.");
    } finally {
      setLoadingStripe(false);
    }
  };

  const confirm = () => {
    const orderId = `ccr_${Date.now().toString(36)}`;
    trackPurchase({
      transaction_id: orderId,
      value: activePrice,
      items: [{ item_id: tier.id, item_name: tier.name, price: activePrice }],
    });
    setStep("success");
  };

  const reset = () => {
    setStep("lead");
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
          {step === "lead" && (
            <form onSubmit={submitLead} className="space-y-4">
              <p className="text-sm leading-relaxed text-charcoal/80">
                Lascia i tuoi dati: il nostro team ti ricontatterà per completare
                l&apos;attivazione del percorso {tier.name}.
              </p>
              <Field label="Nome *" value={lead.nome} onChange={(v) => setLead({ ...lead, nome: v })} />
              <Field label="Cognome" value={lead.cognome} onChange={(v) => setLead({ ...lead, cognome: v })} />
              <Field label="Email *" type="email" value={lead.email} onChange={(v) => setLead({ ...lead, email: v })} />
              <Field label="Telefono" type="tel" value={lead.telefono} onChange={(v) => setLead({ ...lead, telefono: v })} />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Continua
              </Button>
            </form>
          )}

          {step === "payment" && !isSuMisura && (
            <div className="space-y-5">
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
                    <span className="text-charcoal/60">Klarna · PayPal · Carte</span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-teal-900">Metodo di pagamento preferito</p>
                  <span className="text-[11px] text-teal-700 font-medium">Rateizzazione inclusa</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map(({ id, label, sub, badge, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id)}
                      className={cn(
                        "relative flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all",
                        method === id
                          ? "border-teal-600 bg-teal-50/70 shadow-sm ring-1 ring-teal-600/30"
                          : "border-teal-100 hover:border-teal-300 bg-white"
                      )}
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 flex-wrap">
                          <span className="block text-sm font-medium text-teal-900">{label}</span>
                        </span>
                        <span className="block text-[11px] leading-tight text-charcoal/60 mt-0.5">{sub}</span>
                        {badge && (
                          <span className="mt-1.5 inline-block text-[9px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-1.5 py-0.5 rounded">
                            {badge}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  disabled={loadingStripe}
                  onClick={startStripeCheckout}
                >
                  {loadingStripe ? (
                    "Apertura Cassa Protetta..."
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Procedi al Pagamento Sicuro ({formatPrice(tier.price)})</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-charcoal/60 leading-relaxed">
                  Paga subito o in <strong>3 rate a tasso zero</strong> con Klarna e PayPal. Nessun costo nascosto.
                </p>
              </div>
            </div>
          )}

          {step === "payment" && isSuMisura && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-charcoal/80">
                Il percorso {tier.name} viene costruito su misura sulle tue esigenze.
                Ti abbiamo registrato: sarai ricontattato dal nostro team.
              </p>
              <Button className="w-full" size="lg" onClick={confirm}>
                Richiedi informazioni
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Check className="h-8 w-8" />
              </div>
              <h4 className="mt-5 font-serif text-2xl font-semibold text-teal-900">
                Richiesta completata
              </h4>
              <p className="mt-2 max-w-xs text-sm text-charcoal/70">
                Grazie {lead.nome || ""}! Ti abbiamo inviato una mail di conferma a{" "}
                <span className="font-medium text-teal-800">{lead.email}</span>.
              </p>
              <Button className="mt-6" onClick={reset}>
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
