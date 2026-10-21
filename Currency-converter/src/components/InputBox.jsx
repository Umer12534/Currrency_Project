import { useId } from 'react'

const InputBox = ({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = 'usd',
  currencyDisable = false,
  amountDisable = false,
  isCurrencyLoading = false,
}) => {
  const amountInputId = useId()
  const currencySelectId = useId()

  return (
    <div className="input-box">
      <div className="input-column">
        <label className="field-label" htmlFor={amountInputId}>{label}</label>
        <input
          id={amountInputId}
          className="amount-input"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="0.00"
          disabled={amountDisable}
          value={amount ?? ''}
          onChange={(event) => onAmountChange?.(Number(event.target.value))}
        />
      </div>

      <div className="currency-column">
        <label className="currency-label" htmlFor={currencySelectId}>Currency</label>
        <div className="currency-select-wrap">
          <select
            id={currencySelectId}
            className="currency-select"
            value={selectCurrency}
            onChange={(event) => onCurrencyChange?.(event.target.value)}
            disabled={currencyDisable || isCurrencyLoading || currencyOptions.length === 0}
            aria-label={`${label} currency`}
          >
            {currencyOptions.length === 0 && <option value={selectCurrency}>{selectCurrency}</option>}
            {currencyOptions.map((currency) => (
              <option value={currency} key={currency}>{currency.toUpperCase()}</option>
            ))}
          </select>
          <svg className="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default InputBox
