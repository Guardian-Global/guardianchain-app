import { loginUser, issueToken, buildAuthCookie } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body || {};
  const result = await loginUser(email, password);
  if (!result.ok || !result.user) return res.status(401).json({ message: result.reason });
  const token = issueToken({ id: result.user.id, email: result.user.email, displayName: result.user.displayName });
  res.setHeader('Set-Cookie', buildAuthCookie(token));
  return res.status(200).json({ token, user: { id: result.user.id, email: result.user.email, displayName: result.user.displayName } });
}
