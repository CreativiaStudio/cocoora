"use client";

import { useState, type FormEvent } from "react";
import {
  Apple,
  Check,
  CreditCard,
  Landmark,
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
  { id: "card", label: "Carta di credito", sub: "Visa · Mastercard · Amex", Icon: CreditCard },
  { id: "klarna", label: "Klarna", sub: "Paga a rate", Icon: Wallet },
  { id: "paypal", label: "PayPal", sub: "Fino a 24 rate", Icon: Wallet },
  { id: "applepay", label: "Apple Pay", sub: "Pagamento rapido", Icon: Apple },
  { id: "googlepay", label: "Google Pay", sub: "Pagamento rapido", Icon: Smartphone },
  { id: "revolut", label: "Revolut", sub: "Paga in un click", Icon: Landmark },
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

  if (!checkoutItem) return null;

  const { tier, gender } = checkoutItem;
  const isSuMisura = tier.price === 0 && tier.priceLabel.toLowerCase().includes("misura");

  const submitLead = (e: FormEvent) => {
    e.preventDefault();
    if (!lead.nome.trim() || !lead.email.trim()) {
      setError("Compila almeno nome ed email per proseguire.");
      return;
    }
    setError("");
    persistLead(lead);
    trackLead({ email: lead.email, name: `${lead.nome} ${lead.cognome}`.trim() });
    trackAddToCart({ item_id: tier.id, item_name: tier.name, price: tier.price });
    trackBeginCheckout([
      { item_id: tier.id, item_name: tier.name, price: tier.price },
    ]);
    setStep("payment");
  };

  const confirm = () => {
    const orderId = `ccr_${Date.now().toString(36)}`;
    trackPurchase({
      transaction_id: orderId,
      value: tier.price,
      items: [{ item_id: tier.id, item_name: tier.name, price: tier.price }],
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
              {tier.priceLabel}
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
              <div className="rounded-2xl bg-teal-50 p-4">
                <p className="text-sm text-charcoal/70">Totale</p>
                <p className="font-serif text-3xl font-semibold text-teal-900">
                  {formatPrice(tier.price)}
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-teal-900">Metodo di pagamento</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map(({ id, label, sub, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all",
                        method === id
                          ? "border-teal-600 bg-teal-50/60 shadow-sm"
                          : "border-teal-100 hover:border-teal-300"
                      )}
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                      <span>
                        <span className="block text-sm font-medium text-teal-900">{label}</span>
                        <span className="block text-xs text-charcoal/60">{sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={confirm}>
                Conferma pagamento
              </Button>
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
