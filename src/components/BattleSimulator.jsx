import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemonList, usePokemonDetails } from '../hooks/usePokemonData';
import { Button, Loader, TextInput } from '@gravity-ui/uikit';
import confetti from 'canvas-confetti';
import { apiService } from '../services/apiService';
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

// Retro sound effects synthesis via Web Audio API with elemental variations
const playSoundType = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    if (type === 'electric') {
      // Zap & crackle thunder sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.18);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'fire') {
      // Roaring flame blast sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);
      
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'poison') {
      // Toxic bubbling tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
      
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'ice') {
      // Crisp ice shard chime sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'special') {
      // Epic dual oscillator burst
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(280, now);
      osc1.frequency.exponentialRampToValueAtTime(750, now + 0.3);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(140, now);
      osc2.frequency.linearRampToValueAtTime(45, now + 0.3);
      
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } else if (type === 'hit') {
      // Normal tackle/impact thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.14);
      
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);
      
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'dodge') {
      // Fast pitch slide up
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.18);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'miss') {
      // Low buzz sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.15);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'victory') {
      // Short victory fan-fare
      const playNote = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.linearRampToValueAtTime(0.01, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
      };
      
      playNote(523.25, now, 0.12); // C5
      playNote(659.25, now + 0.12, 0.12); // E5
      playNote(783.99, now + 0.24, 0.12); // G5
      playNote(1046.50, now + 0.36, 0.35); // C6
    }
  } catch (e) {
    console.warn('Web Audio synthesis not supported or blocked:', e);
  }
};

// Helper for extracting random moves from Pokémon details
const getRandomMove = (pokemonDetail, isSpecial) => {
  if (!pokemonDetail || !pokemonDetail.moves || pokemonDetail.moves.length === 0) {
    return isSpecial ? "Super Rayo" : "Placaje";
  }
  const movesList = pokemonDetail.moves;
  const randomIndex = Math.floor(Math.random() * movesList.length);
  const rawName = movesList[randomIndex].move.name;
  return rawName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Map primary pokemon type to elemental FX overlay
const getElementEffectType = (pokemonType, isSpecial) => {
  if (isSpecial) return 'special';
  const type = (pokemonType || '').toLowerCase();
  if (type === 'electric') return 'electric';
  if (type === 'fire') return 'fire';
  if (type === 'grass' || type === 'poison' || type === 'bug') return 'poison';
  if (type === 'water' || type === 'ice') return 'ice';
  return 'physical';
};

// Visual Elemental Effect Components
function ElectricFX() {
  return (
    <div className="fx-overlay fx-electric-overlay">
      <svg className="lightning-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,0 25,48 48,48 30,100 85,42 55,42" fill="#ffee58" filter="drop-shadow(0 0 10px #00e5ff)" />
        <polygon points="15,10 65,35 42,48 80,92 48,55 68,42" fill="#00e5ff" opacity="0.85" />
      </svg>
      <div className="zap-spark s1" />
      <div className="zap-spark s2" />
      <div className="zap-spark s3" />
    </div>
  );
}

function FireFX() {
  return (
    <div className="fx-overlay fx-fire-overlay">
      <div className="fire-flare-burst" />
      <div className="ember-particle e1" />
      <div className="ember-particle e2" />
      <div className="ember-particle e3" />
      <div className="ember-particle e4" />
    </div>
  );
}

function PoisonFX() {
  return (
    <div className="fx-overlay fx-poison-overlay">
      <div className="poison-mist-cloud" />
      <div className="poison-bubble-particle b1" />
      <div className="poison-bubble-particle b2" />
      <div className="poison-bubble-particle b3" />
    </div>
  );
}

function IceFX() {
  return (
    <div className="fx-overlay fx-ice-overlay">
      <div className="ice-shard-particle i1" />
      <div className="ice-shard-particle i2" />
      <div className="ice-shard-particle i3" />
      <div className="ice-frost-flash" />
    </div>
  );
}

function SpecialFX() {
  return (
    <div className="fx-overlay fx-special-overlay">
      <div className="slash-beam beam-1" />
      <div className="slash-beam beam-2" />
      <div className="special-impact-ring" />
    </div>
  );
}

function PhysicalFX() {
  return (
    <div className="fx-overlay fx-physical-overlay">
      <div className="impact-shockwave" />
      <div className="punch-spark p1" />
      <div className="punch-spark p2" />
    </div>
  );
}

// Componente para buscar y cargar detalles de un Pokémon en un slot
function FighterSelector({ label, onSelect, selectedPokemon, currentHp, maxHp, status, side, activeEffect, floatingText }) {
  const { pokemones, isLoading: isListLoading } = usePokemonList();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
          activeEffect={activeEffect}
          floatingText={floatingText}
        />
      )}
    </div>
  );
}

