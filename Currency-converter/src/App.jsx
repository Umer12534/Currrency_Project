import { useState } from 'react'
import './App.css'
import InputBox from './components/InputBox'
import useCurrencyInfo from './hooks/useCurrencyInfo'

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${currency.toUpperCase()}`
  }
}

function App() {
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('usd')
  const [to, setTo] = useState('pkr')
  const [convertedAmount, setConvertedAmount] = useState(null)

  const { data: currencyInfo, isLoading, error } = useCurrencyInfo(from)
  const options = Object.keys(currencyInfo).sort()
  const exchangeRate = from === to ? 1 : currencyInfo[to]
  const canConvert =
    !isLoading &&
    !error &&
    Number.isFinite(Number(exchangeRate)) &&
    Number.isFinite(amount) &&
    amount >= 0

  const resetResult = () => setConvertedAmount(null)

  const swap = () => {
    setFrom(to)
    setTo(from)
    resetResult()
  }

  const convert = (event) => {
    event.preventDefault()
    if (!canConvert) return

    setConvertedAmount(amount * Number(exchangeRate))
  }

  const formattedRate = Number.isFinite(Number(exchangeRate))
    ? Number(exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 6 })
    : null

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Ratewise home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 8h14m0 0-3-3m3 3-3 3M20 16H6m0 0 3 3m-3-3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>ratewise</span>
        </a>
        <div className="live-indicator"><span aria-hidden="true" /> Daily rates</div>
      </header>

      <main className="page-content" id="home">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">Currency, made clearer</p>
          <h1 id="page-title">Move money <span>with confidence.</span></h1>
          <p className="intro-copy">
            Get a quick, clear estimate for your next transfer with exchange rates for currencies around the world.
          </p>
          <ul className="feature-list">
            <li><span className="feature-check" aria-hidden="true">✓</span> Simple, transparent conversion</li>
            <li><span className="feature-check" aria-hidden="true">✓</span> Rates updated daily</li>
          </ul>
        </section>

        <section className="converter-card" aria-labelledby="converter-title">
          <div className="card-heading">
            <h2 id="converter-title">Currency converter</h2>
            <span className="fee-badge">No hidden fees</span>
          </div>

          <form onSubmit={convert}>
            <InputBox
              label="You send"
              amount={amount}
              currencyOptions={options}
              onCurrencyChange={(currency) => {
                setFrom(currency)
                resetResult()
              }}
              selectCurrency={from}
              onAmountChange={(value) => {
                setAmount(value)
                resetResult()
              }}
              isCurrencyLoading={isLoading}
            />

            <div className="swap-row">
              <span className="swap-line" aria-hidden="true" />
              <button
                type="button"
                className="swap-button"
                onClick={swap}
                aria-label="Swap currencies"
                title="Swap currencies"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 7h13m0 0-3.5-3.5M20 7l-3.5 3.5M17 17H4m0 0 3.5-3.5M4 17l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <InputBox
              label="They receive"
              amount={convertedAmount}
              currencyOptions={options}
              onCurrencyChange={(currency) => {
                setTo(currency)
                resetResult()
              }}
              selectCurrency={to}
              amountDisable
              isCurrencyLoading={isLoading}
            />

            <div className="rate-line" aria-live="polite">
              <span>
                {formattedRate
                  ? <>1 {from.toUpperCase()} = <strong>{formattedRate} {to.toUpperCase()}</strong></>
                  : 'Loading exchange rate'}
              </span>
              <span className="rate-status">{isLoading ? 'Updating…' : error ? 'Unavailable' : 'Indicative rate'}</span>
            </div>

            {error && <p className="error-message" role="alert">{error}</p>}

            {convertedAmount !== null && (
              <div className="result-panel" aria-live="polite">
                <div>
                  <span className="result-label">Estimated amount</span>
                  <div className="result-value">{formatCurrency(convertedAmount, to)}</div>
                </div>
                <span className="result-pair">{from.toUpperCase()} → {to.toUpperCase()}</span>
              </div>
            )}

            <button className="convert-button" type="submit" disabled={!canConvert}>
              {isLoading ? 'Loading rates…' : `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </section>

        <aside className="aside-card">
          <span className="aside-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5M12 7v5l3.5 2M16.5 3.5v4h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2>Know your numbers before you move.</h2>
          <p>Compare currencies in seconds and make your next international payment with more clarity.</p>
        </aside>
      </main>

      <footer className="site-footer">
        <p>Exchange rates are indicative and may differ from the rate offered by your provider.</p>
        <p>Built for clearer currency decisions.</p>
      </footer>
    </div>
  )
}

export default App
