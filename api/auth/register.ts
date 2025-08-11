import { registerUser, issueToken, buildAuthCookie } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password, displayName } = req.body || {};
  const result = await registerUser(email, password, displayName);
  if (!result.created || !result.user) return res.status(400).json({ message: result.reason });
  const token = issueToken({ id: result.user.id, email: result.user.email, displayName: result.user.displayName });
  res.setHeader('Set-Cookie', buildAuthCookie(token));
  return res.status(201).json({ message: 'Registered', token, user: { id: result.user.id, email: result.user.email, displayName: result.user.displayName } });
}
