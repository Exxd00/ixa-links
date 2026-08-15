'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const INSTAGRAM = 'https://www.instagram.com/ixa_agency?igsh=MXd2aDI3dGx5dTZ0cA==';
const WHATSAPP = 'https://wa.me/491629155408';
const LINKEDIN = 'https://www.linkedin.com/company/ixa-agency';

function EyeLogo({ className = '', interactive = false, onActivate, compact = false }) {
  const ref = useRef(null);
  const [pressed, setPressed] = useState(false);

  const move = useCallback((event) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const point = event.touches?.[0] ?? event;
    const x = Math.max(-1, Math.min(1, ((point.clientX - rect.left) / rect.width - .5) * 2));
    const y = Math.max(-1, Math.min(1, ((point.clientY - rect.top) / rect.height - .5) * 2));
    ref.current.style.setProperty('--rx', `${-y * 8}deg`);
    ref.current.style.setProperty('--ry', `${x * 8}deg`);
    ref.current.style.setProperty('--px', `${x * 8}px`);
    ref.current.style.setProperty('--py', `${y * 5}px`);
  }, [interactive]);

  const reset = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
    ref.current.style.setProperty('--px', '0px');
    ref.current.style.setProperty('--py', '0px');
    setPressed(false);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={`eye-logo ${className} ${pressed ? 'is-pressed' : ''} ${compact ? 'is-compact' : ''}`}
      aria-label={interactive ? 'IXA Links Hub öffnen' : 'IXA Agency'}
      onPointerMove={move}
      onPointerDown={(e) => { setPressed(true); move(e); }}
      onPointerUp={() => { reset(); onActivate?.(); }}
      onPointerCancel={reset}
      onPointerLeave={reset}
      disabled={!interactive}
    >
      <span className="eye-aura" aria-hidden="true" />
      <svg viewBox="0 0 1000 520" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`mint-face-${compact}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b9f4ee" />
            <stop offset=".46" stopColor="#64e0d5" />
            <stop offset="1" stopColor="#2d9f97" />
          </linearGradient>
          <filter id={`mint-glow-${compact}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g className="eye-depth" fill="#163c39" transform="translate(0 13)">
          <path d="M58 260C236 96 364 38 476 36v78c-94 4-193 47-310 146 117 99 216 142 310 146v78C364 482 236 424 58 260Z"/>
          <path d="M942 260C764 96 636 38 524 36v78c94 4 193 47 310 146-117 99-216 142-310 146v78C636 482 764 424 942 260Z"/>
        </g>
        <g className="eye-face" fill={`url(#mint-face-${compact})`} filter={`url(#mint-glow-${compact})`}>
          <path d="M58 250C236 86 364 28 476 26v78c-94 4-193 47-310 146 117 99 216 142 310 146v78C364 472 236 414 58 250Z"/>
          <path d="M942 250C764 86 636 28 524 26v78c94 4 193 47 310 146-117 99-216 142-310 146v78C636 472 764 414 942 250Z"/>
        </g>
        <circle className="eye-pupil-depth" cx="500" cy="265" r="72" fill="#17413d"/>
        <circle className="eye-pupil" cx="500" cy="250" r="72" fill={`url(#mint-face-${compact})`} filter={`url(#mint-glow-${compact})`}/>
      </svg>
    </button>
  );
}

function ParticleField({ phase }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let width = 0;
    let height = 0;
    const count = matchMedia('(max-width: 600px)').matches ? 58 : 95;
    const points = Array.from({ length: count }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      d: .3 + Math.random() * .75,
      s: .45 + Math.random() * 1.4,
      r: .6 + Math.random() * 1.4,
      seed: i * 1.73,
    }));
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth; height = innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const start = performance.now();
    const draw = (now) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      points.forEach((p) => {
        const gather = phase === 'forming' ? Math.max(.08, 1 - t / 2.4) : phase === 'hub' ? .78 : .24;
        const radius = Math.min(width, height) * p.d * gather;
        const angle = p.a + t * .12 * p.s;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height * .43 + Math.sin(angle) * radius * .68;
        const alpha = phase === 'hub' ? .16 : Math.min(.72, .22 + t * .15);
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,224,213,${alpha})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); addEventListener('resize', resize); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, [phase]);
  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}

