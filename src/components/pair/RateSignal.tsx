'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface RateSignalProps {
  from: string;
  to: string;
}

interface SignalData {
  signal: 'good' | 'neutral' | 'bad';
  diffPercent: number;
  avg30: number;
  current: number;
}

const API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

/** 30일 평균 대비 현재 환율 신호등. */
export default function RateSignal({ from, to }: RateSignalProps) {
  const [data, setData] = useState<SignalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const fromL = from.toLowerCase();
        const toL = to.toLowerCase();

        // 최근 30일 날짜 생성
        const today = new Date();
        const dates: string[] = [];
        for (let i = 30; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          dates.push(d.toISOString().split('T')[0]);
        }

        const results = await Promise.allSettled(
          dates.map(async (date) => {
            const res = await fetch(`${API_BASE}@${date}/v1/currencies/${fromL}.json`);
            if (!res.ok) return null;
            const d = await res.json();
            return d[fromL]?.[toL] ?? null;
          })
        );

        const rates = results
          .map(r => r.status === 'fulfilled' ? r.value : null)
          .filter((v): v is number => typeof v === 'number' && v > 0);

        if (rates.length < 2 || cancelled) return;

        const current = rates[rates.length - 1];
        const avg30 = rates.reduce((s, r) => s + r, 0) / rates.length;
        const diffPercent = ((current - avg30) / avg30) * 100;

        // to 기준: 현재 환율이 높으면(더 많이 받음) 유리
        let signal: 'good' | 'neutral' | 'bad';
        if (diffPercent >= 2) signal = 'good';
        else if (diffPercent <= -2) signal = 'bad';
        else signal = 'neutral';

        if (!cancelled) setData({ signal, diffPercent, avg30, current });
      } catch {
        // 실패 시 표시하지 않음
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [from, to]);

  if (loading) {
    return (
      <span className="inline-block h-6 w-32 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
    );
  }

  const locale = useLocale();
  if (!data) return null;

  const { signal, diffPercent } = data;
  const emoji = signal === 'good' ? '🟢' : signal === 'neutral' ? '🟡' : '🔴';
  const abs = Math.abs(diffPercent).toFixed(1);
  const isKo = locale === 'ko';

  const labels = {
    good: isKo ? `30일 평균 대비 ${abs}% 높음 — 환전 유리` : `${abs}% above 30-day avg — Good time`,
    neutral: isKo ? '30일 평균과 비슷한 수준' : 'Near 30-day average',
    bad: isKo ? `30일 평균 대비 ${abs}% 낮음 — 환전 불리` : `${abs}% below 30-day avg — Not ideal`,
  };

  const bgMap = {
    good: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400',
    neutral: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
    bad: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bgMap[signal]}`}>
      <span>{emoji}</span>
      <span>{labels[signal]}</span>
    </span>
  );
}
