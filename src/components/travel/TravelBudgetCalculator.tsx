'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { calculateBudget, getCountries, type BudgetLevel, type BudgetResult } from '@/lib/travel-budget';

const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

const LEVELS: { key: BudgetLevel; ko: string; en: string }[] = [
  { key: 'budget', ko: '절약', en: 'Budget' },
  { key: 'mid', ko: '보통', en: 'Mid-range' },
  { key: 'luxury', ko: '럭셔리', en: 'Luxury' },
];

/** 여행 예산 계산기 UI. */
export default function TravelBudgetCalculator() {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const countries = getCountries();

  const [country, setCountry] = useState('JP');
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(1);
  const [level, setLevel] = useState<BudgetLevel>('mid');
  const [usdToKrw, setUsdToKrw] = useState(0);
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setUsdToKrw(data.usd?.krw ?? 1350);
      } catch {
        setUsdToKrw(1350);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  useEffect(() => {
    if (usdToKrw > 0) {
      setResult(calculateBudget(country, days, travelers, level, usdToKrw));
    }
  }, [country, days, travelers, level, usdToKrw]);

  const items = [
    { key: 'accommodation', emoji: '🏨', ko: '숙박', en: 'Accommodation' },
    { key: 'food', emoji: '🍽️', ko: '식비', en: 'Food' },
    { key: 'transport', emoji: '🚕', ko: '교통', en: 'Transport' },
    { key: 'activities', emoji: '🎟️', ko: '관광/활동', en: 'Activities' },
  ] as const;

  return (
    <div>
      {/* 입력 폼 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isKo ? '여행 국가' : 'Destination'}
          </label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {isKo ? c.nameKo : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isKo ? `여행 일수: ${days}일` : `Duration: ${days} days`}
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isKo ? `인원: ${travelers}명` : `Travelers: ${travelers}`}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={travelers}
            onChange={e => setTravelers(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isKo ? '여행 스타일' : 'Travel Style'}
          </label>
          <div className="flex gap-2">
            {LEVELS.map(l => (
              <button
                key={l.key}
                onClick={() => setLevel(l.key)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  level === l.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {isKo ? l.ko : l.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
        </div>
      ) : result ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 space-y-3">
            {items.map(item => {
              const value = result[item.key];
              const ratio = result.total > 0 ? (value / result.total) * 100 : 0;
              return (
                <div key={item.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {item.emoji} {isKo ? item.ko : item.en}
                    </span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                      ₩{value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {isKo ? '총 예상 비용' : 'Total Estimated Cost'}
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ₩{result.total.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {isKo
                ? `현재 환율 기준 (1 USD = ₩${Math.round(usdToKrw).toLocaleString()})`
                : `Based on current rate (1 USD = ₩${Math.round(usdToKrw).toLocaleString()})`}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
