import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemonList, usePokemonDetails } from '../hooks/usePokemonData';
import { Button, Card, Loader, TextInput } from '@gravity-ui/uikit';
import confetti from 'canvas-confetti';
import './BattleSimulator.css';
import './PokemonCard.css';

// Mapeo de fortalezas y debilidades de tipos
const TYPE_EFFECTIVENESS = {
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, fire: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, normal: 0, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, poison: 0.5, steel: 0.5, fire: 0.5 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  normal: { rock: 0.5, steel: 0.5, ghost: 0 }
};

// Componente para buscar y cargar detalles de un Pokémon en un slot
function FighterSelector({ label, onSelect, selectedPokemon, currentHp, maxHp, status, side }) {
  const { pokemones, isLoading: isListLoading } = usePokemonList();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar sugerencias reactivamente cuando carguen los pokemones o cambie la query
  React.useEffect(() => {
    if (query.trim().length > 1 && pokemones.length > 0) {
      const filtered = pokemones
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, pokemones]);

  return (
    <div className="fighter-selector">
      <div className="selector-input-container">
        <TextInput
          placeholder={isListLoading ? "Sincronizando Pokédex..." : `Buscar ${label}...`}
          size="l"
          value={query}
          onUpdate={setQuery}
          disabled={isListLoading}
        />
        {isOpen && suggestions.length > 0 && (
          <ul className="fighter-suggestions-list glass-card">
            {suggestions.map((p) => (
              <li
                key={p.name}
                className="fighter-suggestion-item"
                onClick={() => {
                  onSelect(p.name);
                  setQuery('');
                  setSuggestions([]);
                  setIsOpen(false);
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPokemon && (
        <FighterCard 
          name={selectedPokemon}
          currentHp={currentHp}
          maxHp={maxHp}
          status={status}
          side={side}
        />
      )}
    </div>
  );
}

// Carga y muestra los detalles del Pokémon combatiente
function FighterCard({ name, currentHp, maxHp, status, side }) {
  const { pokemon, isLoading, isError } = usePokemonDetails(name);

  if (isError) {
    return (
      <div className="fighter-card-skeleton" style={{ borderColor: '#ef5350' }}>
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <span style={{ fontSize: '0.85rem', color: '#ef5350', marginTop: '8px' }}>Error al cargar datos</span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{isError.message || 'Error de red'}</span>
      </div>
    );
  }

  if (isLoading || !pokemon) {
    return (
      <div className="fighter-card-skeleton pulse">
        <Loader size="m" />
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>Obteniendo estadísticas...</span>
      </div>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  // Determinar color de la barra de vida según porcentaje
  const pct = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
  const healthBarColor = pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#ef5350';

  // Configurar animaciones de Framer Motion
  let animateProps = { scale: 1, x: 0, y: 0, opacity: 1, filter: "none" };
  if (status === 'attacking') {
    animateProps = {
      x: side === 'left' ? 55 : -55,
      scale: 1.06,
      transition: { type: 'spring', stiffness: 400, damping: 12 }
    };
  } else if (status === 'hit') {
    animateProps = {
      x: [0, -10, 10, -10, 10, 0],
      scale: [1, 0.94, 1],
      transition: { duration: 0.3 }
    };
  } else if (status === 'dodging') {
    animateProps = {
      y: -30,
      x: side === 'left' ? -20 : 20,
      scale: 0.96,
      transition: { type: 'spring', stiffness: 220, damping: 10 }
    };
  } else if (status === 'defeated') {
    animateProps = {
      opacity: 1,
      scale: 0.92,
      filter: "grayscale(0.9) brightness(0.75)",
      transition: { duration: 0.5 }
    };
  }

  return (
    <motion.div 
      className={`fighter-card type-${primaryType}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={animateProps}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Damage Red Flash Overlay */}
      <AnimatePresence>
        {status === 'hit' && (
          <motion.div 
            className="damage-flash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ef5350',
              borderRadius: '16px',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      {/* Dodge Blue Flash Overlay */}
      <AnimatePresence>
        {status === 'dodging' && (
          <motion.div 
            className="dodge-flash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#80deea',
              borderRadius: '16px',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      <img src={imageUrl} alt={name} className="fighter-img" />
      <h4 className="fighter-name">{name}</h4>
      <div className="fighter-type-badge">{primaryType}</div>
      
      {/* Contenedor de Vida */}
      <div className="fighter-hp-container">
        <div className="fighter-hp-text">PS: {currentHp} / {maxHp}</div>
        <div className="fighter-hp-bar-outer">
          <motion.div 
            className="fighter-hp-bar-inner"
            initial={{ width: '100%' }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            style={{ backgroundColor: healthBarColor }}
          />
        </div>
      </div>

      <div className="fighter-stat-snippet">ATK: {pokemon.stats[1].base_stat} | VEL: {pokemon.stats[5].base_stat}</div>
    </motion.div>
  );
}

export default function BattleSimulator() {
  const [fighterA, setFighterA] = useState(null);
  const [fighterB, setFighterB] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [battleRunning, setBattleRunning] = useState(false);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  // Estados de salud y estatus de animación de combatientes
  const [hpA, setHpA] = useState(0);
  const [hpB, setHpB] = useState(0);
  const [maxHpA, setMaxHpA] = useState(1);
  const [maxHpB, setMaxHpB] = useState(1);
  const [statusA, setStatusA] = useState('idle'); // 'idle', 'attacking', 'hit', 'defeated'
  const [statusB, setStatusB] = useState('idle');

  // Carga directa de la PokeAPI de los dos combatientes para obtener sus estadísticas completas
  const { pokemon: detailA } = usePokemonDetails(fighterA);
  const { pokemon: detailB } = usePokemonDetails(fighterB);

  // Sincronizar estadísticas de salud al cargar/cambiar combatientes
  React.useEffect(() => {
    if (detailA) {
      const baseHp = detailA.stats[0].base_stat * 3;
      setHpA(baseHp);
      setMaxHpA(baseHp);
      setStatusA('idle');
    } else {
      setHpA(0);
      setMaxHpA(1);
      setStatusA('idle');
    }
  }, [detailA]);

  React.useEffect(() => {
    if (detailB) {
      const baseHp = detailB.stats[0].base_stat * 3;
      setHpB(baseHp);
      setMaxHpB(baseHp);
      setStatusB('idle');
    } else {
      setHpB(0);
      setMaxHpB(1);
      setStatusB('idle');
    }
  }, [detailB]);

  const calculateTypeAdvantage = (typeA, typeB) => {
    const mult = TYPE_EFFECTIVENESS[typeA]?.[typeB];
    return mult !== undefined ? mult : 1;
  };

  const handleSimulate = async () => {
    if (!detailA || !detailB) return;

    setBattleRunning(true);
    setWinner(null);
    setBattleLog([]);

    const log = [];
    let currentHpValA = detailA.stats[0].base_stat * 3;
    let currentHpValB = detailB.stats[0].base_stat * 3;
    
    setHpA(currentHpValA);
    setHpB(currentHpValB);

    const typeA = detailA.types[0].type.name;
    const typeB = detailB.types[0].type.name;

    const multA = calculateTypeAdvantage(typeA, typeB);
    const multB = calculateTypeAdvantage(typeB, typeA);

    log.push(`🏁 ¡Comienza el combate! ${detailA.name} (${typeA}) vs ${detailB.name} (${typeB})`);
    if (multA > 1) log.push(`🔥 ¡${detailA.name} tiene ventaja de tipo!`);
    if (multB > 1) log.push(`🔥 ¡${detailB.name} tiene ventaja de tipo!`);
    setBattleLog([...log]);

    let turn = detailA.stats[5].base_stat >= detailB.stats[5].base_stat ? 0 : 1; // Prioridad por velocidad

    const runTurn = () => {
      // Si la batalla termina o alguno cae debilitado
      if (currentHpValA <= 0 || currentHpValB <= 0) {
        const finalWinner = currentHpValA > 0 ? detailA : detailB;
        setWinner(finalWinner.name);

        if (currentHpValA > 0) {
          setStatusA('idle');
          setStatusB('defeated');
        } else {
          setStatusB('idle');
          setStatusA('defeated');
        }

        log.push(`🏆 ¡${finalWinner.name} es el ganador del combate!`);
        setBattleLog([...log]);
        setBattleRunning(false);

        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
        return;
      }

      // Restablecer estados del turno anterior
      setStatusA('idle');
      setStatusB('idle');

      setTimeout(() => {
        if (turn === 0) {
          // Ataca A, defiende B
          const speedA = detailA.stats[5].base_stat;
          const speedB = detailB.stats[5].base_stat;
          const speedRatio = speedB / (speedA || 1);
          const dodgeProb = Math.min(0.35, Math.max(0.08, speedRatio * 0.18));
          const isDodged = Math.random() < dodgeProb;

          setStatusA('attacking');
          
          if (isDodged) {
            setStatusB('dodging');
            log.push(`💨 ¡${detailB.name} esquivó velozmente el ataque de ${detailA.name}!`);
          } else {
            setStatusB('hit');
            const dmg = Math.max(1, Math.round(((detailA.stats[1].base_stat / 5) + Math.random() * 5) * multA));
            currentHpValB = Math.max(0, currentHpValB - dmg);
            setHpB(currentHpValB);
            log.push(`⚔️ ${detailA.name} embiste a ${detailB.name} causando ${dmg} daño.`);
          }
        } else {
          // Ataca B, defiende A
          const speedA = detailA.stats[5].base_stat;
          const speedB = detailB.stats[5].base_stat;
          const speedRatio = speedA / (speedB || 1);
          const dodgeProb = Math.min(0.35, Math.max(0.08, speedRatio * 0.18));
          const isDodged = Math.random() < dodgeProb;

          setStatusB('attacking');

          if (isDodged) {
            setStatusA('dodging');
            log.push(`💨 ¡${detailA.name} esquivó velozmente el ataque de ${detailB.name}!`);
          } else {
            setStatusA('hit');
            const dmg = Math.max(1, Math.round(((detailB.stats[1].base_stat / 5) + Math.random() * 5) * multB));
            currentHpValA = Math.max(0, currentHpValA - dmg);
            setHpA(currentHpValA);
            log.push(`⚔️ ${detailB.name} embiste a ${detailA.name} causando ${dmg} daño.`);
          }
        }

        setBattleLog([...log]);

        // Esperar a que la animación física de golpe/esquiva (~350ms) termine para restablecer a idle
        setTimeout(() => {
          if (currentHpValA > 0 && currentHpValB > 0) {
            setStatusA('idle');
            setStatusB('idle');
          }
          
          turn = 1 - turn;
          // Próximo turno en 400ms (combate ágil: total ~800ms por acción)
          setTimeout(runTurn, 400);
        }, 350);

      }, 50);
    };

    // Lanzar el primer turno con un delay de preparación
    setTimeout(runTurn, 1000);
  };

  const handleReset = () => {
    setFighterA(null);
    setFighterB(null);
    setWinner(null);
    setBattleLog([]);
    setHpA(0);
    setHpB(0);
    setStatusA('idle');
    setStatusB('idle');
  };

  return (
    <main className="battle-arena-container">
      <div className="container py-5">
        <header className="arena-header">
          <Button size="l" view="outlined" onClick={() => navigate('/gallery')} className="back-btn">
            ◀ Volver a la Pokédex
          </Button>
          <h1 className="arena-title">⚔️ Arena de Combate</h1>
          <p className="arena-subtitle">Elige y simula enfrentamientos épicos con multiplicadores de daño oficiales</p>
        </header>

        <div className="arena-grid">
          {/* Slot Combatiente A */}
          <div className="arena-slot">
            <h3 className="slot-heading">Combatiente A</h3>
            <FighterSelector 
              label="Pokémon A" 
              selectedPokemon={fighterA}
              onSelect={setFighterA}
              currentHp={hpA}
              maxHp={maxHpA}
              status={statusA}
              side="left"
            />
          </div>

          {/* VS Divider con Animación de Latido */}
          <div className="vs-divider">
            <motion.div 
              className="vs-badge"
              animate={battleRunning ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              VS
            </motion.div>
          </div>

          {/* Slot Combatiente B */}
          <div className="arena-slot">
            <h3 className="slot-heading">Combatiente B</h3>
            <FighterSelector 
              label="Pokémon B" 
              selectedPokemon={fighterB}
              onSelect={setFighterB}
              currentHp={hpB}
              maxHp={maxHpB}
              status={statusB}
              side="right"
            />
          </div>
        </div>

        {/* Acciones del Simulador */}
        <div className="arena-actions text-center mt-5">
          {detailA && detailB && !battleRunning && !winner && (
            <Button size="xl" view="action" className="simulate-btn" onClick={handleSimulate}>
              ⚡ Iniciar Simulación
            </Button>
          )}

          {(winner || battleLog.length > 0) && !battleRunning && (
            <Button size="xl" view="outlined" className="reset-btn" onClick={handleReset}>
              🔄 Reiniciar Arena
            </Button>
          )}
        </div>

        {/* Panel de Registro de Combate */}
        <AnimatePresence>
          {(battleLog.length > 0) && (
            <motion.div 
              className="battle-log-panel glass-card mt-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h3 className="log-title">📋 Registro de Turnos</h3>
              <div className="log-entries">
                {battleLog.map((entry, index) => (
                  <motion.div 
                    key={index} 
                    className={`log-entry ${entry.includes('🏆') ? 'winner-entry' : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    {entry}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
