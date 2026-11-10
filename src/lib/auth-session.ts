// Auth Session for Cocoora
// Token di sessione firmati con HMAC-SHA256 tramite Web Crypto API.
// Compatibile sia con il runtime Edge di Next.js sia con Node.js (>= 18).

export type AppRole = 'admin' | 'agenzia' | 'segreteria' | 'medico' | 'paziente';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: AppRole;
  expiresAt: number;
  doctorSlug?: string;
}

export const SESSION_COOKIE_NAME = 'cocoora_session';

const VALID_ROLES: readonly AppRole[] = [
  'admin',
  'agenzia',
  'segreteria',
  'medico',
  'paziente',
];

// Segreto usato per la firma dei token di sessione (priorità a variabile d'ambiente).
const SESSION_SECRET =
  process.env.AUTH_SECRET || 'cocoora-session-hmac-sha256-v1-clinica-sicura';

// Rate Limiting anti-brute force per IP e account (Art. 32 GDPR)
interface RateLimitState {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}
const rateLimitMap = new Map<string, RateLimitState>();

// Set dei token Magic Link monouso già consumati (anti-replay attack)
const consumedMagicTokens = new Set<string>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  waitMinutes?: number;
  remainingAttempts?: number;
} {
  const now = Date.now();
  const state = rateLimitMap.get(key);
  if (!state) return { allowed: true, remainingAttempts: 5 };

  if (state.lockedUntil && state.lockedUntil > now) {
    const waitMinutes = Math.ceil((state.lockedUntil - now) / 60000);
    return { allowed: false, waitMinutes };
  }

  // Se la finestra di 15 min è passata senza lock attivo, resetta
  if (!state.lockedUntil && now - state.firstAttemptAt > 15 * 60 * 1000) {
    rateLimitMap.delete(key);
    return { allowed: true, remainingAttempts: 5 };
  }

  const remaining = Math.max(0, 5 - state.attempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function recordFailedAttempt(key: string): {
  locked: boolean;
  waitMinutes?: number;
  remainingAttempts: number;
} {
  const now = Date.now();
  let state = rateLimitMap.get(key);

  if (!state || (!state.lockedUntil && now - state.firstAttemptAt > 15 * 60 * 1000)) {
    state = { attempts: 1, firstAttemptAt: now };
  } else {
    state.attempts += 1;
  }

  if (state.attempts >= 5) {
    state.lockedUntil = now + 15 * 60 * 1000; // Blocco 15 minuti
    rateLimitMap.set(key, state);
    return { locked: true, waitMinutes: 15, remainingAttempts: 0 };
  }

  rateLimitMap.set(key, state);
  return { locked: false, remainingAttempts: Math.max(0, 5 - state.attempts) };
}

export function resetRateLimit(key: string) {
  rateLimitMap.delete(key);
}

const DEFAULT_VALIDITY_DAYS = 7;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getCrypto(): Crypto {
  const webCrypto = globalThis.crypto;

  if (!webCrypto || !webCrypto.subtle) {
    throw new Error('Web Crypto API non disponibile in questo runtime.');
  }

  return webCrypto;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
  const binary = atob(normalized + '='.repeat(paddingLength));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }

  return difference === 0;
}

let cachedHmacKey: Promise<CryptoKey> | null = null;

function getHmacKey(): Promise<CryptoKey> {
  if (!cachedHmacKey) {
    cachedHmacKey = getCrypto().subtle
      .importKey(
        'raw',
        textEncoder.encode(SESSION_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
      )
      .catch((error: unknown) => {
        cachedHmacKey = null;
        throw error;
      });
  }

  return cachedHmacKey;
}

async function signPayload(payload: string): Promise<Uint8Array> {
  const key = await getHmacKey();
  const signature = await getCrypto().subtle.sign('HMAC', key, textEncoder.encode(payload));

  return new Uint8Array(signature);
}

function isUserSession(value: unknown): value is UserSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.userId === 'string' &&
    candidate.userId.length > 0 &&
    typeof candidate.email === 'string' &&
    candidate.email.length > 0 &&
    typeof candidate.name === 'string' &&
    candidate.name.length > 0 &&
    typeof candidate.role === 'string' &&
    VALID_ROLES.includes(candidate.role as AppRole) &&
    typeof candidate.expiresAt === 'number' &&
    Number.isFinite(candidate.expiresAt)
  );
}

