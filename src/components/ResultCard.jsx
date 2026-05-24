import { useState } from 'react'
import { ArrowLeftIcon, ShareIcon, MapPinIcon, CalendarIcon, CheckIcon, CopyIcon } from './Icons'
import stateLaws from '../data/stateLaws.json'

const URGENCY = {
  high:   { label: 'Act today',     dot: 'bg-red-500',     pill: 'bg-red-50 text-red-700 ring-1 ring-red-200'                   },
  medium: { label: 'Act this week', dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'             },
  low:    { label: 'Non-urgent',    dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'       },
}

const EVICTION_RESPONSE_DAYS = {
  california:     3,
  texas:          3,
  new_york:       14,
  florida:        3,
  illinois:       5,
  washington:     3,
  georgia:        7,
  colorado:       10,
  arizona:        5,
  north_carolina: 10,
}

function Section({ title, children, delay = '0ms' }) {
  return (
    <div className="ios-group animate-slide-up" style={{ animationDelay: delay }}>
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  )
}

function EvictionCountdown({ stateKey }) {
  const [noticeDate, setNoticeDate] = useState('')
  const responseDays = EVICTION_RESPONSE_DAYS[stateKey] || 3

  let daysRemaining = null
  let deadlineDate  = null

  if (noticeDate) {
    const received = new Date(noticeDate + 'T00:00:00')
    const today    = new Date()
    today.setHours(0, 0, 0, 0)
    const daysSince = Math.floor((today - received) / 86400000)
    daysRemaining   = responseDays - daysSince
    const deadline  = new Date(received)
    deadline.setDate(deadline.getDate() + responseDays)
    deadlineDate = deadline.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const isPast   = daysRemaining !== null && daysRemaining < 0
  const isRed    = daysRemaining !== null && daysRemaining <= 3
  const isYellow = daysRemaining !== null && daysRemaining > 3 && daysRemaining <= 7
  const isGreen  = daysRemaining !== null && daysRemaining > 7

  const wrapperStyle = isPast || isRed
    ? 'border-red-200 bg-red-50/60'
    : isYellow
    ? 'border-amber-200 bg-amber-50/60'
    : isGreen
    ? 'border-emerald-200 bg-emerald-50/60'
    : 'border-slate-200 bg-white'

  const countStyle = isPast || isRed
    ? 'text-red-600'
    : isYellow
    ? 'text-amber-600'
    : isGreen
    ? 'text-emerald-600'
    : 'text-slate-800'

  const iconStyle = isPast || isRed
    ? 'text-red-500'
    : isYellow
    ? 'text-amber-500'
    : isGreen
    ? 'text-emerald-500'
    : 'text-slate-400'

  return (
    <div className={`rounded-2xl border-2 overflow-hidden animate-slide-up ${wrapperStyle}`} style={{ animationDelay: '60ms' }}>
      <div className="px-5 pt-5 pb-2 flex items-center gap-2.5">
        <span className={iconStyle}><CalendarIcon size={15} /></span>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Eviction Response Deadline
        </p>
      </div>

      <div className="px-5 pb-5">
        <p className="text-[13px] text-slate-600 mb-4 leading-relaxed">
          When did you receive the eviction notice? Enter the date to see your exact deadline.
        </p>

        <input
          type="date"
          value={noticeDate}
          onChange={e => setNoticeDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-shadow"
        />

        {noticeDate && (
          <div className="mt-4 space-y-3 animate-slide-down">
            {isPast ? (
              <div className="rounded-xl bg-red-100 border border-red-200 px-4 py-3.5">
                <p className="text-[14px] font-bold text-red-700">Deadline has passed</p>
                <p className="text-[13px] text-red-600 mt-1 leading-relaxed">
                  The {responseDays}-day notice window expired {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''} ago. Contact a legal aid attorney immediately — you may still have options in court.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-4">
                  <span className={`text-[64px] font-black leading-none tabular-nums ${countStyle}`}>
                    {daysRemaining}
                  </span>
                  <div className="pb-2">
                    <p className={`text-[16px] font-semibold leading-tight ${countStyle}`}>
                      day{daysRemaining !== 1 ? 's' : ''} remaining
                    </p>
                    <p className="text-[12px] text-slate-400 mt-0.5">to respond to this notice</p>
                  </div>
                </div>
                <p className="text-[13px] text-slate-600">
                  <span className="font-semibold">Deadline: {deadlineDate}</span>
                  {' '}({responseDays}-day notice period for {stateLaws[stateKey]?.name})
                </p>
                {isRed && (
                  <p className="text-[13px] font-semibold text-red-700 bg-red-100 rounded-xl px-4 py-3">
                    Act immediately. Contact a legal aid attorney today.
                  </p>
                )}
                {isYellow && (
                  <p className="text-[13px] font-semibold text-amber-700 bg-amber-100 rounded-xl px-4 py-3">
                    Time is short. Seek legal help as soon as possible.
                  </p>
                )}
              </>
            )}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Note: this is for the initial notice period. Different timelines may apply depending on the type of notice and your state.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const SITUATION_SHORT = {
  broken_heat:            'No Heat',
  no_hot_water:           'No Hot Water',
  mold:                   'Mold',
  deposit_dispute:        'Deposit',
  illegal_entry:          'Illegal Entry',
  eviction_notice:        'Eviction Notice',
  rent_increase:          'Rent Increase',
  retaliation:            'Retaliation',
  pest_infestation:       'Pests',
  utility_shutoff:        'Utility Shutoff',
  unsafe_conditions:      'Unsafe Conditions',
  housing_discrimination: 'Discrimination',
}

export default function ResultCard({ result, onReset, resultMeta }) {
  const [expanded, setExpanded]       = useState(true)
  const [shareCopied, setShareCopied] = useState(false)
  if (!result) return null

  const urgency    = URGENCY[result.urgency] || URGENCY.medium
  const stateKey   = resultMeta?.state || ''
  const situations = resultMeta?.situations || []
  const stateName  = stateLaws[stateKey]?.name || ''
  const hasEviction = situations.includes('eviction_notice')

  async function handleShare() {
    const actions = result.tenantActions?.slice(0, 3).map(a => `• ${a}`).join('\n') || ''
    const text = `My tenant rights in ${stateName}:\n\n${result.summary}\n\nKey steps:\n${actions}\n\nGenerated by TenantShield`
    try {
      if (navigator.share) {
        await navigator.share({ title: `Tenant Rights — ${stateName}`, text })
      } else {
        await navigator.clipboard.writeText(text)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      } catch {}
    }
  }

  function handleFindHelp() {
    const q = encodeURIComponent(`free tenant legal aid ${stateName}`)
    window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer')
  }

  const contextLabel = [
    stateName,
    situations.length > 0
      ? situations.map(s => SITUATION_SHORT[s] || s).join(' · ')
      : null,
  ].filter(Boolean).join(' — ')

  return (
    <div className="space-y-4">

      {/* Back + context */}
      <div className="animate-fade-in flex items-center gap-2.5 py-1">
        <button
          onClick={onReset}
          className="press-effect flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeftIcon size={13} />
          Back
        </button>
        {contextLabel && (
          <>
            <span className="text-slate-300 select-none">·</span>
            <span className="text-[12px] text-slate-400 truncate">{contextLabel}</span>
          </>
        )}
      </div>

      {/* Urgency pill + share */}
      <div className="animate-scale-in flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold ${urgency.pill}`}>
          <span className={`h-2 w-2 rounded-full ${urgency.dot} dot-pulse`} />
          {urgency.label}
        </span>

        <button
          onClick={handleShare}
          className={`press-effect flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-all duration-200
            ${shareCopied
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}
        >
          {shareCopied ? <CheckIcon size={13} /> : <ShareIcon size={13} />}
          {shareCopied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Short summary */}
      <Section title="The short answer" delay="40ms">
        <p className="text-[16px] font-medium leading-snug text-slate-800">
          {result.summary}
        </p>
      </Section>

      {/* Eviction countdown */}
      {hasEviction && <EvictionCountdown stateKey={stateKey} />}

      {/* Expand / Collapse */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="press-effect w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors animate-slide-up"
        style={{ animationDelay: '80ms' }}
      >
        <span>{expanded ? 'Show less' : 'Show full details'}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <>
          {result.summaryLong && (
            <Section title="More detail" delay="0ms">
              <p className="text-[14px] leading-relaxed text-slate-700">{result.summaryLong}</p>
            </Section>
          )}

          {result.landlordObligations?.length > 0 && (
            <Section title="What your landlord must do" delay="40ms">
              <ul className="space-y-4">
                {result.landlordObligations.map((item, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <span className="text-[14px] text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {result.tenantActions?.length > 0 && (
            <Section title="What you should do" delay="80ms">
              <ul className="space-y-4">
                {result.tenantActions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      {i + 1}
                    </span>
                    <span className="text-[14px] text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}

      {/* Find legal help */}
      <button
        onClick={handleFindHelp}
        className="press-effect w-full flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-[14px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <MapPinIcon size={16} />
        Find free legal help near you
      </button>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <p className="text-[11px] leading-relaxed text-slate-400">
          <strong className="text-slate-500">General info only, not legal advice.</strong> Laws change — double-check with a local attorney or legal aid clinic before taking action.{' '}
          <span className="text-slate-300">Last updated May 2025.</span>
        </p>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="btn-secondary press-effect w-full flex items-center justify-center gap-2 animate-slide-up"
        style={{ animationDelay: '140ms' }}
      >
        <ArrowLeftIcon size={14} />
        Check another situation
      </button>
    </div>
  )
}
