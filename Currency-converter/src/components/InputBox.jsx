import React, { useId } from 'react'

const InputBox = ({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectCurrency = "usd",
    currencyDisable = false,
    amountDisable = false,
    }) => {

        const amountInputId = useId()

    return (
        <div className='flex bg-white p-3 rounded-b-lg text-sm'>
            <div className="w-1/2">
                <label htmlFor={amountInputId} className='text-black mb-2 inline-block'>
                    {label}
                </label>
                <input 
                    type="number" 
                    className='outline-none w-full bg-transparent py-1.5'
                    disabled = {amountDisable}
                    value={amount}
                    onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
                />
            </div>
            <div className="w-1/2 flex  flex-wrap justify-end text-right">
                <p className='mb-2 text-black'>
                    Currency Type
                </p>
                <select 
                    className='rounded-lg p-1 bg-gray-100 cursor-pointer outline-none'
                    value={selectCurrency}
                    onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                    disabled = {currencyDisable}
                >
                    {currencyOptions.map((c) => (
                        <option value={c} className='' key={c}>{c}</option>
                    ))}

                </select>
            </div>
            
        </div>
    )
}

export default InputBox
