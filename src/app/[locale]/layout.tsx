import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://currencycalc.com';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    title: { default: t('title'), template: `%s | ${t('title')}` },
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: { ko: '/ko', en: '/en' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      siteName: 'CurrencyCalc',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
