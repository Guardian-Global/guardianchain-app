import { getUserFromRequest } from '../_lib/auth';
import { getDb, schema } from '../_lib/db';
import { eq } from 'drizzle-orm';

// POST: link wallet; DELETE: unlink wallet (compat path)
export default async function handler(req: any, res: any) {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });

  const db = getDb();
  if (req.method === 'POST') {
    const { walletAddress } = req.body || {};
    if (!walletAddress) return res.status(400).json({ message: 'walletAddress required' });
    await db.update(schema.users).set({ walletAddress }).where(eq(schema.users.id, user.id));
    return res.status(200).json({ message: 'linked' });
  }
  if (req.method === 'DELETE') {
    await db.update(schema.users).set({ walletAddress: null }).where(eq(schema.users.id, user.id));
    return res.status(200).json({ message: 'unlinked' });
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
