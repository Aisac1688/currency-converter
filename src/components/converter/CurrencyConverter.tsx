'use client';

import { useState, useMemo } from 'react';
import AmountInput from './AmountInput';
import CurrencySelect from './CurrencySelect';
import { convert, type Rates } from '@/lib/exchange-rates';
import { formatCurrency } from '@/lib/format';
import { getCurrency } from '@/lib/currencies';

interface CurrencyConverterProps {
  rates: Rates;
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: string;
}

/** 메인 환율 계산기 위젯. */
export default function CurrencyConverter({
  rates,
  defaultFrom = 'usd',
  defaultTo = 'krw',
  defaultAmount = '1',
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const result = useMemo(() => {
    const num = parseFloat(amount) || 0;
    return convert(num, from, to, rates);
  }, [amount, from, to, rates]);

  const rate = useMemo(() => convert(1, from, to, rates), [from, to, rates]);

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  const fromCurrency = getCurrency(from);
  const toCurrency = getCurrency(to);

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* From */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <CurrencySelect value={from} onChange={setFrom} label="From" />
          </div>
          <AmountInput value={amount} onChange={setAmount} label="Amount" />
        </div>

        {/* Swap */}
        <div className="flex items-center justify-center sm:mt-8">
          <button
            type="button"
            onClick={handleSwap}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200
              bg-zinc-50 transition-all hover:bg-zinc-100 hover:shadow-sm
              dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            aria-label="Swap currencies"
          >
            <svg className="h-4 w-4 text-zinc-600 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <CurrencySelect value={to} onChange={setTo} label="To" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Result
            </label>
            <div className="flex h-12 items-center rounded-xl border border-zinc-200 bg-zinc-50 px-4
              dark:border-zinc-700 dark:bg-zinc-800">
              <span className="text-xl font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(result)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rate info */}
      <div className="mt-4 flex items-center justify-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{fromCurrency?.flag} 1 {from.toUpperCase()}</span>
        <span>=</span>
        <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
          {formatCurrency(rate)}
        </span>
        <span>{toCurrency?.flag} {to.toUpperCase()}</span>
      </div>
    </div>
  );
}
