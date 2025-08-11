import { getUserFromRequest } from '../_lib/auth';
import { getDb, schema } from '../_lib/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });

  const db = getDb();
  const [row] = await db.select().from(schema.users).where(eq(schema.users.id, user.id)).limit(1);
  if (!row) return res.status(404).json({ message: 'User not found' });

  return res.status(200).json({
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    tier: row.tier,
    subscriptionPlan: row.subscriptionPlan,
    onboardingCompleted: row.onboardingCompleted,
    walletAddress: row.walletAddress,
    agreementAcceptedAt: row.agreementAcceptedAt,
    capsuleSettings: row.capsuleSettings,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
