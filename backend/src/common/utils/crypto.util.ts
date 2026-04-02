import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes, randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const BCRYPT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt with 12 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a cryptographically random numeric OTP string.
 *
 * @param length - Number of digits (default: 6)
 */
export function generateOtp(length: number = 6): string {
  if (length < 1 || length > 20) {
    throw new RangeError('OTP length must be between 1 and 20');
  }

  // randomInt(min, max) is cryptographically secure and avoids modulo bias
  const digits: string[] = [];
  for (let i = 0; i < length; i++) {
    digits.push(String(randomInt(0, 10))); // 0–9 inclusive
  }

  return digits.join('');
}

/**
 * Produce a SHA-256 hex digest of a token.
 * Used to store a fingerprint of a refresh token instead of the raw value.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

/**
 * Generate a cryptographically secure random token (UUID v4).
 * Suitable for use as refresh tokens, email-verification tokens, etc.
 */
export function generateSecureToken(): string {
  // uuid v4 uses crypto.randomBytes under the hood; combining with extra
  // random bytes and re-hashing gives additional entropy when needed.
  const extra = randomBytes(16).toString('hex');
  return `${uuidv4()}-${extra}`;
}
