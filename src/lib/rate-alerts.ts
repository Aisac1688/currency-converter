/** localStorage 기반 환율 알림 CRUD. */

export interface RateAlert {
  id: string;
  from: string;
  to: string;
  targetRate: number;
  direction: 'above' | 'below';
  createdAt: string;
}

const STORAGE_KEY = 'rate-alerts';

function readAlerts(): RateAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAlerts(alerts: RateAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

/** 저장된 알림 목록. */
export function getAlerts(): RateAlert[] {
  return readAlerts();
}

/** 알림 추가. */
export function addAlert(alert: Omit<RateAlert, 'id' | 'createdAt'>): RateAlert {
  const newAlert: RateAlert = {
    ...alert,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const alerts = readAlerts();
  alerts.push(newAlert);
  writeAlerts(alerts);
  return newAlert;
}

/** 알림 삭제. */
export function removeAlert(id: string) {
  const alerts = readAlerts().filter(a => a.id !== id);
  writeAlerts(alerts);
}

/** 조건 충족 알림 체크. */
export function checkAlerts(currentRates: Record<string, Record<string, number>>): RateAlert[] {
  const alerts = readAlerts();
  const triggered: RateAlert[] = [];

  for (const alert of alerts) {
    const rate = currentRates[alert.from.toLowerCase()]?.[alert.to.toLowerCase()];
    if (!rate) continue;
    if (alert.direction === 'above' && rate >= alert.targetRate) triggered.push(alert);
    if (alert.direction === 'below' && rate <= alert.targetRate) triggered.push(alert);
  }

  return triggered;
}
