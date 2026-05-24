// ─── Shared helpers ───────────────────────────────────────────────────────────

// In dev (Vite on :5173) the serverless function isn't served — use the local dev server instead
const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api/chat' : '/api/chat'

async function postToApi(type, payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || `API error ${res.status}`)
  }

  const data = await res.json()
  // Web search responses may have multiple content blocks; take the last text block
  return data.content?.filter(b => b.type === 'text').at(-1)?.text || ''
}

function parseJSON(text, fallback) {
  try {
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    return JSON.parse(stripped)
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) return JSON.parse(match[0])
    } catch {}
    return fallback
  }
}

// ─── Feature 1: Situation Resolver ───────────────────────────────────────────

export async function analyzeSituation({ state, situations, details }) {
  const text = await postToApi('situation', { state, situations, details })
  return parseJSON(text, {
    summary: text,
    landlordObligations: [],
    tenantActions: ['Contact a local tenant rights organization for guidance.'],
    urgency: 'medium',
  })
}

// ─── Feature 2: Lease Clause Analyzer ────────────────────────────────────────

export async function analyzeLeaseClause({ state, clause }) {
  const text = await postToApi('lease', { state, clause })
  return parseJSON(text, {
    translation: text,
    flag: 'suspicious',
    flagReason: 'Could not fully parse the analysis. Review manually.',
    tenantOptions: ['Consult a tenant rights attorney to review this clause.'],
  })
}

// ─── Feature 3: Letter Generator ─────────────────────────────────────────────

export const LETTER_TYPES = {
  repair_demand:             'Repair Demand Letter',
  deposit_return:            'Security Deposit Return Demand',
  illegal_entry:             'Illegal Entry Complaint',
  habitability:              'Habitability Violation Notice',
  rent_withholding:          'Notice of Rent Withholding',
  retaliatory_eviction:      'Response to Retaliatory Eviction',
  discrimination_complaint:  'Fair Housing Discrimination Complaint',
}

export async function generateLetter({ state, letterType, tenantInfo, situationDetails }) {
  return postToApi('letter', { state, letterType, tenantInfo, situationDetails })
}
