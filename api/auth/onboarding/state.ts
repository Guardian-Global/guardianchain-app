import { getUserFromRequest, getOnboardingState } from '../../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  const state = await getOnboardingState(user.id);
  return res.status(200).json(state);
}
