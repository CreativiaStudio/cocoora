import { NextResponse } from "next/server";
import { recordTelemetryEvent, type TelemetryEvent } from "@/lib/telemetry-store";

export async function POST(request: Request) {
  try {
    const rawText = await request.text().catch(() => "");
    let body: Record<string, unknown> | null = null;
    if (rawText) {
      try {
        body = JSON.parse(rawText) as Record<string, unknown>;
      } catch {
        body = null;
      }
    }

    if (!body || typeof body.type !== "string" || typeof body.pathname !== "string") {
      return NextResponse.json({ ok: false, error: "Payload non valido" }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const ip = forwardedFor.split(",")[0].trim();
    const userAgent = request.headers.get("user-agent") || "";
    const today = new Date().toISOString().slice(0, 10);

    const rawSeed = `${ip}-${userAgent.slice(0, 30)}-${today}-cocoora_telemetry_salt`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawSeed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const visitorHash = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

    const event: TelemetryEvent = {
      type: body.type as TelemetryEvent["type"],
      pathname: body.pathname,
      durationSeconds:
        typeof body.durationSeconds === "number" ? body.durationSeconds : undefined,
      ctaId: typeof body.ctaId === "string" ? body.ctaId : undefined,
      ctaLabel: typeof body.ctaLabel === "string" ? body.ctaLabel : undefined,
      device: isMobile ? "mobile" : "desktop",
      visitorHash,
      timestamp: new Date().toISOString(),
      metadata:
        body.metadata && typeof body.metadata === "object"
          ? (body.metadata as Record<string, unknown>)
          : undefined,
    };

    const result = await recordTelemetryEvent(event);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Errore registrazione evento su Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore interno telemetria";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
