'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/format';

interface Props {
  stockSymbol: string;
  stockName: string;
  stockNameKo: string;
  priceUsd: number;
  rates: Record<string, number>;
}

const TARGET_CURRENCIES = [
  { code: 'krw', name: 'KRW', nameKo: '원', flag: '🇰🇷' },
  { code: 'usd', name: 'USD', nameKo: '달러', flag: '🇺🇸' },
  { code: 'jpy', name: 'JPY', nameKo: '엔', flag: '🇯🇵' },
  { code: 'eur', name: 'EUR', nameKo: '유로', flag: '🇪🇺' },
];

/** 주식 → 통화 변환 계산기. */
export default function StockConverter({ stockSymbol, stockName, stockNameKo, priceUsd, rates }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [shares, setShares] = useState(1);

  const totalUsd = shares * priceUsd;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {isKo ? `${stockNameKo} 가치 계산` : `${stockName} Value Calculator`}
      </h2>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-zinc-500 dark:text-zinc-400">
          {isKo ? '수량' : 'Shares'}
        </label>
        <input
          type="number"
          min={1}
          max={100000}
          value={shares}
          onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
          className="h-10 w-28 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-center font-mono
            focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{stockSymbol}</span>
      </div>

      <div className="space-y-2">
        {TARGET_CURRENCIES.map(cur => {
          const rate = rates[cur.code] ?? 1;
          const value = (totalUsd / (rates['usd'] ?? 1)) * rate;
          return (
            <div key={cur.code} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
              <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span>{cur.flag}</span>
                <span>{cur.code.toUpperCase()}</span>
              </span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(value)} {cur.code.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        {isKo
          ? `기준가: 1 ${stockSymbol} = $${formatCurrency(priceUsd)} USD`
          : `Base: 1 ${stockSymbol} = $${formatCurrency(priceUsd)} USD`}
      </p>
    </div>
  );
}
