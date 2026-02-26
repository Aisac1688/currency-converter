/** 한국 은행/핀테크 환전 수수료 데이터. */

export interface FeeProvider {
  id: string;
  nameKo: string;
  nameEn: string;
  type: 'bank' | 'fintech';
  spreadPercent: number;
  minFeeKrw: number;
}

const PROVIDERS: FeeProvider[] = [
  { id: 'hana', nameKo: '하나은행', nameEn: 'Hana Bank', type: 'bank', spreadPercent: 1.75, minFeeKrw: 0 },
  { id: 'woori', nameKo: '우리은행', nameEn: 'Woori Bank', type: 'bank', spreadPercent: 1.75, minFeeKrw: 0 },
  { id: 'kb', nameKo: 'KB국민은행', nameEn: 'KB Kookmin', type: 'bank', spreadPercent: 1.75, minFeeKrw: 0 },
  { id: 'shinhan', nameKo: '신한은행', nameEn: 'Shinhan Bank', type: 'bank', spreadPercent: 1.50, minFeeKrw: 0 },
  { id: 'ibk', nameKo: 'IBK기업은행', nameEn: 'IBK Bank', type: 'bank', spreadPercent: 1.50, minFeeKrw: 0 },
  { id: 'kakao', nameKo: '카카오뱅크', nameEn: 'Kakao Bank', type: 'fintech', spreadPercent: 0.20, minFeeKrw: 0 },
  { id: 'toss', nameKo: '토스', nameEn: 'Toss', type: 'fintech', spreadPercent: 0.40, minFeeKrw: 0 },
  { id: 'wise', nameKo: '와이즈(Wise)', nameEn: 'Wise', type: 'fintech', spreadPercent: 0.60, minFeeKrw: 1000 },
];

export interface ComparisonResult {
  provider: FeeProvider;
  appliedRate: number;
  feeAmount: number;
  netAmount: number;
}

/** 금액/환율 기준으로 각 제공자별 실수령액 계산. */
export function calculateComparison(
  amountKrw: number,
  midRate: number,
): ComparisonResult[] {
  return PROVIDERS.map(p => {
    const feeAmount = Math.max(amountKrw * (p.spreadPercent / 100), p.minFeeKrw);
    const effectiveKrw = amountKrw - feeAmount;
    const appliedRate = midRate * (1 + p.spreadPercent / 100);
    const netAmount = effectiveKrw / appliedRate;

    return { provider: p, appliedRate, feeAmount, netAmount };
  }).sort((a, b) => b.netAmount - a.netAmount);
}

/** 전체 제공자 목록. */
export function getAllProviders(): FeeProvider[] {
  return PROVIDERS;
}
