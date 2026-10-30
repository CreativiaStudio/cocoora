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

/**
 * Ritorna l'istanza Stripe appropriata per l'entità contabile richiesta.
 * Supporta architettura a doppia chiave (STRIPE_SECRET_KEY_PRIMECARE vs STRIPE_SECRET_KEY).
 */
export function getStripe(entity: BillingEntity = "primecare"): Stripe {
  const apiKey =
    entity === "primecare"
      ? process.env.STRIPE_SECRET_KEY_PRIMECARE || process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error(
      `Chiave segreta Stripe mancante per l'entità fiscale "${entity}". Configura STRIPE_SECRET_KEY o STRIPE_SECRET_KEY_PRIMECARE in .env.local o Vercel.`
    );
  }

  return new Stripe(apiKey, {
    apiVersion: "2025-02-24.acacia" as any,
  });
}
