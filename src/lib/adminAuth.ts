import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'starter_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export function validateAdminPin(pin: unknown, correctPin: unknown) {
  if (typeof correctPin !== 'string' || !/^\d{8}$/.test(correctPin)) {
    return { ok: false, error: 'ADMIN_PIN must be set to an 8 digit PIN.' };
  }

  if (typeof pin !== 'string' || !/^\d{8}$/.test(pin)) {
    return { ok: false, error: 'Enter the 8 digit admin PIN.' };
  }

  return { ok: timingSafeStringEqual(pin, correctPin), error: 'Incorrect PIN' };
}

export function createAdminSessionCookie(correctPin: string, secret?: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ expiresAt })).toString('base64url');
  const signature = sign(payload, signingSecret(correctPin, secret));

  return `${COOKIE_NAME}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export function hasAdminSession(request: Request, correctPin: unknown, secret?: string) {
  if (typeof correctPin !== 'string' || !/^\d{8}$/.test(correctPin)) return false;

  const cookie = request.headers.get('cookie') || '';
  const value = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!value) return false;

  const [payload, signature] = value.split('.');
  if (!payload || !signature) return false;

  const expected = sign(payload, signingSecret(correctPin, secret));
  if (!timingSafeStringEqual(signature, expected)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    return typeof session.expiresAt === 'number' && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function signingSecret(correctPin: string, secret?: string) {
  return secret || correctPin;
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function timingSafeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
