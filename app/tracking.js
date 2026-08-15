const INTERNAL_EVENT = 'ixa:analytics';

export function trackEvent(eventName, parameters = {}) {
  if (typeof window === 'undefined') return;

  const eventParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined && value !== null),
  );
  const sharedParameters = {
    event_source: 'links_hub',
    page_path: window.location.pathname,
    ...eventParameters,
  };
  const detail = { event: eventName, ...sharedParameters };

  window.dispatchEvent(new CustomEvent(INTERNAL_EVENT, { detail }));

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, sharedParameters);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(detail);
}
