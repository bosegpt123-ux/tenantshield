import { useState } from 'react'
import { analyzeLeaseClause } from '../lib/claude'
import { ChevronDownIcon, ArrowRightIcon, ArrowLeftIcon, SpinnerIcon, WarningIcon } from './Icons'

const STATES = [
  { value: 'california',     label: 'California' },
  { value: 'texas',          label: 'Texas' },
  { value: 'new_york',       label: 'New York' },
  { value: 'florida',        label: 'Florida' },
  { value: 'illinois',       label: 'Illinois' },
  { value: 'washington',     label: 'Washington' },
  { value: 'georgia',        label: 'Georgia' },
  { value: 'colorado',       label: 'Colorado' },
  { value: 'arizona',        label: 'Arizona' },
  { value: 'north_carolina', label: 'North Carolina' },
]

const FLAG = {
  illegal:    {
    label: 'Illegal Clause',
    bar: 'bg-red-500',
    pill: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    prose: 'text-red-700',
    dot: 'bg-red-500',
    banner: 'border-red-200 bg-red-50',
  },
  suspicious: {
    label: 'Suspicious Clause',
    bar: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    prose: 'text-amber-700',
    dot: 'bg-amber-400',
    banner: 'border-amber-200 bg-amber-50',
  },
  standard:   {
    label: 'Standard Clause',
    bar: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    prose: 'text-emerald-700',
    dot: 'bg-emerald-500',
    banner: 'border-emerald-200 bg-emerald-50',
  },
}

export default function LeaseAnalyzer() {
  const [state, setState]     = useState('')
  const [clause, setClause]   = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!state || clause.trim().length < 20) return
    setLoading(true); setError(null); setResult(null)
    try {
      setResult(await analyzeLeaseClause({ state, clause: clause.trim() }))
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() { setResult(null); setError(null); setClause('') }

  const f = result ? (FLAG[result.flag] || FLAG.suspicious) : null

  /* ── Result view ─────────────────────────────────────────────────────── */
  if (result) return (
    <div className="space-y-4 animate-slide-up">

      {/* Flag banner */}
      <div className={`animate-flag-pop overflow-hidden rounded-2xl border ${f.banner}`}>
        {/* Colored top bar */}
        <div className={`h-1.5 w-full ${f.bar}`} />
        <div className="px-5 py-5">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${f.dot}`} />
            <div>
              <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${f.pill}`}>
                {f.label}
              </span>
              {result.flagReason && (
                <p className={`mt-2.5 text-[14px] leading-relaxed font-medium ${f.prose}`}>
                  {result.flagReason}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What this means */}
      <div className="ios-group animate-slide-up" style={{ animationDelay: '60ms' }}>
        <div className="px-5 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">What this means</p>
        </div>
        <div className="px-5 pb-5 space-y-2.5">
          <p className="text-[16px] font-medium leading-snug text-slate-800">{result.translation}</p>
          {result.translationLong && (
            <p className="text-[14px] leading-relaxed text-slate-500">{result.translationLong}</p>
          )}
        </div>
      </div>

      {/* What you can do */}
      {result.tenantOptions?.length > 0 && (
        <div className="ios-group animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="px-5 pt-5 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">What you can do</p>
          </div>
          <div className="px-5 pb-5">
            <ul className="space-y-4">
              {result.tenantOptions.map((item, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="animate-slide-up rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4" style={{ animationDelay: '180ms' }}>
        <p className="text-[11px] leading-relaxed text-slate-400">
          <strong className="text-slate-500">General info only, not legal advice.</strong> Laws change — double-check with a local attorney or legal aid clinic before taking action.{' '}
          <span className="text-slate-300">Last updated May 2025.</span>
        </p>
      </div>

      <button onClick={handleReset} className="btn-secondary press-effect w-full flex items-center justify-center gap-2">
        <ArrowLeftIcon size={14} />
        Analyze another clause
      </button>
    </div>
  )

  /* ── Form view ──────────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-7 animate-slide-up">

      <div>
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Lease Clause Analyzer</h2>
        <p className="mt-1.5 text-[14px] text-slate-500 leading-relaxed">
          Paste any clause — we&apos;ll flag illegal, suspicious, or standard language.
        </p>
      </div>

      {/* State */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5">
          Your state
        </label>
        <div className="relative ios-group">
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="w-full appearance-none bg-transparent text-[15px] font-medium text-slate-800 px-5 py-4 pr-11 focus:outline-none cursor-pointer"
            required
          >
            <option value="">Select your state…</option>
            {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDownIcon size={15} />
          </div>
        </div>
      </div>

      {/* Clause textarea */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5">
          Lease clause
        </label>
        <div className="ios-group">
          {/* Tip */}
          <div className="px-5 pt-4 pb-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-[12px] text-slate-600 leading-relaxed">
                <strong>Tip:</strong> Copy one paragraph from your lease and paste it here — for example a repair, entry, or deposit clause. No need to paste the whole lease.
              </p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <textarea
              value={clause}
              onChange={e => setClause(e.target.value)}
              placeholder={`e.g. "Tenant shall be responsible for all repairs under $200. Landlord may enter the premises at any time without prior notice…"`}
              rows={6}
              className="w-full resize-none bg-transparent text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none leading-relaxed"
              required
            />
            <p className="mt-2 text-[11px] text-slate-300">Copy directly from your lease agreement</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 animate-slide-down">
          <span className="text-red-500 shrink-0 mt-0.5"><WarningIcon size={15} /></span>
          <p className="text-[13px] text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!state || clause.trim().length < 20 || loading}
        className="btn-primary w-full flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <SpinnerIcon size={16} />
            <span>Analyzing clause…</span>
          </>
        ) : (
          <>
            <span>Analyze this clause</span>
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>
    </form>
  )
}
