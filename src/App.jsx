import { useState } from 'react'
import SituationForm from './components/SituationForm'
import ResultCard from './components/ResultCard'
import LeaseAnalyzer from './components/LeaseAnalyzer'
import LetterGenerator from './components/LetterGenerator'
import { ShieldIcon, ScaleIcon, DocumentIcon, MailIcon } from './components/Icons'
import { analyzeSituation } from './lib/claude'

const TABS = [
  { id: 'situation', label: 'My Rights', Icon: ScaleIcon    },
  { id: 'lease',     label: 'Lease',     Icon: DocumentIcon },
  { id: 'letter',    label: 'Letter',    Icon: MailIcon     },
]

function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Pick your state & issues',
      desc: 'Select what\'s happening — choose as many as apply to your situation.',
    },
    {
      num: '2',
      title: 'Get your legal rights',
      desc: 'Plain-English explanation of the law and what your landlord must do.',
    },
    {
      num: '3',
      title: 'Take action tonight',
      desc: 'Clear next steps, a formal letter to send, and free legal resources.',
    },
  ]
  return (
    <div className="mt-10 animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">How it works</p>
      <div className="space-y-6">
        {steps.map(({ num, title, desc }) => (
          <div key={num} className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[13px] font-bold text-white mt-0.5">
              {num}
            </span>
            <div>
              <p className="text-[15px] font-semibold text-slate-800 leading-tight">{title}</p>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="skeleton h-8 w-32 rounded-full" />
      <div className="ios-group p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-5 w-3/5 rounded" />
      </div>
      <div className="skeleton h-14 w-full rounded-xl" />
      <div className="skeleton h-14 w-full rounded-xl" />
      <div className="skeleton h-14 w-full rounded-xl" />
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab]   = useState('situation')
  const [result, setResult]         = useState(null)
  const [resultMeta, setResultMeta] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [lastFormData, setLastFormData] = useState(null)
  const [contentKey, setContentKey] = useState(0)

  async function handleSituationSubmit(formData) {
    setLoading(true)
    setError(null)
    setResult(null)
    setLastFormData(formData)
    try {
      const data = await analyzeSituation(formData)
      setResult(data)
      setResultMeta({ state: formData.state, situations: formData.situations })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() { setResult(null); setResultMeta(null); setError(null) }
  function handleRetry()  { if (lastFormData) handleSituationSubmit(lastFormData) }

  function handleTabChange(tabId) {
    if (tabId === activeTab) return
    setActiveTab(tabId)
    setResult(null)
    setResultMeta(null)
    setError(null)
    setContentKey(k => k + 1)
  }

  const showHero = activeTab === 'situation' && !result && !loading

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 font-sans">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-slate-950 px-6 pt-12 pb-7">
        <div className="mx-auto max-w-xl">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25 text-emerald-400">
              <ShieldIcon size={20} />
            </div>
            <div>
              <h1 className="text-[18px] font-bold tracking-tight text-white leading-none">
                TenantShield
              </h1>
              <p className="text-[11px] text-slate-400 tracking-wider mt-0.5 font-medium uppercase">
                Know your rights. Act tonight.
              </p>
            </div>
          </div>

          {/* Hero — visible only on the home state */}
          {showHero && (
            <div className="mt-8 animate-fade-in">
              <h2 className="text-[38px] font-extrabold text-white leading-[1.1] tracking-tight">
                Your legal rights,<br />
                <span className="text-emerald-400">plain and simple.</span>
              </h2>
              <p className="mt-4 text-[15px] text-slate-400 leading-relaxed max-w-sm">
                State-specific tenant law. Real action steps. Free for every renter in America.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* ── Scrollable content ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto mx-auto w-full max-w-xl px-6 py-7 pb-28">

        {/* Error banner */}
        {error && !loading && (
          <div className="mb-6 animate-slide-down rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 text-red-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-red-800">{error}</p>
                {lastFormData && (
                  <button
                    onClick={handleRetry}
                    className="mt-2 text-[13px] font-semibold text-red-700 underline underline-offset-2 hover:text-red-900 transition-colors"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab panels */}
        <div key={contentKey}>
          {activeTab === 'situation' && (
            loading
              ? <ResultSkeleton />
              : result
                ? <ResultCard result={result} onReset={handleReset} resultMeta={resultMeta} />
                : <SituationForm onSubmit={handleSituationSubmit} loading={loading} />
          )}
          {activeTab === 'lease'  && <LeaseAnalyzer />}
          {activeTab === 'letter' && <LetterGenerator />}
        </div>

        {/* How it works — home state only */}
        {activeTab === 'situation' && !result && !loading && !error && <HowItWorks />}
      </main>

      {/* ── Bottom tab bar ──────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 glass border-t border-slate-200/80 pb-safe">
        <div className="mx-auto max-w-xl flex">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`press-effect relative flex-1 flex flex-col items-center gap-1 py-3.5 transition-colors duration-200
                  ${active ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {/* Top-edge active line */}
                {active && (
                  <span className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full bg-emerald-600" />
                )}
                <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] tracking-wide transition-all duration-200 ${active ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
