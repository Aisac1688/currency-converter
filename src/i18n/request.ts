import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import ko from '../../messages/ko.json';
import en from '../../messages/en.json';

const messages = { ko, en } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'ko' | 'en')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  };
});
