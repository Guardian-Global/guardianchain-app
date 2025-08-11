import { getUserFromRequest } from '../../_lib/auth';
import { getDb, schema } from '../../_lib/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'PATCH') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  const { plan } = req.body || {};
  if (!plan) return res.status(400).json({ message: 'plan required' });
  const db = getDb();
  await db.update(schema.users).set({ subscriptionPlan: plan }).where(eq(schema.users.id, user.id));
  return res.status(200).json({ message: 'updated', subscriptionPlan: plan });
}
