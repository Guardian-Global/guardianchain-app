import { getUserFromRequest } from '../_lib/auth';

export default function handler(req: any, res: any) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    tier: 'EXPLORER',
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}
