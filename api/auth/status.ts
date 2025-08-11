import { getUserFromRequest } from '../_lib/auth';

export default function handler(req: any, res: any) {
  const user = getUserFromRequest(req);
  return res.status(200).json({ status: 'ok', authenticated: !!user, userId: user?.id || null });
}
