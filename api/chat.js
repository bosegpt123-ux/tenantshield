// Rate limiting: 10 requests per minute per IP (in-memory, resets on cold start)
const rateLimitStore = new Map()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function setCorsHeaders(res, origin) {
  // Allow any localhost origin in dev; production is same-origin so CORS never fires
  const corsOrigin = /^http:\/\/localhost(:\d+)?$/.test(origin) ? origin : 'http://localhost:5173'
  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

// ─── System prompts (mirrored from src/lib/claude.js + web search instruction) ─

const WEB_SEARCH_PREAMBLE = `Before answering, use web_search to look up current tenant law statutes for the state specified in the user message. Note the source and year of the law in your response.\n\n`

const SITUATION_SYSTEM = WEB_SEARCH_PREAMBLE + `You are a tenant rights assistant. You provide accurate, state-specific legal information to renters in plain English. The tenant may have one or more issues — address all of them in your response. Structure your response as JSON with exactly these keys:
- "summary": 1 short sentence (max 25 words) stating the tenant's core rights covering all their situations
- "summaryLong": 2 to 4 plain English sentences expanding on the law and what it means for the tenant across all their issues
- "landlordObligations": array of 2 to 5 short strings, each one landlord obligation with any deadline. Keep each item under 15 words.
- "tenantActions": array of 3 to 6 short strings, each one clear action step covering the situations. Keep each item under 15 words. Do not number them.
- "urgency": one of "high", "medium", or "low" — reflect the most urgent situation present

Important rules:
- Do not use em dashes, en dashes, or hyphens to join clauses. Use plain punctuation like commas or periods instead.
- Do not use markdown formatting inside string values.
- Respond ONLY with raw valid JSON. No code fences, no markdown, no preamble.`

const LEASE_SYSTEM = WEB_SEARCH_PREAMBLE + `You are a tenant rights attorney reviewing lease clauses. Analyze the provided lease clause for a tenant in the given state. Respond ONLY with raw valid JSON, no code fences, no markdown, no preamble. Use exactly these keys:
- "translation": 1 short plain English sentence (max 20 words) stating what this clause means for the tenant
- "translationLong": 2 to 3 plain English sentences with more detail about the clause and its implications
- "flag": exactly one of "illegal", "suspicious", or "standard"
- "flagReason": 1 short sentence explaining why this flag was assigned. Max 20 words.
- "tenantOptions": array of 2 to 4 short action strings (empty array if "standard"). Max 12 words each.

Do not use em dashes, en dashes, or hyphens to join clauses. Use commas or periods instead.`

const LETTER_SYSTEM = `You are a tenant rights paralegal who drafts formal legal letters for renters. Generate a complete, professional letter that the tenant can send immediately.

CRITICAL FORMAT REQUIREMENTS — follow this exact layout:
1. Sender address block (tenant name, address) — top left
2. Blank line
3. Date (written out: e.g. May 23, 2026)
4. Blank line
5. Recipient address block (landlord name and address)
6. Blank line
7. Re: line stating the letter subject
8. Blank line
9. Salutation (Dear [Landlord Name]:)
10. Blank line
11. Body paragraphs — 3 to 5 paragraphs with blank lines between them
    - Paragraph 1: State the purpose and your relationship as tenant
    - Paragraph 2: Describe the violation or issue clearly with dates
    - Paragraph 3: Cite specific legal code relevant to this state
    - Paragraph 4: State your demand and the deadline for response
    - Paragraph 5 (optional): State consequences of non-compliance
12. Blank line
13. Closing ("Sincerely," or "Respectfully,")
14. Blank line
15. Signature line: [Tenant Signature]
16. Printed name
17. Date line

Additional requirements:
- Include specific legal citations for the tenant's state
- Be firm but professional in tone
- Use [BRACKETED PLACEHOLDERS] for any info not provided

Respond ONLY with the complete letter text — no JSON, no preamble, no explanation.`

const LETTER_TYPES = {
  repair_demand:             'Repair Demand Letter',
  deposit_return:            'Security Deposit Return Demand',
  illegal_entry:             'Illegal Entry Complaint',
  habitability:              'Habitability Violation Notice',
  rent_withholding:          'Notice of Rent Withholding',
  retaliatory_eviction:      'Response to Retaliatory Eviction',
  discrimination_complaint:  'Fair Housing Discrimination Complaint',
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

function buildPrompt(type, payload) {
  if (type === 'situation') {
    const { state, situations, details } = payload
    const situationLabels = situations.map(s => s.replace(/_/g, ' ')).join(', ')
    return {
      system: SITUATION_SYSTEM,
      userPrompt: `State: ${state}
Situations reported: ${situationLabels}
Tenant's description: ${details || '(no additional details provided)'}

What are this tenant's rights and exact next steps for all situations reported?`,
      maxTokens: 1200,
    }
  }

  if (type === 'lease') {
    const { state, clause } = payload
    return {
      system: LEASE_SYSTEM,
      userPrompt: `State: ${state}

Lease clause to analyze:
"""
${clause}
"""

Analyze this clause. Is it illegal, suspicious, or standard for ${state}?`,
      maxTokens: 1024,
    }
  }

  if (type === 'letter') {
    const { state, letterType, tenantInfo, situationDetails } = payload
    const letterTypeName = LETTER_TYPES[letterType] || letterType
    return {
      system: LETTER_SYSTEM,
      userPrompt: `Generate a ${letterTypeName} for a tenant in ${state}.

Tenant information:
- Tenant name: ${tenantInfo.tenantName || '[TENANT NAME]'}
- Tenant address: ${tenantInfo.address || '[RENTAL PROPERTY ADDRESS]'}
- Landlord name: ${tenantInfo.landlordName || '[LANDLORD NAME]'}
- Landlord address: ${tenantInfo.landlordAddress || '[LANDLORD ADDRESS]'}
- Date: ${tenantInfo.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Situation details: ${situationDetails || '(use standard language for this letter type)'}

Write the complete ${letterTypeName} now, following the exact format specified.`,
      maxTokens: 1800,
    }
  }

  throw new Error(`Unknown type: ${type}`)
}

// ─── Handler (ESM export — required because package.json has "type": "module") ─

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  setCorsHeaders(res, origin)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' })
    return
  }

  const body = req.body
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }

  const { type, payload } = body
  if (!type || !payload) {
    res.status(400).json({ error: 'Missing type or payload' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  let system, userPrompt, maxTokens
  try {
    ;({ system, userPrompt, maxTokens } = buildPrompt(type, payload))
  } catch (err) {
    res.status(400).json({ error: err.message })
    return
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userPrompt }],
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      }),
    })

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}))
      res.status(upstream.status).json({ error: err?.error?.message || `Upstream error ${upstream.status}` })
      return
    }

    const data = await upstream.json()
    res.status(200).json(data)
  } catch {
    res.status(502).json({ error: 'Failed to reach AI service' })
  }
}