function Splash({ onEnter, short }) {
  const [phase, setPhase] = useState('forming');
  useEffect(() => {
    const reveal = setTimeout(() => setPhase('ready'), short ? 350 : 2300);
    const enter = setTimeout(onEnter, short ? 950 : 5600);
    return () => { clearTimeout(reveal); clearTimeout(enter); };
  }, [onEnter, short]);
  return (
    <section className={`splash splash-${phase}`} aria-label="IXA Intro">
      <ParticleField phase={phase} />
      <div className="energy-ring" aria-hidden="true" />
      <div className="splash-logo-wrap">
        <EyeLogo interactive onActivate={onEnter} />
        <div className="splash-wordmark" aria-hidden="true">I<span>X</span>Λ</div>
        <p className="enter-hint">Berühren, um einzutreten</p>
      </div>
      <button className="skip" type="button" onClick={onEnter}>Überspringen</button>
    </section>
  );
}

function OrbitSculpture() {
  return <div className="social-phone" aria-hidden="true">
    <div className="social-float social-growth"><b>+24,6%</b><small>Follower</small></div>
    <div className="social-float social-views"><b>128K</b><small>Views</small></div>
    <div className="phone-shell">
      <div className="phone-island" />
      <div className="insta-head"><b>Instagram</b><span>♡</span></div>
      <div className="stories"><i/><i/><i/><i/></div>
      <div className="reel-preview">
        <div className="reel-label">REEL</div>
        <div className="play-mark">▶</div>
        <div className="reel-copy"><b>Build your brand.</b><small>@ixa_agency</small></div>
        <div className="reel-actions"><span>♥<small>2.8K</small></span><span>◯<small>184</small></span><span>↗<small>92</small></span></div>
      </div>
      <div className="insta-nav"><i/><i/><b>＋</b><i/><i/></div>
    </div>
  </div>;
}

function LeadsSculpture() {
  return <div className="leads-dashboard" aria-hidden="true">
    <div className="ads-float"><b>284</b><small>Conversions</small></div>
    <div className="ads-window">
      <div className="ads-head"><span>G</span><b>Google Ads</b><i/><i/><i/></div>
      <div className="ads-kpis">
        <span><small>Klicks</small><b>12.458</b><em>+23,6%</em></span>
        <span><small>Anfragen</small><b>284</b><em>+18,7%</em></span>
        <span><small>Kosten / Anfrage</small><b>24,31 €</b><em>−11,2%</em></span>
      </div>
      <div className="ads-chart">
        <div className="chart-title"><b>Performance</b><small>Letzte 30 Tage</small></div>
        <svg viewBox="0 0 320 112" preserveAspectRatio="none"><path className="chart-area" d="M0 97L35 87 69 91 104 70 139 77 176 49 211 58 248 30 282 40 320 10V112H0Z"/><path className="chart-line" d="M0 97L35 87 69 91 104 70 139 77 176 49 211 58 248 30 282 40 320 10"/></svg>
      </div>
      <div className="ads-detail">
        <div className="ads-donut"><i/><b>4,8×</b><small>ROAS</small></div>
        <div className="campaigns"><b>Top Kampagnen</b><span>Search <i style={{'--bar':'91%'}}/></span><span>Leads <i style={{'--bar':'73%'}}/></span><span>Remarketing <i style={{'--bar':'54%'}}/></span></div>
      </div>
    </div>
  </div>;
}

