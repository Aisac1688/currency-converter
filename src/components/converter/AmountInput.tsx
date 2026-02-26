'use client';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

/** 금액 입력 필드. 숫자만 허용, 콤마 자동 포맷. */
export default function AmountInput({ value, onChange, label }: AmountInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) return;
    onChange(raw);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        placeholder="0"
        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-xl font-mono font-medium
          text-zinc-900 outline-none transition-colors
          placeholder:text-zinc-300
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600
          dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
      />
    </div>
  );
}
