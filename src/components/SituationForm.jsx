import { useState } from 'react'
import {
  FlameIcon, ShowerIcon, AlertIcon, CreditCardIcon,
  KeyIcon, ClipboardIcon, TrendingUpIcon, RetaliationIcon,
  BugIcon, ZapOffIcon, UnsafeHomeIcon, EqualRightsIcon,
  ChevronDownIcon, ArrowRightIcon, SpinnerIcon
} from './Icons'

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

const SITUATIONS = {
  broken_heat:            { label: 'No heat / broken heater',         Icon: FlameIcon        },
  no_hot_water:           { label: 'No hot water',                    Icon: ShowerIcon       },
  mold:                   { label: 'Mold in unit',                    Icon: AlertIcon        },
  pest_infestation:       { label: 'Pests — roaches, mice, bedbugs',  Icon: BugIcon          },
  unsafe_conditions:      { label: 'Unsafe living conditions',        Icon: UnsafeHomeIcon   },
  deposit_dispute:        { label: 'Security deposit dispute',        Icon: CreditCardIcon   },
  rent_increase:          { label: 'Sudden / illegal rent increase',  Icon: TrendingUpIcon   },
  illegal_entry:          { label: 'Landlord entered without notice', Icon: KeyIcon          },
  retaliation:            { label: 'Landlord is retaliating',         Icon: RetaliationIcon  },
  utility_shutoff:        { label: 'Landlord shut off utilities',     Icon: ZapOffIcon       },
  eviction_notice:        { label: 'Received eviction notice',        Icon: ClipboardIcon    },
  housing_discrimination: { label: 'Housing discrimination',          Icon: EqualRightsIcon  },
}

const SITUATION_GROUPS = [
  { label: 'Repairs & Habitability', keys: ['broken_heat', 'no_hot_water', 'mold', 'pest_infestation', 'unsafe_conditions'] },
  { label: 'Money & Deposits',       keys: ['deposit_dispute', 'rent_increase'] },
  { label: 'Landlord Behavior',      keys: ['illegal_entry', 'retaliation', 'utility_shutoff'] },
  { label: 'Legal Threats',          keys: ['eviction_notice', 'housing_discrimination'] },
]

export default function SituationForm({ onSubmit, loading }) {
  const [state, setState]         = useState('')
  const [situations, setSituations] = useState([])
  const [details, setDetails]     = useState('')

  function toggleSituation(value) {
    setSituations(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!state || situations.length === 0) return
    onSubmit({ state, situations, details })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 animate-slide-up">

      {/* State selector */}
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

      {/* Situation groups — multi-select */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            What&rsquo;s happening?
          </label>
          {situations.length > 0 && (
            <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {situations.length} selected
            </span>
          )}
        </div>
        <p className="text-[13px] text-slate-500 mb-5">Select all that apply to your situation.</p>

        <div className="space-y-5">
          {SITUATION_GROUPS.map(({ label: groupLabel, keys }) => (
            <div key={groupLabel}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                {groupLabel}
              </p>
              <div className="ios-group stagger">
                {keys.map(value => {
                  const { label, Icon } = SITUATIONS[value]
                  const active = situations.includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleSituation(value)}
                      className={`press-effect w-full flex items-center gap-3.5 px-5 py-4 row-separator text-left transition-colors duration-150
                        ${active ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
                    >
                      <span className={`shrink-0 transition-colors duration-150 ${active ? 'text-emerald-700' : 'text-slate-400'}`}>
                        <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                      </span>
                      <span className={`flex-1 text-[14px] leading-tight transition-colors duration-150
                        ${active ? 'font-semibold text-emerald-800' : 'font-medium text-slate-700'}`}>
                        {label}
                      </span>
                      {/* Checkbox circle */}
                      <span className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200
                        ${active ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                        {active && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Details
          </label>
          <span className="text-[11px] font-medium text-slate-300">Optional</span>
        </div>
        <div className="ios-group px-5 py-4">
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="e.g. Heater broke 5 days ago, landlord hasn't responded. Also noticed roaches last week…"
            rows={3}
            className="w-full resize-none bg-transparent text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!state || situations.length === 0 || loading}
        className="btn-primary w-full flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <SpinnerIcon size={16} />
            <span>Analyzing your situation…</span>
          </>
        ) : (
          <>
            <span>
              {situations.length > 1
                ? `Get my rights for ${situations.length} issues`
                : 'Get my rights & next steps'}
            </span>
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>

    </form>
  )
}
