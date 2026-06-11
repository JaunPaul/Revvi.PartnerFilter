import { filterPartnerCards, rebuildPartnerIndex, slicePartnerIndex } from './index-data'
import { state } from './state'
import type { PartnerListResponse } from '../shared/partner-api'

type Env = {
  WEBFLOW_TOKEN?: string
  ALLOWED_ORIGINS?: string
}

const DEFAULT_PAGE_SIZE = 12

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

async function ensureIndex(env: Env) {
  if (!env.WEBFLOW_TOKEN) {
    throw new Error('WEBFLOW_TOKEN is required in the worker environment')
  }

  if (!state.partnerIndex) {
    state.partnerIndex = await rebuildPartnerIndex(env.WEBFLOW_TOKEN)
  }

  return state.partnerIndex
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseFacetValues(searchParams: URLSearchParams, key: string) {
  return searchParams
    .getAll(key)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean)
}

function parseTextValue(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.trim() ?? ''
}

function parseAllowedOrigins(value: string | undefined) {
  return new Set(
    (value ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
}

function corsHeaders(origin: string | null) {
  if (!origin) {
    return {}
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function isAllowedOrigin(origin: string | null, allowedOrigins: Set<string>) {
  if (!origin) {
    return true
  }

  return allowedOrigins.has(origin)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin')
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS)

    if (!isAllowedOrigin(origin, allowedOrigins)) {
      return json({ ok: false, error: 'Origin not allowed' }, { status: 403, headers: corsHeaders(origin) })
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (url.pathname === '/health') {
      return json({ ok: true, service: 'revvi-partner-filter-worker' }, { headers: corsHeaders(origin) })
    }

    if (url.pathname === '/partners') {
      const page = parsePositiveInt(url.searchParams.get('page'), 1)
      const pageSize = parsePositiveInt(url.searchParams.get('pageSize'), DEFAULT_PAGE_SIZE)
      const index = await ensureIndex(env)
      const filteredPartners = filterPartnerCards(index.partners, {
        tiers: parseFacetValues(url.searchParams, 'tier'),
        types: parseFacetValues(url.searchParams, 'type'),
        locations: parseFacetValues(url.searchParams, 'location'),
        tags: parseFacetValues(url.searchParams, 'tag'),
        name: parseTextValue(url.searchParams, 'name'),
      })
      const paged = slicePartnerIndex(filteredPartners, page, pageSize)

      return json({
        ok: true,
        generatedAt: index.generatedAt,
        siteId: index.siteId,
        items: paged.items,
        pagination: paged.pagination,
      } satisfies PartnerListResponse, { headers: corsHeaders(origin) })
    }

    return json({ ok: true, message: 'Cloudflare Worker is ready.', path: url.pathname }, { headers: corsHeaders(origin) })
  },

  async scheduled(_event, env) {
    if (!env.WEBFLOW_TOKEN) {
      throw new Error('WEBFLOW_TOKEN is required in the worker environment')
    }

    state.partnerIndex = await rebuildPartnerIndex(env.WEBFLOW_TOKEN)
  },
}
