import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = locale === 'ko'
    ? 'hwanyul.com의 개인정보 수집 및 이용에 관한 안내입니다.'
    : 'Privacy policy for hwanyul.com regarding data collection and usage.';

  return {
    title: locale === 'ko' ? '개인정보처리방침' : 'Privacy Policy',
    description,
    alternates: { canonical: `/${locale}/privacy`, languages: { ko: '/ko/privacy', en: '/en/privacy', 'x-default': '/ko/privacy' } },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

  const sections = ['collect', 'cookies', 'ads', 'thirdParty', 'security', 'changes'] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="mb-8 text-sm text-zinc-400">{t('lastUpdated')}: 2025-01-01</p>

      <div className="space-y-6 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>{t('intro')}</p>

        {sections.map(key => (
          <section key={key}>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t(`${key}.title`)}</h2>
            <p>{t(`${key}.desc`)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
