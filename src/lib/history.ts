const API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

export interface HistoryPoint {
  date: string;
  rate: number;
}

/** 특정 통화쌍의 과거 환율 데이터를 fetch. */
export async function fetchHistory(
  from: string,
  to: string,
  days: number
): Promise<HistoryPoint[]> {
  const points: HistoryPoint[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    points.push({ date: dateStr, rate: 0 });
  }

  const results = await Promise.allSettled(
    points.map(async (p) => {
      const res = await fetch(
        `${API_BASE}@${p.date}/v1/currencies/${from.toLowerCase()}.json`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const rates = data[from.toLowerCase()];
      return rates?.[to.toLowerCase()] ?? null;
    })
  );

  return points
    .map((p, i) => {
      const r = results[i];
      const rate = r.status === 'fulfilled' && r.value ? r.value : 0;
      return { ...p, rate };
    })
    .filter((p) => p.rate > 0);
}
