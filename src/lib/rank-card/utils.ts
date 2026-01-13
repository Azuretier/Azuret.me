import crypto from 'crypto';

/**
 * Normalizes a Discord display name for consistent storage and lookup
 */
export function normalizeDisplayName(displayName: string): string {
  return displayName
    .trim()
    .normalize('NFKC')
    .toLocaleLowerCase();
}

/**
 * Generates a stable card ID from guild ID and normalized display name
 */
export function generateCardId(guildId: string, displayNameKey: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(`${guildId}:${displayNameKey}`);
  return hash.digest('hex').substring(0, 32);
}
