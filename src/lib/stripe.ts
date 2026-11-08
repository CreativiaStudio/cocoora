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
 * Per i Percorsi Salute e il Cocoora Club, l'entità ufficiale è PRIMECARE SRL.
 */
export function getStripe(entity: BillingEntity = "primecare"): Stripe {
  const envKey =
    entity === "primecare"
      ? process.env.STRIPE_SECRET_KEY_PRIMECARE || process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_SECRET_KEY;

  if (!envKey || !envKey.startsWith("sk_")) {
    throw new Error(
      `STRIPE_SECRET_KEY per entità '${entity}' non configurata nelle variabili d'ambiente server.`
    );
  }

  return new Stripe(envKey, {
    apiVersion: "2025-02-24.acacia" as any,
  });
}
