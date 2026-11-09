import { NextRequest, NextResponse } from "next/server";
import { recordConsent, type ConsentChannel, type ConsentPreferences } from "@/lib/consent-ledger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      channel = "cookie_banner",
      preferences,
      userIdentifier,
      policyVersion,
      notes,
    } = body as {
      channel?: ConsentChannel;
      preferences: ConsentPreferences;
      userIdentifier?: string;
      policyVersion?: string;
      notes?: string;
    };

    if (!preferences) {
      return NextResponse.json(
        { error: "Oggetto preferences obbligatorio" },
        { status: 400 }
      );
    }

    // Estrazione dell'IP dai vari header standard di proxy e CDN (Vercel, Cloudflare, ecc.)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfConnectingIp = req.headers.get("cf-connecting-ip");
    const clientIp = cfConnectingIp || realIp || (forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1");

    const userAgent = req.headers.get("user-agent") || "Web Client";

    const record = await recordConsent({
      channel,
      rawIp: clientIp,
      userAgent,
      preferences,
      userIdentifier,
      policyVersion,
      notes,
    });

    return NextResponse.json({
      success: true,
      consentId: record.id,
      timestamp: record.timestamp,
      anonymizedIp: record.anonymizedIp,
      status: record.status,
    });
  } catch (err: any) {
    console.error("Errore registrazione consenso GDPR:", err);
    return NextResponse.json(
      { error: "Impossibile registrare il consenso", details: err?.message },
      { status: 500 }
    );
  }
}
