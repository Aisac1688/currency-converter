'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { getAlerts, removeAlert } from '@/lib/rate-alerts';

const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

/** 페이지 로드 시 저장된 알림을 체크하고 조건 충족 시 브라우저 알림 발생. */
export default function AlertChecker() {
  const locale = useLocale();
  const isKo = locale === 'ko';

  useEffect(() => {
    const alerts = getAlerts();
    if (alerts.length === 0) return;

    // 유니크한 from 통화 목록
    const fromCurrencies = [...new Set(alerts.map(a => a.from.toLowerCase()))];

    async function check() {
      const rateMap: Record<string, Record<string, number>> = {};

      await Promise.allSettled(
        fromCurrencies.map(async (cur) => {
          const res = await fetch(`${API_URL}/${cur}.json`);
          if (!res.ok) return;
          const data = await res.json();
          rateMap[cur] = data[cur] ?? {};
        })
      );

      for (const alert of alerts) {
        const rate = rateMap[alert.from.toLowerCase()]?.[alert.to.toLowerCase()];
        if (!rate) continue;

        const triggered =
          (alert.direction === 'above' && rate >= alert.targetRate) ||
          (alert.direction === 'below' && rate <= alert.targetRate);

        if (!triggered) continue;

        const msg = isKo
          ? `${alert.from.toUpperCase()}/${alert.to.toUpperCase()} 환율이 ${alert.targetRate}${alert.direction === 'above' ? ' 이상' : ' 이하'}입니다! (현재: ${rate.toFixed(4)})`
          : `${alert.from.toUpperCase()}/${alert.to.toUpperCase()} rate is ${alert.direction} ${alert.targetRate}! (Current: ${rate.toFixed(4)})`;

        // 브라우저 알림
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(isKo ? '환율 알림' : 'Rate Alert', { body: msg });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            new Notification(isKo ? '환율 알림' : 'Rate Alert', { body: msg });
          }
        }

        // 트리거된 알림 제거
        removeAlert(alert.id);
      }
    }

    check();
  }, [isKo]);

  return null;
}
