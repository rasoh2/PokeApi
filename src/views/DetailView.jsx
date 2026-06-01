import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePokemonDetails } from "../hooks/usePokemonData";
import { usePokemonTheme } from "../context/PokemonThemeContext";
import RadarChart from "../components/RadarChart";
import EvolutionChain from "../components/EvolutionChain";
import CryPlayer from "../components/CryPlayer";
import { Button, Loader, Card } from "@gravity-ui/uikit";
import { motion } from "framer-motion";
import "./DetailView.css";

// Mapeo de colores hex para las variables CSS de Mesh Gradient
const typeColorsHex = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  dark: "#705848",
};

const typeIcons = {
  normal: "⭐",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌿",
  ice: "❄️",
  fighting: "👊",
  poison: "☠️",
  ground: "⛰️",
  flying: "🦅",
  psychic: "🔮",
  bug: "🐛",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌙",
  steel: "⚙️",
  fairy: "✨",
};

export default function DetailView() {
  const { pokemon: pokemonName } = useParams();
  const navigate = useNavigate();
  const { pokemon, isLoading, isError } = usePokemonDetails(pokemonName);
  const { updateActiveColors } = usePokemonTheme();

  const primaryType = pokemon?.types?.[0]?.type?.name || "normal";
  const secondaryType = pokemon?.types?.[1]?.type?.name || null;
  const isLegendary = pokemon?.is_legendary || pokemon?.is_mythical || false;

  const [evoStage, setEvoStage] = useState(2); // 0 = base, 1 = intermedio, 2 = final

  // Determinar la etapa evolutiva exacta (0 = base, 1 = intermedio, 2 = final)
  useEffect(() => {
    if (!pokemon || !pokemon.evolutionChainUrl) {
      setEvoStage(2);
      return;
    }

    const checkEvolution = async () => {
      try {
        const res = await fetch(pokemon.evolutionChainUrl);
        const data = await res.json();
        
        const evolutions = [];
        let current = data.chain;
        while (current) {
          evolutions.push(current.species.name);
          current = current.evolves_to?.[0];
        }

        const stageIdx = evolutions.indexOf(pokemon.name);
        if (stageIdx === -1) {
          setEvoStage(2);
        } else if (evolutions.length <= 1) {
          setEvoStage(2); // Único -> Se considera final
        } else if (stageIdx === 0) {
          setEvoStage(0); // Base (suave)
        } else if (stageIdx === 1 && evolutions.length === 3) {
          setEvoStage(1); // Intermedio
        } else {
          setEvoStage(2); // Final (espectacular)
        }
      } catch (err) {
        console.error('Error al comprobar evolución:', err);
        setEvoStage(2);
      }
    };

    checkEvolution();
  }, [pokemon]);

  const effectiveEvoStage = isLegendary ? 2 : evoStage;

  // Generar partículas ambientales según la etapa evolutiva y tipo de pokemon
  // Base: 6 partículas, Intermedio: 18 partículas, Final: 30 partículas, Legendarios: 35
  const particleCount = isLegendary ? 35 : effectiveEvoStage === 0 ? 6 : effectiveEvoStage === 1 ? 18 : 30;
  
  const particles = useMemo(() => {
    if (!pokemon) return [];
    
    return Array.from({ length: particleCount }).map((_, i) => {
      let currentType = primaryType;
      if (secondaryType && i % 2 === 1) {
        currentType = secondaryType;
      }

      let isSparkle = false;
      let isFlower = false;
      let isSpecial = false;
      let customContent = "";

      // Regla de Etapa 1: Sin brillos ni partículas complejas (solo círculos sencillos)
      if (effectiveEvoStage === 0 && !isLegendary) {
        isSparkle = false;
        isFlower = false;
      } else {
        // Etapas 2 y 3 (y Legendarios)
        const sparkleProb = (effectiveEvoStage === 2 || isLegendary) ? 0.45 : 0.30;
        isSparkle = Math.random() < sparkleProb;

        // Distribución de flores rosadas para Planta en fase final (máx 6 en total)
        if (currentType === 'grass' && (effectiveEvoStage === 2 || isLegendary)) {
          const grassIndices = Array.from({ length: particleCount })
            .map((_, idx) => idx)
            .filter(idx => (secondaryType ? (idx % 2 === 0) : true));
          const grassPos = grassIndices.indexOf(i);
          if (grassPos >= 0 && grassPos < 6) {
            isFlower = true;
            isSparkle = false;
          }
        }

        // Definir emojis o símbolos específicos para Stage 3 y Legendarios
        if (effectiveEvoStage === 2 || isLegendary) {
          isSpecial = true;
          if (currentType === "grass") {
            customContent = isFlower ? "🌸" : (Math.random() < 0.5 ? "🍃" : "🌿");
          } else if (currentType === "fire") {
            customContent = Math.random() < 0.45 ? "🔥" : "✨";
          } else if (currentType === "water") {
            customContent = Math.random() < 0.5 ? "💧" : "🫧";
          } else if (currentType === "electric") {
            customContent = "⚡";
          } else if (currentType === "ice") {
            customContent = Math.random() < 0.6 ? "❄️" : "💎";
          } else if (currentType === "poison") {
            customContent = Math.random() < 0.5 ? "☣️" : "🫧";
          } else if (currentType === "psychic") {
            customContent = Math.random() < 0.5 ? "🔮" : "⚛️";
          } else if (currentType === "bug") {
            customContent = Math.random() < 0.5 ? "🪲" : "🦋";
          } else if (currentType === "ghost") {
            customContent = Math.random() < 0.4 ? "👁️" : (Math.random() < 0.5 ? "👻" : "💀");
          } else if (currentType === "steel") {
            customContent = "⚙️";
          } else if (currentType === "dragon") {
            customContent = Math.random() < 0.5 ? "🐉" : "🔥";
          } else if (currentType === "fairy") {
            customContent = Math.random() < 0.5 ? "🌸" : "✨";
          } else if (currentType === "fighting") {
            customContent = "👊";
          } else if (currentType === "ground") {
            customContent = "🪨";
          } else if (currentType === "flying") {
            customContent = "🪶";
          } else if (currentType === "dark") {
            customContent = "🌑";
          } else if (currentType === "rock") {
            customContent = "🪨";
          } else {
            customContent = "✨";
          }
        } else if (effectiveEvoStage === 1) {
          // Etapa 2 (Sutil): Símbolos flotantes ambientales moderados
          if (Math.random() < 0.4) {
            isSpecial = true;
            if (currentType === "grass") customContent = "🍃";
            else if (currentType === "fire") customContent = "✨";
            else if (currentType === "water") customContent = "🫧";
            else if (currentType === "electric") customContent = "⚡";
            else if (currentType === "ice") customContent = "❄️";
            else if (currentType === "poison") customContent = "🫧";
            else if (currentType === "flying") customContent = "🪶";
            else if (currentType === "steel") customContent = "🔩";
            else if (currentType === "fairy") customContent = "✨";
            else if (currentType === "ghost") customContent = "👻";
            else if (currentType === "psychic") customContent = "✨";
            else if (currentType === "dark") customContent = "🌙";
            else if (currentType === "bug") customContent = "✨";
          }
        }
      }

      if (isSparkle && !customContent) {
        customContent = "✨";
        isSpecial = true;
      }

      // Trayectorias y animaciones según tipo de movimiento
      let animationType = "up";
      const fallingTypes = ["grass", "ice", "flying", "bug"];
      const flashTypes = ["electric", "steel", "fighting"];

      if (fallingTypes.includes(currentType)) {
        animationType = "down";
      } else if (flashTypes.includes(currentType)) {
        animationType = "flash";
      }

      // Doble tipo en Etapa 3/Legendario -> Persiguen en espiral
      if (secondaryType && (effectiveEvoStage === 2 || isLegendary)) {
        animationType = (i % 2 === 0) ? "spiral-cw" : "spiral-ccw";
      }

      return {
        id: i,
        left: `${Math.random() * 110 - 5}%`,
        top: `${Math.random() * 110 - 5}%`,
        size: Math.random() * 12 + (isLegendary ? 12 : 6),
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 4 + (effectiveEvoStage === 0 ? 5 : 3)}s`,
        dx: `${Math.random() * 100 - 50}px`,
        dy: `${Math.random() * -140 - 50}px`,
        isSparkle,
        isFlower,
        isSpecial,
        content: customContent,
        type: currentType,
        animationType,
      };
    });
  }, [pokemon?.name, effectiveEvoStage, primaryType, secondaryType, isLegendary, particleCount]);

  // Actualizar los colores en el contexto global cuando se carga el Pokémon
  useEffect(() => {
    if (pokemon) {
      const primaryHex = typeColorsHex[primaryType] || "#1a1a2e";
      const secondaryHex = typeColorsHex[secondaryType] || "#16161a";
      let gradient = `linear-gradient(135deg, ${primaryHex} 0%, ${secondaryHex} 100%)`;

      if (isLegendary) {
        gradient = `linear-gradient(135deg, #6b21a8 0%, #1e1b4b 40%, #b45309 100%)`;
      }

      updateActiveColors({
        bg: primaryHex,
        bgSecondary: secondaryHex,
        gradient: gradient,
      });
    }
  }, [pokemon, primaryType, secondaryType, isLegendary]);

  // Limpiar colores únicamente al desmontar el componente
  useEffect(() => {
    return () => {
      updateActiveColors(null);
    };
  }, []);

  if (isLoading) {
    return (
      <div className='detail-loading-screen'>
        <Loader size='l' />
        <p>Capturando datos del Pokémon de forma ultra-fluida...</p>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className='detail-error-screen container text-center'>
        <h2>❌ El Pokémon se ha escapado de la Pokédex</h2>
        <p>No se pudieron recuperar los datos de {pokemonName}.</p>
        <Button size='l' view='action' onClick={() => navigate("/gallery")}>
          Volver a la Pokédex
        </Button>
      </div>
    );
  }

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.front_default;

  // Configurar las variables de color del degradado mesh animado
  const meshStyles = {
    "--mesh-color-1": isLegendary ? "#b45309" : typeColorsHex[primaryType],
    "--mesh-color-2": isLegendary ? "#6b21a8" : (secondaryType ? typeColorsHex[secondaryType] : "#2a2a2a"),
    "--mesh-color-3": isLegendary ? "#1e1b4b" : "#1c1c1e",
  };

  return (
    <motion.main
      className='detail-view-container mesh-gradient-bg'
      style={meshStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='detail-content container'>
        {/* Botón Volver */}
        <div className='back-btn-row'>
          <Button
            size='l'
            view='outlined'
            onClick={() => navigate("/gallery")}
            className='back-btn'
          >
            ◀ Volver a la Galería
          </Button>
        </div>

        <div className='detail-grid'>
          {/* Columna Izquierda: Imagen y Datos Físicos */}
          <div className='left-column'>
            <div 
              className={`pokemon-card-ambient-wrapper type-${primaryType} ${secondaryType ? `type-sec-${secondaryType}` : ''} ${isLegendary ? 'legendary' : ''} ${effectiveEvoStage === 0 ? 'basic-evo' : effectiveEvoStage === 1 ? 'inter-evo' : 'final-evo'}`}
              style={{
                "--type-color-1": typeColorsHex[primaryType],
                "--type-color-2": secondaryType ? typeColorsHex[secondaryType] : typeColorsHex[primaryType],
              }}
            >
              
              {/* Partículas por detrás de la tarjeta (índices pares) */}
              <div className="ambient-particles behind" aria-hidden="true">
                {particles.filter((_, idx) => idx % 2 === 0).map((p) => {
                  let pClass = "ambient-particle";
                  if (p.isSparkle) {
                    pClass += " particle-sparkle";
                  } else if (p.isFlower) {
                    pClass += " particle-flower";
                  } else {
                    pClass += ` type-particle-${p.type}`;
                  }
                  pClass += ` anim-${p.animationType}`;

                  return (
                    <span
                      key={p.id}
                      className={pClass}
                      style={{
                        left: p.left,
                        top: p.top,
                        fontSize: p.isSpecial ? `${p.size}px` : undefined,
                        width: p.isSpecial ? undefined : `${p.size}px`,
                        height: p.isSpecial ? undefined : `${p.size}px`,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                        '--dx': p.dx,
                        '--dy': p.dy,
                      }}
                    >
                      {p.isSpecial ? p.content : ""}
                    </span>
                  );
                })}
              </div>

              {/* Partículas por delante de la tarjeta (índices impares) */}
              <div className="ambient-particles in-front" aria-hidden="true">
                {particles.filter((_, idx) => idx % 2 !== 0).map((p) => {
                  let pClass = "ambient-particle";
                  if (p.isSparkle) {
                    pClass += " particle-sparkle";
                  } else if (p.isFlower) {
                    pClass += " particle-flower";
                  } else {
                    pClass += ` type-particle-${p.type}`;
                  }
                  pClass += ` anim-${p.animationType}`;

                  return (
                    <span
                      key={p.id}
                      className={pClass}
                      style={{
                        left: p.left,
                        top: p.top,
                        fontSize: p.isSpecial ? `${p.size}px` : undefined,
                        width: p.isSpecial ? undefined : `${p.size}px`,
                        height: p.isSpecial ? undefined : `${p.size}px`,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                        '--dx': p.dx,
                        '--dy': p.dy,
                      }}
                    >
                      {p.isSpecial ? p.content : ""}
                    </span>
                  );
                })}
              </div>

              <motion.div
                className='pokemon-large-card glass-card'
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 18 }}
              >
                <span className='pokemon-large-number'>
                  #{String(pokemon.id).padStart(3, "0")}
                </span>

                {/* Contenedor de Imagen de alta fidelidad */}
                <motion.div
                  className='artwork-stage'
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
                >
                  <motion.img
                    src={imageUrl}
                    alt={pokemon.name}
                    className='large-artwork'
                    animate={{
                      y: [0, -8, 0, 8, 0],
                      rotate: [0, -1.5, 1.5, -1.5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                <div className='pokemon-identity'>
                  <h1 className='pokemon-large-name'>{pokemon.name}</h1>
                  <p className='pokemon-large-genera'>{pokemon.genera}</p>
                  <div className='badge-row'>
                    <span className={`type-badge-pill type-${primaryType}`}>
                      {typeIcons[primaryType] || "⭐"} {primaryType}
                    </span>
                    {secondaryType && (
                      <span className={`type-badge-pill type-${secondaryType}`}>
                        {typeIcons[secondaryType] || "⭐"} {secondaryType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cry Player oficial */}
                <CryPlayer cries={pokemon.cries} pokemonName={pokemon.name} />
              </motion.div>
            </div>
          </div>

          {/* Columna Derecha: Estadísticas, Habilidades y Evoluciones */}
          <div className='right-column'>
            {/* Descripción */}
            <Card
              className='detail-section-card glass-card'
              padding='m'
              type='container'
            >
              <h5 className='section-title'>📖 Entrada de la Pokédex</h5>
              <p className='entry-text'>"{pokemon.description}"</p>

              <div className='physical-row'>
                <div className='phys-item'>
                  <span className='phys-label'>Altura</span>
                  <span className='phys-value'>
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className='phys-item'>
                  <span className='phys-label'>Peso</span>
                  <span className='phys-value'>
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
                <div className='phys-item'>
                  <span className='phys-label'>Ratio Captura</span>
                  <span className='phys-value'>
                    {((pokemon.capture_rate / 255) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Gráfico de Radar y Estadísticas */}
            <Card
              className='detail-section-card glass-card'
              padding='m'
              type='container'
            >
              <h5 className='section-title'>📊 Estadísticas de Combate</h5>
              <div className='stats-container'>
                <div className='stats-chart'>
                  <RadarChart stats={pokemon.stats} />
                </div>

                {/* Listado lateral de stats */}
                <div className='stats-list'>
                  {pokemon.stats.map((s) => {
                    const pct = (s.base_stat / 200) * 100;
                    return (
                      <div key={s.stat.name} className='stat-progress-row'>
                        <span className='stat-progress-label'>
                          {STAT_LABELS[s.stat.name] || s.stat.name}
                        </span>
                        <span className='stat-progress-val'>{s.base_stat}</span>
                        <div className='stat-bar-outer'>
                          <motion.div
                            className='stat-bar-inner'
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                              background:
                                pct > 60
                                  ? "#4CAF50"
                                  : pct > 35
                                    ? "#FFC107"
                                    : "#FF5252",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Habilidades */}
            <Card
              className='detail-section-card glass-card'
              padding='m'
              type='container'
            >
              <h5 className='section-title'>✨ Habilidades Especiales</h5>
              <div className='abilities-flex'>
                {pokemon.abilities.map((a) => (
                  <div key={a.ability.name} className='ability-card'>
                    <span className='ability-name'>
                      {a.ability.name.replace("-", " ")}
                    </span>
                    {a.is_hidden && <span className='hidden-tag'>Oculta</span>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Cadena de Evolución Completa */}
        <EvolutionChain
          evolutionChainUrl={pokemon.evolutionChainUrl}
          currentPokemonName={pokemon.name}
        />
      </div>
    </motion.main>
  );
}

const STAT_LABELS = {
  hp: "Puntos de Salud",
  attack: "Ataque Físico",
  defense: "Defensa Física",
  "special-attack": "Ataque Especial",
  "special-defense": "Defensa Especial",
  speed: "Velocidad",
};
