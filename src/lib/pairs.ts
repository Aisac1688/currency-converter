/** 인기 통화쌍 정의. SEO 페이지 생성용. */
export const POPULAR_PAIRS: [string, string][] = [
  // KRW 관련 (한국 사용자 주요 검색)
  ['usd', 'krw'], ['krw', 'usd'],
  ['jpy', 'krw'], ['krw', 'jpy'],
  ['eur', 'krw'], ['krw', 'eur'],
  ['cny', 'krw'], ['krw', 'cny'],
  ['gbp', 'krw'], ['krw', 'gbp'],
  ['thb', 'krw'], ['krw', 'thb'],
  ['vnd', 'krw'], ['krw', 'vnd'],
  ['php', 'krw'], ['krw', 'php'],
  ['twd', 'krw'], ['krw', 'twd'],
  ['sgd', 'krw'], ['krw', 'sgd'],
  ['aud', 'krw'], ['krw', 'aud'],
  ['cad', 'krw'], ['krw', 'cad'],
  ['hkd', 'krw'], ['krw', 'hkd'],
  ['idr', 'krw'], ['krw', 'idr'],
  ['myr', 'krw'], ['krw', 'myr'],
  ['chf', 'krw'], ['krw', 'chf'],
  ['nzd', 'krw'], ['krw', 'nzd'],
  ['inr', 'krw'], ['krw', 'inr'],
  ['aed', 'krw'], ['krw', 'aed'],
  ['try', 'krw'], ['krw', 'try'],

  // USD 글로벌 쌍
  ['eur', 'usd'], ['usd', 'eur'],
  ['gbp', 'usd'], ['usd', 'gbp'],
  ['usd', 'jpy'], ['jpy', 'usd'],
  ['usd', 'cny'], ['cny', 'usd'],
  ['usd', 'cad'], ['cad', 'usd'],
  ['usd', 'aud'], ['aud', 'usd'],
  ['usd', 'chf'], ['chf', 'usd'],
  ['usd', 'hkd'], ['usd', 'sgd'],
  ['usd', 'inr'], ['usd', 'thb'],
  ['usd', 'vnd'], ['usd', 'php'],
  ['usd', 'idr'], ['usd', 'myr'],
  ['usd', 'twd'], ['usd', 'mxn'],
  ['usd', 'brl'], ['usd', 'try'],
  ['usd', 'zar'], ['usd', 'rub'],
  ['usd', 'aed'], ['usd', 'sar'],
  ['usd', 'nzd'], ['usd', 'sek'],
  ['usd', 'nok'], ['usd', 'dkk'],
  ['usd', 'pln'], ['usd', 'czk'],
  ['usd', 'huf'], ['usd', 'egp'],
  ['usd', 'ngn'], ['usd', 'pkr'],
  ['usd', 'bdt'], ['usd', 'lkr'],
  ['usd', 'kwd'], ['usd', 'qar'],

  // EUR 크로스
  ['eur', 'gbp'], ['gbp', 'eur'],
  ['eur', 'jpy'], ['eur', 'chf'],
  ['eur', 'cny'], ['eur', 'cad'],
  ['eur', 'aud'], ['eur', 'inr'],
  ['eur', 'try'], ['eur', 'brl'],
  ['eur', 'sek'], ['eur', 'nok'],
  ['eur', 'pln'], ['eur', 'czk'],

  // GBP 크로스
  ['gbp', 'jpy'], ['gbp', 'chf'],
  ['gbp', 'aud'], ['gbp', 'cad'],

  // JPY 크로스
  ['aud', 'jpy'], ['cad', 'jpy'],
  ['chf', 'jpy'], ['nzd', 'jpy'],

  // 기타 크로스
  ['aud', 'nzd'], ['nzd', 'usd'],
  ['sgd', 'myr'], ['thb', 'jpy'],
];

/** 통화쌍을 URL 슬러그로 변환. */
export function pairToSlug(from: string, to: string): string {
  return `${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

/** 금액+통화쌍을 URL 슬러그로 변환. */
export function amountPairToSlug(amount: number, from: string, to: string): string {
  return `${amount}-${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

export interface PairSlug { type: 'pair'; from: string; to: string }
export interface AmountPairSlug { type: 'amount'; amount: number; from: string; to: string }
export type ParsedSlug = PairSlug | AmountPairSlug;

/** URL 슬러그를 파싱하여 통화쌍 또는 금액+통화쌍 반환. {3,5}로 암호화폐 코드 지원. */
export function parseSlug(slug: string): ParsedSlug | null {
  const amountMatch = slug.match(/^(\d+)-([a-z]{3,5})-to-([a-z]{3,5})$/);
  if (amountMatch) {
    return { type: 'amount', amount: parseInt(amountMatch[1], 10), from: amountMatch[2], to: amountMatch[3] };
  }
  const pairMatch = slug.match(/^([a-z]{3,5})-to-([a-z]{3,5})$/);
  if (pairMatch) {
    return { type: 'pair', from: pairMatch[1], to: pairMatch[2] };
  }
  return null;
}

/** URL 슬러그에서 통화쌍 추출 (하위 호환). */
export function slugToPair(slug: string): [string, string] | null {
  const parsed = parseSlug(slug);
  if (!parsed) return null;
  if (parsed.type === 'amount') return [parsed.from, parsed.to];
  return [parsed.from, parsed.to];
}

/** 홈페이지 인기 환율 표시용. */
export const HOME_PAIRS: [string, string][] = [
  ['usd', 'krw'], ['usd', 'jpy'], ['eur', 'usd'], ['gbp', 'usd'],
  ['usd', 'cny'], ['eur', 'krw'], ['jpy', 'krw'], ['usd', 'thb'],
];
