import { useEffect, useRef } from 'react';

export default function LiquidReveal() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduceMotion || !finePointer) return undefined;

    const ctx = canvas.getContext('2d');
    const cover = document.createElement('canvas');
    const coverCtx = cover.getContext('2d');
    const brush = document.createElement('canvas');
    const brushCtx = brush.getContext('2d');
    const revealImage = new Image();
    revealImage.src = '/hero/robot-reveal.png';

    const points = [];
    const BRUSH_RADIUS = 143;
    const DECAY = 0.016;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let radius = BRUSH_RADIUS * dpr;
    let last = null;
    let frameId = 0;
    let ready = false;

    const buildCover = () => {
      if (!revealImage.naturalWidth || !canvas.width || !canvas.height) return;
      cover.width = canvas.width;
      cover.height = canvas.height;
      const scale = Math.max(canvas.width / revealImage.naturalWidth, canvas.height / revealImage.naturalHeight);
      const width = revealImage.naturalWidth * scale;
      const height = revealImage.naturalHeight * scale;
      coverCtx.clearRect(0, 0, cover.width, cover.height);
      coverCtx.drawImage(revealImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      ready = true;
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      radius = BRUSH_RADIUS * dpr;
      const diameter = Math.ceil(radius * 2);
      brush.width = diameter;
      brush.height = diameter;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      buildCover();
    };

    const stamp = (x, y) => {
      const size = brush.width;
      const center = size / 2;
      brushCtx.clearRect(0, 0, size, size);
      brushCtx.globalCompositeOperation = 'source-over';
      const gradient = brushCtx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.55, 'rgba(255,255,255,.82)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      brushCtx.fillStyle = gradient;
      brushCtx.fillRect(0, 0, size, size);
      brushCtx.globalCompositeOperation = 'source-in';
      brushCtx.drawImage(cover, center - x, center - y);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(brush, x - center, y - center);
    };

    const tick = () => {
      frameId = 0;
      const drawing = points.length > 0;
      if (!drawing) return;
      if (!ready) {
        points.length = 0;
        return;
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${DECAY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      points.splice(0).forEach(({ x, y }) => stamp(x, y));
      frameId = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(tick);
    };

    const handlePointer = (event) => {
      const rect = wrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) * dpr;
      const y = (event.clientY - rect.top) * dpr;
      if (x < -radius || y < -radius || x > canvas.width + radius || y > canvas.height + radius) {
        last = null;
        return;
      }
      if (!last) points.push({ x, y });
      else {
        const dx = x - last.x;
        const dy = y - last.y;
        const distance = Math.hypot(dx, dy);
        const step = Math.max(radius * 0.3, 1);
        const count = Math.min(Math.ceil(distance / step), 60);
        for (let index = 1; index <= Math.max(count, 1); index += 1) {
          const progress = index / Math.max(count, 1);
          points.push({ x: last.x + dx * progress, y: last.y + dy * progress });
        }
      }
      last = { x, y };
      schedule();
    };

    const reset = () => { last = null; };
    const pauseWhenHidden = () => {
      if (document.hidden) {
        points.length = 0;
        last = null;
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    revealImage.addEventListener('load', buildCover);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', pauseWhenHidden);
    resize();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      revealImage.removeEventListener('load', buildCover);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('blur', reset);
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);

  return (
    <div className="liquid-reveal" ref={wrapRef}>
      <img src="/hero/robot-base.png" alt="Футуристичный робот PixiPod" fetchPriority="high" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
