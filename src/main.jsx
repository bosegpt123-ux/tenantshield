import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
          <p className="text-[18px] font-semibold text-slate-200 mb-4">
            Something went wrong. Please refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
