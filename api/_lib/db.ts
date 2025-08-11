import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../shared/schema';

let _db: ReturnType<typeof drizzle> | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function getDb() {
  if (_db) return _db;
  const url = getDatabaseUrl();
  if (!url) throw new Error('DATABASE_URL not set.');
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

export type DB = ReturnType<typeof getDb>;
export { schema };
