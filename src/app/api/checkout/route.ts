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
      let patientCode = "";
      if (lead?.email && lead?.nome) {
        try {
          const supabase = getServiceSupabase();
          const cleanEmail = lead.email.trim().toLowerCase();
          const cleanPhone = (lead.telefono || "").trim();
          const cleanNome = lead.nome.trim();
          const cleanCognome = (lead.cognome || "").trim() || "Paziente";
          const notesText = `[Lead Iscrizione Club] Percorso Discover Free (€0) — ${new Date().toLocaleDateString("it-IT")}`;

          // Verifica se esiste già un profilo per email o telefono
          let existingQuery = supabase
            .from("patient_profiles")
            .select("id, patient_code, notes");
          
          if (cleanPhone) {
            existingQuery = existingQuery.or(`email.eq.${cleanEmail},phone.eq.${cleanPhone}`);
          } else {
            existingQuery = existingQuery.eq("email", cleanEmail);
          }

          const { data: existing } = await existingQuery.limit(1).maybeSingle();

          if (existing) {
            patientCode = existing.patient_code;
            const updatedNotes = existing.notes ? `${existing.notes}\n${notesText}` : notesText;
            await supabase
              .from("patient_profiles")
              .update({
                notes: updatedNotes,
                health_path_id: "0344a8b6-9d6b-4ab5-9360-a1f2974f9598", // Discover path
                updated_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
          } else {
            const { data: inserted, error: insErr } = await supabase
              .from("patient_profiles")
              .insert({
                first_name: cleanNome,
                last_name: cleanCognome,
                email: cleanEmail,
                phone: cleanPhone || null,
                notes: notesText,
                health_path_id: "0344a8b6-9d6b-4ab5-9360-a1f2974f9598", // Discover path
                health_path_started_on: new Date().toISOString().split("T")[0],
                gdpr_consent_at: new Date().toISOString(),
                gdpr_marketing: true,
              })
              .select("id, patient_code")
              .maybeSingle();

            if (!insErr && inserted) {
              patientCode = inserted.patient_code;
            } else if (insErr) {
              console.error("Errore inserimento profilo Discover:", insErr);
            }
          }
        } catch (err) {
          console.warn("Errore salvataggio profilo Discover in Supabase:", err);
        }
      }

      return NextResponse.json({
        success: true,
        free: true,
        patientCode: patientCode || undefined,
        url: `/club/success?tier=discover&name=${encodeURIComponent(lead?.nome || "Paziente")}${patientCode ? `&code=${patientCode}` : ""}`,
      });
    }

    // Registrazione preventiva lead nel CRM per i percorsi a pagamento (Zero Input Persi)
    let leadPatientId: string | null = null;
    let leadPatientCode: string | null = null;
    if (lead?.email || lead?.nome) {
      try {
        const supabase = getServiceSupabase();
        const cleanEmail = (lead.email || "").trim().toLowerCase();
        const cleanPhone = (lead.telefono || "").trim();
        const cleanNome = (lead.nome || "Lead").trim();
        const cleanCognome = (lead.cognome || "Interessato").trim();
        const notesText = `[Lead Pre-Checkout] Percorso ${tier.name} (€${tier.price}) — Inizio procedura di pagamento (${new Date().toLocaleDateString("it-IT")})`;

        let existingQuery = supabase
          .from("patient_profiles")
          .select("id, patient_code, notes");
        if (cleanEmail && cleanPhone) {
          existingQuery = existingQuery.or(`email.eq.${cleanEmail},phone.eq.${cleanPhone}`);
        } else if (cleanEmail) {
          existingQuery = existingQuery.eq("email", cleanEmail);
        } else if (cleanPhone) {
          existingQuery = existingQuery.eq("phone", cleanPhone);
        }

        const { data: existing } = await existingQuery.limit(1).maybeSingle();
        if (existing) {
          leadPatientId = existing.id;
          leadPatientCode = existing.patient_code;
          const updatedNotes = existing.notes ? `${existing.notes}\n${notesText}` : notesText;
          await supabase
            .from("patient_profiles")
            .update({ notes: updatedNotes, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else if (cleanEmail) {
          const { data: inserted } = await supabase
            .from("patient_profiles")
            .insert({
              first_name: cleanNome,
              last_name: cleanCognome,
              email: cleanEmail,
              phone: cleanPhone || null,
              notes: notesText,
              gdpr_consent_at: new Date().toISOString(),
              gdpr_marketing: true,
            })
            .select("id, patient_code")
            .maybeSingle();

          if (inserted) {
            leadPatientId = inserted.id;
            leadPatientCode = inserted.patient_code;
          }
        }
      } catch (leadSaveErr) {
        console.warn("Avviso salvataggio lead pre-checkout:", leadSaveErr);
      }
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
        patient_id: leadPatientId || "",
        patient_code: leadPatientCode || "",
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
