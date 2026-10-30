import { NextResponse } from "next/server";
import { getStripe, BILLING_ENTITIES } from "@/lib/stripe";
import { CLUB_TIERS } from "@/lib/club";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tierId, gender, lead } = body;

    if (!tierId || !lead?.email || !lead?.nome) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti (tierId, nome, email)" },
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

      return NextResponse.json({
        success: true,
        free: true,
        url: `/club/success?tier=discover&name=${encodeURIComponent(lead.nome)}`,
      });
    }

    // Calcolo prezzo (con eventuale differenziazione Uomo / Donna)
    let finalPrice = tier.price;
    if (gender === "donna" && tier.priceDonna) {
      finalPrice = tier.priceDonna;
    } else if (gender === "uomo" && tier.priceUomo) {
      finalPrice = tier.priceUomo;
    }

    // Risoluzione Entità Fiscale: i percorsi Club appartengono a PRIMECARE SRL
    const billingEntity = "primecare";
    const entityInfo = BILLING_ENTITIES[billingEntity];
    const stripe = getStripe(billingEntity);

    const origin = req.headers.get("origin") || "https://cocoora.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: lead.email.trim(),
      client_reference_id: `ccr_${tier.id}_${Date.now()}`,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: finalPrice * 100,
            product_data: {
              name: `Cocoora Club · Percorso ${tier.name}${gender ? ` (${gender.charAt(0).toUpperCase() + gender.slice(1)})` : ""}`,
              description: `${tier.description} — Emesso da ${entityInfo.name}`,
              metadata: {
                tier_id: tier.id,
                billing_entity: billingEntity,
                iban_accredito: entityInfo.iban,
              },
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        tier_id: tier.id,
        tier_name: tier.name,
        gender: gender || "",
        customer_name: `${lead.nome} ${lead.cognome || ""}`.trim(),
        customer_phone: (lead.telefono || "").trim(),
        customer_email: lead.email.trim(),
        billing_entity: billingEntity,
        company_name: entityInfo.name,
        company_iban: entityInfo.iban,
      },
      success_url: `${origin}/club/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier.id}`,
      cancel_url: `${origin}/club/${tier.id}`,
    });

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
