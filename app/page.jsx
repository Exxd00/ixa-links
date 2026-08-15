'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const INSTAGRAM = 'https://www.instagram.com/ixa_agency?igsh=MXd2aDI3dGx5dTZ0cA==';
const WHATSAPP = 'https://wa.me/491629155408';
const LINKEDIN = 'https://www.linkedin.com/company/ixa-agency';

function IXALogo({ className = '', motion = 'static', interactive = false }) {
  const [pressed, setPressed] = useState(false);
  const pressTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(pressTimer.current), []);

  const replay = () => {
    if (!interactive) return;
    window.clearTimeout(pressTimer.current);
    setPressed(false);
    window.requestAnimationFrame(() => {
      setPressed(true);
      pressTimer.current = window.setTimeout(() => setPressed(false), 440);
    });
  };

  const content = <>
    <svg viewBox="0 0 1000 520" aria-hidden="true">
      <path className="logo-wing logo-wing-left" d="M58 250C236 86 364 28 476 26v78c-94 4-193 47-310 146 117 99 216 142 310 146v78C364 472 236 414 58 250Z" />
      <path className="logo-wing logo-wing-right" d="M942 250C764 86 636 28 524 26v78c94 4 193 47 310 146-117 99-216 142-310 146v78C636 472 764 414 942 250Z" />
      <circle className="logo-pupil" cx="500" cy="250" r="72" />
      <g className="logo-flow logo-flow-leads">
        <circle cx="345" cy="250" r="22"/><path d="m361 266 19 19M403 250h44M447 250l-12-10M447 250l-12 10"/><circle cx="472" cy="250" r="8"/><path d="m466 250 5 5 10-13"/>
      </g>
      <g className="logo-flow logo-flow-smm">
        <rect x="548" y="224" width="40" height="50" rx="6"/><path d="M600 240h31M600 258h23"/><circle cx="650" cy="249" r="6"/><circle cx="673" cy="249" r="6"/><path d="M692 226h44a9 9 0 0 1 9 9v23a9 9 0 0 1-9 9h-17l-12 12v-12h-15a9 9 0 0 1-9-9v-23a9 9 0 0 1 9-9Z"/>
      </g>
      <circle className="logo-pulse" cx="500" cy="250" r="102" />
    </svg>
    <strong>IXA AGENCY</strong>
  </>;

  if (interactive) return (
    <button className={`ixa-brand ixa-brand-button ${className} logo-${motion}${pressed ? ' logo-tap' : ''}`} type="button" onPointerDown={replay} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') replay();
    }} aria-label="IXA Logo Animation abspielen">
      {content}
    </button>
  );

  return (
    <div className={`ixa-brand ${className} logo-${motion}`} aria-label="IXA Agency">{content}</div>
  );
}

function SplashScreen() {
  return (
    <section className="splash-screen" aria-label="IXA Agency wird geladen">
      <div className="splash-glow" aria-hidden="true" />
      <IXALogo className="splash-brand" />
    </section>
  );
}

function Icon({ name }) {
  const paths = {
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>,
    whatsapp: <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 21l1.7-4.7a8.5 8.5 0 1 1 15.8-4.6Z"/><path d="M8 8c1 4 4 7 8 8l1.2-2.1-2.6-1.2-.9 1c-1.8-.8-3.2-2.2-4-4l1-.9L9.5 6.3 8 8Z"/></>,
    phone: <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 2a15.5 15.5 0 0 1-9.8-9.8L8 7 7 3Z"/>,
    linkedin: <><path d="M7 9v10M7 5.5v.1M11 19v-6c0-2 1.2-3.5 3.2-3.5S18 10.8 18 13v6M3.5 9H7v10H3.5z"/><path d="M11 9h3v1.5"/></>,
    theme: <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function useElementVisibility() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function useAnimationCoordinator(enabled) {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (!enabled) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      setPhase('reduced');
      return undefined;
    }

    let timer;
    let cycleStart = performance.now();
    const update = () => {
      window.clearTimeout(timer);
      if (document.visibilityState !== 'visible') {
        setPhase('idle');
        return;
      }
      const elapsed = (performance.now() - cycleStart) % 12000;
      const next = elapsed < 2100 ? ['logo', 2100] : elapsed < 5700 ? ['leads', 5700] : elapsed < 6300 ? ['idle', 6300] : elapsed < 9900 ? ['smm', 9900] : ['idle', 12000];
      setPhase(next[0]);
      timer = window.setTimeout(update, Math.max(40, next[1] - elapsed));
    };
    const handleVisibility = () => {
      window.clearTimeout(timer);
      if (document.visibilityState === 'visible') cycleStart = performance.now();
      update();
    };

    update();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled]);

  return phase;
}

