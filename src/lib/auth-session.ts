// Auth Session for Cocoora
// Token di sessione firmati con HMAC-SHA256 tramite Web Crypto API.
// Compatibile sia con il runtime Edge di Next.js sia con Node.js (>= 18).

/** I quattro livelli di accesso selezionabili dal login. */
export type AppRole = 'admin' | 'segreteria' | 'medico' | 'paziente';

/**
 * Profilo amministrativo aggiuntivo dell'agenzia (Silvia Monticelli).
 * Non è un quinto livello selezionabile: usa il selettore
 * "Admin/Direzione Sanitaria".
 */
export type AgencyRole = 'agenzia';

export type SessionRole = AppRole | AgencyRole;

export type AccessRole = AppRole;

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: SessionRole;
  expiresAt: number;
  doctorSlug?: string;
}

export const SESSION_COOKIE_NAME = 'cocoora_session';

const VALID_ROLES: readonly SessionRole[] = [
  'admin',
  'agenzia',
  'segreteria',
  'medico',
  'paziente',
];

// Segreto usato per la firma dei token di sessione (priorità a variabile d'ambiente).
// Il fallback è un valore lungo e casuale: in produzione impostare comunque
// AUTH_SECRET (>= 32 caratteri) nelle variabili d'ambiente del deploy.
const FALLBACK_AUTH_SECRET =
  'cocoora_95f0fcc5fe8ad3fe8e076400952a68a445757a907823cbab2d9bc285cded6daaad1306ba3a3b1ed8a67329228d5a38fc';

let hasWarnedAboutFallbackSecret = false;

function getSessionSecret(): string {
  const configuredSecret = process.env.AUTH_SECRET?.trim();

  if (configuredSecret && configuredSecret.length >= 32) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === 'production' && !hasWarnedAboutFallbackSecret) {
    hasWarnedAboutFallbackSecret = true;
    console.warn(
      '[auth-session] AUTH_SECRET non impostato o troppo corto: uso il fallback interno. Configurare AUTH_SECRET in produzione.',
    );
  }

  return FALLBACK_AUTH_SECRET;
}

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
        textEncoder.encode(getSessionSecret()),
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
    VALID_ROLES.includes(candidate.role as SessionRole) &&
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

  if (user.doctorSlug) {
    session.doctorSlug = user.doctorSlug;
  }

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

    const session: UserSession = {
      userId: parsed.userId,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      expiresAt: parsed.expiresAt,
    };

    if (typeof (parsed as UserSession).doctorSlug === 'string') {
      session.doctorSlug = (parsed as UserSession).doctorSlug;
    }

    return session;
  } catch {
    return null;
  }
}

interface StoredCredential {
  email: string;
  passwordSalt: string;
  passwordHash: string;
  user: Omit<UserSession, 'expiresAt'>;
}

/**
 * Credenziali applicative.
 *
 * Le password NON sono salvate in chiaro: ogni record contiene un salt
 * dedicato e l'hash SHA-256 di "salt:password". Per la produzione è possibile
 * sostituire gli hash mantenendo la stessa struttura.
 *
 * Profili disponibili:
 * - Admin/Direzione Sanitaria
 * - Segreteria CRM
 * - Area Medico
 * - Area Paziente
 * - Agenzia (Silvia Monticelli), che accede dal selettore Admin
 */
