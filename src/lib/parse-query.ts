import { CURRENCIES } from './currencies';
import { CRYPTO_CURRENCIES } from './crypto-currencies';
import { STOCK_TICKERS } from './stock-tickers';

export type AssetType = 'currency' | 'crypto' | 'stock';

export interface ResolvedAsset {
  code: string;
  type: AssetType;
  name: string;
  nameKo: string;
  icon: string;
}

export interface ParsedQuery {
  amount: number;
  from: ResolvedAsset;
  to?: ResolvedAsset;
}

/** 한국어 별명 → 자산 코드 매핑. */
const KO_ALIASES: Record<string, string> = {
  '달러': 'usd', '불': 'usd', '미국달러': 'usd', '미달러': 'usd',
  '원': 'krw', '한화': 'krw', '원화': 'krw',
  '엔': 'jpy', '엔화': 'jpy', '일본엔': 'jpy',
  '유로': 'eur', '유로화': 'eur',
  '위안': 'cny', '위안화': 'cny',
  '파운드': 'gbp', '영국파운드': 'gbp',
  '바트': 'thb', '태국바트': 'thb',
  '동': 'vnd', '베트남동': 'vnd',
  '페소': 'php', '루피': 'inr', '루피아': 'idr',
  '프랑': 'chf', '스위스프랑': 'chf',
  '호주달러': 'aud', '캐나다달러': 'cad', '싱가포르달러': 'sgd',
  '홍콩달러': 'hkd', '대만달러': 'twd', '뉴질랜드달러': 'nzd',
  '비트코인': 'btc', '이더리움': 'eth', '이더': 'eth',
  '리플': 'xrp', '솔라나': 'sol', '도지코인': 'doge', '도지': 'doge',
  '카르다노': 'ada', '폴카닷': 'dot', '아발란체': 'avax',
  '폴리곤': 'matic', '테더': 'usdt',
  '애플': 'aapl', '테슬라': 'tsla', '엔비디아': 'nvda', '구글': 'googl',
  '아마존': 'amzn', '메타': 'meta', '넷플릭스': 'nflx',
  '마이크로소프트': 'msft', '인텔': 'intc',
  '알리바바': 'baba', '니오': 'nio', '팔란티어': 'pltr',
  '코인베이스': 'coin', '블록': 'sq',
};

/** 코드로 자산 메타데이터 조회. */
function lookupByCode(code: string): ResolvedAsset | null {
  const lc = code.toLowerCase();
  const cur = CURRENCIES.find(c => c.code === lc);
  if (cur) return { code: lc, type: 'currency', name: cur.name, nameKo: cur.nameKo, icon: cur.flag };
  const cry = CRYPTO_CURRENCIES.find(c => c.code === lc);
  if (cry) return { code: lc, type: 'crypto', name: cry.name, nameKo: cry.nameKo, icon: cry.flag };
  const stk = STOCK_TICKERS.find(s => s.symbol.toLowerCase() === lc);
  if (stk) return { code: lc, type: 'stock', name: stk.name, nameKo: stk.nameKo, icon: '📈' };
  return null;
}

/** 입력 텍스트를 자산으로 해석. 코드 → 별명 → 이름 순서. */
function resolveAsset(input: string): ResolvedAsset | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  // 1. 코드 직접 매칭
  const byCode = lookupByCode(trimmed);
  if (byCode) return byCode;
  // 2. 한국어 별명
  const aliasCode = KO_ALIASES[trimmed];
  if (aliasCode) return lookupByCode(aliasCode);
  // 3. 영어 이름 startsWith
  const cur = CURRENCIES.find(c => c.name.toLowerCase().startsWith(trimmed));
  if (cur) return { code: cur.code, type: 'currency', name: cur.name, nameKo: cur.nameKo, icon: cur.flag };
  const cry = CRYPTO_CURRENCIES.find(c => c.name.toLowerCase().startsWith(trimmed));
  if (cry) return { code: cry.code, type: 'crypto', name: cry.name, nameKo: cry.nameKo, icon: cry.flag };
  const stk = STOCK_TICKERS.find(s => s.name.toLowerCase().startsWith(trimmed));
  if (stk) return { code: stk.symbol.toLowerCase(), type: 'stock', name: stk.name, nameKo: stk.nameKo, icon: '📈' };
  return null;
}

/** 콤마 포함 숫자 문자열 파싱. */
function parseNumber(raw: string): number {
  return parseFloat(raw.replace(/,/g, '')) || 0;
}

/** 로케일 기반 기본 변환 대상. */
function getDefaultTarget(from: ResolvedAsset, locale: string): ResolvedAsset | undefined {
  if (from.type === 'stock') return undefined; // 주식은 multi-currency 표시
  const defaultCode = locale === 'ko' ? 'krw' : 'usd';
  const fallback = locale === 'ko' ? 'usd' : 'krw';
  const code = from.code === defaultCode ? fallback : defaultCode;
  return lookupByCode(code) ?? undefined;
}

/** 자연어 입력을 파싱하여 변환 의도 추출. */
export function parseQuery(raw: string, locale: string): ParsedQuery | null {
  const input = raw.trim();
  if (!input) return null;

  // 1. "100 usd to krw" / "100 달러 to 엔"
  const fullMatch = input.match(/^([\d,]+\.?\d*)\s*(.+?)\s+(?:to|in|→|에서|를)\s+(.+)$/i);
  if (fullMatch) {
    const amount = parseNumber(fullMatch[1]);
    const from = resolveAsset(fullMatch[2]);
    const to = resolveAsset(fullMatch[3]);
    if (from && to && amount > 0) return { amount, from, to };
  }

  // 2. "100 usd" / "100 달러"
  const amountFirst = input.match(/^([\d,]+\.?\d*)\s+(.+)$/);
  if (amountFirst) {
    const amount = parseNumber(amountFirst[1]);
    const from = resolveAsset(amountFirst[2]);
    if (from && amount > 0) return { amount, from, to: getDefaultTarget(from, locale) };
  }

  // 3. "달러 100" / "usd100"
  const assetFirst = input.match(/^([a-zA-Z\u3131-\uD79D]+)\s*([\d,]+\.?\d*)$/);
  if (assetFirst && assetFirst[2]) {
    const from = resolveAsset(assetFirst[1]);
    const amount = parseNumber(assetFirst[2]);
    if (from && amount > 0) return { amount, from, to: getDefaultTarget(from, locale) };
  }

  // 4. 자산만: "btc" / "aapl" / "달러"
  const from = resolveAsset(input);
  if (from) return { amount: 1, from, to: getDefaultTarget(from, locale) };

  return null;
}
