import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './PokemonCard.css';

// Mapeo de íconos de tipo
const typeIcons = {
  normal: '⭐',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '⛰️',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨'
};

export default function PokemonCard({ pokemon, onClick }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Coordenadas del ratón para el efecto Parallax 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Valores interpolados elásticos
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 250, damping: 25 });

  // Coordenadas del gradiente de reflejo/brillo
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalizamos la posición entre -0.5 y 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const pokemonId = pokemon.id || pokemon.url?.split('/').filter(Boolean).pop() || '1';
  const hasTypes = !!pokemon.types;
  const primaryType = hasTypes ? pokemon.types[0].type.name : 'default';
  const secondaryType = hasTypes ? pokemon.types[1]?.type?.name : null;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(pokemon.name)}
      layoutId={`pokemon-card-container-${pokemon.name}`}
      className={`pokemon-card-3d-wrapper type-${primaryType}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`pokemon-gravity-card type-${primaryType}`}>
        {/* Capa Holográfica Brillante */}
        {hovered && (
          <motion.div
            className="card-glow"
            style={{
              background: `radial-gradient(circle 130px at ${glowX} ${glowY}, rgba(255, 255, 255, 0.18), transparent)`,
            }}
          />
        )}

        <div className="card-inner" style={{ transform: 'translateZ(25px)' }}>
          {/* Número de fondo para dar profundidad */}
          <span className="pokemon-bg-number">
            #{String(pokemonId).padStart(3, '0')}
          </span>

          <motion.div 
            className="pokemon-artwork-container"
            style={{ transform: 'translateZ(50px)' }}
          >
            <motion.img
              src={imageUrl}
              alt={pokemon.name}
              className="pokemon-artwork"
              layoutId={`pokemon-img-${pokemon.name}`}
              loading="lazy" // Optimización nativa de lazy loading para carga masiva
              onError={(e) => {
                // Fallback a sprite frontal si no hay artwork oficial
                e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
              }}
            />
          </motion.div>

          <div className="pokemon-info" style={{ transform: 'translateZ(35px)' }}>
            <h3 className="pokemon-name-title">
              {pokemon.name}
            </h3>
            {hasTypes && (
              <div className="type-badge-container">
                <span className={`type-badge-pill type-${primaryType}`}>
                  {typeIcons[primaryType] || '⭐'} {primaryType}
                </span>
                {secondaryType && (
                  <span className={`type-badge-pill type-${secondaryType}`}>
                    {typeIcons[secondaryType] || '⭐'} {secondaryType}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
