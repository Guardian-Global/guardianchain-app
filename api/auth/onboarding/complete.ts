import { getUserFromRequest } from '../../_lib/auth';
import { getDb, schema } from '../../_lib/db';
import { eq } from 'drizzle-orm';
import { getOnboardingState } from '../../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  const state = await getOnboardingState(user.id);
  if (!state) return res.status(404).json({ message: 'State not found' });
  if (state.nextStep && state.nextStep !== 'finalize') return res.status(400).json({ message: `Cannot finalize, next step is ${state.nextStep}` });
  const db = getDb();
  await db.update(schema.users).set({ onboardingCompleted: true }).where(eq(schema.users.id, user.id));
  return res.status(200).json({ message: 'onboarding_completed' });
}
