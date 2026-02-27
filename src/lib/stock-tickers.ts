/** 인기 주식 종목 메타데이터. */

export interface StockTicker {
  symbol: string;
  name: string;
  nameKo: string;
  sector: string;
  sectorKo: string;
  exchange: string;
}

export const STOCK_TICKERS: StockTicker[] = [
  // US Tech
  { symbol: 'AAPL', name: 'Apple', nameKo: '애플', sector: 'Technology', sectorKo: '기술', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft', nameKo: '마이크로소프트', sector: 'Technology', sectorKo: '기술', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)', nameKo: '구글', sector: 'Technology', sectorKo: '기술', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon', nameKo: '아마존', sector: 'Consumer', sectorKo: '소비재', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla', nameKo: '테슬라', sector: 'Automotive', sectorKo: '자동차', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA', nameKo: '엔비디아', sector: 'Semiconductor', sectorKo: '반도체', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms', nameKo: '메타', sector: 'Technology', sectorKo: '기술', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix', nameKo: '넷플릭스', sector: 'Entertainment', sectorKo: '엔터테인먼트', exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'AMD', nameKo: 'AMD', sector: 'Semiconductor', sectorKo: '반도체', exchange: 'NASDAQ' },
  { symbol: 'INTC', name: 'Intel', nameKo: '인텔', sector: 'Semiconductor', sectorKo: '반도체', exchange: 'NASDAQ' },
  // Asia / Global
  { symbol: 'BABA', name: 'Alibaba', nameKo: '알리바바', sector: 'E-Commerce', sectorKo: '이커머스', exchange: 'NYSE' },
  { symbol: 'TSM', name: 'TSMC', nameKo: 'TSMC', sector: 'Semiconductor', sectorKo: '반도체', exchange: 'NYSE' },
  { symbol: 'NIO', name: 'NIO', nameKo: '니오', sector: 'Automotive', sectorKo: '자동차', exchange: 'NYSE' },
  // Fintech / Crypto-adjacent
  { symbol: 'PLTR', name: 'Palantir', nameKo: '팔란티어', sector: 'Software', sectorKo: '소프트웨어', exchange: 'NYSE' },
  { symbol: 'COIN', name: 'Coinbase', nameKo: '코인베이스', sector: 'Fintech', sectorKo: '핀테크', exchange: 'NASDAQ' },
  { symbol: 'SQ', name: 'Block (Square)', nameKo: '블록', sector: 'Fintech', sectorKo: '핀테크', exchange: 'NYSE' },
];

/** 심볼로 주식 찾기. */
export function getStock(symbol: string): StockTicker | undefined {
  return STOCK_TICKERS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
}

/** 슬러그용 소문자 심볼 목록. */
export function getAllStockSlugs(): string[] {
  return STOCK_TICKERS.map(s => s.symbol.toLowerCase());
}
