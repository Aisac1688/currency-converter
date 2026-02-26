'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { addAlert, getAlerts, removeAlert, type RateAlert } from '@/lib/rate-alerts';

interface Props {
  from: string;
  to: string;
  currentRate: number;
}

/** 통화쌍 페이지에 표시되는 환율 알림 설정 버튼. */
export default function RateAlertButton({ from, to, currentRate }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [open, setOpen] = useState(false);
  const [targetRate, setTargetRate] = useState(currentRate.toFixed(4));
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [alerts, setAlerts] = useState<RateAlert[]>(() =>
    getAlerts().filter(a => a.from === from && a.to === to)
  );

  function handleAdd() {
    const rate = parseFloat(targetRate);
    if (isNaN(rate) || rate <= 0) return;
    const newAlert = addAlert({ from, to, targetRate: rate, direction });
    setAlerts(prev => [...prev, newAlert]);
    setOpen(false);
  }

  function handleRemove(id: string) {
    removeAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        🔔 {isKo ? '알림 설정' : 'Set Alert'}
        {alerts.length > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {isKo ? '목표 환율 알림' : 'Rate Alert'} ({from.toUpperCase()}/{to.toUpperCase()})
          </p>

          <div className="mb-3 space-y-2">
            <input
              type="number"
              step="any"
              value={targetRate}
              onChange={e => setTargetRate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder={isKo ? '목표 환율' : 'Target rate'}
            />
            <div className="flex gap-2">
              {(['above', 'below'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    direction === d
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {d === 'above' ? (isKo ? '이상일 때' : 'Above') : (isKo ? '이하일 때' : 'Below')}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {isKo ? '알림 추가' : 'Add Alert'}
          </button>

          {alerts.length > 0 && (
            <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-700">
              <p className="mb-2 text-xs font-medium text-zinc-500">
                {isKo ? '활성 알림' : 'Active Alerts'}
              </p>
              {alerts.map(a => (
                <div key={a.id} className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {a.direction === 'above' ? '≥' : '≤'} {a.targetRate}
                  </span>
                  <button
                    onClick={() => handleRemove(a.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
