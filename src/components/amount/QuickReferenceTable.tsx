import { Link } from '@/i18n/navigation';

interface QuickReferenceItem {
  amount: number;
  result: string;
  slug: string;
}

interface Props {
  items: QuickReferenceItem[];
  from: string;
  to: string;
  locale: string;
}

/** 관련 금액 환산표. 각 행이 해당 금액 페이지로 링크. */
export default function QuickReferenceTable({ items, from, to, locale }: Props) {
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">{FROM}</th>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">{TO}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.amount} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50">
              <td className="px-4 py-3">
                <Link
                  href={`/${item.slug}`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {item.amount.toLocaleString()} {FROM}
                </Link>
              </td>
              <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-100">
                {item.result} {TO}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
