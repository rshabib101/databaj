'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function TechBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    
    // Higher density of interactive particles
    const particleCount = Math.min(Math.floor((width * height) / 12000), 70);
    
    // Mouse tracking with generous reach
    const mouse = {
      x: null,
      y: null,
      radius: 170,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const particles = [];
    const colors = isDark
      ? ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'] // Glowing Emerald, Cyan, Electric Blue, Violet
      : ['#059669', '#0284c7', '#4f46e5', '#0d9488', '#059669']; // Rich Emerald, Azure, Indigo, Teal

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 2; // Noticeable visible size
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.9;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.4 + 0.5; // High visibility
        this.pulse = Math.random() * 0.03 + 0.01;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = isDark ? this.alpha : this.alpha * 0.85;
        ctx.shadowBlur = isDark ? 14 : 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around viewport edges seamlessly
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Cursor attraction & gentle repulsion effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            // Gentle magnetic drift towards cursor
            this.x += forceDirectionX * force * 1.8;
            this.y += forceDirectionY * force * 1.8;
          }
        }

        // Pulse alpha for living neon breathing effect
        this.alpha += this.pulse;
        if (this.alpha > 0.95 || this.alpha < 0.4) {
          this.pulse = -this.pulse;
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectLines = () => {
      const maxDistance = 145;

      // 1. Inter-particle connections
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacityValue = (1 - dist / maxDistance) * (isDark ? 0.38 : 0.28);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = particles[a].color;
            ctx.globalAlpha = opacityValue;
            ctx.lineWidth = isDark ? 1.1 : 1.3;
            ctx.stroke();
            ctx.restore();
          }
        }

        // 2. Interactive line connecting directly to cursor!
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particles[a].x;
          const dy = mouse.y - particles[a].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const cursorOpacity = (1 - dist / mouse.radius) * (isDark ? 0.65 : 0.5);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark ? '#06b6d4' : '#0284c7';
            ctx.globalAlpha = cursorOpacity;
            ctx.lineWidth = 1.4;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#06b6d4';
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect lines and render particles
      connectLines();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme, mounted]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
    >
      {/* Dynamic Cyber Tech Grid (rendered behind canvas) */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 dark:opacity-20 [html.light_&]:opacity-35 pointer-events-none" />

      {/* Ambient Moving Radial Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 [html.light_&]:bg-emerald-400/20 blur-[130px] animate-pulse-glow pointer-events-none" />
      <div className="absolute top-1/3 -right-28 w-[38rem] h-[38rem] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 [html.light_&]:bg-blue-400/20 blur-[140px] animate-pulse-glow delay-1000 pointer-events-none" />
      <div className="absolute -bottom-28 left-1/4 w-[40rem] h-[40rem] rounded-full bg-purple-500/10 dark:bg-purple-500/15 [html.light_&]:bg-indigo-300/20 blur-[140px] animate-pulse-glow delay-700 pointer-events-none" />

      {/* Floating Cyber Badges / Data Packets */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <div className="absolute top-[16%] left-[4%] animate-float-slow text-[11px] font-mono font-bold px-3 py-1.5 rounded-full border border-emerald-500/40 bg-zinc-950/80 [html.light_&]:bg-white/90 text-emerald-400 [html.light_&]:text-emerald-700 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-radar-ping" />
          <span>&lt;CAPI :: 10/10 LIVE&gt;</span>
        </div>
        <div className="absolute top-[26%] right-[5%] animate-float-delayed text-[11px] font-mono font-bold px-3 py-1.5 rounded-full border border-cyan-500/40 bg-zinc-950/80 [html.light_&]:bg-white/90 text-cyan-400 [html.light_&]:text-cyan-700 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>// ROAS 4.8X SCALE</span>
        </div>
        <div className="absolute top-[58%] left-[3%] animate-float-reverse text-[11px] font-mono font-bold px-3 py-1.5 rounded-full border border-purple-500/40 bg-zinc-950/80 [html.light_&]:bg-white/90 text-purple-400 [html.light_&]:text-purple-700 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.25)]">
          ☁ GTM SERVER CLUSTER
        </div>
        <div className="absolute top-[75%] right-[4%] animate-float-slow text-[11px] font-mono font-bold px-3 py-1.5 rounded-full border border-amber-500/40 bg-zinc-950/80 [html.light_&]:bg-white/90 text-amber-400 [html.light_&]:text-amber-700 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          ⚡ NEXT.JS 16 CORE ENGINE
        </div>
      </div>

      {/* Living Interactive Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />
    </div>
  );
}
