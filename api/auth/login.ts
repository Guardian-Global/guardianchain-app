import { loginUser, issueToken } from '../_lib/auth';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body || {};
  const result = loginUser(email, password);
  if (!result.ok || !result.user) return res.status(401).json({ message: result.reason });
  const token = issueToken(result.user);
  res.setHeader('Set-Cookie', `gc_jwt=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7*24*60*60}`);
  return res.status(200).json({ token, user: { id: result.user.id, email: result.user.email, name: result.user.name } });
}
