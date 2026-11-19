import { NextResponse } from "next/server";
import { getTrackingConfig } from "@/lib/tracking-config";

async function sha256Normalized(value?: string): Promise<string | undefined> {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;
  const bytes = new TextEncoder().encode(clean);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      eventName?: string;
      eventId?: string;
      value?: number;
      currency?: string;
      contentName?: string;
      contentIds?: string[];
      eventSourceUrl?: string;
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      fbp?: string;
      fbc?: string;
    } | null;

    if (!body?.eventName || !body?.eventId) {
      return NextResponse.json(
        { ok: false, error: "eventName e eventId obbligatori" },
        { status: 400 }
      );
    }

    const config = await getTrackingConfig({ fresh: true });
    const pixelId = config.metaPixelId?.trim();
    const accessToken = (
      config.metaCapiAccessToken ||
      process.env.META_CAPI_ACCESS_TOKEN ||
      ""
    ).trim();

    if (!pixelId || !accessToken) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "CAPI non ancora configurato",
      });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = realIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : undefined);
    const userAgent = request.headers.get("user-agent") || undefined;

    const cleanPhone = body.phone ? body.phone.replace(/[^\d]/g, "") : undefined;
    const [emHash, phHash, fnHash, lnHash] = await Promise.all([
      sha256Normalized(body.email),
      sha256Normalized(cleanPhone),
      sha256Normalized(body.firstName),
      sha256Normalized(body.lastName),
    ]);

    const userData: Record<string, unknown> = {
      ...(emHash ? { em: [emHash] } : {}),
      ...(phHash ? { ph: [phHash] } : {}),
      ...(fnHash ? { fn: [fnHash] } : {}),
      ...(lnHash ? { ln: [lnHash] } : {}),
      ...(clientIp ? { client_ip_address: clientIp } : {}),
      ...(userAgent ? { client_user_agent: userAgent } : {}),
      ...(body.fbp ? { fbp: body.fbp } : {}),
      ...(body.fbc ? { fbc: body.fbc } : {}),
    };

    const eventPayload: Record<string, unknown> = {
      event_name: body.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.eventId,
      action_source: "website",
      ...(body.eventSourceUrl ? { event_source_url: body.eventSourceUrl } : {}),
      user_data: userData,
      custom_data: {
        currency: body.currency || "EUR",
        ...(typeof body.value === "number" ? { value: body.value } : {}),
        ...(body.contentName ? { content_name: body.contentName } : {}),
        ...(body.contentIds?.length ? { content_ids: body.contentIds } : {}),
      },
    };

    const graphBody: Record<string, unknown> = {
      data: [eventPayload],
      ...(config.metaCapiTestEventCode
        ? { test_event_code: config.metaCapiTestEventCode.trim() }
        : {}),
    };

    const graphRes = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(
        pixelId
      )}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphBody),
      }
    );

    const graphJson = await graphRes.json().catch(() => null);
    if (!graphRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: graphJson?.error?.message || `Meta Graph API HTTP ${graphRes.status}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      eventId: body.eventId,
      eventsReceived: graphJson?.events_received ?? 1,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore interno Meta CAPI";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
