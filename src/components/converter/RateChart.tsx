'use client';

import { useEffect, useState } from 'react';
import type { HistoryPoint } from '@/lib/history';

interface RateChartProps {
  from: string;
  to: string;
}

/** 환율 변동 차트 (7일/30일). Canvas 기반 간단 라인 차트. */
export default function RateChart({ from, to }: RateChartProps) {
  const [period, setPeriod] = useState<7 | 30>(7);
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const res = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`
        );
        const latest = await res.json();
        const currentRate = latest[from.toLowerCase()]?.[to.toLowerCase()];

        const points: HistoryPoint[] = [];
        const today = new Date();
        const dates: string[] = [];
        for (let i = period; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          dates.push(d.toISOString().split('T')[0]);
        }

        const results = await Promise.allSettled(
          dates.map(async (date) => {
            const r = await fetch(
              `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${from.toLowerCase()}.json`
            );
            if (!r.ok) return null;
            const d = await r.json();
            return d[from.toLowerCase()]?.[to.toLowerCase()] ?? null;
          })
        );

        dates.forEach((date, i) => {
          const r = results[i];
          const rate = r.status === 'fulfilled' && r.value ? r.value : 0;
          if (rate > 0) points.push({ date, rate });
        });

        if (points.length === 0 && currentRate) {
          points.push({ date: today.toISOString().split('T')[0], rate: currentRate });
        }

        if (!cancelled) setData(points);
      } catch {
        // 히스토리 로드 실패 시 빈 상태 유지
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [from, to, period]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }

  if (data.length < 2) return null;

  const rates = data.map((d) => d.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;
  const change = rates[rates.length - 1] - rates[0];
  const changePercent = (change / rates[0]) * 100;
  const isUp = change >= 0;

  const W = 100;
  const H = 40;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((d.rate - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {from.toUpperCase()}/{to.toUpperCase()}
          </span>
          <span className={`text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
            {isUp ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
        <div className="flex gap-1">
          {([7, 30] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {p}D
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={isUp ? '#16a34a' : '#dc2626'}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-zinc-400">
        <span>{data[0].date.slice(5)}</span>
        <span>{data[data.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}
