import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function roundedRectPath(path, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.quadraticCurveTo(x + width, y, x + width, y + r);
  path.lineTo(x + width, y + height - r);
  path.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  path.lineTo(x + r, y + height);
  path.quadraticCurveTo(x, y + height, x, y + height - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
}

function roundedExtrude(width, height, radius, depth) {
  const shape = new THREE.Shape();
  roundedRectPath(shape, -width / 2, -height / 2, width, height, radius);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: Math.min(0.08, radius / 3),
    bevelThickness: 0.08,
    curveSegments: 18,
  });
  geometry.center();
  return geometry;
}

function podFrameGeometry() {
  const shape = new THREE.Shape();
  roundedRectPath(shape, -1.46, -2.1, 2.92, 4.2, 1.18);
  const hole = new THREE.Path();
  roundedRectPath(hole, -1.02, -1.64, 2.04, 3.28, 0.78);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 6,
    bevelSize: 0.11,
    bevelThickness: 0.1,
    curveSegments: 26,
  });
  geometry.center();
  return geometry;
}

export default function PodScene() {
  const canvasRef = useRef(null);
  const shellRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      setFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.1, 10.5);

    const scrollRig = new THREE.Group();
    const pointerRig = new THREE.Group();
    const pod = new THREE.Group();
    scrollRig.add(pointerRig);
    pointerRig.add(pod);
    scene.add(scrollRig);

    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x071424,
      metalness: 0.86,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const frame = new THREE.Mesh(podFrameGeometry(), frameMaterial);
    frame.rotation.x = 0.03;
    pod.add(frame);

    const markMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x20c9ff,
      emissive: 0x2612aa,
      emissiveIntensity: 0.55,
      metalness: 0.32,
      roughness: 0.12,
      clearcoat: 1,
    });

    const stem = new THREE.Mesh(roundedExtrude(0.52, 2.02, 0.2, 0.34), markMaterial);
    stem.position.set(-0.36, -0.12, 0.46);
    pod.add(stem);

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.83, 0.83, 0.34, 64), markMaterial);
    bowl.rotation.x = Math.PI / 2;
    bowl.scale.set(1, 0.74, 1);
    bowl.position.set(0.15, 0.57, 0.47);
    pod.add(bowl);

    const dot = new THREE.Mesh(roundedExtrude(0.34, 0.31, 0.11, 0.28), markMaterial);
    dot.position.set(0, -1.4, 0.47);
    pod.add(dot);

    const echoMaterial = new THREE.MeshBasicMaterial({
      color: 0x765cff,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const echo = new THREE.Mesh(podFrameGeometry(), echoMaterial);
    echo.scale.setScalar(1.16);
    echo.position.z = -0.45;
    pod.add(echo);

    scene.add(new THREE.HemisphereLight(0xe8f9ff, 0x2b105f, 2.25));
    const keyLight = new THREE.DirectionalLight(0xffffff, 6.4);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);
    const cyanLight = new THREE.PointLight(0x00ccff, 42, 18, 2);
    cyanLight.position.set(-4, -1, 4);
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x7a2cff, 58, 20, 2);
    violetLight.position.set(4, 2, 3);
    scene.add(violetLight);

    const particleCount = reduceMotion ? 70 : 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.4 + Math.random() * 4.5;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = -2 + Math.sin(angle) * radius * 0.45 + Math.random() * 2;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x725cff,
      size: 0.026,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    const handlePointer = (event) => {
      const bounds = shell.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.55;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.38;
    };
    const resetPointer = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      shell.addEventListener('pointermove', handlePointer, { passive: true });
      shell.addEventListener('pointerleave', resetPointer);
    }

    const resize = () => {
      const { width, height } = shell.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      pod.scale.setScalar(width < 520 ? 0.72 : Math.min(1.02, width / 600));
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(shell);
    resize();

    let inView = true;
    let pageVisible = !document.hidden;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) render();
    }, { rootMargin: '120px' });
    intersectionObserver.observe(shell);

    const visibilityHandler = () => {
      pageVisible = !document.hidden;
      if (pageVisible) render();
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    const lostHandler = (event) => {
      event.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener('webglcontextlost', lostHandler);

    let frameId = 0;
    const clock = new THREE.Clock();
    const render = () => {
      if (!inView || !pageVisible) {
        frameId = 0;
        return;
      }
      const elapsed = clock.getElapsedTime();
      if (!reduceMotion) {
        pointerRig.rotation.y += (pointer.x - pointerRig.rotation.y) * 0.045;
        pointerRig.rotation.x += (-pointer.y - pointerRig.rotation.x) * 0.045;
        pod.position.y = Math.sin(elapsed * 0.72) * 0.12;
        pod.rotation.z = Math.sin(elapsed * 0.42) * 0.035;
        particles.rotation.y = elapsed * 0.018;
        particles.rotation.x = Math.sin(elapsed * 0.16) * 0.08;
      }
      renderer.render(scene, camera);
      if (!reduceMotion) frameId = requestAnimationFrame(render);
    };

    let intro;
    if (reduceMotion) {
      pod.scale.setScalar(1);
    } else {
      intro = gsap.fromTo(
        pod.scale,
        { x: 0.58, y: 0.58, z: 0.58 },
        { x: 1, y: 1, z: 1, duration: 1.6, ease: 'expo.out', delay: 0.15 },
      );
    }

    let scrollTween;
    if (!reduceMotion) {
      scrollTween = gsap.to(scrollRig.rotation, {
        y: Math.PI * 1.35,
        x: -0.28,
        ease: 'none',
        scrollTrigger: {
          trigger: shell.closest('.hero'),
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }

    render();

    return () => {
      intro?.kill();
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', visibilityHandler);
      shell.removeEventListener('pointermove', handlePointer);
      shell.removeEventListener('pointerleave', resetPointer);
      canvas.removeEventListener('webglcontextlost', lostHandler);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose?.();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`scene-shell ${failed ? 'scene-failed' : ''}`} ref={shellRef}>
      <div className="scene-meta scene-meta-top" aria-hidden="true">
        <span>ЖИВОЙ ОБЪЕКТ</span>
        <span>01 / 05</span>
      </div>
      <div className="scene-orbit scene-orbit-one" aria-hidden="true" />
      <div className="scene-orbit scene-orbit-two" aria-hidden="true" />
      <div className="pod-poster" aria-hidden={!failed}>
        <img src="/pixipod-logo.jpg" alt={failed ? 'Логотип PixiPod' : ''} />
      </div>
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="scene-meta scene-meta-bottom" aria-hidden="true">
        <span>PIXIPOD / DIGITAL STUDIO</span>
        <span>ДВИГАЙТЕ КУРСОР</span>
      </div>
    </div>
  );
}
