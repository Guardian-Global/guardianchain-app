import { getUserFromRequest } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  const user = await getUserFromRequest(req);
  return res.status(200).json({ status: 'ok', authenticated: !!user, userId: user?.id || null });
}
