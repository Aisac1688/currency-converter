/** 금액 페이지 마이크로 콘텐츠 생성기. */
import { getCurrency } from './currencies';
import { CURRENCY_CONTEXTS, getBuyingPowerTier } from './currency-context';
import { convert, type Rates } from './exchange-rates';
import { formatCurrency } from './format';
import { getRelatedAmounts } from './amount-pairs';

export interface AmountPageContent {
  heroAnswer: string;
  contextParagraph: string;
  travelTip: string;
  useCases: string[];
  quickReference: { amount: number; result: string; slug: string }[];
  faqItems: { question: string; answer: string }[];
}

/** 금액 페이지의 고유 콘텐츠 생성. */
export function generateAmountContent(
  amount: number,
  from: string,
  to: string,
  rates: Rates,
  locale: string,
): AmountPageContent {
  const result = convert(amount, from, to, rates);
  const fromC = getCurrency(from);
  const toC = getCurrency(to);
  const ctx = CURRENCY_CONTEXTS[from];
  const tier = getBuyingPowerTier(amount, from);
  const isKo = locale === 'ko';
  const fmtResult = formatCurrency(result);
  const fmtAmount = amount.toLocaleString();
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();

  const heroAnswer = `${fmtAmount} ${FROM} = ${fmtResult} ${TO}`;

  const buyingPower = isKo ? ctx?.buyingPowerKo[tier] : ctx?.buyingPowerEn[tier];
  const counter = ctx?.counterKo ?? FROM;

  const contextParagraph = isKo
    ? `현재 환율 기준으로 ${fmtAmount} ${counter}(${FROM})는 약 ${fmtResult} ${toC?.nameKo ?? TO}(${TO})입니다. ${buyingPower ?? ''}`
    : `At the current exchange rate, ${fmtAmount} ${fromC?.name ?? FROM} (${FROM}) equals approximately ${fmtResult} ${TO}. ${buyingPower ?? ''}`;

  const travelTip = isKo ? (ctx?.travelTipKo ?? '') : (ctx?.travelTipEn ?? '');
  const useCases = isKo ? (ctx?.useCasesKo ?? []) : (ctx?.useCasesEn ?? []);

  const related = getRelatedAmounts(from, to, amount);
  const quickReference = related.slice(0, 8).map(a => ({
    amount: a,
    result: formatCurrency(convert(a, from, to, rates)),
    slug: `${a}-${from}-to-${to}`,
  }));

  const faqItems = buildFaq(amount, from, to, result, rates, locale, fromC, toC, ctx, counter);

  return { heroAnswer, contextParagraph, travelTip, useCases, quickReference, faqItems };
}

function buildFaq(
  amount: number,
  from: string,
  to: string,
  result: number,
  rates: Rates,
  locale: string,
  fromC: ReturnType<typeof getCurrency>,
  toC: ReturnType<typeof getCurrency>,
  ctx: (typeof CURRENCY_CONTEXTS)[string] | undefined,
  counter: string,
): { question: string; answer: string }[] {
  const fmtResult = formatCurrency(result);
  const fmtAmount = amount.toLocaleString();
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();
  const isKo = locale === 'ko';
  const reverseResult = formatCurrency(convert(amount, to, from, rates));

  if (isKo) {
    return [
      {
        question: `${fmtAmount} ${counter}(${FROM})는 ${toC?.nameKo ?? TO}로 얼마인가요?`,
        answer: `현재 환율 기준 ${fmtAmount} ${FROM}는 약 ${fmtResult} ${TO}입니다. 환율은 매일 변동되므로 이 페이지에서 최신 환율을 확인하세요.`,
      },
      {
        question: `${fmtAmount} ${FROM}를 ${TO}로 환전할 때 수수료는 얼마인가요?`,
        answer: `은행은 보통 1-3% 환전 수수료를 부과합니다. 와이즈(Wise), 리볼루트 등 온라인 서비스는 0.3-1.5%로 더 저렴합니다. 수수료를 비교하여 가장 유리한 환전 방법을 선택하세요.`,
      },
      {
        question: `반대로 ${fmtAmount} ${TO}는 ${FROM}로 얼마인가요?`,
        answer: `${fmtAmount} ${TO}는 현재 약 ${reverseResult} ${FROM}입니다. 반대 방향 환율이 궁금하다면 상단 계산기에서 통화를 바꿔보세요.`,
      },
      {
        question: `${FROM}/${TO} 환율은 언제 가장 유리한가요?`,
        answer: `환율은 경제 지표, 금리 정책, 국제 정세에 따라 변동됩니다. 큰 금액을 환전할 때는 며칠간 환율 추이를 관찰한 후 유리한 시점에 환전하는 것이 좋습니다.`,
      },
    ];
  }

  return [
    {
      question: `How much is ${fmtAmount} ${FROM} in ${TO}?`,
      answer: `At the current exchange rate, ${fmtAmount} ${FROM} equals approximately ${fmtResult} ${TO}. Rates fluctuate daily—check this page for the latest.`,
    },
    {
      question: `What are the fees for converting ${fmtAmount} ${FROM} to ${TO}?`,
      answer: `Banks typically charge 1-3% in exchange fees. Online services like Wise or Revolut offer 0.3-1.5% rates. Compare fees to find the best conversion method.`,
    },
    {
      question: `How much is ${fmtAmount} ${TO} in ${FROM}?`,
      answer: `${fmtAmount} ${TO} is currently about ${reverseResult} ${FROM}. Use the converter above to check the reverse direction.`,
    },
    {
      question: `When is the best time to convert ${FROM} to ${TO}?`,
      answer: `Exchange rates depend on economic indicators, interest rate policies, and global events. For large amounts, monitor rates over a few days and convert when favorable.`,
    },
  ];
}
