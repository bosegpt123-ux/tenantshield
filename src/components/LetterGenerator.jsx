import { useState } from 'react'
import { generateLetter, LETTER_TYPES } from '../lib/claude'
import {
  WrenchIcon, CreditCardIcon, KeyIcon, HomeIcon,
  ClipboardIcon, RetaliationIcon, EqualRightsIcon,
  ChevronDownIcon, ArrowRightIcon, ArrowLeftIcon,
  CopyIcon, CheckIcon, SpinnerIcon, WarningIcon, RefreshIcon,
  PrinterIcon, ShareIcon
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

const LETTER_OPTIONS = [
  { value: 'repair_demand',            Icon: WrenchIcon,      label: 'Repair Demand',                 desc: 'Demand landlord fix something broken'                 },
  { value: 'deposit_return',           Icon: CreditCardIcon,  label: 'Deposit Return Demand',         desc: 'Request your deposit after move-out'                  },
  { value: 'illegal_entry',            Icon: KeyIcon,         label: 'Illegal Entry Complaint',       desc: 'Landlord entered without notice'                      },
  { value: 'habitability',             Icon: HomeIcon,        label: 'Habitability Notice',           desc: 'Unsafe or uninhabitable conditions'                   },
  { value: 'rent_withholding',         Icon: ClipboardIcon,   label: 'Rent Withholding Notice',       desc: 'Withhold rent due to unlivable conditions'            },
  { value: 'retaliatory_eviction',     Icon: RetaliationIcon, label: 'Retaliatory Eviction Response', desc: 'Fight back against landlord retaliation'              },
  { value: 'discrimination_complaint', Icon: EqualRightsIcon, label: 'Discrimination Complaint',      desc: 'Report housing discrimination or Fair Housing violation' },
]

const DETAIL_PLACEHOLDERS = {
  repair_demand:            'e.g. Heater stopped working Dec 10. I texted you Dec 10 and 14. Still no repair as of Dec 15.',
  deposit_return:           'e.g. Moved out Nov 30. It has been 35 days — no deposit or itemized statement received.',
  illegal_entry:            'e.g. On Dec 12 at 2pm you entered without notice while I was not home.',
  habitability:             'e.g. Visible mold on bathroom ceiling since Nov. Notified you 3 weeks ago with photos. No action taken.',
  rent_withholding:         'e.g. Heat has been out for 3 weeks. Sent written notice twice. Unit is uninhabitable below 55°F.',
  retaliatory_eviction:     'e.g. I called code enforcement on Nov 5 about the mold. You served me an eviction notice on Nov 20.',
  discrimination_complaint: 'e.g. Landlord refused to rent to me, saying the unit was taken. It was re-listed the next day. I believe this was due to my national origin.',
}

function Field({ label, value, onChange, placeholder, optional }) {
  return (
    <div className="row-separator py-3.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
        {label}
        {optional && <span className="ml-1.5 normal-case font-normal tracking-normal text-slate-300">Optional</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[14px] text-slate-800 placeholder-slate-300 py-0.5 focus:outline-none"
      />
    </div>
  )
}

/* Step progress indicator */
function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-7">
      {[1, 2, 3].map(n => (
        <div key={n} className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-200
            ${n < step
              ? 'bg-emerald-700 text-white'
              : n === step
              ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
              : 'bg-slate-100 text-slate-400'}`}
          >
            {n < step ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : n}
          </div>
          {n < 3 && (
            <div className={`h-0.5 w-8 rounded-full transition-colors duration-200 ${n < step ? 'bg-emerald-600' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
      <span className="ml-1 text-[12px] text-slate-400 font-medium">
        Step {step} of 3
      </span>
    </div>
  )
}

export default function LetterGenerator() {
  const [step, setStep]       = useState(1)
  const [state, setState]     = useState('')
  const [letterType, setType] = useState('')
  const [info, setInfo]       = useState({
    tenantName: '', address: '', landlordName: '', landlordAddress: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  })
  const [details, setDetails]   = useState('')
  const [letter, setLetter]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [copied, setCopied]     = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const set = (field, val) => setInfo(p => ({ ...p, [field]: val }))

  async function handleGenerate(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const text = await generateLetter({ state, letterType, tenantInfo: info, situationDetails: details })
      setLetter(text)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(letter) } catch {
      const el = Object.assign(document.createElement('textarea'), { value: letter })
      document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${selected?.label} — TenantShield`, text: letter })
      } else {
        await navigator.clipboard.writeText(letter)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {
      try {
        await navigator.clipboard.writeText(letter)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      } catch {}
    }
  }

  function handlePrint() {
    const win = window.open('', '_blank', 'width=800,height=700')
    if (!win) { alert('Please allow popups to use the print feature.'); return }
    const escaped = letter
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${selected?.label || 'Letter'} — TenantShield</title>
<style>
  body { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; line-height: 1.7; margin: 1in; color: #000; background: #fff; }
  pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; font-size: 12pt; margin: 0; }
  @media print { body { margin: 0.75in; } }
</style>
</head>
<body>
<pre>${escaped}</pre>
<script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`)
    win.document.close()
  }

  function reset() {
    setStep(1); setType(''); setState(''); setDetails(''); setLetter('');
    setError(null); setCopied(false); setShareCopied(false)
  }

  const selected = LETTER_OPTIONS.find(o => o.value === letterType)

  /* ── Step 1 — Select type ────────────────────────────────────────────── */
  if (step === 1) return (
    <form onSubmit={e => { e.preventDefault(); if (state && letterType) setStep(2) }} className="space-y-7 animate-slide-up">

      <div>
        <StepBar step={1} />
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Letter Generator</h2>
        <p className="mt-1.5 text-[14px] text-slate-500">A formal legal letter, ready to send today.</p>
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

      {/* Letter type */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Letter type</p>
        <div className="ios-group stagger">
          {LETTER_OPTIONS.map(({ value, Icon, label, desc }) => {
            const active = letterType === value
            return (
              <button key={value} type="button" onClick={() => setType(value)}
                className={`press-effect w-full flex items-center gap-3.5 px-5 py-4 row-separator text-left transition-colors duration-150
                  ${active ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
              >
                <span className={`shrink-0 transition-colors duration-150 ${active ? 'text-emerald-700' : 'text-slate-400'}`}>
                  <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] leading-tight ${active ? 'font-semibold text-emerald-800' : 'font-medium text-slate-700'}`}>
                    {label}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
                </div>
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

      <button type="submit" disabled={!state || !letterType}
        className="btn-primary w-full flex items-center justify-center gap-2.5">
        Continue
        <ArrowRightIcon size={16} />
      </button>
    </form>
  )

  /* ── Step 2 — Fill details ───────────────────────────────────────────── */
  if (step === 2) return (
    <form onSubmit={handleGenerate} className="space-y-7 animate-slide-up">

      <div>
        <StepBar step={2} />
        <button type="button" onClick={() => setStep(1)}
          className="press-effect flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors mb-4">
          <ArrowLeftIcon size={13} />
          Back
        </button>
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">{selected?.label}</h2>
        <p className="mt-1.5 text-[14px] text-slate-500">Fill in your details — leave blank to use placeholders.</p>
      </div>

      {/* Your details */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Your details</p>
        <div className="ios-group px-5">
          <Field label="Your full name"  value={info.tenantName} onChange={v => set('tenantName', v)} placeholder="Jane Smith" optional />
          <Field label="Rental address"  value={info.address}    onChange={v => set('address', v)}    placeholder="123 Main St, Apt 4B, City, State" optional />
        </div>
      </div>

      {/* Landlord details */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Landlord details</p>
        <div className="ios-group px-5">
          <Field label="Landlord name"    value={info.landlordName}    onChange={v => set('landlordName', v)}    placeholder="John Doe / ABC Property Mgmt" optional />
          <Field label="Landlord address" value={info.landlordAddress} onChange={v => set('landlordAddress', v)} placeholder="456 Oak Ave, City, State" optional />
        </div>
      </div>

      {/* What happened */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            What happened?
          </label>
          <span className="text-[11px] font-medium text-slate-300">Strengthens the letter</span>
        </div>
        <div className="ios-group px-5 py-4">
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder={DETAIL_PLACEHOLDERS[letterType] || 'Describe your situation in detail…'}
            rows={4}
            className="w-full resize-none bg-transparent text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 animate-slide-down">
          <span className="text-red-500 shrink-0 mt-0.5"><WarningIcon size={15} /></span>
          <div className="flex-1">
            <p className="text-[13px] text-red-700">{error}</p>
            <button type="button" onClick={() => setError(null)} className="mt-1.5 text-[12px] font-semibold text-red-600 underline underline-offset-2">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2.5">
        {loading ? (
          <>
            <SpinnerIcon size={16} />
            <span>Writing your letter…</span>
          </>
        ) : (
          <>
            <span>Generate letter</span>
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>
    </form>
  )

  /* ── Step 3 — Letter display ─────────────────────────────────────────── */
  return (
    <div className="space-y-5 animate-slide-up">

      <div>
        <StepBar step={3} />
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Your letter is ready</h2>
        <p className="mt-1.5 text-[14px] text-slate-500">Print, copy, or email to your landlord today.</p>
      </div>

      {/* Action buttons — primary copy, secondary print/share */}
      <div className="flex gap-2.5">
        <button onClick={handleCopy}
          className={`press-effect flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200
            ${copied
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm'}`}>
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          {copied ? 'Copied!' : 'Copy letter'}
        </button>
        <button onClick={handlePrint}
          className="press-effect flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-[13px] font-semibold bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 transition-colors">
          <PrinterIcon size={14} />
          Print
        </button>
        <button onClick={handleShare}
          className={`press-effect flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200
            ${shareCopied
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
          {shareCopied ? <CheckIcon size={14} /> : <ShareIcon size={14} />}
          Share
        </button>
      </div>

      {/* Letter preview */}
      <div className="ios-group overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Letter</span>
          <span className="text-[11px] text-slate-400 font-medium">{selected?.label}</span>
        </div>
        <div className="max-h-[500px] overflow-y-auto bg-white px-7 py-6">
          <pre className="whitespace-pre-wrap font-serif text-[13px] leading-[1.8] text-slate-800 tracking-normal">{letter}</pre>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-600">Before you send</p>
        <ul className="space-y-2 text-[13px] text-amber-800">
          <li className="flex gap-2.5 items-start"><span className="text-amber-500 shrink-0 mt-0.5">&#x2192;</span>Send via <strong>certified mail</strong> for proof of delivery</li>
          <li className="flex gap-2.5 items-start"><span className="text-amber-500 shrink-0 mt-0.5">&#x2192;</span>Keep a copy for your records</li>
          <li className="flex gap-2.5 items-start"><span className="text-amber-500 shrink-0 mt-0.5">&#x2192;</span>Email a copy too for a digital paper trail</li>
          <li className="flex gap-2.5 items-start"><span className="text-amber-500 shrink-0 mt-0.5">&#x2192;</span>Fill in any <strong>[BRACKETED PLACEHOLDERS]</strong> before sending</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
        <p className="text-[11px] leading-relaxed text-slate-400">
          <strong className="text-slate-500">General info only, not legal advice.</strong> Laws change — double-check with a local attorney or legal aid clinic.{' '}
          <span className="text-slate-300">Last updated May 2025.</span>
        </p>
      </div>

      <button onClick={reset} className="btn-secondary press-effect w-full flex items-center justify-center gap-2">
        <RefreshIcon size={14} />
        Generate another letter
      </button>
    </div>
  )
}
