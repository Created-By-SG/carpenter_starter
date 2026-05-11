// src/pages/api/admin/save.ts
// Commits the updated business.json to GitHub.
// Vercel detects the commit and automatically rebuilds + redeploys the site.
//
// Required Vercel env vars:
//   ADMIN_PIN       — the PIN used to protect the admin page
//   GITHUB_TOKEN    — fine-grained PAT with Contents: Read & Write on this repo
//   GITHUB_OWNER    — GitHub username or org (e.g. "acme-co")
//   GITHUB_REPO     — repository name (e.g. "painter-site")
//   GITHUB_BRANCH   — branch to commit to (default: "main")
export const prerender = false

import type { APIRoute } from 'astro'
import { hasAdminSession, validateAdminPin } from '../../../lib/adminAuth'

export const POST: APIRoute = async ({ request }) => {
  const { pin, content, sha } = await request.json()

  // ── 1. Re-verify PIN ──────────────────────────────────────────────────────
  const correctPin = import.meta.env.ADMIN_PIN
  const sessionOk = hasAdminSession(request, correctPin, import.meta.env.ADMIN_SESSION_SECRET)
  const pinOk = validateAdminPin(pin, correctPin).ok
  if (!sessionOk && !pinOk) {
    return json({ error: 'Unauthorized' }, 401)
  }

  // ── 2. Check env vars ─────────────────────────────────────────────────────
  const token  = import.meta.env.GITHUB_TOKEN
  const owner  = import.meta.env.GITHUB_OWNER
  const repo   = import.meta.env.GITHUB_REPO
  const branch = import.meta.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) {
    return json({ error: 'GitHub env vars not configured' }, 500)
  }

  // ── 3. Get current SHA if not provided (needed to update an existing file) ─
  let fileSha = sha
  if (!fileSha) {
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/src/data/business.json?ref=${branch}`,
      { headers: ghHeaders(token) }
    )
    if (getRes.ok) {
      const data = await getRes.json()
      fileSha = data.sha
    }
  }

  // ── 4. Commit the new file content ────────────────────────────────────────
  const newContent = Buffer.from(
    JSON.stringify(content, null, 2) + '\n',
    'utf-8'
  ).toString('base64')

  const body: Record<string, unknown> = {
    message: 'chore: update site content via admin dashboard',
    content: newContent,
    branch,
  }
  if (fileSha) body.sha = fileSha

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/src/data/business.json`,
    {
      method: 'PUT',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!putRes.ok) {
    const err = await putRes.text()
    return json({ error: `GitHub commit failed: ${err}` }, 502)
  }

  const result = await putRes.json()
  return json({
    ok: true,
    commit: result.commit?.sha,
    message: 'Committed to GitHub. Vercel is rebuilding your site. Changes will be live in about 60 seconds.',
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
