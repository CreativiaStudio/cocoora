import twilio from "twilio";

/**
 * Client Twilio ufficiale per Cocoora Centro Medico
 * Account: simonepapagno@cocoora.it
 */
let twilioClientInstance: twilio.Twilio | null = null;

export function getTwilioClient(): twilio.Twilio {
  if (twilioClientInstance) {
    return twilioClientInstance;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      "Credenziali Twilio non configurate. Verificare TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN in .env.local"
    );
  }

  twilioClientInstance = twilio(accountSid, authToken);
  return twilioClientInstance;
}

/**
 * Normalizza il numero di telefono nel formato internazionale E.164 (+39...)
 */
export function normalizeItalianPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "").trim();
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.startsWith("0039")) {
    return `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith("39") && cleaned.length >= 11) {
    return `+${cleaned}`;
  }
  // Numero cellulare italiano senza prefisso
  return `+39${cleaned}`;
}

export interface SendAppointmentReminderParams {
  to: string;
  patientName: string;
  doctorName?: string;
  serviceName?: string;
  appointmentDate: string; // Es: "Martedì 10 Novembre"
  appointmentTime: string; // Es: "15:30"
}

export interface SendSMSResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

/**
 * Invia un SMS di promemoria appuntamento con mittente ufficiale "COCOORA".
 * Conforme GDPR Art. 9: nessuna diagnosi, branca o prestazione clinica in chiaro nell'SMS.
 */
export async function sendAppointmentReminderSMS(
  params: SendAppointmentReminderParams
): Promise<SendSMSResult> {
  try {
    const client = getTwilioClient();
    const formattedPhone = normalizeItalianPhoneNumber(params.to);
    const sender = process.env.TWILIO_SENDER_ID || "COCOORA";

    const body =
      `Gentile ${params.patientName}, Le ricordiamo il Suo appuntamento ` +
      `per ${params.appointmentDate} alle ore ${params.appointmentTime}. ` +
      `Cocoora Centro Medico - Via Generale Giovanni De Bonis 81, Napoli - Tel. 081 1818 2091`;

    const message = await client.messages.create({
      body,
      from: sender,
      to: formattedPhone,
    });

    return {
      success: true,
      messageSid: message.sid,
    };
  } catch (error: any) {
    console.error("Errore invio SMS Twilio:", error);
    return {
      success: false,
      error: error?.message || "Errore sconosciuto durante l'invio dell'SMS",
    };
  }
}

/**
 * Invia un SMS generico transazionale con mittente "COCOORA"
 */
export async function sendGenericSMS(
  to: string,
  messageText: string
): Promise<SendSMSResult> {
  try {
    const client = getTwilioClient();
    const formattedPhone = normalizeItalianPhoneNumber(to);
    const sender = process.env.TWILIO_SENDER_ID || "COCOORA";

    const message = await client.messages.create({
      body: messageText,
      from: sender,
      to: formattedPhone,
    });

    return {
      success: true,
      messageSid: message.sid,
    };
  } catch (error: any) {
    console.error("Errore invio SMS Twilio:", error);
    return {
      success: false,
      error: error?.message || "Errore sconosciuto durante l'invio dell'SMS",
    };
  }
}
