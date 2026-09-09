import React, { useEffect, useRef } from 'react';
import './ElementalParticles.css';

export default function ElementalParticles({ type = 'normal', active = false, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    let particles = [];
    const particleCount = type === 'fire' || type === 'electric' ? 40 : 30;

    const colors = {
      fire: ['#FF4500', '#FFA500', '#FFD700', '#FF0000'],
      water: ['#00BFFF', '#1E90FF', '#00FFFF', '#E0FFFF'],
      electric: ['#FFFF00', '#FFEE00', '#FFFFFF', '#FFD700'],
      grass: ['#32CD32', '#00FF00', '#228B22', '#ADFF2F'],
      poison: ['#9400D3', '#8A2BE2', '#BA55D3', '#DA70D6'],
      normal: ['#FFFFFF', '#D3D3D3', '#FFA500', '#CCCCCC']
    };

    const typeColors = colors[type] || colors.normal;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height / 2 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * (type === 'electric' ? 12 : 6),
        vy: (Math.random() - 0.5) * (type === 'electric' ? 12 : 6) - (type === 'fire' ? 3 : 0),
        size: Math.random() * 8 + 3,
        color: typeColors[Math.floor(Math.random() * typeColors.length)],
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        if (p.life > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
        }
      });

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [active, type, onComplete]);

  if (!active) return null;

  return (
    <div className={`particle-overlay particle-type-${type}`}>
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
}
