import { getUserFromRequest } from '../_lib/auth';
import { getDb, schema } from '../_lib/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  const jwtUser = await getUserFromRequest(req);
  if (!jwtUser) return res.status(401).json({ message: 'Not authenticated' });
  const db = getDb();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, jwtUser.id)).limit(1);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.status(200).json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    tier: user.tier,
    subscriptionPlan: user.subscriptionPlan,
    onboardingCompleted: user.onboardingCompleted,
    walletAddress: user.walletAddress,
    agreementAcceptedAt: user.agreementAcceptedAt,
    capsuleSettings: user.capsuleSettings,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
