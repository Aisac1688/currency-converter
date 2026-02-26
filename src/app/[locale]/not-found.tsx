import { Link } from '@/i18n/navigation';

/** 커스텀 404 페이지. */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <p className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">404</p>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
