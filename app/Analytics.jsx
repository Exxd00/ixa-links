'use client';

import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GOOGLE_ANALYTICS_ID } from './site-config';
import { trackEvent } from './tracking';

const CONSENT_KEY = 'ixa-analytics-consent';
const CONSENT_RESET_EVENT = 'ixa:reset-analytics-consent';
const SCROLL_MILESTONES = [25, 50, 75, 90];

function updateConsent(granted) {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export default function Analytics() {
  const [consent, setConsent] = useState(null);
  const trackedScroll = useRef(new Set());
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === 'granted' || saved === 'denied') {
      setConsent(saved);
      updateConsent(saved === 'granted');
    } else {
      setConsent('pending');
    }

    const resetConsent = () => {
      localStorage.removeItem(CONSENT_KEY);
      updateConsent(false);
      setConsent('pending');
    };
    window.addEventListener(CONSENT_RESET_EVENT, resetConsent);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, resetConsent);
  }, []);

  useEffect(() => {
    if (consent !== 'granted') return undefined;

    trackedScroll.current.clear();
    trackEvent('page_view', {
      page_location: window.location.href,
      page_title: document.title,
    });

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.round((window.scrollY / scrollable) * 100);
      SCROLL_MILESTONES.forEach((milestone) => {
        if (depth >= milestone && !trackedScroll.current.has(milestone)) {
          trackedScroll.current.add(milestone);
          trackEvent('scroll_depth', { percent_scrolled: milestone });
        }
      });
    };

    const engagedTimer = window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        trackEvent('engaged_visit', { engagement_time_seconds: 30 });
      }
    }, 30000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.clearTimeout(engagedTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [consent, pathname]);

  const chooseConsent = (choice) => {
    localStorage.setItem(CONSENT_KEY, choice);
    updateConsent(choice === 'granted');
    setConsent(choice);
    if (choice === 'granted') trackEvent('analytics_consent_update', { consent_status: choice });
  };

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}', { send_page_view: false });
        `}
      </Script>
      {consent === 'pending' && (
        <aside className="consent-banner" aria-label="Analyse-Einstellungen" role="dialog" aria-live="polite">
          <div>
            <strong>Analyse & Datenschutz</strong>
            <p>Wir möchten anonyme Nutzungsdaten mit Google Analytics auswerten, um unsere Angebote zu verbessern. Das ist freiwillig.</p>
            <Link href="/datenschutz">Mehr erfahren</Link>
          </div>
          <div className="consent-actions">
            <button type="button" className="consent-decline" onClick={() => chooseConsent('denied')}>Ablehnen</button>
            <button type="button" className="consent-accept" onClick={() => chooseConsent('granted')}>Zustimmen</button>
          </div>
        </aside>
      )}
    </>
  );
}

export function AnalyticsPreferencesButton() {
  return (
    <button
      className="analytics-preferences"
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_RESET_EVENT))}
    >
      Analyse-Einstellungen öffnen
    </button>
  );
}
