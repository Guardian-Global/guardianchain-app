import { getUserFromRequest } from '../_lib/auth';
import { getDb, schema } from '../_lib/db';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'PATCH') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });

  const { firstName, lastName, profileImageUrl, displayName, bio } = req.body || {};
  const updates: any = {};
  if (displayName || firstName || lastName) {
    updates.displayName = displayName || [firstName, lastName].filter(Boolean).join(' ').trim() || null;
  }
  if (typeof bio === 'string') updates.bio = bio;
  if (profileImageUrl) updates.profileImage = profileImageUrl;

  const db = getDb();
  if (Object.keys(updates).length > 0) {
    await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, user.id));
  }

  return res.status(200).json({ message: 'profile updated' });
}
