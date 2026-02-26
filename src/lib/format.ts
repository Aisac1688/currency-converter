/** 숫자를 통화 형식으로 포맷팅. */
export function formatCurrency(value: number, decimals?: number): string {
  const d = decimals ?? (value >= 100 ? 2 : value >= 1 ? 4 : 6);
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: d,
  });
}

/** 큰 숫자를 간략화 (1.2M, 3.4K 등). */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(2);
}

/** 날짜를 YYYY-MM-DD 포맷. */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
