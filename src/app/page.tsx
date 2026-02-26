import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

/** 루트 접속 시 기본 로케일로 리다이렉트. */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