// Carga y muestra los detalles del Pokémon combatiente
function FighterCard({ name, currentHp, maxHp, status, side, activeEffect, floatingText }) {
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
      x: side === 'left' ? 75 : -75,
      scale: 1.1,
      transition: { type: 'spring', stiffness: 350, damping: 10 }
    };
  } else if (status === 'hit') {
    animateProps = {
      x: [0, -14, 14, -14, 14, 0],
      scale: [1, 0.9, 1],
      transition: { duration: 0.4, ease: "easeInOut" }
    };
  } else if (status === 'dodging') {
    animateProps = {
      y: [-45, 0],
      x: side === 'left' ? [-35, 0] : [35, 0],
      scale: [0.94, 1],
      transition: { duration: 0.5, ease: "easeOut" }
    };
  } else if (status === 'defeated') {
    animateProps = {
      opacity: 0.85,
      scale: 0.92,
      filter: "grayscale(0.8) sepia(0.2) brightness(0.85)",
      transition: { duration: 0.6 }
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
      {/* Floating Damage / Miss Popups */}
      <AnimatePresence>
        {floatingText && (
          <motion.div 
            key={floatingText.id}
            className={`floating-text-badge float-${floatingText.type}`}
            initial={{ opacity: 0, y: 15, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -50, scale: [0.6, 1.25, 1, 0.9] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {floatingText.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Elemental FX Overlays */}
      <AnimatePresence>
        {activeEffect && (
          <motion.div 
            className={`fx-wrapper`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeEffect === 'electric' && <ElectricFX />}
            {activeEffect === 'fire' && <FireFX />}
            {activeEffect === 'poison' && <PoisonFX />}
            {activeEffect === 'ice' && <IceFX />}
            {activeEffect === 'special' && <SpecialFX />}
            {activeEffect === 'physical' && <PhysicalFX />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Damage Red Flash Overlay */}
      <AnimatePresence>
        {status === 'hit' && (
          <motion.div 
            className="damage-flash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ff1744',
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
            animate={{ opacity: [0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#00e5ff',
              borderRadius: '16px',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      {/* K.O. Stamp Overlay */}
      {status === 'defeated' && (
        <div 
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            backgroundColor: 'rgba(239, 83, 80, 0.95)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontWeight: '900',
            fontSize: '1.5rem',
            border: '3px solid #fff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
            zIndex: 15,
            pointerEvents: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          K.O.
        </div>
      )}

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
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
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
  const [statusA, setStatusA] = useState('idle');
  const [statusB, setStatusB] = useState('idle');

  // Efectos elementales activos por luchador
  const [effectA, setEffectA] = useState(null);
  const [effectB, setEffectB] = useState(null);

  // Textos flotantes de daño o estado por luchador
  const [floatA, setFloatA] = useState(null);
  const [floatB, setFloatB] = useState(null);

  // Estado de sacudida de pantalla / arena
  const [screenShake, setScreenShake] = useState(false);

  // Referencia para scroll automático del log
  const logContainerRef = useRef(null);

  // Carga directa de la PokeAPI de los dos combatientes para obtener sus estadísticas completas
  const { pokemon: detailA } = usePokemonDetails(fighterA);
  const { pokemon: detailB } = usePokemonDetails(fighterB);

  // Scroll automático del registro de turnos cuando se agreguen nuevas acciones
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [battleLog]);

  // Sincronizar estadísticas de salud al cargar/cambiar combatientes
  useEffect(() => {
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

  useEffect(() => {
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

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 450);
  };

  const handleSimulate = async () => {
    if (!detailA || !detailB) return;

    setBattleRunning(true);
    setWinner(null);
    setBattleLog([]);
    setEffectA(null);
    setEffectB(null);
    setFloatA(null);
    setFloatB(null);

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

        // Guardar resultado en MongoDB
        apiService.saveBattleLog({
          playerPokemon: { id: detailA.id, name: detailA.name, type: detailA.types[0]?.type?.name || 'normal' },
          rivalPokemon: { id: detailB.id, name: detailB.name, type: detailB.types[0]?.type?.name || 'normal' },
          winner: currentHpValA > 0 ? 'player' : 'rival',
          turns: log.length,
          log: log
        });

        playSoundType('victory');

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
      setEffectA(null);
      setEffectB(null);

      // Fase 1: El atacante inicia la embestida
      setTimeout(() => {
        if (turn === 0) {
          setStatusA('attacking');
        } else {
          setStatusB('attacking');
        }

        // Fase 2: El ataque impacta o es esquivado/fallado tras 380ms
        setTimeout(() => {
          const isSpecial = Math.random() < 0.25; // 25% probabilidad de golpe especial

          if (turn === 0) {
            // Ataca A, defiende B
            const speedA = detailA.stats[5].base_stat;
            const speedB = detailB.stats[5].base_stat;
            const speedRatio = speedB / (speedA || 1);
            const dodgeProb = Math.min(0.35, Math.max(0.08, speedRatio * 0.18));
            const isDodged = Math.random() < dodgeProb;
            const isMissed = !isDodged && Math.random() < 0.12;

            setStatusA('idle');

            if (isDodged) {
              setStatusB('dodging');
              setFloatB({ id: Date.now(), text: '💨 ¡ESQUIVADO!', type: 'dodge' });
              playSoundType('dodge');
              log.push(`💨 ¡${detailB.name} esquivó velozmente el ataque de ${detailA.name}!`);
            } else if (isMissed) {
              setFloatB({ id: Date.now(), text: '❌ ¡FALLÓ!', type: 'miss' });
              playSoundType('miss');
              log.push(`❌ ¡El ataque de ${detailA.name} falló y no alcanzó a ${detailB.name}!`);
            } else {
              setStatusB('hit');
              const moveName = getRandomMove(detailA, isSpecial);
              const fxType = getElementEffectType(typeA, isSpecial);
              setEffectB(fxType);

              if (isSpecial) {
                playSoundType('special');
                triggerShake();
                const dmg = Math.max(2, Math.round((((detailA.stats[1].base_stat / 5) + Math.random() * 5) * multA) * 2.0));
                currentHpValB = Math.max(0, currentHpValB - dmg);
                setHpB(currentHpValB);
                setFloatB({ id: Date.now(), text: `💥 -${dmg} PS`, type: 'special' });
                log.push(`💥 ¡ATAQUE ESPECIAL! ¡${detailA.name} desata ${moveName} infligiendo ${dmg} daño devastador!`);
              } else {
                playSoundType(fxType);
                if (multA > 1) triggerShake();
                const dmg = Math.max(1, Math.round(((detailA.stats[1].base_stat / 5) + Math.random() * 5) * multA));
                currentHpValB = Math.max(0, currentHpValB - dmg);
                setHpB(currentHpValB);
                setFloatB({ id: Date.now(), text: `⚔️ -${dmg} PS`, type: 'damage' });
                log.push(`⚔️ ${detailA.name} usa ${moveName} y causa ${dmg} daño.`);
              }
            }
          } else {
            // Ataca B, defiende A
            const speedA = detailA.stats[5].base_stat;
            const speedB = detailB.stats[5].base_stat;
            const speedRatio = speedA / (speedB || 1);
            const dodgeProb = Math.min(0.35, Math.max(0.08, speedRatio * 0.18));
            const isDodged = Math.random() < dodgeProb;
            const isMissed = !isDodged && Math.random() < 0.12;

            setStatusB('idle');

            if (isDodged) {
              setStatusA('dodging');
              setFloatA({ id: Date.now(), text: '💨 ¡ESQUIVADO!', type: 'dodge' });
              playSoundType('dodge');
              log.push(`💨 ¡${detailA.name} esquivó velozmente el ataque de ${detailB.name}!`);
            } else if (isMissed) {
              setFloatA({ id: Date.now(), text: '❌ ¡FALLÓ!', type: 'miss' });
              playSoundType('miss');
              log.push(`❌ ¡El ataque de ${detailB.name} falló y no alcanzó a ${detailA.name}!`);
            } else {
              setStatusA('hit');
              const moveName = getRandomMove(detailB, isSpecial);
              const fxType = getElementEffectType(typeB, isSpecial);
              setEffectA(fxType);

              if (isSpecial) {
                playSoundType('special');
                triggerShake();
                const dmg = Math.max(2, Math.round((((detailB.stats[1].base_stat / 5) + Math.random() * 5) * multB) * 2.0));
                currentHpValA = Math.max(0, currentHpValA - dmg);
                setHpA(currentHpValA);
                setFloatA({ id: Date.now(), text: `💥 -${dmg} PS`, type: 'special' });
                log.push(`💥 ¡ATAQUE ESPECIAL! ¡${detailB.name} desata ${moveName} infligiendo ${dmg} daño devastador!`);
              } else {
                playSoundType(fxType);
                if (multB > 1) triggerShake();
                const dmg = Math.max(1, Math.round(((detailB.stats[1].base_stat / 5) + Math.random() * 5) * multB));
                currentHpValA = Math.max(0, currentHpValA - dmg);
                setHpA(currentHpValA);
                setFloatA({ id: Date.now(), text: `⚔️ -${dmg} PS`, type: 'damage' });
                log.push(`⚔️ ${detailB.name} usa ${moveName} y causa ${dmg} daño.`);
              }
            }
          }

          setBattleLog([...log]);

          // Fase 3: Recuperación del defensor a idle
          setTimeout(() => {
            if (currentHpValA > 0 && currentHpValB > 0) {
              setStatusA('idle');
              setStatusB('idle');
            }
            setEffectA(null);
            setEffectB(null);

            turn = 1 - turn;
            setTimeout(runTurn, 400);
          }, 500);

        }, 380);

      }, 50);
    };

    setTimeout(runTurn, 900);
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
    setEffectA(null);
    setEffectB(null);
    setFloatA(null);
    setFloatB(null);
  };

  // Obtener la última línea de acción para el Ticker HUD
  const latestAction = battleLog.length > 0 ? battleLog[battleLog.length - 1] : null;

  return (
    <main className="battle-arena-container">
      <div className="container py-5">
        <header className="arena-header">
          <Button size="l" view="outlined" onClick={() => navigate('/gallery')} className="back-btn">
            ◀ Volver a la Pokédex
          </Button>
          <h1 className="arena-title">⚔️ Arena de Combate</h1>
          <p className="arena-subtitle">Elige y simula enfrentamientos épicos con efectos elementales en vivo</p>
        </header>

        {/* Banner Ticker de Acción en Vivo */}
        <AnimatePresence mode="wait">
          {latestAction && (
            <motion.div 
              key={latestAction}
              className="live-action-banner-hud"
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <span className="live-hud-icon">⚡ ACCIÓN EN VIVO:</span>
              <span className="live-hud-text">{latestAction}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`arena-grid ${screenShake ? 'arena-shake' : ''}`}>
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
              activeEffect={effectA}
              floatingText={floatA}
            />
          </div>

          {/* VS Divider con Animación de Latido */}
          <div className="vs-divider">
            <motion.div 
              className="vs-badge"
              animate={battleRunning ? { scale: [1, 1.25, 1], boxShadow: ['0 0 20px rgba(255,82,82,0.4)', '0 0 35px rgba(255,82,82,0.8)', '0 0 20px rgba(255,82,82,0.4)'] } : {}}
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
              activeEffect={effectB}
              floatingText={floatB}
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

        {/* Panel de Registro de Combate (Auto-scrollable) */}
        <AnimatePresence>
          {(battleLog.length > 0) && (
            <motion.div 
              className="battle-log-panel glass-card mt-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="log-header-row">
                <h3 className="log-title">📋 Registro de Turnos</h3>
                <span className="log-badge-count">{battleLog.length} turnos</span>
              </div>
              <div className="log-entries" ref={logContainerRef}>
                {battleLog.map((entry, index) => (
                  <motion.div 
                    key={index} 
                    className={`log-entry ${entry.includes('🏆') ? 'winner-entry' : ''} ${entry.includes('💥') ? 'special-entry' : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 }}
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