export async function createSessionToken(
  user: Omit<UserSession, 'expiresAt'>,
  daysValid: number = DEFAULT_VALIDITY_DAYS,
): Promise<string> {
  const validityDays =
    Number.isFinite(daysValid) && daysValid > 0 ? daysValid : DEFAULT_VALIDITY_DAYS;

  const session: UserSession = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: Date.now() + Math.round(validityDays * MILLISECONDS_PER_DAY),
  };

  const payload = JSON.stringify(session);
  const encodedPayload = bytesToBase64Url(textEncoder.encode(payload));
  const encodedSignature = bytesToBase64Url(await signPayload(encodedPayload));

  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  if (typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, encodedSignature] = parts;

  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  try {
    const expectedSignature = await signPayload(encodedPayload);
    const receivedSignature = base64UrlToBytes(encodedSignature);

    if (!timingSafeEqual(expectedSignature, receivedSignature)) {
      return null;
    }

    const decodedPayload = textDecoder.decode(base64UrlToBytes(encodedPayload));
    const parsed: unknown = JSON.parse(decodedPayload);

    if (!isUserSession(parsed)) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return {
      userId: parsed.userId,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export const DEMO_CREDENTIALS: Record<
  string,
  { password: string; user: Omit<UserSession, 'expiresAt'> }
> = {
  'admin@cocoora.it': {
    password: process.env.ADMIN_PASSWORD || '%Cocoora26%',
    user: {
      userId: 'usr-admin-cocoora',
      email: 'admin@cocoora.it',
      name: 'Mario Pepe / Direzione Sanitaria',
      role: 'admin',
    },
  },
  'info@cocoora.it': {
    password: process.env.ADMIN_PASSWORD || '%Cocoora26%',
    user: {
      userId: 'usr-info-cocoora',
      email: 'info@cocoora.it',
      name: 'Mario Pepe / Direzione Sanitaria',
      role: 'admin',
    },
  },
  'silvia@agenzia.it': {
    password: process.env.SILVIA_PASSWORD || '%SilviaCocoora26%',
    user: {
      userId: 'usr-silvia-agenzia',
      email: 'silvia@agenzia.it',
      name: 'Silvia — Agenzia SEO & Contenuti',
      role: 'agenzia',
    },
  },
  'segreteria@cocoora.it': {
    password: process.env.SEGRETERIA_PASSWORD || '%SegreteriaCocoora26%',
    user: {
      userId: 'usr-segreteria-desk',
      email: 'segreteria@cocoora.it',
      name: 'Reception & Desk Accoglienza',
      role: 'segreteria',
    },
  },
  'dott.russo@cocoora.it': {
    password: process.env.DOCTOR_RUSSO_PASSWORD || '%RussoCocoora26%',
    user: {
      userId: 'usr-elisarusso',
      email: 'dott.russo@cocoora.it',
      name: 'Dott.ssa Elisa Russo (D.S.)',
      role: 'medico',
      doctorSlug: 'elisa-russo',
    },
  },
};

/** Medici Specialistici con Credenziali Cliniche Protette */
export interface SmartDoctorBadge {
  slug: string;
  name: string;
  specialty: string;
  email: string;
  securePin: string; // PIN personale univoco a 6 cifre
}

export const SMART_DOCTORS: SmartDoctorBadge[] = [
  { slug: 'elisa-russo', name: 'Dott.ssa Elisa Russo', specialty: 'Direttrice Sanitaria · Ortodonzia', email: 'elisa.russo@cocoora.it', securePin: '739201' },
  { slug: 'titti-errico', name: 'Dott.ssa Titti Errico', specialty: 'Dermatologia & Venereologia', email: 'titti.errico@cocoora.it', securePin: '582914' },
  { slug: 'mirella-dandrea', name: 'Dott.ssa Mirella D\'Andrea', specialty: 'Ginecologia & Ostetricia', email: 'mirella.dandrea@cocoora.it', securePin: '914820' },
  { slug: 'alessandra-riccardi', name: 'Dott.ssa Alessandra Riccardi', specialty: 'Medicina Estetica Avanzata', email: 'alessandra.riccardi@cocoora.it', securePin: '461038' },
  { slug: 'fabiana-di-costanzo', name: 'Dott.ssa Fabiana Di Costanzo', specialty: 'Nutrizione Clinica & Longevity', email: 'fabiana.dicostanzo@cocoora.it', securePin: '629471' },
  { slug: 'marco-de-luca', name: 'Dott. Marco De Luca', specialty: 'Odontoiatria Digitale', email: 'marco.deluca@cocoora.it', securePin: '830519' },
];

/**
 * Genera un Magic Token crittografico a 256-bit monouso per il medico (valido 15 minuti).
 * Zero password da ricordare: basta 1 tap dal proprio smartphone autorizzato.
 */
export async function createDoctorMagicToken(doctorSlug: string): Promise<string> {
  const doc = SMART_DOCTORS.find((d) => d.slug === doctorSlug);
  if (!doc) throw new Error("Medico non trovato");

  const nonce = bytesToBase64Url(getCrypto().getRandomValues(new Uint8Array(16)));
  const payload = JSON.stringify({
    doctorSlug: doc.slug,
    name: doc.name,
    email: doc.email,
    nonce,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minuti
  });

  const encodedPayload = bytesToBase64Url(textEncoder.encode(payload));
  const encodedSignature = bytesToBase64Url(await signPayload(encodedPayload));
  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifica il Magic Token monouso. Se valido, lo consuma per impedire replay attacks.
 */
export async function verifyDoctorMagicToken(
  token: string
): Promise<Omit<UserSession, 'expiresAt'> | null> {
  if (consumedMagicTokens.has(token)) {
    return null; // Già utilizzato
  }

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, encodedSignature] = parts;

  try {
    const expectedSignature = await signPayload(encodedPayload);
    const receivedSignature = base64UrlToBytes(encodedSignature);
    if (!timingSafeEqual(expectedSignature, receivedSignature)) return null;

    const decoded = JSON.parse(textDecoder.decode(base64UrlToBytes(encodedPayload)));
    if (!decoded || decoded.expiresAt <= Date.now()) return null;

    // Marchia come consumato
    consumedMagicTokens.add(token);
    // Pulizia periodica per non saturare memoria
    if (consumedMagicTokens.size > 10000) consumedMagicTokens.clear();

    return {
      userId: `doctor-${decoded.doctorSlug}`,
      email: decoded.email,
      name: decoded.name,
      role: 'medico',
      doctorSlug: decoded.doctorSlug,
    };
  } catch {
    return null;
  }
}

export function authenticateDoctorByPin(
  slug: string,
  pin: string,
): Omit<UserSession, 'expiresAt'> | null {
  const doc = SMART_DOCTORS.find((d) => d.slug === slug);
  if (!doc) return null;

  // Accetta SOLO il PIN personale univoco a 6 cifre del medico
  if (pin !== doc.securePin) {
    return null;
  }

  return {
    userId: `doctor-${doc.slug}`,
    email: doc.email,
    name: doc.name,
    role: 'medico',
    doctorSlug: doc.slug,
  };
}

export function authenticateUser(
  email: string,
  password: string,
): Omit<UserSession, 'expiresAt'> | null {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  const record = DEMO_CREDENTIALS[normalizedEmail];

  if (!record || record.password !== password) {
    return null;
  }

  return { ...record.user };
}
