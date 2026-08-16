const INTERNAL_EVENT = 'ixa:analytics';
const EVENT_PREFIX = 'ixa';

function eventId(eventName) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${EVENT_PREFIX}-${eventName}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function trackEvent(eventName, parameters = {}) {
  if (typeof window === 'undefined') return;

  const eventParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined && value !== null),
  );
  const sharedParameters = {
    event_source: 'links_hub',
    page_path: window.location.pathname,
    event_id: eventId(eventName),
    ...eventParameters,
  };
  const detail = { event: eventName, ...sharedParameters };

  window.dispatchEvent(new CustomEvent(INTERNAL_EVENT, { detail }));

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, sharedParameters);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(['event', eventName, sharedParameters]);
}

export function trackOutbound(destination, context, extra = {}) {
  trackEvent('outbound_click', {
    destination,
    link_context: context,
    ...extra,
  });
}

export function trackLead(channel, destination, context = 'contact_navigation') {
  trackEvent('contact_select', {
    channel,
    destination_type: destination,
    contact_context: context,
  });
  trackEvent('generate_lead', {
    currency: 'EUR',
    value: 1,
    lead_channel: channel,
    lead_source: 'ixa_links_hub',
    lead_context: context,
  });
}
