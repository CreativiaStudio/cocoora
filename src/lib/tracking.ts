import type { ConsentState } from "./types";

/**
 * Cocoora — Tracking & DataLayer
 *
 * Utilizzato da Marco (GTM) e Mario (Meta CAPI server-side) per la
 * deduplicazione degli eventi. Ogni evento pushato nel DataLayer include un
 * `event_id` univoco e condiviso con `/api/tracking/capi`.
 */

type DataLayerEvent =
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "lead"
  | "consent_update"
  | "email_tracking_consent"
  | "select_item"
  | "view_item_list";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    __cocooraConsentInitialized?: boolean;
    __cocooraConsentUpdatedFromStorage?: boolean;
    __cocooraMetaPixelLoaded?: string;
  }
}

let eventCounter = 0;

export function generateEventId(): string {
  eventCounter += 1;
  const rand = Math.random().toString(36).slice(2, 10);
  return `evt_${Date.now().toString(36)}_${eventCounter.toString(36)}_${rand}`;
}

function ensureDataLayer(): unknown[] {
  if (typeof window === "undefined") return [];
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  return window.dataLayer;
}

function ensureGtag() {
  if (typeof window === "undefined") return;
  ensureDataLayer();
  if (typeof window.gtag !== "function") {
    // Google Tag Manager / gtag.js richiede un oggetto Arguments nativo nel dataLayer, non un Array
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}

export function initConsentDefault(initial?: Partial<ConsentState>) {
  if (typeof window === "undefined" || window.__cocooraConsentInitialized) return;
  ensureGtag();
  const state: ConsentState & { wait_for_update: number } = {
    ad_storage: initial?.ad_storage ?? "denied",
    analytics_storage: initial?.analytics_storage ?? "denied",
    functionality_storage: initial?.functionality_storage ?? "denied",
    personalization_storage: initial?.personalization_storage ?? "denied",
    security_storage: initial?.security_storage ?? "granted",
    ad_user_data: initial?.ad_user_data ?? "denied",
    ad_personalization: initial?.ad_personalization ?? "denied",
    wait_for_update: 500,
  };
  window.gtag?.("consent", "default", state);
  window.gtag?.("set", "url_passthrough", true);
  window.gtag?.("set", "ads_data_redaction", true);
  window.__cocooraConsentInitialized = true;
}

function getCookieValue(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function hasMarketingConsentStored(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("cocoora_consent_v1");
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return parsed.ad_storage === "granted";
  } catch {
    return false;
  }
}

export function sendInternalTelemetry(type: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      type,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
      metadata,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", payload);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

type CapiEventName = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Lead";

export function sendMetaCapiEvent(params: {
  eventName: CapiEventName;
  eventId: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}) {
  if (typeof window === "undefined" || !hasMarketingConsentStored()) return;
  try {
    if (window.__cocooraMetaPixelLoaded && typeof window.fbq === "function") {
      const fbCustom: Record<string, unknown> = {
        currency: params.currency || "EUR",
        ...(typeof params.value === "number" ? { value: params.value } : {}),
        ...(params.contentName ? { content_name: params.contentName } : {}),
        ...(params.contentIds?.length ? { content_ids: params.contentIds } : {}),
      };
      window.fbq("track", params.eventName, fbCustom, { eventID: params.eventId });
    }
    const payload = {
      ...params,
      eventSourceUrl: window.location.href,
      fbp: getCookieValue("_fbp"),
      fbc: getCookieValue("_fbc"),
    };
    fetch("/api/tracking/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function pushToDataLayer(
  event: DataLayerEvent,
  data: Record<string, unknown> = {}
): string {
  const eventId = generateEventId();
  const payload = {
    event,
    event_id: eventId,
    ...data,
  };

  if (typeof window !== "undefined") {
    ensureDataLayer().push(payload);
  }

  return eventId;
}

export function trackViewItem(item: {
  item_id: string;
  item_name: string;
  price: number;
  currency?: string;
  item_category?: string;
}): string {
  sendInternalTelemetry("view_item", {
    itemId: item.item_id,
    itemName: item.item_name,
    price: item.price,
  });
  const eventId = pushToDataLayer("view_item", {
    ecommerce: {
      currency: item.currency ?? "EUR",
      value: item.price,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price,
          item_category: item.item_category ?? "Cocoora Club",
        },
      ],
    },
  });
  sendMetaCapiEvent({
    eventName: "ViewContent",
    eventId,
    value: item.price,
    currency: item.currency ?? "EUR",
    contentName: item.item_name,
    contentIds: [item.item_id],
  });
  return eventId;
}

export function trackAddToCart(item: {
  item_id: string;
  item_name: string;
  price: number;
  currency?: string;
}): string {
  sendInternalTelemetry("cart_add", {
    itemId: item.item_id,
    itemName: item.item_name,
    price: item.price,
  });
  const eventId = pushToDataLayer("add_to_cart", {
    ecommerce: {
      currency: item.currency ?? "EUR",
      value: item.price,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price,
        },
      ],
    },
  });
  sendMetaCapiEvent({
    eventName: "AddToCart",
    eventId,
    value: item.price,
    currency: item.currency ?? "EUR",
    contentName: item.item_name,
    contentIds: [item.item_id],
  });
  return eventId;
}

