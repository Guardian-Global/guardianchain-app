export default function handler(_req: any, res: any) {
  res.setHeader('Set-Cookie', 'gc_jwt=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res.status(200).json({ message: 'Logged out' });
}
