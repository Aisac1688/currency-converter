/** 통화별 실생활 아이템 가격 (현지 통화 기준). */

export interface ItemPrices {
  coffee: number;
  bigmac: number;
  taxi: number;
  hotel: number;
}

/** 통화별 대표 아이템 가격. */
const PRICES: Record<string, ItemPrices> = {
  usd: { coffee: 5.5, bigmac: 5.7, taxi: 15, hotel: 150 },
  krw: { coffee: 4500, bigmac: 5500, taxi: 8000, hotel: 100000 },
  jpy: { coffee: 450, bigmac: 450, taxi: 1500, hotel: 12000 },
  eur: { coffee: 3.5, bigmac: 5.0, taxi: 12, hotel: 120 },
  gbp: { coffee: 3.5, bigmac: 4.5, taxi: 12, hotel: 130 },
  cny: { coffee: 25, bigmac: 25, taxi: 30, hotel: 400 },
  thb: { coffee: 60, bigmac: 150, taxi: 100, hotel: 1500 },
  vnd: { coffee: 35000, bigmac: 75000, taxi: 50000, hotel: 800000 },
  php: { coffee: 150, bigmac: 200, taxi: 200, hotel: 3500 },
  twd: { coffee: 80, bigmac: 80, taxi: 150, hotel: 2500 },
  aud: { coffee: 5, bigmac: 7, taxi: 18, hotel: 180 },
  cad: { coffee: 5, bigmac: 7.5, taxi: 16, hotel: 170 },
  sgd: { coffee: 6, bigmac: 6.5, taxi: 15, hotel: 200 },
  hkd: { coffee: 40, bigmac: 25, taxi: 50, hotel: 800 },
  chf: { coffee: 5, bigmac: 6.5, taxi: 20, hotel: 200 },
  inr: { coffee: 200, bigmac: 200, taxi: 150, hotel: 3000 },
  mxn: { coffee: 60, bigmac: 80, taxi: 80, hotel: 1500 },
  idr: { coffee: 30000, bigmac: 50000, taxi: 30000, hotel: 500000 },
  myr: { coffee: 10, bigmac: 13, taxi: 15, hotel: 250 },
  nzd: { coffee: 5.5, bigmac: 8, taxi: 18, hotel: 180 },
  brl: { coffee: 8, bigmac: 25, taxi: 20, hotel: 300 },
};

export interface BuyingPowerResult {
  coffee: number;
  bigmac: number;
  taxi: number;
  hotel: number;
}

/** 금액으로 살 수 있는 아이템 수량 계산. */
export function calculateBuyingPower(amount: number, currencyCode: string): BuyingPowerResult | null {
  const prices = PRICES[currencyCode.toLowerCase()];
  if (!prices) return null;

  return {
    coffee: Math.floor(amount / prices.coffee),
    bigmac: Math.floor(amount / prices.bigmac),
    taxi: Math.floor(amount / prices.taxi),
    hotel: Math.floor(amount / prices.hotel),
  };
}

/** 지원 통화 여부. */
export function hasBuyingPowerData(currencyCode: string): boolean {
  return currencyCode.toLowerCase() in PRICES;
}
