/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Card.css";

const Card = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { pokemon } = useParams();
  const navigate = useNavigate();

  const typeColors = {
    normal: {
      bg: "#A8A878",
      gradient: "linear-gradient(135deg, #A8A878 0%, #8a8a59 100%)",
    },
    fire: {
      bg: "#F08030",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)",
    },
    water: {
      bg: "#6890F0",
      gradient: "linear-gradient(135deg, #4FC3F7 0%, #2196F3 100%)",
    },
    electric: {
      bg: "#F8D030",
      gradient: "linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)",
    },
    grass: {
      bg: "#78C850",
      gradient: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
    },
    ice: {
      bg: "#98D8D8",
      gradient: "linear-gradient(135deg, #81D4FA 0%, #4FC3F7 100%)",
    },
    fighting: {
      bg: "#C03028",
      gradient: "linear-gradient(135deg, #EF5350 0%, #E53935 100%)",
    },
    poison: {
      bg: "#A040A0",
      gradient: "linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)",
    },
    ground: {
      bg: "#E0C068",
      gradient: "linear-gradient(135deg, #FFD54F 0%, #FBC02D 100%)",
    },
    flying: {
      bg: "#A890F0",
      gradient: "linear-gradient(135deg, #9FA8DA 0%, #7986CB 100%)",
    },
    psychic: {
      bg: "#F85888",
      gradient: "linear-gradient(135deg, #F48FB1 0%, #EC407A 100%)",
    },
    bug: {
      bg: "#A8B820",
      gradient: "linear-gradient(135deg, #AED581 0%, #9CCC65 100%)",
    },
    rock: {
      bg: "#B8A038",
      gradient: "linear-gradient(135deg, #A1887F 0%, #8D6E63 100%)",
    },
    ghost: {
      bg: "#705898",
      gradient: "linear-gradient(135deg, #9575CD 0%, #7E57C2 100%)",
    },
    dragon: {
      bg: "#7038F8",
      gradient: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
    },
    dark: {
      bg: "#705848",
      gradient: "linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)",
    },
    steel: {
      bg: "#B8B8D0",
      gradient: "linear-gradient(135deg, #90CAF9 0%, #64B5F6 100%)",
    },
    fairy: {
      bg: "#EE99AC",
      gradient: "linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)",
    },
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

  useEffect(() => {
    getPokemon();
  }, [pokemon]);

  const getPokemon = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

      if (res.status === 404) {
        navigate(`/`);
        return;
      }

      const data = await res.json();

      // Obtener información adicional de la especie
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();

      // Obtener descripción en español
      const flavorText =
        speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "es",
        ) ||
        speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en",
        );

      setPokemonData({
        ...data,
        description:
          flavorText?.flavor_text.replace(/\f/g, " ") ||
          "Sin descripción disponible",
        genera:
          speciesData.genera.find((g) => g.language.name === "es")?.genus ||
          "Pokémon",
        evolutionChainUrl: speciesData.evolution_chain.url,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='card-loading'>
        <div
          className='spinner-border text-warning'
          role='status'
          style={{ width: "4rem", height: "4rem" }}
        >
          <span className='visually-hidden'>Cargando...</span>
        </div>
        <p className='text-white mt-3 fw-bold'>Capturando Pokémon...</p>
      </div>
    );
  }

  if (error || !pokemonData) {
    return (
      <div className='card-error'>
        <i className='fas fa-exclamation-triangle fa-4x text-warning mb-3'></i>
        <h3 className='text-white'>No se pudo cargar el Pokémon</h3>
        <button
          className='btn btn-outline-warning mt-3'
          onClick={() => navigate("/gallery")}
        >
          Volver a la Galería
        </button>
      </div>
    );
  }

  const primaryType = pokemonData.types[0].type.name;
  const typeStyle = typeColors[primaryType] || typeColors.normal;

  return (
    <main
      className='pokemon-detail-container'
      style={{ background: typeStyle.gradient }}
    >
      <div className='container py-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
            {/* Botón de regreso */}
            <button
              className='btn-back mb-4'
              onClick={() => navigate("/gallery")}
            >
              <i className='fas fa-arrow-left me-2'></i>
              Volver
            </button>

            <div className='pokemon-detail-card animate-scale-in'>
              {/* Header */}
              <div className='pokemon-header'>
                <div>
                  <span className='pokemon-number'>
                    #{String(pokemonData.id).padStart(3, "0")}
                  </span>
                  <h1 className='pokemon-title'>
                    {pokemon.charAt(0).toUpperCase() + pokemon.slice(1)}
                  </h1>
                  <p className='pokemon-genera'>{pokemonData.genera}</p>
                </div>
                <div className='pokemon-types'>
                  {pokemonData.types.map((type, index) => (
                    <span
                      key={index}
                      className='type-badge'
                      style={{ background: typeColors[type.type.name]?.bg }}
                    >
                      {typeIcons[type.type.name]} {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Imagen principal */}
              <div className='pokemon-image-section'>
                <div className='image-glow-effect'></div>
                <img
                  src={
                    pokemonData.sprites.other.dream_world.front_default ||
                    pokemonData.sprites.other["official-artwork"].front_default
                  }
                  alt={pokemon}
                  className='pokemon-main-img'
                />
              </div>

              {/* Descripción */}
              <div className='pokemon-description'>
                <p>
                  <i className='fas fa-book-open me-2'></i>
                  {pokemonData.description}
                </p>
              </div>

              {/* Información física */}
              <div className='row g-3 mb-4'>
                <div className='col-6'>
                  <div className='info-box'>
                    <i className='fas fa-weight-hanging text-warning mb-2'></i>
                    <h6>Peso</h6>
                    <p className='fw-bold'>
                      {(pokemonData.weight / 10).toFixed(1)} kg
                    </p>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='info-box'>
                    <i className='fas fa-ruler-vertical text-info mb-2'></i>
                    <h6>Altura</h6>
                    <p className='fw-bold'>
                      {(pokemonData.height / 10).toFixed(1)} m
                    </p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className='pokemon-stats'>
                <h5 className='section-title mb-3'>
                  <i className='fas fa-chart-bar me-2'></i>
                  Estadísticas Base
                </h5>
                {pokemonData.stats.map((stat, index) => {
                  const statNames = {
                    hp: "PS",
                    attack: "Ataque",
                    defense: "Defensa",
                    "special-attack": "At. Especial",
                    "special-defense": "Def. Especial",
                    speed: "Velocidad",
                  };
                  const percentage = (stat.base_stat / 255) * 100;

                  return (
                    <div key={index} className='stat-row'>
                      <div className='stat-label'>
                        {statNames[stat.stat.name] || stat.stat.name}
                      </div>
                      <div className='stat-value'>{stat.base_stat}</div>
                      <div className='stat-bar-container'>
                        <div
                          className='stat-bar'
                          style={{
                            width: `${percentage}%`,
                            background:
                              percentage > 70
                                ? "#4CAF50"
                                : percentage > 40
                                  ? "#FFC107"
                                  : "#FF5252",
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                <div className='stat-total'>
                  <span>Total:</span>
                  <span className='fw-bold'>
                    {pokemonData.stats.reduce(
                      (sum, stat) => sum + stat.base_stat,
                      0,
                    )}
                  </span>
                </div>
              </div>

              {/* Habilidades */}
              <div className='pokemon-abilities mt-4'>
                <h5 className='section-title mb-3'>
                  <i className='fas fa-star me-2'></i>
                  Habilidades
                </h5>
                <div className='abilities-grid'>
                  {pokemonData.abilities.map((ability, index) => (
                    <div key={index} className='ability-badge'>
                      <i className='fas fa-bolt me-2'></i>
                      {ability.ability.name.replace("-", " ")}
                      {ability.is_hidden && (
                        <span className='hidden-badge'>Oculta</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Movimientos destacados */}
              <div className='pokemon-moves mt-4'>
                <h5 className='section-title mb-3'>
                  <i className='fas fa-fist-raised me-2'></i>
                  Movimientos (Primeros 10)
                </h5>
                <div className='moves-grid'>
                  {pokemonData.moves.slice(0, 10).map((move, index) => (
                    <div key={index} className='move-chip'>
                      {move.move.name.replace("-", " ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Card;
