import { calculateBuyingPower, hasBuyingPowerData } from '@/lib/buying-power-items';

interface Props {
  amount: number;
  currency: string;
  locale: string;
}

const ITEMS = [
  { key: 'coffee' as const, emoji: '☕', ko: '커피', en: 'Coffee' },
  { key: 'bigmac' as const, emoji: '🍔', ko: '빅맥', en: 'Big Mac' },
  { key: 'taxi' as const, emoji: '🚕', ko: '택시', en: 'Taxi Ride' },
  { key: 'hotel' as const, emoji: '🏨', ko: '호텔 1박', en: 'Hotel Night' },
];

/** 구매력 시각화 (이모지 + 바 차트). */
export default function BuyingPowerVisual({ amount, currency, locale }: Props) {
  if (!hasBuyingPowerData(currency)) return null;

  const result = calculateBuyingPower(amount, currency);
  if (!result) return null;

  const isKo = locale === 'ko';
  const maxCount = Math.max(result.coffee, result.bigmac, result.taxi, result.hotel, 1);

  return (
    <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {isKo ? '이 돈으로 살 수 있는 것' : 'What you can buy'}
      </h2>
      <div className="space-y-3">
        {ITEMS.map(item => {
          const count = result[item.key];
          const ratio = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  {item.emoji} {isKo ? item.ko : item.en}
                </span>
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {count.toLocaleString()}{isKo ? '회' : 'x'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min(ratio, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
