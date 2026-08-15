'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import IXAEye3D from './IXAEye3D';
import LiveParticleField from './LiveParticleField';

const INSTAGRAM = 'https://www.instagram.com/ixa_agency?igsh=MXd2aDI3dGx5dTZ0cA==';
const WHATSAPP = 'https://wa.me/491629155408';
const LINKEDIN = 'https://www.linkedin.com/company/ixa-agency';

function IXALogo({ className = '', active = false, interactive = false }) {
  const [pressed, setPressed] = useState(false);
  const pressTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(pressTimer.current), []);

  const focus = () => {
    if (!interactive) return;
    window.clearTimeout(pressTimer.current);
    setPressed(false);
    window.requestAnimationFrame(() => {
      setPressed(true);
      pressTimer.current = window.setTimeout(() => setPressed(false), 720);
    });
  };

  const content = <>
    <svg viewBox="0 0 1000 520" aria-hidden="true">
      <path className="logo-base" d="M58 250C236 86 364 28 476 26v60c-88 4-162 58-231 164 69 106 143 160 231 164v60C364 472 236 414 58 250Z" />
      <path className="logo-base" d="M942 250C764 86 636 28 524 26v60c88 4 162 58 231 164-69 106-143 160-231 164v60C636 472 764 414 942 250Z" />
      <circle className="logo-pupil" cx="500" cy="250" r="72" />
      <circle className="logo-focus-ring" cx="500" cy="250" r="112" />
      <path className="logo-contour logo-contour-left" d="M465 112C378 121 286 164 185 250c101 86 193 129 280 138" />
      <path className="logo-contour logo-contour-right" d="M535 112c87 9 179 52 280 138-101 86-193 129-280 138" />
      <path className="logo-scan" d="M356 250h288" />
      <circle className="logo-signal logo-signal-left" cx="224" cy="250" r="9" />
      <circle className="logo-signal logo-signal-right" cx="776" cy="250" r="9" />
      <circle className="logo-lock" cx="500" cy="250" r="98" />
    </svg>
    <strong>IXA AGENCY</strong>
  </>;

  if (interactive) return (
    <button className={`ixa-brand ixa-brand-button ${className}${active ? ' logo-focus-active' : ''}${pressed ? ' logo-focus-tap' : ''}`} type="button" onPointerDown={focus} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') focus();
    }} aria-label="IXA Logo fokussieren">{content}</button>
  );

  return (
    <div className={`ixa-brand ${className}`} aria-label="IXA Agency">{content}</div>
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
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.15"/><circle className="icon-fill" cx="17.45" cy="6.55" r="1.05"/></>,
    whatsapp: <path className="icon-fill" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37A9.86 9.86 0 1 1 12.05 21.78M20.45 3.49A11.82 11.82 0 0 0 12 0C5.5 0 .2 5.3.2 11.81c0 2.08.54 4.11 1.57 5.9L.1 23.81l6.24-1.64A11.8 11.8 0 0 0 12 23.62c6.51 0 11.81-5.3 11.81-11.81 0-3.15-1.23-6.12-3.46-8.32Z"/>,
    phone: <path d="M21 16.75v2.75a1.8 1.8 0 0 1-1.96 1.8 18.2 18.2 0 0 1-7.93-2.82 17.9 17.9 0 0 1-5.55-5.55A18.2 18.2 0 0 1 2.74 5 1.8 1.8 0 0 1 4.53 3h2.75a1.8 1.8 0 0 1 1.78 1.55c.12.88.34 1.75.64 2.58a1.8 1.8 0 0 1-.4 1.9l-1.16 1.16a14.45 14.45 0 0 0 5.55 5.55l1.16-1.16a1.8 1.8 0 0 1 1.9-.4c.83.3 1.7.52 2.58.64A1.8 1.8 0 0 1 21 16.75Z"/>,
    linkedin: <path className="icon-fill" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.04c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>,
    theme: <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z"/>,
  };
  return <svg className={`icon-${name}`} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
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

