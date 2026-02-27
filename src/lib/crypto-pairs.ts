import { CRYPTO_CODES } from './crypto-currencies';
import type { AmountPairConfig } from './amount-pairs';

/** 주요 법정화폐 (crypto 쌍 대상). */
const FIAT_TARGETS = ['krw', 'usd', 'jpy', 'eur', 'gbp'];

/** 인기 암호화폐-법정화폐 쌍. SEO 페이지 생성용. */
export const CRYPTO_PAIRS: [string, string][] = [];
for (const crypto of CRYPTO_CODES) {
  for (const fiat of FIAT_TARGETS) {
    CRYPTO_PAIRS.push([crypto, fiat]);
    CRYPTO_PAIRS.push([fiat, crypto]);
  }
}

/** 암호화폐 금액별 롱테일 SEO 페이지 설정. */
const BTC_AMOUNTS = [1, 5, 10, 50, 100];
const HIGH_AMOUNTS = [1, 10, 100, 1000];
const MID_AMOUNTS = [100, 1000, 10000];

export const CRYPTO_AMOUNT_PAIRS: AmountPairConfig[] = [
  // BTC → fiat (고가)
  { from: 'btc', to: 'krw', amounts: BTC_AMOUNTS },
  { from: 'btc', to: 'usd', amounts: BTC_AMOUNTS },
  { from: 'btc', to: 'jpy', amounts: BTC_AMOUNTS },
  // ETH → fiat
  { from: 'eth', to: 'krw', amounts: HIGH_AMOUNTS },
  { from: 'eth', to: 'usd', amounts: HIGH_AMOUNTS },
  // SOL, XRP → fiat
  { from: 'sol', to: 'krw', amounts: HIGH_AMOUNTS },
  { from: 'sol', to: 'usd', amounts: HIGH_AMOUNTS },
  { from: 'xrp', to: 'krw', amounts: MID_AMOUNTS },
  { from: 'xrp', to: 'usd', amounts: MID_AMOUNTS },
  // DOGE → fiat
  { from: 'doge', to: 'krw', amounts: MID_AMOUNTS },
  { from: 'doge', to: 'usd', amounts: MID_AMOUNTS },
];

/** 모든 암호화폐 금액 슬러그 생성. */
export function getAllCryptoAmountSlugs(): { from: string; to: string; amount: number }[] {
  const slugs: { from: string; to: string; amount: number }[] = [];
  for (const config of CRYPTO_AMOUNT_PAIRS) {
    for (const amount of config.amounts) {
      slugs.push({ from: config.from, to: config.to, amount });
    }
  }
  return slugs;
}
