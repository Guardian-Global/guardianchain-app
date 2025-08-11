import { registerUser, issueToken } from '../_lib/auth';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password, name } = req.body || {};
  const result = registerUser(email, password, name);
  if (!result.created || !result.user) return res.status(400).json({ message: result.reason });
  const token = issueToken(result.user);
  res.setHeader('Set-Cookie', `gc_jwt=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7*24*60*60}`);
  return res.status(201).json({ message: 'Registered', token, user: { id: result.user.id, email: result.user.email, name: result.user.name } });
}
