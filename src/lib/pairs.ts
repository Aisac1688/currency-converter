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
  ['idr', 'krw'],
  ['myr', 'krw'],

  // 글로벌 주요 쌍
  ['eur', 'usd'], ['usd', 'eur'],
  ['gbp', 'usd'], ['usd', 'gbp'],
  ['usd', 'jpy'], ['usd', 'cny'],
  ['usd', 'cad'], ['usd', 'aud'],
  ['usd', 'chf'], ['usd', 'hkd'],
  ['usd', 'sgd'], ['usd', 'inr'],
  ['usd', 'thb'], ['usd', 'vnd'],
  ['usd', 'php'], ['usd', 'idr'],
  ['usd', 'myr'], ['usd', 'twd'],
  ['usd', 'mxn'], ['usd', 'brl'],
  ['eur', 'gbp'], ['eur', 'jpy'],
  ['eur', 'chf'], ['gbp', 'eur'],
  ['aud', 'usd'], ['nzd', 'usd'],
  ['usd', 'try'], ['usd', 'zar'],
  ['usd', 'rub'], ['usd', 'aed'],
];

/** 통화쌍을 URL 슬러그로 변환. */
export function pairToSlug(from: string, to: string): string {
  return `${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

/** URL 슬러그에서 통화쌍 추출. */
export function slugToPair(slug: string): [string, string] | null {
  const match = slug.match(/^([a-z]{3})-to-([a-z]{3})$/);
  if (!match) return null;
  return [match[1], match[2]];
}

/** 홈페이지 인기 환율 표시용. */
export const HOME_PAIRS: [string, string][] = [
  ['usd', 'krw'], ['usd', 'jpy'], ['eur', 'usd'], ['gbp', 'usd'],
  ['usd', 'cny'], ['eur', 'krw'], ['jpy', 'krw'], ['usd', 'thb'],
];
