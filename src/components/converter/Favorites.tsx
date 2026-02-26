'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { getCurrency } from '@/lib/currencies';
import { convert, type Rates } from '@/lib/exchange-rates';

interface FavoritesProps {
  rates: Rates;
}

const STORAGE_KEY = 'favorite-pairs';

const DEFAULT_PAIRS: [string, string][] = [
  ['usd', 'krw'],
  ['eur', 'krw'],
  ['jpy', 'krw'],
];

/** 즐겨찾기 통화쌍 위젯. localStorage 기반. */
export default function Favorites({ rates }: FavoritesProps) {
  const [pairs, setPairs] = useState<[string, string][]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPairs(JSON.parse(stored));
      } else {
        setPairs(DEFAULT_PAIRS);
      }
    } catch {
      setPairs(DEFAULT_PAIRS);
    }
  }, []);

  function removePair(index: number) {
    const next = pairs.filter((_, i) => i !== index);
    setPairs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  if (pairs.length === 0) return null;

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {pairs.map(([from, to], i) => {
        const rate = convert(1, from, to, rates);
        const fromC = getCurrency(from);
        const toC = getCurrency(to);
        return (
          <div
            key={`${from}-${to}-${i}`}
            className="group flex items-center justify-between rounded-lg border border-zinc-200
              bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="flex items-center gap-2 text-sm">
              <span>{fromC?.flag}</span>
              <span className="text-zinc-600 dark:text-zinc-400">{from.toUpperCase()}</span>
              <span className="text-zinc-400">→</span>
              <span>{toC?.flag}</span>
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(rate)}
              </span>
            </div>
            <button
              onClick={() => removePair(i)}
              className="ml-2 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500
                dark:text-zinc-600 dark:hover:text-red-400"
              aria-label="Remove"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** 즐겨찾기에 통화쌍 추가 (외부에서 호출 가능). */
export function addFavoritePair(from: string, to: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const pairs: [string, string][] = stored ? JSON.parse(stored) : DEFAULT_PAIRS;
    const exists = pairs.some(([f, t]) => f === from && t === to);
    if (!exists) {
      pairs.push([from, to]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    }
  } catch {
    // localStorage unavailable
  }
}
