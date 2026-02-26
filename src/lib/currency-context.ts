/** 통화별 실생활 맥락 데이터. 금액 페이지 마이크로 콘텐츠용. */

export interface CurrencyContext {
  buyingPowerKo: { small: string; medium: string; large: string };
  buyingPowerEn: { small: string; medium: string; large: string };
  useCasesKo: string[];
  useCasesEn: string[];
  travelTipKo: string;
  travelTipEn: string;
  counterKo: string;
}

export const CURRENCY_CONTEXTS: Record<string, CurrencyContext> = {
  usd: {
    buyingPowerKo: {
      small: '이 금액은 미국에서 커피 한 잔, 패스트푸드, 간식 구매에 적합한 소액입니다.',
      medium: '이 금액은 호텔 1박, 쇼핑, 레스토랑 식사, 박물관 입장료에 충분합니다.',
      large: '이 금액은 미국 월세, 대학 학비 일부, 중고차 구매 수준의 금액입니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers coffee, fast food, or small purchases in the US.',
      medium: 'This amount covers a hotel night, shopping, dining out, or museum admission.',
      large: 'This amount covers monthly rent, partial tuition, or a used car in the US.',
    },
    useCasesKo: ['해외 직구', '미국 여행 예산', '유학 송금', '투자 목적 환전'],
    useCasesEn: ['Online shopping', 'US travel budget', 'Tuition transfer', 'Investment exchange'],
    travelTipKo: '미국 여행 시 팁 문화가 있으며 음식점에서 15-20% 팁이 일반적입니다. 대부분 카드 결제가 가능합니다.',
    travelTipEn: 'Tipping 15-20% is customary at US restaurants. Credit cards are accepted almost everywhere.',
    counterKo: '달러',
  },
  jpy: {
    buyingPowerKo: {
      small: '이 금액은 일본 편의점 도시락, 자판기 음료, 100엔 숍 물건에 해당합니다.',
      medium: '이 금액은 라멘 정식, 도쿄 지하철 1일권, 드럭스토어 쇼핑 수준입니다.',
      large: '이 금액은 료칸 1박, 신칸센 왕복, 가전제품 구매에 충분한 금액입니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers convenience store meals, vending machine drinks in Japan.',
      medium: 'This amount covers ramen meals, subway day passes, or drugstore shopping.',
      large: 'This amount covers ryokan stays, Shinkansen round trips, or electronics.',
    },
    useCasesKo: ['일본 여행', '아마존 재팬 직구', '유학 생활비', '엔화 투자'],
    useCasesEn: ['Japan travel', 'Amazon Japan shopping', 'Study abroad expenses', 'Yen investment'],
    travelTipKo: '일본은 아직 현금 사용이 많으며 팁 문화가 없습니다. IC카드(Suica, PASMO)가 편리합니다.',
    travelTipEn: 'Japan is still largely cash-based with no tipping culture. IC cards (Suica/PASMO) are convenient.',
    counterKo: '엔',
  },
  eur: {
    buyingPowerKo: {
      small: '이 금액은 유럽에서 에스프레소, 빵, 대중교통 1회권에 해당하는 소액입니다.',
      medium: '이 금액은 유럽 호텔 1박, 미술관 입장, 레스토랑 코스 식사에 충분합니다.',
      large: '이 금액은 유럽 내 항공편, 월세, 고급 호텔 연박에 해당하는 금액입니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers an espresso, bread, or a single transit ticket in Europe.',
      medium: 'This amount covers a hotel night, museum entry, or a restaurant course meal.',
      large: 'This amount covers intra-Europe flights, monthly rent, or luxury hotel stays.',
    },
    useCasesKo: ['유럽 여행', '유럽 직구', '유학 학비', '유로화 투자'],
    useCasesEn: ['Europe travel', 'EU online shopping', 'Tuition payment', 'Euro investment'],
    travelTipKo: '유럽 대부분 국가에서 카드 결제가 가능하지만 소규모 상점은 현금만 받는 경우도 있습니다.',
    travelTipEn: 'Most European businesses accept cards, but small shops may require cash.',
    counterKo: '유로',
  },
  gbp: {
    buyingPowerKo: {
      small: '이 금액은 영국에서 샌드위치, 커피, 버스 요금에 해당합니다.',
      medium: '이 금액은 런던 호텔 1박, 뮤지컬 티켓, 쇼핑에 충분합니다.',
      large: '이 금액은 영국 월세, 대학 학비, 항공권에 해당하는 금액입니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers a sandwich, coffee, or bus fare in the UK.',
      medium: 'This amount covers a London hotel night, musical tickets, or shopping.',
      large: 'This amount covers UK rent, university tuition, or flight tickets.',
    },
    useCasesKo: ['영국 여행', '영국 직구', '영국 유학', '파운드 투자'],
    useCasesEn: ['UK travel', 'UK online shopping', 'UK study abroad', 'GBP investment'],
    travelTipKo: '영국에서는 컨택트리스 결제가 매우 보편적이며 팁은 10-12.5%가 일반적입니다.',
    travelTipEn: 'Contactless payment is widespread in the UK. Tipping 10-12.5% is common.',
    counterKo: '파운드',
  },
  krw: {
    buyingPowerKo: {
      small: '이 금액은 편의점 음료, 대중교통 요금, 간식에 해당하는 소액입니다.',
      medium: '이 금액은 한식 한 끼, 카페, 영화 티켓, 택시비에 충분합니다.',
      large: '이 금액은 호텔 숙박, 월세 일부, KTX 왕복에 해당하는 금액입니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers convenience store drinks, transit fares, or snacks in Korea.',
      medium: 'This amount covers a Korean meal, café visit, movie ticket, or taxi ride.',
      large: 'This amount covers hotel stays, partial rent, or KTX round trips in Korea.',
    },
    useCasesKo: ['한국 내 소비', '외화 환전 준비', '해외 송금'],
    useCasesEn: ['Domestic spending in Korea', 'Currency exchange preparation', 'International remittance'],
    travelTipKo: '한국은 카드 결제가 매우 보편적이며 팁 문화가 없습니다.',
    travelTipEn: 'Card payment is ubiquitous in Korea. Tipping is not expected.',
    counterKo: '원',
  },
  cny: {
    buyingPowerKo: {
      small: '이 금액은 중국에서 길거리 음식, 지하철 요금, 음료에 해당합니다.',
      medium: '이 금액은 중급 호텔 1박, 관광지 입장료, 쇼핑에 충분합니다.',
      large: '이 금액은 중국 내 항공편, 고급 호텔, 대량 쇼핑에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers street food, subway fares, or drinks in China.',
      medium: 'This amount covers a mid-range hotel, attraction tickets, or shopping.',
      large: 'This amount covers domestic flights, luxury hotels, or bulk shopping in China.',
    },
    useCasesKo: ['중국 여행', '알리바바/타오바오 직구', '중국 유학', '위안화 투자'],
    useCasesEn: ['China travel', 'Alibaba/Taobao shopping', 'Study in China', 'CNY investment'],
    travelTipKo: '중국에서는 위챗페이, 알리페이가 필수이며 외국인도 사용 가능합니다.',
    travelTipEn: 'WeChat Pay and Alipay are essential in China. Foreigners can now register.',
    counterKo: '위안',
  },
  aud: {
    buyingPowerKo: {
      small: '이 금액은 호주에서 커피, 미트파이, 대중교통에 해당합니다.',
      medium: '이 금액은 호주 호텔 1박, 동물원 입장, 레스토랑 식사에 충분합니다.',
      large: '이 금액은 호주 월세, 국내선 항공, 워킹홀리데이 초기 자금에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers a coffee, meat pie, or transit fare in Australia.',
      medium: 'This amount covers a hotel night, zoo admission, or restaurant dining.',
      large: 'This amount covers monthly rent, domestic flights, or working holiday funds.',
    },
    useCasesKo: ['호주 여행', '호주 워킹홀리데이', '호주 유학', '호주달러 투자'],
    useCasesEn: ['Australia travel', 'Working holiday', 'Study abroad', 'AUD investment'],
    travelTipKo: '호주는 물가가 높은 편이며 팁 문화가 약합니다. 대부분 카드 결제 가능합니다.',
    travelTipEn: 'Australia has high living costs. Tipping is not mandatory. Cards accepted everywhere.',
    counterKo: '호주달러',
  },
  cad: {
    buyingPowerKo: {
      small: '이 금액은 캐나다에서 커피, 팀홀튼 도넛, 버스 요금에 해당합니다.',
      medium: '이 금액은 캐나다 호텔 1박, 내셔널파크 입장, 식당 식사에 충분합니다.',
      large: '이 금액은 캐나다 월세, 유학 학비 일부, 스키 시즌 패스에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers a coffee, Tim Hortons, or bus fare in Canada.',
      medium: 'This amount covers a hotel night, national park entry, or restaurant meal.',
      large: 'This amount covers monthly rent, partial tuition, or a ski season pass.',
    },
    useCasesKo: ['캐나다 여행', '캐나다 유학', '이민 준비', '캐나다달러 투자'],
    useCasesEn: ['Canada travel', 'Study in Canada', 'Immigration preparation', 'CAD investment'],
    travelTipKo: '캐나다에서는 15-20% 팁이 일반적이며 대부분 카드 결제 가능합니다.',
    travelTipEn: 'Tipping 15-20% is standard in Canada. Cards are widely accepted.',
    counterKo: '캐나다달러',
  },
  chf: {
    buyingPowerKo: {
      small: '이 금액은 스위스에서 물 한 병, 초콜릿, 대중교통에 해당합니다.',
      medium: '이 금액은 스위스 호텔 1박, 융프라우 케이블카, 레스토랑 식사에 충분합니다.',
      large: '이 금액은 스위스 리조트 숙박, 스키 패스, 고급 시계 구매에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers bottled water, chocolate, or transit in Switzerland.',
      medium: 'This amount covers a hotel night, cable car rides, or restaurant meals.',
      large: 'This amount covers resort stays, ski passes, or luxury watch purchases.',
    },
    useCasesKo: ['스위스 여행', '스위스 유학', '프랑 투자', '명품 구매'],
    useCasesEn: ['Switzerland travel', 'Swiss study abroad', 'CHF investment', 'Luxury purchases'],
    travelTipKo: '스위스는 세계에서 가장 물가가 높은 나라 중 하나입니다. 카드 결제가 보편적입니다.',
    travelTipEn: 'Switzerland is one of the most expensive countries. Cards are widely accepted.',
    counterKo: '프랑',
  },
  sgd: {
    buyingPowerKo: {
      small: '이 금액은 싱가포르에서 호커센터 식사, MRT 요금에 해당합니다.',
      medium: '이 금액은 싱가포르 호텔 1박, 마리나베이 관광, 쇼핑에 충분합니다.',
      large: '이 금액은 싱가포르 월세, 고급 레스토랑, 가전 구매에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers hawker centre meals or MRT fares in Singapore.',
      medium: 'This amount covers a hotel night, Marina Bay attractions, or shopping.',
      large: 'This amount covers monthly rent, fine dining, or electronics in Singapore.',
    },
    useCasesKo: ['싱가포르 여행', '싱가포르 유학', '아시아 금융 투자'],
    useCasesEn: ['Singapore travel', 'Study in Singapore', 'Asian financial investment'],
    travelTipKo: '싱가포르에서는 카드 결제가 매우 보편적이며 팁은 필수가 아닙니다.',
    travelTipEn: 'Cards are widely accepted in Singapore. Tipping is not expected.',
    counterKo: '싱가포르달러',
  },
  nzd: {
    buyingPowerKo: {
      small: '이 금액은 뉴질랜드에서 플랫화이트 커피, 간식에 해당합니다.',
      medium: '이 금액은 뉴질랜드 호텔 1박, 번지점프, 와인 투어에 충분합니다.',
      large: '이 금액은 뉴질랜드 캠퍼밴 렌탈, 월세, 워킹홀리데이 자금에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers a flat white coffee or snacks in New Zealand.',
      medium: 'This amount covers a hotel night, bungee jumping, or wine tours.',
      large: 'This amount covers campervan rental, rent, or working holiday funds.',
    },
    useCasesKo: ['뉴질랜드 여행', '워킹홀리데이', '뉴질랜드 유학'],
    useCasesEn: ['New Zealand travel', 'Working holiday', 'NZ study abroad'],
    travelTipKo: '뉴질랜드는 팁 문화가 약하며 카드 결제가 보편적입니다.',
    travelTipEn: 'Tipping is not customary in New Zealand. Cards are widely accepted.',
    counterKo: '뉴질랜드달러',
  },
  thb: {
    buyingPowerKo: {
      small: '이 금액은 태국에서 길거리 음식, 뚝뚝 요금, 음료에 해당합니다.',
      medium: '이 금액은 태국 리조트 1박, 마사지, 시장 쇼핑에 충분합니다.',
      large: '이 금액은 태국 풀빌라, 골프 라운드, 장기 체류에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers street food, tuk-tuk rides, or drinks in Thailand.',
      medium: 'This amount covers a resort night, Thai massage, or market shopping.',
      large: 'This amount covers a pool villa, golf rounds, or extended stays in Thailand.',
    },
    useCasesKo: ['태국 여행', '태국 장기 체류', '태국 부동산'],
    useCasesEn: ['Thailand travel', 'Extended stay in Thailand', 'Thai property'],
    travelTipKo: '태국은 현금 사용이 많으며 흥정이 가능한 시장이 많습니다.',
    travelTipEn: 'Cash is common in Thailand. Bargaining is expected at markets.',
    counterKo: '바트',
  },
  vnd: {
    buyingPowerKo: {
      small: '이 금액은 베트남에서 쌀국수 한 그릇, 카페 음료에 해당합니다.',
      medium: '이 금액은 베트남 호텔 1박, 관광 투어, 쇼핑에 충분합니다.',
      large: '이 금액은 베트남 리조트 숙박, 장기 체류, 대량 쇼핑에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers a bowl of pho or café drinks in Vietnam.',
      medium: 'This amount covers a hotel night, tours, or shopping in Vietnam.',
      large: 'This amount covers resort stays, extended living, or bulk shopping.',
    },
    useCasesKo: ['베트남 여행', '베트남 부동산', '동남아 투자'],
    useCasesEn: ['Vietnam travel', 'Vietnamese property', 'Southeast Asian investment'],
    travelTipKo: '베트남은 현금 위주이며 큰 단위 지폐가 많아 계산 시 주의가 필요합니다.',
    travelTipEn: 'Vietnam is cash-heavy. Bills come in large denominations—count carefully.',
    counterKo: '동',
  },
  php: {
    buyingPowerKo: {
      small: '이 금액은 필리핀에서 길거리 음식, 지프니 요금에 해당합니다.',
      medium: '이 금액은 필리핀 리조트 1박, 섬 투어, 다이빙에 충분합니다.',
      large: '이 금액은 필리핀 장기 체류, 콘도 렌탈에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers street food or jeepney fares in the Philippines.',
      medium: 'This amount covers a resort night, island hopping, or diving.',
      large: 'This amount covers extended stays or condo rental in the Philippines.',
    },
    useCasesKo: ['필리핀 여행', '필리핀 어학연수', '동남아 장기 체류'],
    useCasesEn: ['Philippines travel', 'Language study', 'Extended stay in Southeast Asia'],
    travelTipKo: '필리핀에서는 소액 현금이 유용하며 큰 지폐는 거스름돈을 못 줄 수 있습니다.',
    travelTipEn: 'Carry small bills in the Philippines. Vendors may not have change for large notes.',
    counterKo: '페소',
  },
  twd: {
    buyingPowerKo: {
      small: '이 금액은 대만에서 야시장 음식, 버블티에 해당합니다.',
      medium: '이 금액은 대만 호텔 1박, 지우펀 관광, 야시장 쇼핑에 충분합니다.',
      large: '이 금액은 대만 고급 숙소, 환도 여행, 전자제품 구매에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers night market food or bubble tea in Taiwan.',
      medium: 'This amount covers a hotel night, Jiufen tour, or night market shopping.',
      large: 'This amount covers premium stays, round-island trips, or electronics.',
    },
    useCasesKo: ['대만 여행', '대만 직구', '대만 유학'],
    useCasesEn: ['Taiwan travel', 'Taiwan online shopping', 'Study in Taiwan'],
    travelTipKo: '대만은 야시장 문화가 발달했으며 소액 현금이 유용합니다. MRT가 편리합니다.',
    travelTipEn: 'Night markets are a highlight. Keep small cash handy. MRT is convenient.',
    counterKo: '대만달러',
  },
  myr: {
    buyingPowerKo: {
      small: '이 금액은 말레이시아에서 나시르막, 테타릭 차에 해당합니다.',
      medium: '이 금액은 말레이시아 호텔 1박, 관광, 쇼핑에 충분합니다.',
      large: '이 금액은 말레이시아 리조트, 랑카위 여행, 장기 체류에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers nasi lemak or teh tarik in Malaysia.',
      medium: 'This amount covers a hotel night, sightseeing, or shopping.',
      large: 'This amount covers resorts, Langkawi trips, or extended stays.',
    },
    useCasesKo: ['말레이시아 여행', '말레이시아 유학', '동남아 투자'],
    useCasesEn: ['Malaysia travel', 'Study in Malaysia', 'Southeast Asian investment'],
    travelTipKo: '말레이시아는 물가가 저렴하며 그랩(Grab) 앱이 택시 대신 유용합니다.',
    travelTipEn: 'Malaysia is affordable. Grab app is the go-to for rides.',
    counterKo: '링깃',
  },
  hkd: {
    buyingPowerKo: {
      small: '이 금액은 홍콩에서 완탕면, 밀크티에 해당합니다.',
      medium: '이 금액은 홍콩 호텔 1박, 빅토리아 피크, 딤섬에 충분합니다.',
      large: '이 금액은 홍콩 쇼핑, 고급 호텔, 마카오 여행에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers wonton noodles or milk tea in Hong Kong.',
      medium: 'This amount covers a hotel night, Victoria Peak, or dim sum.',
      large: 'This amount covers shopping, luxury hotels, or a Macau trip.',
    },
    useCasesKo: ['홍콩 여행', '홍콩 쇼핑', '홍콩 경유'],
    useCasesEn: ['Hong Kong travel', 'Hong Kong shopping', 'Hong Kong layover'],
    travelTipKo: '홍콩에서는 옥토퍼스 카드가 교통과 편의점 결제에 매우 편리합니다.',
    travelTipEn: 'Octopus card is essential for transit and convenience stores in Hong Kong.',
    counterKo: '홍콩달러',
  },
  inr: {
    buyingPowerKo: {
      small: '이 금액은 인도에서 차이, 사모사, 오토릭샤 요금에 해당합니다.',
      medium: '이 금액은 인도 호텔 1박, 타지마할 입장, 시장 쇼핑에 충분합니다.',
      large: '이 금액은 인도 5성급 호텔, 장기 여행, 아유르베다 리트릿에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers chai, samosas, or auto-rickshaw rides in India.',
      medium: 'This amount covers a hotel night, Taj Mahal entry, or market shopping.',
      large: 'This amount covers 5-star hotels, extended travel, or Ayurveda retreats.',
    },
    useCasesKo: ['인도 여행', '인도 IT 비즈니스', '인도 유학'],
    useCasesEn: ['India travel', 'India IT business', 'Study in India'],
    travelTipKo: '인도는 현금 사용이 많으며 UPI 결제가 빠르게 확산 중입니다.',
    travelTipEn: 'Cash is common in India. UPI digital payments are rapidly expanding.',
    counterKo: '루피',
  },
  mxn: {
    buyingPowerKo: {
      small: '이 금액은 멕시코에서 타코, 음료, 버스 요금에 해당합니다.',
      medium: '이 금액은 멕시코 호텔 1박, 관광, 레스토랑 식사에 충분합니다.',
      large: '이 금액은 멕시코 리조트, 칸쿤 여행, 장기 체류에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers tacos, drinks, or bus fare in Mexico.',
      medium: 'This amount covers a hotel night, sightseeing, or restaurant dining.',
      large: 'This amount covers resorts, Cancún trips, or extended stays.',
    },
    useCasesKo: ['멕시코 여행', '멕시코 비즈니스'],
    useCasesEn: ['Mexico travel', 'Mexico business'],
    travelTipKo: '멕시코에서는 10-15% 팁이 일반적이며 소액 현금이 유용합니다.',
    travelTipEn: 'Tipping 10-15% is standard in Mexico. Carry small bills.',
    counterKo: '페소',
  },
  brl: {
    buyingPowerKo: {
      small: '이 금액은 브라질에서 카페진호 커피, 간식에 해당합니다.',
      medium: '이 금액은 브라질 호텔 1박, 슈하스코 뷔페, 관광에 충분합니다.',
      large: '이 금액은 브라질 리조트, 아마존 투어, 장기 체류에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers cafezinho coffee or snacks in Brazil.',
      medium: 'This amount covers a hotel night, churrascaria buffet, or tours.',
      large: 'This amount covers resorts, Amazon tours, or extended stays.',
    },
    useCasesKo: ['브라질 여행', '브라질 비즈니스'],
    useCasesEn: ['Brazil travel', 'Brazil business'],
    travelTipKo: '브라질에서는 PIX 디지털 결제가 매우 보편적입니다.',
    travelTipEn: 'PIX digital payment is widely used in Brazil.',
    counterKo: '헤알',
  },
  idr: {
    buyingPowerKo: {
      small: '이 금액은 인도네시아에서 나시고렝, 음료에 해당합니다.',
      medium: '이 금액은 발리 빌라 1박, 서핑 레슨, 마사지에 충분합니다.',
      large: '이 금액은 발리 풀빌라, 장기 체류, 다이빙 패키지에 해당합니다.',
    },
    buyingPowerEn: {
      small: 'This amount covers nasi goreng or drinks in Indonesia.',
      medium: 'This amount covers a Bali villa night, surfing lessons, or spa.',
      large: 'This amount covers pool villas, extended stays, or diving packages.',
    },
    useCasesKo: ['발리 여행', '인도네시아 장기 체류', '동남아 투자'],
    useCasesEn: ['Bali travel', 'Extended stay in Indonesia', 'SE Asian investment'],
    travelTipKo: '발리에서는 현금이 필수이며 ATM 수수료에 주의하세요.',
    travelTipEn: 'Cash is essential in Bali. Watch for ATM fees.',
    counterKo: '루피아',
  },
};

/** 금액과 통화에 따라 구매력 티어 결정. */
export function getBuyingPowerTier(amount: number, currencyCode: string): 'small' | 'medium' | 'large' {
  const lowValue = ['krw', 'jpy', 'vnd', 'idr'];
  if (lowValue.includes(currencyCode)) {
    if (amount <= 1000) return 'small';
    if (amount <= 50000) return 'medium';
    return 'large';
  }
  const medValue = ['cny', 'myr', 'thb', 'twd', 'hkd', 'php', 'inr', 'mxn', 'brl'];
  if (medValue.includes(currencyCode)) {
    if (amount <= 50) return 'small';
    if (amount <= 1000) return 'medium';
    return 'large';
  }
  if (amount <= 10) return 'small';
  if (amount <= 500) return 'medium';
  return 'large';
}
