'use client';

import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

function createParticle(width, height, index) {
  const depth = 0.35 + Math.random() * 0.65;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.45 + depth * 1.05,
    speed: 4 + depth * 9,
    drift: (Math.random() - 0.5) * (4 + depth * 5),
    phase: Math.random() * TAU,
    pulse: 0.18 + Math.random() * 0.34,
    depth,
    accent: index % 7 === 0,
  };
}

export default function LiveParticleField({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5);
    const frameInterval = coarsePointer ? 50 : 34;
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let frameTimer = 0;
    let resizeTimer = 0;
    let lastTime = performance.now();
    let visible = document.visibilityState === 'visible';

    const colors = theme === 'dark'
      ? { soft: '185,244,238', mint: '100,224,213' }
      : { soft: '27,30,30', mint: '45,188,176' };

    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const targetCount = coarsePointer
        ? Math.max(14, Math.min(22, Math.round((width * height) / 16500)))
        : Math.max(26, Math.min(42, Math.round((width * height) / 24000)));
      particles = Array.from({ length: targetCount }, (_, index) => createParticle(width, height, index));
    };

    const paint = (time, move) => {
      context.clearRect(0, 0, width, height);
      const delta = Math.min(0.04, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;

      particles.forEach((particle) => {
        if (move) {
          particle.y -= particle.speed * delta;
          particle.x += Math.sin(time * 0.00028 + particle.phase) * particle.drift * delta;
          if (particle.y < -12) {
            particle.y = height + 12;
            particle.x = Math.random() * width;
          }
          if (particle.x < -12) particle.x = width + 12;
          if (particle.x > width + 12) particle.x = -12;
        }

        const shimmer = reducedMotion ? 0.56 : 0.5 + Math.sin(time * 0.0007 + particle.phase) * particle.pulse;
        const baseAlpha = theme === 'dark' ? 0.1 + particle.depth * 0.24 : 0.045 + particle.depth * 0.11;
        const alpha = Math.max(0.025, baseAlpha * shimmer);

        if (particle.accent) {
          const halo = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 5.5);
          halo.addColorStop(0, `rgba(${colors.mint},${alpha * 0.72})`);
          halo.addColorStop(1, `rgba(${colors.mint},0)`);
          context.fillStyle = halo;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius * 5.5, 0, TAU);
          context.fill();
        }

        context.fillStyle = `rgba(${particle.accent ? colors.mint : colors.soft},${alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, TAU);
        context.fill();
      });
    };

    const render = (time) => {
      frame = 0;
      if (!visible) {
        return;
      }
      paint(time, true);
      frameTimer = window.setTimeout(() => {
        frameTimer = 0;
        if (visible) frame = window.requestAnimationFrame(render);
      }, frameInterval);
    };

    const start = () => {
      if (!frame && !frameTimer && visible && !reducedMotion) {
        lastTime = performance.now();
        frame = window.requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible) start();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      if (!visible && frameTimer) {
        window.clearTimeout(frameTimer);
        frameTimer = 0;
      }
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reducedMotion) paint(performance.now(), false);
      }, 120);
    };

    resize();
    if (reducedMotion) paint(performance.now(), false);
    else start();
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(frameTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="ambient-particles" aria-hidden="true" />;
}
