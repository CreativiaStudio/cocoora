import { NextResponse } from "next/server";
import { reconcileStripeSession } from "@/lib/stripe-reconcile";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Parametro 'session_id' mancante." },
        { status: 400 }
      );
    }

    const result = await reconcileStripeSession(sessionId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Errore verifica sessione Stripe:", err);
    const message = err instanceof Error ? err.message : "Errore interno verifica";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = body?.session_id;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Parametro 'session_id' mancante nel body." },
        { status: 400 }
      );
    }

    const result = await reconcileStripeSession(sessionId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Errore verifica sessione Stripe:", err);
    const message = err instanceof Error ? err.message : "Errore interno verifica";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
