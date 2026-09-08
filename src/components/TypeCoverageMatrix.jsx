import React from 'react';
import './TypeCoverageMatrix.css';

// Type Effectiveness Matrix (Simplified multipliers)
const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
  'dragon', 'dark', 'steel', 'fairy'
];

export default function TypeCoverageMatrix({ pokemons = [] }) {
  if (pokemons.length === 0) {
    return <div className="matrix-empty">Agrega Pokémon a tu equipo para analizar la cobertura de tipos.</div>;
  }

  // Calculate defensive vulnerabilities across team
  const coverage = ALL_TYPES.reduce((acc, attackType) => {
    let weakCount = 0;
    let resistCount = 0;
    let immuneCount = 0;

    pokemons.forEach((p) => {
      if (!p.types || p.types.length === 0) return;

      let multiplier = 1;
      p.types.forEach((defType) => {
        const typeLower = typeof defType === 'string' ? defType.toLowerCase() : defType.type?.name?.toLowerCase();
        if (TYPE_CHART[attackType] && TYPE_CHART[attackType][typeLower] !== undefined) {
          multiplier *= TYPE_CHART[attackType][typeLower];
        }
      });

      if (multiplier > 1) weakCount++;
      else if (multiplier === 0) immuneCount++;
      else if (multiplier < 1) resistCount++;
    });

    acc[attackType] = { weakCount, resistCount, immuneCount };
    return acc;
  }, {});

  return (
    <div className="type-coverage-matrix">
      <h3 className="matrix-title">🛡️ Matriz Táctica de Cobertura de Tipos</h3>
      <p className="matrix-subtitle">
        Análisis defensivo en tiempo real de las vulnerabilidades y resistencias de tu equipo.
      </p>

      <div className="matrix-grid">
        {ALL_TYPES.map((type) => {
          const stats = coverage[type];
          const netScore = stats.resistCount + stats.immuneCount - stats.weakCount;
          let statusClass = 'neutral';
          if (netScore < 0) statusClass = 'vulnerable';
          else if (netScore > 0) statusClass = 'resistant';

          return (
            <div key={type} className={`matrix-card type-${type} ${statusClass}`}>
              <div className="matrix-type-header">
                <span className="type-badge">{type.toUpperCase()}</span>
              </div>
              <div className="matrix-stats">
                {stats.weakCount > 0 && <span className="stat-weak">❌ {stats.weakCount} Débil</span>}
                {stats.resistCount > 0 && <span className="stat-resist">🛡️ {stats.resistCount} Resiste</span>}
                {stats.immuneCount > 0 && <span className="stat-immune">⚡ {stats.immuneCount} Inmune</span>}
                {stats.weakCount === 0 && stats.resistCount === 0 && stats.immuneCount === 0 && (
                  <span className="stat-neutral">⚪ Neutro</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
