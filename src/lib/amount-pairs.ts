/** 금액별 롱테일 SEO 페이지 생성 설정. */

export interface AmountPairConfig {
  from: string;
  to: string;
  amounts: number[];
}

const HIGH = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
const MID = [10, 50, 100, 500, 1000, 5000, 10000];
const LOW = [100, 1000, 5000, 10000, 50000, 100000, 1000000];
const GLOBAL = [1, 10, 50, 100, 500, 1000];

export const AMOUNT_PAIRS: AmountPairConfig[] = [
  // Tier 1: 고가치 통화 → KRW
  { from: 'usd', to: 'krw', amounts: HIGH },
  { from: 'eur', to: 'krw', amounts: HIGH },
  { from: 'gbp', to: 'krw', amounts: HIGH },
  { from: 'aud', to: 'krw', amounts: HIGH },
  { from: 'cad', to: 'krw', amounts: HIGH },
  { from: 'chf', to: 'krw', amounts: HIGH },
  { from: 'sgd', to: 'krw', amounts: HIGH },
  { from: 'nzd', to: 'krw', amounts: HIGH },
  // 고가치 글로벌
  { from: 'usd', to: 'jpy', amounts: HIGH },
  { from: 'eur', to: 'usd', amounts: HIGH },
  { from: 'gbp', to: 'usd', amounts: HIGH },

  // Tier 2: 중가치 통화 → KRW
  { from: 'cny', to: 'krw', amounts: MID },
  { from: 'hkd', to: 'krw', amounts: MID },
  { from: 'twd', to: 'krw', amounts: MID },
  { from: 'myr', to: 'krw', amounts: MID },
  { from: 'thb', to: 'krw', amounts: MID },
  { from: 'php', to: 'krw', amounts: MID },

  // Tier 3: 저가치 통화
  { from: 'jpy', to: 'krw', amounts: LOW },
  { from: 'krw', to: 'usd', amounts: LOW },
  { from: 'krw', to: 'jpy', amounts: LOW },
  { from: 'krw', to: 'eur', amounts: LOW },
  { from: 'vnd', to: 'krw', amounts: LOW },
  { from: 'idr', to: 'krw', amounts: LOW },

  // Tier 4: 글로벌 크로스
  { from: 'eur', to: 'gbp', amounts: GLOBAL },
  { from: 'gbp', to: 'eur', amounts: GLOBAL },
  { from: 'usd', to: 'cad', amounts: GLOBAL },
  { from: 'usd', to: 'inr', amounts: GLOBAL },
  { from: 'usd', to: 'mxn', amounts: GLOBAL },
  { from: 'usd', to: 'brl', amounts: GLOBAL },
  { from: 'usd', to: 'php', amounts: GLOBAL },
];

/** 모든 금액 페이지 슬러그 생성 (generateStaticParams용). */
export function getAllAmountSlugs(): { from: string; to: string; amount: number }[] {
  const slugs: { from: string; to: string; amount: number }[] = [];
  for (const config of AMOUNT_PAIRS) {
    for (const amount of config.amounts) {
      slugs.push({ from: config.from, to: config.to, amount });
    }
  }
  return slugs;
}

/** 해당 쌍의 관련 금액 목록 반환. */
export function getRelatedAmounts(from: string, to: string, currentAmount: number): number[] {
  const config = AMOUNT_PAIRS.find(p => p.from === from && p.to === to);
  if (!config) return [];
  return config.amounts.filter(a => a !== currentAmount);
}

/** 해당 쌍에 금액 페이지가 존재하는지 확인. */
export function isValidAmountPage(from: string, to: string, amount: number): boolean {
  const config = AMOUNT_PAIRS.find(p => p.from === from && p.to === to);
  return config ? config.amounts.includes(amount) : false;
}

/** 해당 쌍의 모든 금액 목록 (쌍 페이지에서 링크용). */
export function getAmountsForPair(from: string, to: string): number[] {
  const config = AMOUNT_PAIRS.find(p => p.from === from && p.to === to);
  return config?.amounts ?? [];
}
