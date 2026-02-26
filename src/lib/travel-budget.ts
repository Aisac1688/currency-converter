/** 국가별 1일 평균 여행비 데이터 (USD 기준). */

export interface CountryBudget {
  code: string;
  currencyCode: string;
  nameKo: string;
  nameEn: string;
  flag: string;
  /** [숙박, 식비, 교통, 관광] × [절약, 보통, 럭셔리] */
  daily: Record<'budget' | 'mid' | 'luxury', { accommodation: number; food: number; transport: number; activities: number }>;
}

const COUNTRIES: CountryBudget[] = [
  { code: 'JP', currencyCode: 'jpy', nameKo: '일본', nameEn: 'Japan', flag: '🇯🇵',
    daily: {
      budget: { accommodation: 30, food: 15, transport: 10, activities: 10 },
      mid: { accommodation: 80, food: 35, transport: 20, activities: 25 },
      luxury: { accommodation: 200, food: 80, transport: 50, activities: 60 },
    } },
  { code: 'TH', currencyCode: 'thb', nameKo: '태국', nameEn: 'Thailand', flag: '🇹🇭',
    daily: {
      budget: { accommodation: 15, food: 8, transport: 5, activities: 8 },
      mid: { accommodation: 50, food: 20, transport: 12, activities: 18 },
      luxury: { accommodation: 150, food: 50, transport: 30, activities: 40 },
    } },
  { code: 'VN', currencyCode: 'vnd', nameKo: '베트남', nameEn: 'Vietnam', flag: '🇻🇳',
    daily: {
      budget: { accommodation: 10, food: 5, transport: 3, activities: 5 },
      mid: { accommodation: 35, food: 15, transport: 8, activities: 12 },
      luxury: { accommodation: 120, food: 40, transport: 25, activities: 35 },
    } },
  { code: 'FR', currencyCode: 'eur', nameKo: '프랑스', nameEn: 'France', flag: '🇫🇷',
    daily: {
      budget: { accommodation: 40, food: 20, transport: 10, activities: 15 },
      mid: { accommodation: 120, food: 45, transport: 20, activities: 30 },
      luxury: { accommodation: 300, food: 100, transport: 50, activities: 60 },
    } },
  { code: 'US', currencyCode: 'usd', nameKo: '미국', nameEn: 'USA', flag: '🇺🇸',
    daily: {
      budget: { accommodation: 50, food: 25, transport: 15, activities: 15 },
      mid: { accommodation: 150, food: 50, transport: 30, activities: 35 },
      luxury: { accommodation: 350, food: 120, transport: 60, activities: 80 },
    } },
  { code: 'AU', currencyCode: 'aud', nameKo: '호주', nameEn: 'Australia', flag: '🇦🇺',
    daily: {
      budget: { accommodation: 35, food: 20, transport: 12, activities: 12 },
      mid: { accommodation: 100, food: 40, transport: 25, activities: 30 },
      luxury: { accommodation: 250, food: 90, transport: 50, activities: 60 },
    } },
  { code: 'TW', currencyCode: 'twd', nameKo: '대만', nameEn: 'Taiwan', flag: '🇹🇼',
    daily: {
      budget: { accommodation: 20, food: 10, transport: 5, activities: 8 },
      mid: { accommodation: 60, food: 25, transport: 12, activities: 18 },
      luxury: { accommodation: 150, food: 60, transport: 30, activities: 40 },
    } },
  { code: 'SG', currencyCode: 'sgd', nameKo: '싱가포르', nameEn: 'Singapore', flag: '🇸🇬',
    daily: {
      budget: { accommodation: 40, food: 15, transport: 8, activities: 12 },
      mid: { accommodation: 120, food: 35, transport: 18, activities: 25 },
      luxury: { accommodation: 300, food: 80, transport: 40, activities: 50 },
    } },
  { code: 'PH', currencyCode: 'php', nameKo: '필리핀', nameEn: 'Philippines', flag: '🇵🇭',
    daily: {
      budget: { accommodation: 12, food: 6, transport: 3, activities: 6 },
      mid: { accommodation: 40, food: 18, transport: 8, activities: 15 },
      luxury: { accommodation: 130, food: 45, transport: 25, activities: 35 },
    } },
  { code: 'GB', currencyCode: 'gbp', nameKo: '영국', nameEn: 'UK', flag: '🇬🇧',
    daily: {
      budget: { accommodation: 45, food: 20, transport: 12, activities: 15 },
      mid: { accommodation: 130, food: 45, transport: 25, activities: 30 },
      luxury: { accommodation: 300, food: 100, transport: 50, activities: 60 },
    } },
  { code: 'CA', currencyCode: 'cad', nameKo: '캐나다', nameEn: 'Canada', flag: '🇨🇦',
    daily: {
      budget: { accommodation: 40, food: 20, transport: 12, activities: 12 },
      mid: { accommodation: 120, food: 40, transport: 25, activities: 28 },
      luxury: { accommodation: 280, food: 90, transport: 50, activities: 55 },
    } },
  { code: 'HK', currencyCode: 'hkd', nameKo: '홍콩', nameEn: 'Hong Kong', flag: '🇭🇰',
    daily: {
      budget: { accommodation: 35, food: 12, transport: 6, activities: 10 },
      mid: { accommodation: 100, food: 30, transport: 15, activities: 22 },
      luxury: { accommodation: 250, food: 70, transport: 35, activities: 45 },
    } },
];

export type BudgetLevel = 'budget' | 'mid' | 'luxury';

export interface BudgetResult {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
}

/** 여행 예산 계산 (KRW 기준). */
export function calculateBudget(
  countryCode: string,
  days: number,
  travelers: number,
  level: BudgetLevel,
  usdToKrw: number,
): BudgetResult | null {
  const country = COUNTRIES.find(c => c.code === countryCode);
  if (!country) return null;

  const daily = country.daily[level];
  const mult = days * travelers * usdToKrw;

  return {
    accommodation: Math.round(daily.accommodation * mult),
    food: Math.round(daily.food * mult),
    transport: Math.round(daily.transport * mult),
    activities: Math.round(daily.activities * mult),
    total: Math.round((daily.accommodation + daily.food + daily.transport + daily.activities) * mult),
  };
}

/** 국가 목록 반환. */
export function getCountries(): CountryBudget[] {
  return COUNTRIES;
}
