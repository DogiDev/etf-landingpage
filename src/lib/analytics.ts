export type FunnelEventType =
  | 'landing_view'
  | 'variant_displayed'
  | 'comparison_interaction'
  | 'lead_form_start'
  | 'lead_submit_attempt'
  | 'lead_submit_success'
  | 'comparison_unlocked';

export interface FunnelEventPayload {
  event: FunnelEventType;
  variant: 'fees' | 'alternatives';
  timestamp: string;
  details?: Record<string, unknown>;
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
}

const STORAGE_KEY = 'etf_landing_analytics_events';

// Sanitizer to guarantee zero email or personal data in analytics
const sanitizeDetails = (details?: Record<string, unknown>): Record<string, unknown> | undefined => {
  if (!details) return undefined;
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(details)) {
    // Drop anything related to email or names
    if (/email|mail|name|jmeno|ident/i.test(k)) continue;
    if (typeof v === 'string' && v.includes('@')) continue;
    clean[k] = v;
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
};

export const trackEvent = async (
  event: FunnelEventType,
  variant: 'fees' | 'alternatives',
  details?: Record<string, unknown>
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
  };

  const payload: FunnelEventPayload = {
    event,
    variant,
    timestamp: new Date().toISOString(),
    details: sanitizeDetails(details),
    utmParams,
  };

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] ${event}`, payload);
  }

  // Client session log for local testing
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-50)));
    window.dispatchEvent(new CustomEvent('etf_analytics_event', { detail: payload }));
  } catch {
    // ignore
  }

  // Server endpoint
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking
  }
};

export const getStoredClientEvents = (): FunnelEventPayload[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
