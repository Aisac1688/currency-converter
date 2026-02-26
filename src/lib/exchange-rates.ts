const API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
const FALLBACK_BASE = 'https://latest.currency-api.pages.dev/v1/currencies';

export type Rates = Record<string, number>;

/** USD 기준 환율 데이터를 fetch. 빌드 타임 전용. */
export async function fetchRates(): Promise<Rates> {
  try {
    const res = await fetch(`${API_BASE}/usd.json`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return data.usd as Rates;
  } catch {
    const res = await fetch(`${FALLBACK_BASE}/usd.json`);
    const data = await res.json();
    return data.usd as Rates;
  }
}

/** 두 통화 간 환율 계산. */
export function convert(
  amount: number,
  from: string,
  to: string,
  rates: Rates
): number {
  const fromRate = rates[from.toLowerCase()];
  const toRate = rates[to.toLowerCase()];
  if (!fromRate || !toRate) return 0;
  return (amount / fromRate) * toRate;
}

/** 1 단위 기준 환율 조회. */
export function getRate(from: string, to: string, rates: Rates): number {
  return convert(1, from, to, rates);
}