function LeadsStory({ active, reduced }) {
  return (
    <div className={`service-story leads-story story-${reduced ? 'complete' : active ? 'running' : 'complete'}`} aria-hidden="true">
      <svg className="story-path" viewBox="0 0 180 126" preserveAspectRatio="none">
        <path d="M45 23 C91 23 72 54 112 58 S137 91 91 101" />
      </svg>
      <div className="lead-search story-step">
        <svg viewBox="0 0 20 20"><circle cx="8" cy="8" r="5"/><path d="m12 12 5 5"/></svg>
        <span>Google Ads Agentur</span>
      </div>
      <div className="lead-result story-step"><small>Anzeige</small><b>IXA Agency</b><span>Mehr Anfragen gewinnen</span></div>
      <div className="lead-page story-step">
        <div className="mini-browser"><i/><i/><i/></div>
        <b>IXA Landingpage</b>
        <span>Klare Leistung. Klare Antwort.</span>
        <em>Kontakt aufnehmen</em>
      </div>
      <div className="lead-request story-step">
        <b>Neue Anfrage</b>
        <span className="lead-source">Quelle: Google Ads</span>
        <em className="lead-tracked">✓ erfasst</em>
      </div>
    </div>
  );
}

function SmmStory({ active, reduced }) {
  return (
    <div className={`service-story smm-story story-${reduced ? 'complete' : active ? 'running' : 'complete'}`} aria-hidden="true">
      <svg className="story-path" viewBox="0 0 180 126" preserveAspectRatio="none">
        <path d="M69 29 C134 4 169 44 137 69 S166 111 112 108" />
      </svg>
      <div className="social-profile story-step">
        <div className="profile-head">
          <i className="profile-avatar"/>
          <span><b>@ixa_agency</b><small>Content Studio</small></span>
        </div>
        <div className="profile-stories"><i/><i/><i/></div>
        <div className="profile-media">
          <i/><i className="reel"/><i/>
          <i className="reel"/><i/><i className="reel"/>
        </div>
      </div>
      <span className="engagement-node node-like story-step">♥</span>
      <span className="engagement-node node-comment story-step">●</span>
      <span className="engagement-node node-save story-step">⌑</span>
      <div className="reach-chip story-step"><b>2.4K</b><span>Views</span></div>
      <div className="social-message story-step"><b>Neue Nachricht</b><span>Ich interessiere mich…</span></div>
      <div className="demand-badge story-step"><span>✓</span><b>Neue Anfrage</b></div>
    </div>
  );
}

function ServiceCard({ type, href, active, reduced }) {
  const { ref, visible } = useElementVisibility();
  const leads = type === 'leads';
  return (
    <a
      ref={ref}
      className={`service-card ${leads ? 'leads-card' : 'smm-card'}`}
      href={href}
      aria-label={`${leads ? 'IXA Leads' : 'IXA SMM'} öffnen`}
    >
      <div className="card-copy">
        <span className="service-kicker">IXA</span>
        <h2>{leads ? 'LEADS' : 'SMM'}</h2>
        <p>{leads ? 'Aus Suche wird Anfrage.' : 'Aus Aufmerksamkeit wird Nachfrage.'}</p>
        <span className="card-arrow" aria-hidden="true">→</span>
      </div>
      {leads ? <LeadsStory active={active && visible} reduced={reduced}/> : <SmmStory active={active && visible} reduced={reduced}/>}
      <span className="sr-only">{leads ? 'Google Suche führt zur Landingpage, zur Anfrage und wird als Google Ads Quelle erfasst.' : 'Content erzeugt Aufmerksamkeit, Interaktion, eine Nachricht und schließlich eine neue Anfrage.'}</span>
    </a>
  );
}

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [showSplash, setShowSplash] = useState(true);
  const phase = useAnimationCoordinator(!showSplash);

  useEffect(() => {
    const saved = localStorage.getItem('ixa-theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ixa-theme', theme);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#050606' : '#f7faf9');
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <main className="home-shell">
      <div className="home-topbar">
        <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}>
          <Icon name="theme"/><span>{theme === 'dark' ? 'Hell' : 'Dunkel'}</span>
        </button>
      </div>

      <header className="home-hero">
        <IXALogo className="home-brand" motion={phase === 'logo' ? 'active' : phase === 'reduced' ? 'reduced' : 'idle'} interactive />
        <h1><span>Sichtbar.</span><span>Messbar.</span><span>Wirksam.</span></h1>
      </header>

      <section className="service-grid" aria-label="IXA Leistungen">
        <ServiceCard type="leads" href="https://ixa-leads.de" active={phase === 'leads'} reduced={phase === 'reduced'}/>
        <ServiceCard type="smm" href="https://ixa-smm.de" active={phase === 'smm'} reduced={phase === 'reduced'}/>
      </section>

      <nav className="social-links" aria-label="IXA Kontakt">
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin"/></a>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram"/></a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp"/></a>
        <a href="tel:+491629155408" aria-label="+49 162 9155408 anrufen"><Icon name="phone"/></a>
      </nav>

      <footer className="home-footer"><span>© IXA</span><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link></footer>
    </main>
  );
}
