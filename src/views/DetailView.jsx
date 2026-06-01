import React, { useEffect } from "react";
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

  // Actualizar los colores en el contexto global cuando se carga el Pokémon
  useEffect(() => {
    if (pokemon) {
      const primaryHex = typeColorsHex[primaryType] || "#1a1a2e";
      const secondaryHex = typeColorsHex[secondaryType] || "#16161a";
      updateActiveColors({
        bg: primaryHex,
        bgSecondary: secondaryHex,
        gradient: `linear-gradient(135deg, ${primaryHex} 0%, ${secondaryHex} 100%)`,
      });
    }
  }, [pokemon, primaryType, secondaryType]);

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
    "--mesh-color-1": typeColorsHex[primaryType],
    "--mesh-color-2": secondaryType ? typeColorsHex[secondaryType] : "#2a2a2a",
    "--mesh-color-3": "#1c1c1e",
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
