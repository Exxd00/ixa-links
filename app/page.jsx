'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const INSTAGRAM = 'https://www.instagram.com/ixa_agency?igsh=MXd2aDI3dGx5dTZ0cA==';
const WHATSAPP = 'https://wa.me/491629155408';
const LINKEDIN = 'https://www.linkedin.com/company/ixa-agency';

function IXALogo() {
  return (
    <div className="ixa-logo" aria-label="IXA Agency">
      <svg viewBox="0 0 1000 520" aria-hidden="true">
        <path d="M58 250C236 86 364 28 476 26v78c-94 4-193 47-310 146 117 99 216 142 310 146v78C364 472 236 414 58 250Z" />
        <path d="M942 250C764 86 636 28 524 26v78c94 4 193 47 310 146-117 99-216 142-310 146v78C636 472 764 414 942 250Z" />
        <circle cx="500" cy="250" r="72" />
      </svg>
      <span>IXA</span>
    </div>
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

function useStoryMotion() {
  const ref = useRef(null);
  const started = useRef(false);
  const [motion, setMotion] = useState('idle');

  useEffect(() => {
    const card = ref.current;
    if (!card) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotion('complete');
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!started.current) started.current = true;
        setMotion((current) => current === 'complete' ? current : 'running');
      } else if (started.current) {
        setMotion((current) => current === 'running' ? 'paused' : current);
      }
    }, { threshold: 0.55 });

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return { ref, motion, finish: () => setMotion('complete') };
}

function LeadsStory({ motion, onFinish }) {
  return (
    <div className={`service-story leads-story story-${motion}`} aria-hidden="true">
      <svg className="story-path" viewBox="0 0 180 126" preserveAspectRatio="none">
        <path d="M45 23 C91 23 72 54 112 58 S137 91 91 101" />
      </svg>
      <div className="lead-search story-step">
        <svg viewBox="0 0 20 20"><circle cx="8" cy="8" r="5"/><path d="m12 12 5 5"/></svg>
        <span>Google Suche</span>
      </div>
      <div className="lead-page story-step">
        <div className="mini-browser"><i/><i/><i/></div>
        <b>IXA Landingpage</b>
        <span>Klare Leistung. Klare Antwort.</span>
        <em>Kontakt aufnehmen</em>
      </div>
      <div className="lead-request story-step">
        <b>Neue Anfrage</b>
        <span className="lead-source">Quelle: Google Ads</span>
        <em className="lead-tracked" onAnimationEnd={onFinish}>✓ erfasst</em>
      </div>
    </div>
  );
}

function SmmStory({ motion, onFinish }) {
  return (
    <div className={`service-story smm-story story-${motion}`} aria-hidden="true">
      <svg className="story-path" viewBox="0 0 180 126" preserveAspectRatio="none">
        <path d="M44 67 C72 67 77 23 111 24 S126 83 95 101" />
      </svg>
      <div className="social-post story-step">
        <div className="post-head"><i/><span>@ixa_agency</span></div>
        <div className="post-visual"><b>Content</b><i/></div>
        <div className="post-actions"><span>♡</span><span>○</span><span>⌑</span></div>
      </div>
      <div className="reach-badge story-step"><b>Reach</b><span>Aufmerksamkeit</span></div>
      <div className="social-message story-step"><b>Neue Nachricht</b><span>Hallo, ich interessiere mich…</span></div>
      <div className="demand-badge story-step" onAnimationEnd={onFinish}><span>✓</span><b>Neue Anfrage</b></div>
    </div>
  );
}

function ServiceCard({ type, href, delay }) {
  const { ref, motion, finish } = useStoryMotion();
  const leads = type === 'leads';
  return (
    <a
      ref={ref}
      className={`service-card ${leads ? 'leads-card' : 'smm-card'}`}
      href={href}
      style={{ '--story-delay': `${delay}ms` }}
      aria-label={`${leads ? 'IXA Leads' : 'IXA SMM'} öffnen`}
    >
      <div className="card-copy">
        <span className="service-kicker">IXA</span>
        <h2>{leads ? 'LEADS' : 'SMM'}</h2>
        <p>{leads ? 'Aus Suche wird Anfrage.' : 'Aus Aufmerksamkeit wird Nachfrage.'}</p>
        <span className="card-arrow" aria-hidden="true">→</span>
      </div>
      {leads ? <LeadsStory motion={motion} onFinish={finish}/> : <SmmStory motion={motion} onFinish={finish}/>}
      <span className="sr-only">{leads ? 'Google Suche führt zur Landingpage, zur Anfrage und wird als Google Ads Quelle erfasst.' : 'Content erzeugt Aufmerksamkeit, Interaktion, eine Nachricht und schließlich eine neue Anfrage.'}</span>
    </a>
  );
}

export default function Home() {
  const [theme, setTheme] = useState('light');

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

  return (
    <main className="home-shell">
      <div className="home-topbar">
        <IXALogo />
        <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}>
          <Icon name="theme"/><span>{theme === 'dark' ? 'Hell' : 'Dunkel'}</span>
        </button>
      </div>

      <header className="home-hero">
        <h1><span>Sichtbar. Messbar.</span><span>Wirksam.</span></h1>
        <p>Wachstum für dein Unternehmen.</p>
      </header>

      <section className="service-grid" aria-label="IXA Leistungen">
        <ServiceCard type="leads" href="https://ixa-leads.de" delay={350}/>
        <ServiceCard type="smm" href="https://ixa-smm.de" delay={650}/>
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
