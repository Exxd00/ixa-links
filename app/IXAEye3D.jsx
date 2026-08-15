'use client';

import { useEffect, useRef, useState } from 'react';

const MODEL_URL = '/models/ixa-eye.glb';

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export default function IXAEye3D({ active = false, theme = 'light', onBurst }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const activeRef = useRef(active);
  const themeRef = useRef(theme);
  const onBurstRef = useRef(onBurst);
  const [ready, setReady] = useState(false);
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    activeRef.current = active;
    apiRef.current?.requestRender?.();
  }, [active]);

  useEffect(() => {
    themeRef.current = theme;
    apiRef.current?.requestRender?.();
  }, [theme]);

  useEffect(() => {
    onBurstRef.current = onBurst;
  }, [onBurst]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;

    let disposed = false;
    let frame = 0;
    let visible = true;
    let resizeObserver;
    let intersectionObserver;
    let visibilityHandler;
    let pointerMoveHandler;
    let pointerLeaveHandler;
    const cleanupTasks = [];

    const setup = async () => {
      const [THREE, loaderModule] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
      ]);
      if (disposed) return;

      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0, 11.8);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: coarsePointer ? 'low-power' : 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      scene.add(new THREE.HemisphereLight(0xd9fffb, 0x050606, 2.7));
      const key = new THREE.DirectionalLight(0xb9f4ee, 4.2);
      key.position.set(-3.5, 4.5, 7);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x64e0d5, 3.2);
      rim.position.set(4.5, -2.5, 5);
      scene.add(rim);
      const coreGlow = new THREE.PointLight(0x64e0d5, 7.5, 7, 2);
      coreGlow.position.set(0, 0, 2.2);
      scene.add(coreGlow);

      const root = new THREE.Group();
      root.rotation.x = -0.035;
      scene.add(root);

      const pointerTarget = new THREE.Vector2(0, 0);
      const pointerCurrent = new THREE.Vector2(0, 0);
      const animationStart = performance.now();
      const loader = new loaderModule.GLTFLoader();
      const pieces = [];
      let model;
      let burstStart = -1;
      let appliedTheme = '';
      let renderedWidth = 0;
      let renderedHeight = 0;
      let lastRenderTime = 0;

      const resize = () => {
        const rect = stage.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        if (width === renderedWidth && height === renderedHeight) return;
        renderedWidth = width;
        renderedHeight = height;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const collectPieces = (loadedScene) => {
        const namedParts = loadedScene.children.filter((child) => /^(Wing_|Iris_|Pupil_)/.test(child.name));
        const targets = namedParts.length ? namedParts : loadedScene.children;
        targets.forEach((part, index) => {
          const basePosition = part.position.clone();
          const baseRotation = part.rotation.clone();
          const name = part.name || `Part_${index}`;
          let direction;
          if (name.includes('Wing_Left')) direction = new THREE.Vector3(-2.4, 0.45, 1.15);
          else if (name.includes('Wing_Right')) direction = new THREE.Vector3(2.4, -0.35, 1.15);
          else if (name.includes('Pupil_Core')) direction = new THREE.Vector3(0, 0.2, 2.25);
          else if (name.includes('Pupil_Frame')) direction = new THREE.Vector3(0, -0.25, -0.8);
          else {
            const segment = Math.max(0, Number(name.match(/(\d+)$/)?.[1] || index) - 1);
            const angle = Math.PI / 6 + segment * Math.PI / 3;
            direction = new THREE.Vector3(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0.75 + (segment % 2) * 0.35);
          }
          pieces.push({
            part,
            basePosition,
            baseRotation,
            direction,
            pupil: name.includes('Pupil_'),
            spin: new THREE.Vector3((index % 3 - 1) * 0.7, ((index + 1) % 3 - 1) * 0.65, (index % 2 ? 1 : -1) * 0.8),
          });
        });
      };

      const applyTheme = () => {
        if (!model || appliedTheme === themeRef.current) return;
        appliedTheme = themeRef.current;
        model.traverse((child) => {
          if (!child.isMesh) return;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (!material) return;
            if (/Graphite Edge/i.test(material.name)) {
              if (appliedTheme === 'light') {
                material.color.set(0x64e0d5);
                material.metalness = 0.34;
                material.roughness = 0.3;
                material.emissive?.set(0x2dbcb0);
                material.emissiveIntensity = 0.16;
              } else {
                material.color.set(0x07110f);
                material.metalness = 0.82;
                material.roughness = 0.19;
                material.emissive?.set(0x000000);
                material.emissiveIntensity = 0;
              }
              material.needsUpdate = true;
            }
          });
        });
      };

      loader.load(MODEL_URL, (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        model.scale.setScalar(0.93);
        // Blender exports its Z-up scene into glTF's Y-up coordinates. Rotate the
        // logo back onto the screen plane so its modeled depth faces the camera.
        model.rotation.x = Math.PI / 2;
        model.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow = false;
          child.receiveShadow = false;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (!material) return;
            material.envMapIntensity = 1.1;
            if (/Core Light/i.test(material.name)) material.emissiveIntensity = 2.6;
            else if (/Mint/i.test(material.name)) material.emissiveIntensity = 0.55;
          });
        });
        root.add(model);
        collectPieces(model);
        applyTheme();
        setReady(true);
        startRendering();
      }, undefined, () => {
        if (!disposed) setReady(false);
      });

      const startBurst = () => {
        if (!model || reducedMotion || burstStart >= 0) return;
        burstStart = performance.now();
        onBurstRef.current?.(stage.getBoundingClientRect());
        setBursting(true);
        startRendering();
      };

      apiRef.current = { burst: startBurst, requestRender: () => startRendering() };

      if (!coarsePointer) {
        pointerMoveHandler = (event) => {
          const rect = stage.getBoundingClientRect();
          pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        pointerLeaveHandler = () => pointerTarget.set(0, 0);
        stage.addEventListener('pointermove', pointerMoveHandler, { passive: true });
        stage.addEventListener('pointerleave', pointerLeaveHandler, { passive: true });
        cleanupTasks.push(() => stage.removeEventListener('pointermove', pointerMoveHandler));
        cleanupTasks.push(() => stage.removeEventListener('pointerleave', pointerLeaveHandler));
      }

      const applyBurst = (now) => {
        if (burstStart < 0) return;
        const elapsed = (now - burstStart) / 1000;
        if (elapsed >= 2.35) {
          burstStart = -1;
          setBursting(false);
        }
        pieces.forEach(({ part, basePosition, baseRotation, direction, spin, pupil }) => {
          let amount;
          if (elapsed < 0.28) amount = easeOutCubic(elapsed / 0.28);
          else if (pupil && elapsed < 1.7) amount = 1;
          else if (pupil && elapsed < 2.35) amount = 1 - easeInOutCubic((elapsed - 1.7) / 0.65);
          else if (!pupil && elapsed < 0.42) amount = 1;
          else if (!pupil && elapsed < 1.02) amount = 1 - easeInOutCubic((elapsed - 0.42) / 0.6);
          else amount = 0;
          if (pupil) part.visible = elapsed < 0.34 || elapsed > 2.23;
          part.position.copy(basePosition).addScaledVector(direction, amount);
          part.rotation.set(
            baseRotation.x + spin.x * amount,
            baseRotation.y + spin.y * amount,
            baseRotation.z + spin.z * amount,
          );
        });
      };

      const render = (now) => {
        frame = 0;
        if (disposed || !visible) {
          return;
        }
        const burstingNow = burstStart >= 0;
        const continuous = burstingNow || (!coarsePointer && !reducedMotion);
        const frameInterval = burstingNow ? (coarsePointer ? 25 : 20) : 34;
        if (continuous && lastRenderTime && now - lastRenderTime < frameInterval) {
          frame = window.requestAnimationFrame(render);
          return;
        }
        lastRenderTime = now;
        const elapsed = (now - animationStart) / 1000;
        applyTheme();
        pointerCurrent.lerp(pointerTarget, 0.075);
        if (!coarsePointer && !reducedMotion) {
          root.rotation.y = pointerCurrent.x * 0.19;
          root.rotation.x = -0.035 - pointerCurrent.y * 0.13;
        }
        const focus = activeRef.current ? 1 : 0;
        coreGlow.intensity = 7.2 + focus * 1.25 + (reducedMotion ? 0 : Math.sin(elapsed * 1.65) * (coarsePointer ? 0.4 : 0.22));
        if (model && !reducedMotion && !coarsePointer) {
          model.position.z = Math.sin(elapsed * 1.05) * 0.025;
        } else if (model) {
          model.position.z = 0;
        }
        applyBurst(now);
        renderer.render(scene, camera);
        if (burstStart >= 0 || (!coarsePointer && !reducedMotion)) {
          frame = window.requestAnimationFrame(render);
        }
      };

      const startRendering = () => {
        if (!frame && visible && !disposed) frame = window.requestAnimationFrame(render);
      };

      resizeObserver = new ResizeObserver(() => {
        resize();
        startRendering();
      });
      resizeObserver.observe(stage);
      resize();

      intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && document.visibilityState === 'visible';
        if (visible) startRendering();
        else if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      }, { threshold: 0.05 });
      intersectionObserver.observe(stage);

      visibilityHandler = () => {
        visible = document.visibilityState === 'visible' && stage.getBoundingClientRect().bottom > 0;
        if (visible) startRendering();
        else if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      startRendering();

      cleanupTasks.push(() => {
        if (frame) window.cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        document.removeEventListener('visibilitychange', visibilityHandler);
        model?.traverse((child) => {
          if (!child.isMesh) return;
          child.geometry?.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material?.dispose());
        });
        renderer.dispose();
      });
    };

    setup().catch(() => {
      if (!disposed) setReady(false);
    });
    return () => {
      disposed = true;
      apiRef.current = null;
      cleanupTasks.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <button
      ref={stageRef}
      className={`eye3d-stage${ready ? ' is-ready' : ''}${bursting ? ' is-bursting' : ''}`}
      type="button"
      onClick={() => apiRef.current?.burst()}
      aria-label="IXA 3D Logo – zum Auflösen berühren"
    >
      <canvas ref={canvasRef} className="eye3d-canvas" aria-hidden="true" />
      <svg className="eye3d-fallback" viewBox="0 0 1000 520" aria-hidden="true">
        <path d="M58 250C236 86 364 28 476 26v60c-88 4-162 58-231 164 69 106 143 160 231 164v60C364 472 236 414 58 250Z" />
        <path d="M942 250C764 86 636 28 524 26v60c88 4 162 58 231 164-69 106-143 160-231 164v60C636 472 764 414 942 250Z" />
        <polygon points="500,178 562,214 562,286 500,322 438,286 438,214" />
      </svg>
    </button>
  );
}
