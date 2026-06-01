import React from 'react';
import { motion } from 'framer-motion';
import './RadarChart.css';

const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp',
  'special-defense': 'Def. Esp',
  speed: 'Velocidad',
};

const MAX_VAL = 200; // Valor máximo de referencia para normalizar en la gráfica

export default function RadarChart({ stats }) {
  // Asegurar que las estadísticas estén ordenadas para mantener la forma del hexágono
  const orderedStats = [
    stats.find((s) => s.stat.name === 'hp'),
    stats.find((s) => s.stat.name === 'attack'),
    stats.find((s) => s.stat.name === 'defense'),
    stats.find((s) => s.stat.name === 'speed'),
    stats.find((s) => s.stat.name === 'special-defense'),
    stats.find((s) => s.stat.name === 'special-attack'),
  ].filter(Boolean);

  const numAxes = orderedStats.length;
  const radius = 70; // Reducido de 90 a 70
  const centerX = 135; // Centro horizontal
  const centerY = 120; // Centro vertical

  // Obtiene las coordenadas cartesianas de un punto dado su índice y valor
  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2; // Iniciar en el eje superior (-90 grados)
    const factor = Math.min(value / MAX_VAL, 1);
    const x = centerX + radius * factor * Math.cos(angle);
    const y = centerY + radius * factor * Math.sin(angle);
    return { x, y };
  };

  // Coordenadas de los 4 hexágonos concéntricos de referencia (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1].map((level) => {
    const points = Array.from({ length: numAxes }).map((_, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const x = centerX + radius * level * Math.cos(angle);
      const y = centerY + radius * level * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  });

  // Coordenadas finales de los valores del Pokémon
  const polygonPoints = orderedStats.map((stat, i) => {
    const { x, y } = getCoordinates(i, stat.base_stat);
    return `${x},${y}`;
  }).join(' ');

  // Coordenadas de inicio para la animación (todos los valores a cero en el centro)
  const initialPoints = Array.from({ length: numAxes })
    .map(() => `${centerX},${centerY}`)
    .join(' ');

  return (
    <div className="radar-chart-wrapper">
      <svg viewBox="0 0 270 240" className="radar-svg">
        {/* Líneas de cuadrícula hexagonales */}
        {gridLevels.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            className="radar-grid-line"
            fill="none"
          />
        ))}

        {/* Ejes radiales (del centro a las esquinas) */}
        {Array.from({ length: numAxes }).map((_, i) => {
          const outerPoint = getCoordinates(i, MAX_VAL);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={outerPoint.x}
              y2={outerPoint.y}
              className="radar-axis"
            />
          );
        })}

        {/* Área de Estadísticas Animada */}
        <motion.polygon
          points={polygonPoints}
          initial={{ points: initialPoints }}
          animate={{ points: polygonPoints }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
          className="radar-polygon"
        />

        {/* Puntos en los vértices */}
        {orderedStats.map((stat, i) => {
          const pt = getCoordinates(i, stat.base_stat);
          return (
            <motion.circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              className="radar-vertex"
              initial={{ cx: centerX, cy: centerY }}
              animate={{ cx: pt.x, cy: pt.y }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
            />
          );
        })}

        {/* Etiquetas de las estadísticas */}
        {orderedStats.map((stat, i) => {
          const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
          // Colocar el texto ligeramente por fuera del círculo de rango completo
          const labelDist = radius + 15;
          const x = centerX + labelDist * Math.cos(angle);
          const y = centerY + labelDist * Math.sin(angle);

          // Ajustes estéticos de alineación de texto
          let textAnchor = 'middle';
          if (Math.cos(angle) > 0.1) textAnchor = 'start';
          if (Math.cos(angle) < -0.1) textAnchor = 'end';

          return (
            <text
              key={i}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              className="radar-label"
            >
              {STAT_LABELS[stat.stat.name]} ({stat.base_stat})
            </text>
          );
        })}
      </svg>
    </div>
  );
}
