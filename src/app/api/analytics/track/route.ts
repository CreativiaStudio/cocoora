import { NextResponse } from "next/server";
import { recordTelemetryEvent, type TelemetryEvent } from "@/lib/telemetry-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.type !== "string" || typeof body.pathname !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Anonimizzazione GDPR: generiamo un hash a 1 via usando IP + Data + Salt
    const forwardedFor = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const ip = forwardedFor.split(",")[0].trim();
    const userAgent = request.headers.get("user-agent") || "";
    const today = new Date().toISOString().slice(0, 10);

    // Hash non reversibile
    const rawSeed = `${ip}-${userAgent.slice(0, 30)}-${today}-cocoora_telemetry_salt`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawSeed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const visitorHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);

    // Rilevazione approssimata mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    const event: TelemetryEvent = {
      type: body.type,
      pathname: body.pathname,
      durationSeconds: typeof body.durationSeconds === "number" ? body.durationSeconds : undefined,
      ctaId: typeof body.ctaId === "string" ? body.ctaId : undefined,
      ctaLabel: typeof body.ctaLabel === "string" ? body.ctaLabel : undefined,
      device: isMobile ? "mobile" : "desktop",
      visitorHash,
      timestamp: new Date().toISOString(),
    };

    await recordTelemetryEvent(event);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
