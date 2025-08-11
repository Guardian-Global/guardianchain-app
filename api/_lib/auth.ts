// Minimal request type so we don't depend on @vercel/node types at build time
export interface VercelLikeRequest { headers: Record<string, any>; } // body not needed for token extraction
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb, schema } from './db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-dev-secret';
const COOKIE_NAME = 'gc_jwt';
const TOKEN_DAYS = 7;

export interface JwtUser { id: string; email: string; displayName?: string | null; walletAddress?: string | null }

export function issueToken(user: JwtUser) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: `${TOKEN_DAYS}d` });
}

export function buildAuthCookie(token: string) {
  const maxAge = TOKEN_DAYS * 24 * 60 * 60;
  const secure = (process.env.NODE_ENV === 'production') ? ' Secure;' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${secure}`;
}

export function extractToken(req: VercelLikeRequest): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.headers.cookie;
  if (cookie) {
    const part = cookie.split(/; */).find(p => p.startsWith(`${COOKIE_NAME}=`));
    if (part) return decodeURIComponent(part.split('=')[1]);
  }
  return null;
}

export async function getUserFromRequest(req: VercelLikeRequest): Promise<JwtUser | null> {
  const token = extractToken(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const db = getDb();
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, decoded.id)).limit(1);
    if (!user) return null;
    return { id: user.id, email: user.email, displayName: user.displayName, walletAddress: user.walletAddress };
  } catch {
    return null;
  }
}

export async function registerUser(email: string, password: string, displayName?: string) {
  if (!email || !password) return { created: false, reason: 'Email & password required' } as const;
  const db = getDb();
  const normalized = email.toLowerCase();
  const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, normalized)).limit(1);
  if (existing.length) return { created: false, reason: 'User exists' } as const;
  const passwordHash = await bcrypt.hash(password, 10);
  const [row] = await db.insert(schema.users).values({ email: normalized, passwordHash, displayName: displayName || normalized.split('@')[0] }).returning({ id: schema.users.id, email: schema.users.email, displayName: schema.users.displayName });
  return { created: true, user: row } as const;
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) return { ok: false, reason: 'Email & password required' } as const;
  const db = getDb();
  const normalized = email.toLowerCase();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, normalized)).limit(1);
  if (!user || !user.passwordHash) return { ok: false, reason: 'Invalid credentials' } as const;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, reason: 'Invalid credentials' } as const;
  return { ok: true, user } as const;
}

export async function getOnboardingState(userId: string) {
  const db = getDb();
  const [user] = await db.select({
    id: schema.users.id,
    subscriptionPlan: schema.users.subscriptionPlan,
    agreementAcceptedAt: schema.users.agreementAcceptedAt,
    onboardingCompleted: schema.users.onboardingCompleted,
    displayName: schema.users.displayName,
    walletAddress: schema.users.walletAddress,
    capsuleSettings: schema.users.capsuleSettings,
  }).from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  if (!user) return null;
  let nextStep: string | null = null;
  if (!user.subscriptionPlan) nextStep = 'subscription';
  else if (!user.agreementAcceptedAt) nextStep = 'agreement';
  else if (!user.displayName) nextStep = 'profile';
  else if (!user.capsuleSettings) nextStep = 'capsuleSettings';
  else if (!user.onboardingCompleted) nextStep = 'finalize';
  return { ...user, nextStep };
}

