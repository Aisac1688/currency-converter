'use client';

import { useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/format';

interface ResultRow {
  code: string;
  flag: string;
  value: number;
}

interface Props {
  results: ResultRow[];
  sourceAmount: number;
  sourceCode: string;
}

/** 변환 결과 카드 목록. */
export default function ConversionResult({ results, sourceAmount, sourceCode }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';

  if (results.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {sourceAmount.toLocaleString()} {sourceCode.toUpperCase()} =
      </p>
      {results.map(r => (
        <div key={r.code} className="flex items-center justify-between rounded-xl bg-zinc-50 px-5 py-3.5 dark:bg-zinc-800/50">
          <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="text-lg">{r.flag}</span>
            <span className="font-mono">{r.code.toUpperCase()}</span>
          </span>
          <span className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(r.value)}
          </span>
        </div>
      ))}
      <p className="text-xs text-zinc-400">
        {isKo ? '실시간 환율 기준 추정치입니다.' : 'Estimates based on current exchange rates.'}
      </p>
    </div>
  );
}
