'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { calculateComparison, type ComparisonResult } from '@/lib/bank-fees';

const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

const CURRENCY_OPTIONS = [
  { code: 'usd', ko: '미국 달러', en: 'US Dollar' },
  { code: 'jpy', ko: '일본 엔', en: 'Japanese Yen' },
  { code: 'eur', ko: '유로', en: 'Euro' },
  { code: 'gbp', ko: '영국 파운드', en: 'British Pound' },
  { code: 'cny', ko: '중국 위안', en: 'Chinese Yuan' },
  { code: 'thb', ko: '태국 바트', en: 'Thai Baht' },
  { code: 'vnd', ko: '베트남 동', en: 'Vietnamese Dong' },
  { code: 'aud', ko: '호주 달러', en: 'Australian Dollar' },
];

/** 환전 수수료 비교 테이블. */
export default function FeeComparisonTable() {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [amount, setAmount] = useState('100000');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [midRate, setMidRate] = useState(0);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/krw.json`);
        const data = await res.json();
        const rate = data.krw?.[targetCurrency];
        if (rate) {
          setMidRate(1 / rate);
        }
      } catch {
        // 실패 시 기본값 유지
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, [targetCurrency]);

  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    if (midRate > 0 && amountNum > 0) {
      setResults(calculateComparison(amountNum, midRate));
    }
  }, [amount, midRate]);

  const best = results[0]?.netAmount ?? 0;

  return (
    <div>
      {/* 입력 */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isKo ? '환전 금액 (원)' : 'Amount (KRW)'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isKo ? '환전 통화' : 'Target Currency'}
          </label>
          <select
            value={targetCurrency}
            onChange={e => setTargetCurrency(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {CURRENCY_OPTIONS.map(c => (
              <option key={c.code} value={c.code}>
                {c.code.toUpperCase()} — {isKo ? c.ko : c.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-3 text-left font-medium text-zinc-500">{isKo ? '은행/서비스' : 'Provider'}</th>
                <th className="py-3 text-right font-medium text-zinc-500">{isKo ? '스프레드' : 'Spread'}</th>
                <th className="py-3 text-right font-medium text-zinc-500">{isKo ? '수수료' : 'Fee'}</th>
                <th className="py-3 text-right font-medium text-zinc-500">{isKo ? '실수령액' : 'You Get'}</th>
                <th className="py-3 text-right font-medium text-zinc-500">{isKo ? '차이' : 'Diff'}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const diff = r.netAmount - best;
                const isBest = i === 0;
                return (
                  <tr
                    key={r.provider.id}
                    className={`border-b border-zinc-100 dark:border-zinc-800 ${isBest ? 'bg-green-50 dark:bg-green-950/30' : ''}`}
                  >
                    <td className="py-3">
                      <span className={`font-medium ${isBest ? 'text-green-700 dark:text-green-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {isKo ? r.provider.nameKo : r.provider.nameEn}
                      </span>
                      <span className="ml-2 text-xs text-zinc-400">
                        {r.provider.type === 'fintech' ? '💳' : '🏦'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {r.provider.spreadPercent}%
                    </td>
                    <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                      ₩{Math.round(r.feeAmount).toLocaleString()}
                    </td>
                    <td className={`py-3 text-right font-mono font-medium ${isBest ? 'text-green-700 dark:text-green-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {r.netAmount.toFixed(2)} {targetCurrency.toUpperCase()}
                    </td>
                    <td className="py-3 text-right text-xs text-zinc-400">
                      {isBest ? (isKo ? '최저' : 'Best') : `${diff.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-400">
        {isKo
          ? '※ 수수료는 일반 창구 기준 추정치이며, 실제 환율 우대 및 프로모션에 따라 다를 수 있습니다.'
          : '※ Fees are estimates based on standard rates. Actual rates may vary with promotions.'}
      </p>
    </div>
  );
}
