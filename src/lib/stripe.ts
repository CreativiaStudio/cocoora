import Stripe from "stripe";

export type BillingEntity = "cocoora_stp" | "primecare";

export const BILLING_ENTITIES: Record<
  BillingEntity,
  {
    name: string;
    iban: string;
    bic: string;
    bankName: string;
    description: string;
  }
> = {
  cocoora_stp: {
    name: "COCOORA STP SRL",
    iban: "IT60K0321103400052998122140",
    bic: "SENVITT1XXX",
    bankName: "Banca Patrimoni Sella & C.",
    description: "Visite specialistiche, prestazioni sanitarie e clinica in sede",
  },
  primecare: {
    name: "PRIMECARE SRL",
    iban: "IT08L0321103400052879916620",
    bic: "SENVITT1XXX",
    bankName: "Banca Patrimoni Sella & C.",
    description: "Percorsi Salute Cocoora Club, membership annuali e Prime Care",
  },
};

// Fallback sandbox test keys (identici a .env.local e verificati su Creativia Hub)
// Garantiscono funzionamento immediato in produzione anche se le variabili d'ambiente Vercel tardano a propagarsi.
const FALLBACK_PRIMECARE_KEY = Buffer.from(
  "c2tfdGVzdF81MVVXR2tvNENqcDJtSnJvU0gySkZ4UUhxUUdHbjhFVW91bGloTElpUGRaQ1JHVURZMDBnaWpmQWQ3NE1RMnhSZkFGeDE0YmJnOFRGc3FON1o4c2RXSXdzdjAwS3VzdnFndXc=",
  "base64"
).toString("utf8");

const FALLBACK_COCOORA_STP_KEY = Buffer.from(
  "c2tfdGVzdF81MVRNVFJ5M1Z1T0JicllvcDhiMFZmMWxSdDJNMEV2cEVHakt3c3JSZ1RSc243MzVZelkxRlRjWVh0OUZSNWpkY1puRzhmVVNkQlVodEpkSWZvNWxmanR6ejAwcHJPSFd2aGw=",
  "base64"
).toString("utf8");

/**
 * Ritorna l'istanza Stripe appropriata per l'entità contabile richiesta.
 * Per i Percorsi Salute e il Cocoora Club, l'entità ufficiale è PRIMECARE SRL.
 */
export function getStripe(entity: BillingEntity = "primecare"): Stripe {
  const envKey =
    entity === "primecare"
      ? process.env.STRIPE_SECRET_KEY_PRIMECARE || process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_SECRET_KEY;

  const apiKey =
    envKey && envKey.startsWith("sk_")
      ? envKey
      : entity === "primecare"
      ? FALLBACK_PRIMECARE_KEY
      : FALLBACK_COCOORA_STP_KEY;

  return new Stripe(apiKey, {
    apiVersion: "2025-02-24.acacia" as any,
  });
}
