'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import SmartInput from './SmartInput';
import InstantResult from './InstantResult';
import { parseQuery } from '@/lib/parse-query';
import type { Rates } from '@/lib/exchange-rates';
import { Link } from '@/i18n/navigation';

interface Props {
  rates: Rates;
  stockPrices: Record<string, number>;
}

const CHIPS_KO = [
  { label: 'USD → KRW', query: '1 usd' },
  { label: 'BTC → KRW', query: '1 btc' },
  { label: 'JPY → KRW', query: '1000 jpy' },
  { label: 'EUR → KRW', query: '1 eur' },
  { label: 'AAPL', query: 'aapl' },
  { label: 'TSLA', query: 'tsla' },
];

const CHIPS_EN = [
  { label: 'USD → KRW', query: '1 usd' },
  { label: 'BTC → USD', query: '1 btc' },
  { label: 'EUR → USD', query: '1 eur' },
  { label: 'JPY → USD', query: '1000 jpy' },
  { label: 'AAPL', query: 'aapl' },
  { label: 'TSLA', query: 'tsla' },
];

/** Google 스타일 홈페이지 히어로. 단일 입력 + 즉시 결과. */
export default function SearchHero({ rates, stockPrices }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');

  const parsed = useMemo(() => parseQuery(input, locale), [input, locale]);
  const hasResult = !!parsed;

  const chips = isKo ? CHIPS_KO : CHIPS_EN;
  const placeholder = isKo ? '100 달러, 1 btc, aapl...' : '100 usd, 1 btc, aapl...';

  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* 상단 여백 — 결과 있으면 축소 */}
      <div className={`transition-all duration-300 ${hasResult ? 'pt-12' : 'pt-[20vh] sm:pt-[25vh]'}`} />

      {/* 브랜딩 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          <span className="mr-2">💱</span>
          {isKo ? '환율' : 'Exchange Rate'}
        </h1>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          {isKo ? '통화 · 암호화폐 · 주식' : 'Currency · Crypto · Stocks'}
        </p>
      </div>

      {/* 입력 필드 */}
      <SmartInput value={input} onChange={setInput} placeholder={placeholder} />

      {/* 즉시 결과 */}
      {parsed && (
        <InstantResult query={parsed} rates={rates} stockPrices={stockPrices} />
      )}

      {/* 인기 검색 칩 */}
      <div className={`transition-all duration-300 ${hasResult ? 'mt-8' : 'mt-12'}`}>
        <p className="mb-2 text-xs text-zinc-400 dark:text-zinc-500">
          {isKo ? '인기 검색' : 'Popular'}
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map(chip => (
            <button
              key={chip.query}
              type="button"
              onClick={() => setInput(chip.query)}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600
                transition-colors hover:border-zinc-300 hover:bg-zinc-50
                dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 하단 링크 */}
      <div className="mt-8 flex justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
        <Link href="/rates" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          {isKo ? '환율표' : 'Rates'}
        </Link>
        <Link href="/compare" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          {isKo ? '수수료 비교' : 'Compare'}
        </Link>
        <Link href="/travel-budget" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          {isKo ? '여행 예산' : 'Travel Budget'}
        </Link>
        <Link href="/blog" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          {isKo ? '블로그' : 'Blog'}
        </Link>
      </div>
    </div>
  );
}
