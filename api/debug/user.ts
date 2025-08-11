import { getUserFromRequest } from '../_lib/auth';

export default function handler(req: any, res: any) {
  const user = getUserFromRequest(req);
  return res.status(200).json({
    id: user?.id || 'guest',
    simulated: true,
    authenticated: !!user,
    timestamp: new Date().toISOString()
  });
}
