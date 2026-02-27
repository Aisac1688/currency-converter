/** Finnhub 주식 가격 API 연동. 무료 티어: 60 calls/min. */

const FINNHUB_BASE = 'https://finnhub.io/api/v1';

export interface StockQuote {
  current: number;    // 현재가 (USD)
  high: number;       // 일중 최고가
  low: number;        // 일중 최저가
  open: number;       // 시가
  prevClose: number;  // 전일 종가
  change: number;     // 변동액
  changePercent: number; // 변동률 (%)
  timestamp: number;
}

/** 주식 시세 조회. 빌드 타임 전용. */
export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return createFallbackQuote(symbol);
  }

  try {
    const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`);
    if (!res.ok) return createFallbackQuote(symbol);
    const data = await res.json();
    if (!data.c || data.c === 0) return createFallbackQuote(symbol);
    return {
      current: data.c,
      high: data.h,
      low: data.l,
      open: data.o,
      prevClose: data.pc,
      change: data.d ?? 0,
      changePercent: data.dp ?? 0,
      timestamp: data.t ?? Date.now() / 1000,
    };
  } catch {
    return createFallbackQuote(symbol);
  }
}

/** API 키 미설정 시 예상 가격 폴백 (빌드 실패 방지). */
const FALLBACK_PRICES: Record<string, number> = {
  AAPL: 195, MSFT: 420, GOOGL: 175, AMZN: 185, TSLA: 250,
  NVDA: 130, META: 500, NFLX: 620, AMD: 160, INTC: 30,
  BABA: 90, TSM: 170, NIO: 5, PLTR: 25, COIN: 250, SQ: 75,
};

function createFallbackQuote(symbol: string): StockQuote {
  const price = FALLBACK_PRICES[symbol.toUpperCase()] ?? 100;
  return {
    current: price, high: price * 1.01, low: price * 0.99,
    open: price, prevClose: price, change: 0, changePercent: 0,
    timestamp: Date.now() / 1000,
  };
}