export function trackBeginCheckout(
  items: {
    item_id: string;
    item_name: string;
    price: number;
    quantity?: number;
  }[]
): string {
  const value = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );
  sendInternalTelemetry("checkout_begin", {
    itemsCount: items.length,
    totalValue: value,
  });
  const eventId = pushToDataLayer("begin_checkout", {
    ecommerce: {
      currency: "EUR",
      value,
      items,
    },
  });
  sendMetaCapiEvent({
    eventName: "InitiateCheckout",
    eventId,
    value,
    currency: "EUR",
    contentName: items.map((i) => i.item_name).join(", "),
    contentIds: items.map((i) => i.item_id),
  });
  return eventId;
}

export function trackPurchase(order: {
  transaction_id: string;
  value: number;
  items: { item_id: string; item_name: string; price: number }[];
  email?: string;
}): string {
  sendInternalTelemetry("purchase", {
    transactionId: order.transaction_id,
    totalValue: order.value,
  });
  const eventId = pushToDataLayer("purchase", {
    ecommerce: {
      currency: "EUR",
      transaction_id: order.transaction_id,
      value: order.value,
      items: order.items,
    },
  });
  sendMetaCapiEvent({
    eventName: "Purchase",
    eventId,
    value: order.value,
    currency: "EUR",
    contentName: order.items.map((i) => i.item_name).join(", "),
    contentIds: order.items.map((i) => i.item_id),
    email: order.email,
  });
  return eventId;
}

export function trackLead(data: {
  email: string;
  name?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  contentName?: string;
}): string {
  sendInternalTelemetry("lead_submit", { email: data.email, name: data.name });
  const eventId = pushToDataLayer("lead", { lead: data });
  const nameParts = (data.name || "").trim().split(/\s+/);
  sendMetaCapiEvent({
    eventName: "Lead",
    eventId,
    contentName: data.contentName || "Cocoora Lead",
    email: data.email,
    phone: data.phone,
    firstName: data.firstName || nameParts[0],
    lastName: data.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined),
  });
  return eventId;
}

export function trackSelectItem(item: {
  item_id: string;
  item_name: string;
  price: number;
}): string {
  return pushToDataLayer("select_item", {
    ecommerce: {
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price,
        },
      ],
    },
  });
}

export function trackEmailTrackingConsent(granted: boolean, channel: string): string {
  return pushToDataLayer("email_tracking_consent", {
    email_tracking_granted: granted,
    channel,
  });
}

/**
 * Google Consent Mode v2 — aggiorna in tempo reale:
 * 1) `gtag('consent', 'update', ...)` (con oggetto Arguments nativo)
 * 2) `fbq('consent', 'grant' | 'revoke')` (se Meta Pixel è caricato)
 * 3) DataLayer `consent_update`
 */
export function pushConsentUpdate(consent: ConsentState): string {
  if (typeof window !== "undefined") {
    ensureGtag();
    window.gtag?.("consent", "update", {
      ad_storage: consent.ad_storage,
      analytics_storage: consent.analytics_storage,
      functionality_storage: consent.functionality_storage,
      personalization_storage: consent.personalization_storage,
      security_storage: consent.security_storage,
      ad_user_data: consent.ad_user_data ?? consent.ad_storage,
      ad_personalization: consent.ad_personalization ?? consent.ad_storage,
    });
    if (typeof window.fbq === "function") {
      window.fbq("consent", consent.ad_storage === "granted" ? "grant" : "revoke");
    }
  }
  return pushToDataLayer("consent_update", { consent });
}
