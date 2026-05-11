// src/pages/api/admin/check-pin.ts
// Verifies the admin PIN, applies short lockouts, and sets an HttpOnly session.
export const prerender = false

import type { APIRoute } from 'astro'
import { createAdminSessionCookie, validateAdminPin } from '../../../lib/adminAuth'

type AttemptState = {
  failures: number
  lockouts: number
  lockUntil: number
}

const attempts = new Map<string, AttemptState>()
const MAX_FAILURES = 3
const FIRST_LOCK_MS = 1000 * 60 * 15
const SECOND_LOCK_MS = 1000 * 60 * 60

export const POST: APIRoute = async ({ request }) => {
  const { pin } = await request.json()
  const correct = import.meta.env.ADMIN_PIN
  const secret = import.meta.env.ADMIN_SESSION_SECRET
  const key = clientKey(request)
  const state = attempts.get(key) || { failures: 0, lockouts: 0, lockUntil: 0 }
  const now = Date.now()

  if (state.lockUntil > now) {
    return json({
      error: `Too many attempts. Try again in ${Math.ceil((state.lockUntil - now) / 60000)} minutes.`,
      lockedUntil: state.lockUntil,
    }, 429)
  }

  const result = validateAdminPin(pin, correct)

  if (!result.ok) {
    if (result.error.startsWith('ADMIN_PIN')) return json({ error: result.error }, 500)

    state.failures += 1

    if (state.failures >= MAX_FAILURES) {
      const lockMs = state.lockouts === 0 ? FIRST_LOCK_MS : SECOND_LOCK_MS
      state.failures = 0
      state.lockouts += 1
      state.lockUntil = now + lockMs
      attempts.set(key, state)
      return json({
        error: `Too many attempts. Try again in ${Math.ceil(lockMs / 60000)} minutes.`,
        lockedUntil: state.lockUntil,
      }, 429)
    }

    attempts.set(key, state)
    return json({ error: result.error, attemptsRemaining: MAX_FAILURES - state.failures }, 401)
  }

  attempts.delete(key)
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': createAdminSessionCookie(correct, secret),
    },
  })
}

function clientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('cf-connecting-ip')
    || 'local'
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
