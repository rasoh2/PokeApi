import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@gravity-ui/uikit';
import './CryPlayer.css';

export default function CryPlayer({ cries, pokemonName }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  // Obtener la URL de sonido disponible (latest o legacy)
  const cryUrl = cries?.latest || cries?.legacy;

  const playCry = () => {
    if (!audioRef.current || !cryUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Error al reproducir el sonido:', err));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Dibujar onda de audio animada cuando esté sonando
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    let bars = 16;
    let barWidth = 4;
    let gap = 3;
    let heights = Array(bars).fill(2); // Tamaños iniciales de las barras

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Calcular centro horizontal para centrar el visualizador
      const totalWidth = bars * barWidth + (bars - 1) * gap;
      const startX = (width - totalWidth) / 2;

      for (let i = 0; i < bars; i++) {
        // Si se está reproduciendo, oscilar alturas de forma aleatoria/armónica, si no, mantener bajas
        if (isPlaying) {
          // Simular onda de audio con ruido sinusoidal y aleatorio
          const time = Date.now() * 0.015;
          const targetHeight = Math.abs(Math.sin(time + i * 0.5)) * (height - 6) + 4;
          // Interpolación suave (lerp)
          heights[i] += (targetHeight - heights[i]) * 0.3;
        } else {
          // Volver a estado pasivo
          heights[i] += (3 - heights[i]) * 0.15;
        }

        const x = startX + i * (barWidth + gap);
        const y = (height - heights[i]) / 2;

        // Crear gradiente vertical para las barritas
        const grad = ctx.createLinearGradient(0, y, 0, y + heights[i]);
        grad.addColorStop(0, '#ff5252');
        grad.addColorStop(1, '#ffc107');

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Dibujar barras redondeadas
        ctx.roundRect(x, y, barWidth, heights[i], 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  if (!cryUrl) return null;

  return (
    <div className="cry-player-card glass-card">
      <audio 
        ref={audioRef} 
        src={cryUrl} 
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="cry-content">
        <Button 
          view="action" 
          size="l" 
          onClick={playCry} 
          className="cry-btn"
        >
          {isPlaying ? '🔊 Detener Grito' : '🔊 Escuchar Grito'}
        </Button>

        <div className="visualizer-container">
          <canvas 
            ref={canvasRef} 
            width={160} 
            height={40} 
            className="visualizer-canvas"
          />
        </div>
      </div>
    </div>
  );
}
