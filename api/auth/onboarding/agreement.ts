import { getUserFromRequest } from '../../_lib/auth';
import { getDb, schema } from '../../_lib/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  const db = getDb();
  await db.update(schema.users).set({ agreementAcceptedAt: new Date() }).where(eq(schema.users.id, user.id));
  return res.status(200).json({ message: 'accepted' });
}
