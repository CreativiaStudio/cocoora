/**
 * Helper client-side per avviare il checkout e-commerce Stripe su PRIMECARE SRL.
 * Crea la sessione di pagamento sicura e reindirizza istantaneamente a checkout.stripe.com.
 */
export async function redirectToStripeCheckout(params: {
  tierId: string;
  gender?: "uomo" | "donna" | null;
  lead?: { nome?: string; cognome?: string; email?: string; telefono?: string } | null;
}): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data.error || "Impossibile inizializzare il modulo di pagamento sicuro Stripe.");
  }

  window.location.href = data.url;
}
