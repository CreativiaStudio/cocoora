/**
 * Cocoora — Tracking & DataLayer
 *
 * Utilizzato da Marco (GTM) e Mario (Meta CAPI server-side) per la
 * deduplicazione degli eventi. Ogni evento pushato nel DataLayer include un
 * `event_id` univoco.
 */

type DataLayerEvent =
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "lead"
  | "consent_update"
  | "select_item"
  | "view_item_list";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

let eventCounter = 0;

export function generateEventId(): string {
  eventCounter += 1;
  const rand = Math.random().toString(36).slice(2, 10);
  return `evt_${Date.now().toString(36)}_${eventCounter.toString(36)}_${rand}`;
}

function ensureDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  return window.dataLayer;
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
  return pushToDataLayer("view_item", {
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
}

export function trackAddToCart(item: {
  item_id: string;
  item_name: string;
  price: number;
  currency?: string;
}): string {
  return pushToDataLayer("add_to_cart", {
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
}

export function trackBeginCheckout(items: {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
}[]): string {
  const value = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );
  return pushToDataLayer("begin_checkout", {
    ecommerce: {
      currency: "EUR",
      value,
      items,
    },
  });
}

export function trackPurchase(order: {
  transaction_id: string;
  value: number;
  items: { item_id: string; item_name: string; price: number }[];
}): string {
  return pushToDataLayer("purchase", {
    ecommerce: {
      currency: "EUR",
      transaction_id: order.transaction_id,
      value: order.value,
      items: order.items,
    },
  });
}

export function trackLead(data: { email: string; name?: string }): string {
  return pushToDataLayer("lead", { lead: data });
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

/**
 * Google Consent Mode v2 — spinge l'evento `consent_update` nel DataLayer
 * quando l'utente aggiorna le preferenze (senza bisogno di cookiebot esterni).
 */
export function pushConsentUpdate(consent: {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  functionality_storage: "granted" | "denied";
  personalization_storage: "granted" | "denied";
  security_storage: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
}): string {
  return pushToDataLayer("consent_update", { consent });
}
