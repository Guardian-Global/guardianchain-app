import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export interface JwtUser { id: number; email: string; name?: string; walletAddress?: string }

// Demo users (non-persistent across cold starts)
const demoUsers: JwtUser[] = [
  { id: 1, email: 'founder@guardianchain.app', name: 'Founder User' },
];

export function issueToken(user: JwtUser) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export function extractToken(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.headers.cookie;
  if (cookie) {
    const part = cookie.split(/; */).find(p => p.startsWith('gc_jwt='));
    if (part) return decodeURIComponent(part.split('=')[1]);
  }
  return null;
}

export function getUserFromRequest(req: VercelRequest): JwtUser | null {
  const token = extractToken(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    return demoUsers.find(u => u.id === decoded.id) || null;
  } catch {
    return null;
  }
}

export function registerUser(email: string, password: string, name?: string) {
  if (!email || !password) return { created: false, reason: 'Email & password required' };
  if (demoUsers.find(u => u.email === email)) return { created: false, reason: 'User exists' };
  const user: JwtUser = { id: demoUsers.length + 1, email, name: name || email.split('@')[0] };
  demoUsers.push(user);
  return { created: true, user };
}

export function loginUser(email: string, password: string) {
  if (!email || !password) return { ok: false, reason: 'Email & password required' };
  const user = demoUsers.find(u => u.email === email);
  if (!user) return { ok: false, reason: 'Invalid credentials' };
  return { ok: true, user };
}
