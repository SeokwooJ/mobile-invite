"use client";

import { useEffect, useRef } from "react";

type Flower = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  rot: number;
  vr: number;
  alpha: number;
};

export default function FallingFlowers({ count = 18 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flowersRef = useRef<Flower[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const spawn = (w: number, h: number): Flower => ({
      x: rand(0, w),
      y: rand(-h, 0),
      r: rand(2.5, 5.5),
      vy: rand(0.35, 1.2),
      vx: rand(-0.25, 0.25),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      alpha: rand(0.55, 0.95),
    });

    resize();

    const w = window.innerWidth;
    const h = window.innerHeight;

    flowersRef.current = Array.from({ length: count }, () => spawn(w, h));

    const drawFlower = (f: Flower) => {
      // 간단한 "작은 꽃" 모양 (5 petals)
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);

      ctx.globalAlpha = f.alpha;

      // petals
      for (let i = 0; i < 5; i++) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -f.r * 1.4, f.r * 0.75, f.r * 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 245, 190, 0.95)";
        ctx.fill();
      }

      // center
      ctx.beginPath();
      ctx.arc(0, 0, f.r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 230, 120, 0.95)";
      ctx.fill();

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < flowersRef.current.length; i++) {
        const f = flowersRef.current[i];
        f.x += f.vx;
        f.y += f.vy;
        f.rot += f.vr;

        // 약간의 좌우 흔들림
        f.x += Math.sin(f.y / 80 + i) * 0.12;

        drawFlower(f);

        // 화면 아래로 내려가면 위에서 다시 생성
        if (f.y > h + 20) {
          flowersRef.current[i] = spawn(w, h);
          flowersRef.current[i].y = -20;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
    />
  );
}
