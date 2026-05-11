// src/pages/api/admin/load.ts
// Fetches the current business.json directly from GitHub so the admin always
// edits the live source-of-truth, not a stale build-time snapshot.
export const prerender = false

import type { APIRoute } from 'astro'
import { hasAdminSession } from '../../../lib/adminAuth'

export const GET: APIRoute = async ({ request }) => {
  if (!hasAdminSession(request, import.meta.env.ADMIN_PIN, import.meta.env.ADMIN_SESSION_SECRET)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const token  = import.meta.env.GITHUB_TOKEN
  const owner  = import.meta.env.GITHUB_OWNER
  const repo   = import.meta.env.GITHUB_REPO
  const branch = import.meta.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) {
    return new Response(
      JSON.stringify({ error: 'GitHub env vars not configured (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/src/data/business.json?ref=${branch}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(JSON.stringify({ error: `GitHub API error: ${err}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await res.json()
  // GitHub returns base64-encoded content
  const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))

  return new Response(JSON.stringify({ content, sha: data.sha }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