function Icon({ name }) {
  const paths = {
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>,
    whatsapp: <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 21l1.7-4.7a8.5 8.5 0 1 1 15.8-4.6Z"/><path d="M8 8c1 4 4 7 8 8l1.2-2.1-2.6-1.2-.9 1c-1.8-.8-3.2-2.2-4-4l1-.9L9.5 6.3 8 8Z"/></>,
    phone: <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 2a15.5 15.5 0 0 1-9.8-9.8L8 7 7 3Z"/>,
    email: <><rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    linkedin: <><path d="M7 9v10M7 5.5v.1M11 19v-6c0-2 1.2-3.5 3.2-3.5S18 10.8 18 13v6M3.5 9H7v10H3.5z"/><path d="M11 9h3v1.5"/></>,
    theme: <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function ServiceCard({ type, href }) {
  const isSoon = type === 'smm';
  const cardRef = useRef(null);
  const tilt = (event) => {
    const card = cardRef.current;
    if (!card || isSoon) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.setProperty('--card-rx', `${-y * 7}deg`);
    card.style.setProperty('--card-ry', `${x * 9}deg`);
    card.style.setProperty('--glow-x', `${(x + .5) * 100}%`);
    card.style.setProperty('--glow-y', `${(y + .5) * 100}%`);
  };
  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--card-rx', '0deg');
    cardRef.current.style.setProperty('--card-ry', '0deg');
  };
  const content = (
    <>
      <div className="card-copy">
        <h2><span className="mini-eye">◉</span> IXA <em>{isSoon ? 'SMM' : 'LEADS'}</em></h2>
        <h3>{isSoon ? <>Aus Aufmerksamkeit<br/>wird Nachfrage.</> : <>Aus Suche<br/>wird Anfrage.</>}</h3>
        <ul>{isSoon ? <><li>Social Media Management</li><li>Content Creation</li><li>Paid Social Ads</li></> : <><li>Google Ads</li><li>Landingpages</li><li>Tracking & Optimierung</li></>}</ul>
        <small>{isSoon ? 'Demnächst' : 'ixa-leads.de'}</small>
      </div>
      {isSoon ? <OrbitSculpture /> : <LeadsSculpture />}
      <span className={`service-cta ${isSoon ? 'disabled' : ''}`}>{isSoon ? 'Bald verfügbar' : 'Zu IXA Leads'} <b>→</b></span>
    </>
  );
  if (isSoon) return <article ref={cardRef} className="service-card soon-card" aria-disabled="true">{content}</article>;
  return <a ref={cardRef} className="service-card leads-card" href={href} target="_blank" rel="noopener noreferrer" onPointerMove={tilt} onPointerLeave={resetTilt}>{content}</a>;
}

function Hub({ theme, setTheme }) {
  return (
    <main className="hub">
      <ParticleField phase="hub" />
      <button className="hub-theme" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}>
        <Icon name="theme"/><span>{theme === 'dark' ? 'Hell' : 'Dunkel'}</span>
      </button>
      <header className="hub-hero">
        <EyeLogo compact />
        <h1>Sichtbar. Messbar. Wirksam.</h1>
        <p>Zwei starke Wege. Ein Ziel: <em>Wachstum für dein Unternehmen.</em></p>
      </header>
      <section className="cards" aria-label="IXA Angebote">
        <ServiceCard type="leads" href="https://ixa-leads.de" />
        <ServiceCard type="smm" />
      </section>
      <nav className="socials" aria-label="Kontakt und Einstellungen">
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin"/></a>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram"/></a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp"/></a>
        <a href="tel:+491629155408" aria-label="+49 162 9155408 anrufen"><Icon name="phone"/></a>
      </nav>
      <footer><Link href="/datenschutz">Datenschutz</Link><span>·</span><Link href="/impressum">Impressum</Link></footer>
    </main>
  );
}

function ThemeChooser({ onChoose }) {
  return <main className="theme-choice">
    <div className="choice-orbit" aria-hidden="true"><i/><i/><i/></div>
    <EyeLogo compact />
    <p>Willkommen bei IXA</p>
    <h1>Wähle deinen<br/>Fokus.</h1>
    <span>Du kannst die Darstellung später jederzeit oben wechseln.</span>
    <div className="theme-options">
      <button className="light-choice" type="button" onClick={() => onChoose('light')}><b>☀</b><strong>Hell</strong><small>Klar · Offen · Präzise</small></button>
      <button className="dark-choice" type="button" onClick={() => onChoose('dark')}><b>◐</b><strong>Dunkel</strong><small>Fokussiert · Ruhig · Premium</small></button>
    </div>
  </main>;
}

export default function Home() {
  const [stage, setStage] = useState('loading');
  const [shortSplash, setShortSplash] = useState(false);
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    setShortSplash(sessionStorage.getItem('ixa-intro-seen') === '1');
    const saved = localStorage.getItem('ixa-theme');
    if (saved) { setTheme(saved); setStage('splash'); }
    else setStage('choose');
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (stage === 'splash' || stage === 'hub') localStorage.setItem('ixa-theme', theme);
  }, [theme, stage]);
  const enter = useCallback(() => {
    sessionStorage.setItem('ixa-intro-seen', '1');
    setStage('hub');
  }, []);
  const chooseTheme = (value) => { setTheme(value); localStorage.setItem('ixa-theme', value); setStage('splash'); };
  return <div className={`app stage-${stage}`}>{stage === 'loading' ? null : stage === 'choose' ? <ThemeChooser onChoose={chooseTheme}/> : stage === 'splash' ? <Splash onEnter={enter} short={shortSplash}/> : <Hub theme={theme} setTheme={setTheme}/>}</div>;
}
