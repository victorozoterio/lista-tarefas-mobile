import { getDatabase } from './database';
import { SaveProfileInput, UserProfile } from '../types/profile';

export async function getProfile(): Promise<UserProfile | null> {
  const db = await getDatabase();
  return db.getFirstAsync<UserProfile>(
    'SELECT * FROM profile WHERE id = 1 LIMIT 1',
  );
}

export async function saveProfile(input: SaveProfileInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO profile (id, name, email, photoUri) VALUES (1, ?, ?, ?)',
    input.name,
    input.email,
    input.photoUri,
  );
}