function useAnimationCycle(enabled) {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      const elapsed = (performance.now() - cycleStart) % 15400;
      const next = elapsed < 1600 ? ['logo', 1600] : elapsed < 2400 ? ['idle', 2400] : elapsed < 7800 ? ['leads', 7800] : elapsed < 8800 ? ['idle', 8800] : elapsed < 14200 ? ['smm', 14200] : ['idle', 15400];
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

function LeadsStory({ active }) {
  return (
    <div className={`service-story leads-story${active ? ' story-active' : ''}`} aria-hidden="true">
      <svg className="story-path" viewBox="0 0 180 126" preserveAspectRatio="none">
        <path d="M45 23 C91 23 72 54 112 58 S137 91 91 101" />
        <g className="story-signal lead-signal">
          <circle className="signal-ripple" r="7" />
          <circle className="signal-core" r="3.2" />
        </g>
      </svg>
      <div className="lead-search story-step">
        <svg viewBox="0 0 20 20"><circle cx="8" cy="8" r="5"/><path d="m12 12 5 5"/></svg>
        <span className="search-loop">
          <span>Mehr Leads</span>
          <span>Mehr Anfragen</span>
          <span>Google Ads Agentur</span>
          <span>Messbare Anfragen</span>
        </span>
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

function SmmStory({ active }) {
  const viewsRef = useRef(null);

  useEffect(() => {
    const counter = viewsRef.current;
    if (!counter) return undefined;
    if (!active) {
      counter.textContent = '2.4K';
      return undefined;
    }
    let value = 1280;
    const updateCounter = () => {
      counter.textContent = `${(value / 1000).toFixed(1)}K`;
    };
    updateCounter();
    const timer = window.setInterval(() => {
      value += 34;
      if (value > 2860) value = 1280;
      updateCounter();
    }, 180);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <div className={`service-story smm-story${active ? ' story-active' : ''}`} aria-hidden="true">
      <svg className="story-path" viewBox="0 0 180 126" preserveAspectRatio="none">
        <path d="M69 29 C134 4 169 44 137 69 S166 111 112 108" />
        <g className="story-signal smm-signal">
          <circle className="signal-ripple" r="7" />
          <circle className="signal-core" r="3.2" />
        </g>
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
      <span className="engagement-node node-like story-step"><svg viewBox="0 0 24 24"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></svg></span>
      <span className="engagement-node node-comment story-step"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.7-4.6A8.5 8.5 0 1 1 21 11.5Z"/></svg></span>
      <span className="engagement-node node-save story-step"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg></span>
      <div className="reach-chip story-step"><b ref={viewsRef}>2.4K</b><span>Views</span></div>
      <div className="social-message story-step"><b>Neue Nachricht</b><span>Ich interessiere mich…</span></div>
      <div className="demand-badge story-step"><span className="demand-check">✓</span><span className="demand-copy"><b>Neue Anfrage</b><small>via Social Media</small></span></div>
    </div>
  );
}

function ServiceCard({ type, href, active, reduced, externalRef, energized }) {
  const { ref, visible } = useElementVisibility();
  const leads = type === 'leads';
  return (
    <a
      ref={(node) => {
        ref.current = node;
        if (externalRef) externalRef.current = node;
      }}
      className={`service-card ${leads ? 'leads-card' : 'smm-card'}${energized ? ' is-energized' : ''}`}
      href={href}
      aria-label={`${leads ? 'IXA Leads' : 'IXA SMM'} öffnen`}
    >
      <div className="card-copy">
        <span className="service-kicker">IXA</span>
        <h2>{leads ? 'LEADS' : 'SMM'}</h2>
        <p>{leads ? 'Aus Suche wird Anfrage.' : 'Aus Aufmerksamkeit wird Nachfrage.'}</p>
        <span className="card-arrow" aria-hidden="true">→</span>
      </div>
      {leads ? <LeadsStory active={!reduced && active && visible}/> : <SmmStory active={!reduced && active && visible}/>}
      <span className="sr-only">{leads ? 'Google Suche führt zur Landingpage, zur Anfrage und wird als Google Ads Quelle erfasst.' : 'Content erzeugt Aufmerksamkeit, Interaktion, eine Nachricht und schließlich eine neue Anfrage.'}</span>
    </a>
  );
}

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [showSplash, setShowSplash] = useState(true);
  const [energyTransfer, setEnergyTransfer] = useState(null);
  const leadsCardRef = useRef(null);
  const smmCardRef = useRef(null);
  const transferTimerRef = useRef(null);
  const phase = useAnimationCycle(!showSplash);

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

  useEffect(() => () => window.clearTimeout(transferTimerRef.current), []);

  const handleLogoBurst = (eyeRect) => {
    const leadsRect = leadsCardRef.current?.getBoundingClientRect();
    const smmRect = smmCardRef.current?.getBoundingClientRect();
    if (!leadsRect || !smmRect) return;
    window.clearTimeout(transferTimerRef.current);
    const id = Date.now();
    setEnergyTransfer({
      id,
      startX: eyeRect.left + eyeRect.width / 2,
      startY: eyeRect.top + eyeRect.height / 2,
      leadsX: leadsRect.left + leadsRect.width * 0.72,
      leadsY: leadsRect.top + leadsRect.height * 0.5,
      smmX: smmRect.left + smmRect.width * 0.72,
      smmY: smmRect.top + smmRect.height * 0.5,
    });
    transferTimerRef.current = window.setTimeout(() => setEnergyTransfer(null), 2500);
  };

  return (
    <>
    {showSplash && <SplashScreen />}
    {!showSplash && <LiveParticleField theme={theme} />}
    {energyTransfer && (
      <div key={energyTransfer.id} className="energy-transfer" aria-hidden="true">
        <i
          className="energy-shard energy-shard-leads"
          style={{ '--start-x': `${energyTransfer.startX}px`, '--start-y': `${energyTransfer.startY}px`, '--end-x': `${energyTransfer.leadsX}px`, '--end-y': `${energyTransfer.leadsY}px` }}
        />
        <i
          className="energy-shard energy-shard-smm"
          style={{ '--start-x': `${energyTransfer.startX}px`, '--start-y': `${energyTransfer.startY}px`, '--end-x': `${energyTransfer.smmX}px`, '--end-y': `${energyTransfer.smmY}px` }}
        />
      </div>
    )}
    <main className={`home-shell${showSplash ? ' is-preloading' : ''}`} aria-hidden={showSplash || undefined} inert={showSplash ? true : undefined}>
      <div className="home-topbar">
        <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}>
          <Icon name="theme"/><span>{theme === 'dark' ? 'Hell' : 'Dunkel'}</span>
        </button>
      </div>

      <header className="home-hero">
        <IXAEye3D active={phase === 'logo'} theme={theme} onBurst={handleLogoBurst} />
        <strong className="home-brand-name">IXA AGENCY</strong>
        <h1><span>Sichtbar.</span><span>Messbar.</span><span>Wirksam.</span></h1>
      </header>

      <section className="service-grid" aria-label="IXA Leistungen">
        <ServiceCard type="leads" href="https://ixa-leads.de" active={phase === 'leads'} reduced={phase === 'reduced'} externalRef={leadsCardRef} energized={Boolean(energyTransfer)}/>
        <ServiceCard type="smm" href="https://ixa-smm.de" active={phase === 'smm'} reduced={phase === 'reduced'} externalRef={smmCardRef} energized={Boolean(energyTransfer)}/>
      </section>

      <nav className="social-links" aria-label="IXA Kontakt">
        <a className="social-link social-linkedin" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin"/></a>
        <a className="social-link social-instagram" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram"/></a>
        <a className="social-link social-whatsapp" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp"/></a>
        <a className="social-link social-phone" href="tel:+491629155408" aria-label="+49 162 9155408 anrufen"><Icon name="phone"/></a>
      </nav>

      <footer className="home-footer"><span>© IXA</span><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link></footer>
    </main>
    </>
  );
}
