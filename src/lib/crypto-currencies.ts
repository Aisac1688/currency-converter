import type { Currency } from './currencies';

/** 암호화폐 메타데이터. @fawazahmed0/currency-api에서 지원하는 코드 사용. */
export const CRYPTO_CURRENCIES: Currency[] = [
  { code: 'btc', name: 'Bitcoin', nameKo: '비트코인', symbol: '₿', flag: '🪙' },
  { code: 'eth', name: 'Ethereum', nameKo: '이더리움', symbol: 'Ξ', flag: '🪙' },
  { code: 'sol', name: 'Solana', nameKo: '솔라나', symbol: 'SOL', flag: '🪙' },
  { code: 'xrp', name: 'XRP (Ripple)', nameKo: '리플', symbol: 'XRP', flag: '🪙' },
  { code: 'doge', name: 'Dogecoin', nameKo: '도지코인', symbol: 'Ð', flag: '🪙' },
  { code: 'ada', name: 'Cardano', nameKo: '카르다노', symbol: 'ADA', flag: '🪙' },
  { code: 'dot', name: 'Polkadot', nameKo: '폴카닷', symbol: 'DOT', flag: '🪙' },
  { code: 'avax', name: 'Avalanche', nameKo: '아발란체', symbol: 'AVAX', flag: '🪙' },
  { code: 'matic', name: 'Polygon', nameKo: '폴리곤', symbol: 'MATIC', flag: '🪙' },
  { code: 'usdt', name: 'Tether', nameKo: '테더', symbol: '₮', flag: '🪙' },
];

/** 암호화폐 코드 목록. */
export const CRYPTO_CODES = CRYPTO_CURRENCIES.map(c => c.code);

/** 코드로 암호화폐 찾기. */
export function getCrypto(code: string): Currency | undefined {
  return CRYPTO_CURRENCIES.find(c => c.code === code.toLowerCase());
}

/** 암호화폐 코드인지 확인. */
export function isCryptoCode(code: string): boolean {
  return CRYPTO_CODES.includes(code.toLowerCase());
}
