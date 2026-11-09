import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { reconcileStripeSession } from "@/lib/stripe-reconcile";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Payload JSON non valido" }, { status: 400 });
    }

    // Se checkout.session.completed, riconcilia
    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      if (session?.id) {
        console.log(`[Stripe Webhook] Ricevuta sessione completata: ${session.id}`);
        await reconcileStripeSession(session.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("Errore elaborazione webhook Stripe:", err);
    return NextResponse.json({ error: "Errore webhook" }, { status: 500 });
  }
}
