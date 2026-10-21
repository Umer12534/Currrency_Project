import { useEffect, useState } from 'react'

function useCurrencyInfo(currency) {
  const [state, setState] = useState({
    currency: null,
    data: {},
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadCurrencyInfo() {
      try {
        const response = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Exchange rates could not be loaded (${response.status}).`)
        }

        const result = await response.json()
        const rates = result[currency]

        if (!rates || typeof rates !== 'object') {
          throw new Error('The exchange rate response was invalid.')
        }

        setState({ currency, data: rates, isLoading: false, error: null })
      } catch (error) {
        if (controller.signal.aborted) return

        setState({
          currency,
          data: {},
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unable to load exchange rates.',
        })
      }
    }

    loadCurrencyInfo()
    return () => controller.abort()
  }, [currency])

  const isCurrentCurrency = state.currency === currency

  return {
    data: isCurrentCurrency ? state.data : {},
    isLoading: !isCurrentCurrency || state.isLoading,
    error: isCurrentCurrency ? state.error : null,
  }
}

export default useCurrencyInfo