export const DEMO_CREDENTIALS: Record<string, StoredCredential> = {
  'admin@cocoora.it': {
    email: 'admin@cocoora.it',
    passwordSalt: 'cocoora-admin-v1',
    passwordHash:
      'c9b8236abd8d1abc2363290296ab6275e9a8fc7b985d5555dcc329ebd5d6ef2f',
    user: {
      userId: 'usr-admin-cocoora',
      email: 'admin@cocoora.it',
      name: 'Direzione Cocoora',
      role: 'admin',
    },
  },
  'info@cocoora.it': {
    email: 'info@cocoora.it',
    passwordSalt: 'cocoora-info-v1',
    passwordHash:
      'a5a2410837a773ed6e9b52af124f93dc1626587a5408fa16d23f7191d4d1b02b',
    user: {
      userId: 'usr-info-cocoora',
      email: 'info@cocoora.it',
      name: 'Direzione Cocoora',
      role: 'admin',
    },
  },
  'silvia@agenzia.it': {
    email: 'silvia@agenzia.it',
    passwordSalt: 'cocoora-agenzia-v1',
    passwordHash:
      '4e8737a3739efaf72f9013b1348ba03c6aa35946df85a03aad41e9f02189a507',
    user: {
      userId: 'usr-silvia-agenzia',
      email: 'silvia@agenzia.it',
      name: 'Silvia Monticelli — Agenzia',
      role: 'agenzia',
    },
  },
  'segreteria@cocoora.it': {
    email: 'segreteria@cocoora.it',
    passwordSalt: 'cocoora-segreteria-v1',
    passwordHash:
      'ba6a273ef7527ad43b8e176edc3d7579e115d6415bc88ec3dfa2c458d89fcb4a',
    user: {
      userId: 'usr-segreteria-desk',
      email: 'segreteria@cocoora.it',
      name: 'Segreteria Cocoora',
      role: 'segreteria',
    },
  },
  'dott.russo@cocoora.it': {
    email: 'dott.russo@cocoora.it',
    passwordSalt: 'cocoora-medico-v1',
    passwordHash:
      'e63fb9d65e575bb8ae2f724fe814d18e8e512bca7e97097c7bd762b68022f3b3',
    user: {
      userId: 'usr-elisarusso',
      email: 'dott.russo@cocoora.it',
      name: 'Dott.ssa Elisa Russo',
      role: 'medico',
      doctorSlug: 'elisa-russo',
    },
  },
  'paziente@cocoora.it': {
    email: 'paziente@cocoora.it',
    passwordSalt: 'cocoora-paziente-v1',
    passwordHash:
      '1217b13935be7b3054794915552c352d6588b2f6a9fc09f63561cf1502f5251b',
    user: {
      userId: 'usr-paziente-cocoora',
      email: 'paziente@cocoora.it',
      name: 'Paziente Cocoora',
      role: 'paziente',
    },
  },
};

const DUMMY_PASSWORD_SALT = 'cocoora-dummy-v1';
const DUMMY_PASSWORD_HASH =
  'ddfbea21e4ec05e29655cd997a913ccf6a5f3c857e59f2de126d99c3870af542';

async function sha256Hex(value: string): Promise<string> {
  const digest = await getCrypto().subtle.digest(
    'SHA-256',
    textEncoder.encode(value),
  );
  const bytes = new Uint8Array(digest);
  let hex = '';

  for (let index = 0; index < bytes.length; index += 1) {
    hex += bytes[index].toString(16).padStart(2, '0');
  }

  return hex;
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

function roleMatchesAccess(
  actualRole: SessionRole,
  requestedRole?: AccessRole,
): boolean {
  if (!requestedRole) {
    return true;
  }

  // L'account Agenzia (Silvia) usa il selettore Admin/Direzione Sanitaria.
  if (requestedRole === 'admin') {
    return actualRole === 'admin' || actualRole === 'agenzia';
  }

  return actualRole === requestedRole;
}

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

export async function authenticateUser(
  email: string,
  password: string,
  requestedRole?: AccessRole,
): Promise<Omit<UserSession, 'expiresAt'> | null> {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  const record = DEMO_CREDENTIALS[normalizedEmail];
  const envOverridePassword =
    normalizedEmail === 'admin@cocoora.it' || normalizedEmail === 'info@cocoora.it'
      ? process.env.ADMIN_PASSWORD?.trim()
      : normalizedEmail === 'segreteria@cocoora.it'
      ? process.env.SEGRETERIA_PASSWORD?.trim()
      : normalizedEmail === 'silvia@agenzia.it'
      ? process.env.SILVIA_PASSWORD?.trim()
      : undefined;

  const passwordSalt = record?.passwordSalt ?? DUMMY_PASSWORD_SALT;
  const expectedPasswordHash =
    envOverridePassword && record
      ? await sha256Hex(`${passwordSalt}:${envOverridePassword}`)
      : (record?.passwordHash ?? DUMMY_PASSWORD_HASH);
  const candidateHash = await sha256Hex(`${passwordSalt}:${password}`);
  const passwordIsValid = constantTimeEqual(candidateHash, expectedPasswordHash);

  if (!record || !passwordIsValid) {
    return null;
  }

  if (!roleMatchesAccess(record.user.role, requestedRole)) {
    return null;
  }

  return { ...record.user };
}

export function isAccessRole(value: unknown): value is AccessRole {
  return (
    value === 'admin' ||
    value === 'segreteria' ||
    value === 'medico' ||
    value === 'paziente'
  );
}
