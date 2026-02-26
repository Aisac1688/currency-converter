interface FaqItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  type: 'faq';
  faqItems: FaqItem[];
}

/** JSON-LD 구조화 데이터 삽입. */
export default function StructuredData({ type, faqItems }: StructuredDataProps) {
  if (type === 'faq') {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }

  return null;
}
