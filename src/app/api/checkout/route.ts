import { NextResponse } from "next/server";
import { getStripe, BILLING_ENTITIES } from "@/lib/stripe";
import { CLUB_TIERS } from "@/lib/club";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tierId, gender, lead } = body;

    if (!tierId) {
      return NextResponse.json(
        { error: "Parametro tierId obbligatorio." },
        { status: 400 }
      );
    }

    const tier = CLUB_TIERS.find((t) => t.id === tierId);
    if (!tier) {
      return NextResponse.json(
        { error: `Percorso Club "${tierId}" non trovato nel catalogo.` },
        { status: 404 }
      );
    }

    // Se percorso gratuito (Discover), salva nel CRM e ritorna successo immediato
    if (tier.price === 0) {
      if (lead?.email && lead?.nome) {
        try {
          const supabase = getServiceSupabase();
          await supabase.from("patient_profiles").upsert(
            {
              first_name: lead.nome.trim(),
              last_name: (lead.cognome || "").trim() || "Paziente",
              email: lead.email.trim(),
              phone: (lead.telefono || "").trim(),
              notes: `Iscrizione Cocoora Club Gratuita — Percorso Discover (${new Date().toLocaleDateString("it-IT")})`,
            },
            { onConflict: "email" }
          );
        } catch (err) {
          console.warn("Errore salvataggio profilo Discover in Supabase", err);
        }
      }

      return NextResponse.json({
        success: true,
        free: true,
        url: `/club/success?tier=discover&name=${encodeURIComponent(lead?.nome || "Paziente")}`,
      });
    }

    // Calcolo prezzo (con eventuale differenziazione Uomo / Donna)
    let finalPrice = tier.price;
    if (gender === "donna" && tier.priceDonna) {
      finalPrice = tier.priceDonna;
    } else if (gender === "uomo" && tier.priceUomo) {
      finalPrice = tier.priceUomo;
    }

    // Risoluzione Entità Fiscale: tutti i percorsi Club sono gestiti e incassati da PRIMECARE SRL
    const billingEntity = "primecare";
    const entityInfo = BILLING_ENTITIES[billingEntity];
    const stripe = getStripe(billingEntity);

    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/$/, "") ||
      "https://cocoora.vercel.app";

    const sessionParams: any = {
      mode: "payment",
      client_reference_id: `ccr_${tier.id}_${gender || "std"}_${Date.now()}`,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: finalPrice * 100,
            product_data: {
              name: `Cocoora Club · Percorso ${tier.name}${gender ? ` (${gender === "donna" ? "Donna" : "Uomo"})` : ""}`,
              description: `Percorso Annuale di Prevenzione Continua — Emesso da ${entityInfo.name} (IBAN: ${entityInfo.iban})`,
              metadata: {
                tier_id: tier.id,
                gender: gender || "",
                billing_entity: billingEntity,
                iban_accredito: entityInfo.iban,
              },
            },
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      metadata: {
        tier_id: tier.id,
        tier_name: tier.name,
        gender: gender || "",
        customer_name: lead?.nome ? `${lead.nome} ${lead.cognome || ""}`.trim() : "",
        customer_phone: (lead?.telefono || "").trim(),
        customer_email: (lead?.email || "").trim(),
        billing_entity: billingEntity,
        company_name: entityInfo.name,
        company_iban: entityInfo.iban,
      },
      success_url: `${origin}/club/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier.id}`,
      cancel_url: `${origin}/club/${tier.id}`,
    };

    if (lead?.email && lead.email.trim().length > 3) {
      sessionParams.customer_email = lead.email.trim();
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      billingEntity: {
        entity: billingEntity,
        name: entityInfo.name,
        iban: entityInfo.iban,
      },
    });
  } catch (err: unknown) {
    console.error("Errore creazione sessione Stripe Checkout:", err);
    const message = err instanceof Error ? err.message : "Errore creazione checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
