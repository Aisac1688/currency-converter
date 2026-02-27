'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { ParsedQuery } from '@/lib/parse-query';
import { convert, type Rates } from '@/lib/exchange-rates';
import { formatCurrency } from '@/lib/format';
import { Link } from '@/i18n/navigation';
import { pairToSlug } from '@/lib/pairs';

interface Props {
  query: ParsedQuery;
  rates: Rates;
  stockPrices: Record<string, number>;
}

const DISPLAY_CURRENCIES = [
  { code: 'krw', flag: '🇰🇷', label: 'KRW' },
  { code: 'usd', flag: '🇺🇸', label: 'USD' },
  { code: 'jpy', flag: '🇯🇵', label: 'JPY' },
  { code: 'eur', flag: '🇪🇺', label: 'EUR' },
  { code: 'gbp', flag: '🇬🇧', label: 'GBP' },
];

/** 즉시 변환 결과 표시. fade-in 애니메이션. */
export default function InstantResult({ query, rates, stockPrices }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';

  const results = useMemo(() => {
    const { amount, from, to } = query;

    // 주식: USD 가격 기반 multi-currency 표시
    if (from.type === 'stock') {
      const priceUsd = stockPrices[from.code] ?? 0;
      if (!priceUsd) return [];
      const totalUsd = amount * priceUsd;
      return DISPLAY_CURRENCIES.map(dc => ({
        code: dc.code,
        flag: dc.flag,
        label: dc.label,
        value: dc.code === 'usd' ? totalUsd : convert(totalUsd, 'usd', dc.code, rates),
        isPrimary: false,
      }));
    }

    // 통화/크립토: 명시적 to가 있으면 그것을 primary로
    if (to) {
      const primaryValue = convert(amount, from.code, to.code, rates);
      const primaryResult = {
        code: to.code,
        flag: to.icon,
        label: to.code.toUpperCase(),
        value: primaryValue,
        isPrimary: true,
      };
      const secondaries = DISPLAY_CURRENCIES
        .filter(dc => dc.code !== from.code && dc.code !== to.code)
        .slice(0, 3)
        .map(dc => ({
          code: dc.code,
          flag: dc.flag,
          label: dc.label,
          value: convert(amount, from.code, dc.code, rates),
          isPrimary: false,
        }));
      return [primaryResult, ...secondaries];
    }

    // to 없음: 모든 주요 통화 표시
    return DISPLAY_CURRENCIES
      .filter(dc => dc.code !== from.code)
      .slice(0, 4)
      .map(dc => ({
        code: dc.code,
        flag: dc.flag,
        label: dc.label,
        value: convert(amount, from.code, dc.code, rates),
        isPrimary: false,
      }));
  }, [query, rates, stockPrices]);

  if (results.length === 0) return null;

  const { from, to } = query;
  const detailSlug = to && from.type !== 'stock' ? pairToSlug(from.code, to.code) : null;
  const stockSlug = from.type === 'stock' ? `/stock/${from.code}` : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-6 space-y-3 duration-200">
      {/* 주식 헤더 */}
      {from.type === 'stock' && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="text-lg">{from.icon}</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {isKo ? from.nameKo : from.name}
          </span>
          <span>({from.code.toUpperCase()})</span>
          <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
            ${formatCurrency(stockPrices[from.code] ?? 0)}
          </span>
        </div>
      )}

      {/* 결과 리스트 */}
      {results.map((r, i) => (
        <div
          key={r.code}
          className={`flex items-center gap-3 ${
            r.isPrimary || i === 0
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <span className="text-xl">{r.flag}</span>
          <span className={`font-mono ${
            r.isPrimary || i === 0 ? 'text-2xl font-bold sm:text-3xl' : 'text-lg font-medium'
          }`}>
            {formatCurrency(r.value)}
          </span>
          <span className={`${r.isPrimary || i === 0 ? 'text-base font-medium' : 'text-sm'}`}>
            {r.label}
          </span>
        </div>
      ))}

      {/* 상세 페이지 링크 */}
      {detailSlug && (
        <Link
          href={`/${detailSlug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {from.code.toUpperCase()} → {to?.code.toUpperCase()} {isKo ? '상세 보기' : 'See details'}
          <span>→</span>
        </Link>
      )}
      {stockSlug && (
        <Link
          href={stockSlug}
          className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {from.code.toUpperCase()} {isKo ? '상세 보기' : 'See details'}
          <span>→</span>
        </Link>
      )}
    </div>
  );
}
