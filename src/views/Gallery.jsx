import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfesorOk from "../assets/img/PngItem_4780727.png";
import "./Gallery.css";

const Gallery = () => {
  const [pokemones, setPokemones] = useState([]);
  const [filteredPokemones, setFilteredPokemones] = useState([]);
  const [pokemon, setPokemon] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [msgError, setMsgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("select"); // 'select' o 'grid'

  const navigate = useNavigate();

  const getPokemones = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
      const { results } = await res.json();

      const pokemonData = results.sort((a, b) => a.name.localeCompare(b.name));
      setPokemones(pokemonData);
      setFilteredPokemones(pokemonData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setLoading(false);
    }
  };

  const goCard = async () => {
    if (!pokemon) {
      setMsgError(true);
      setTimeout(() => setMsgError(false), 3000);
      return;
    }
    navigate(`/gallery/${pokemon}`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value === "") {
      setFilteredPokemones(pokemones);
    } else {
      const filtered = pokemones.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredPokemones(filtered);
    }
  };

  const handleCardClick = (name) => {
    navigate(`/gallery/${name}`);
  };

  useEffect(() => {
    getPokemones();
  }, []);

  return (
    <main className='gallery-container'>
      <div className='container py-5'>
        {/* Header */}
        <div className='text-center mb-5 animate-fade-in'>
          <div className='professor-section mb-4'>
            <img
              src={ProfesorOk}
              alt='Profesor Pokémon'
              className='professor-image'
            />
          </div>

          <h1 className='display-4 fw-bold text-white mb-3'>
            <i className='fas fa-book-open text-warning me-3'></i>
            PokéDex Completa
          </h1>
          <p className='lead text-white-50 mb-4'>
            ¡Bienvenido, Entrenador! Selecciona tu Pokémon y descubre sus
            habilidades únicas
          </p>

          {/* Toggle View Mode */}
          <div className='view-toggle mb-4'>
            <button
              className={`btn-view ${viewMode === "select" ? "active" : ""}`}
              onClick={() => setViewMode("select")}
            >
              <i className='fas fa-list me-2'></i>
              Selector
            </button>
            <button
              className={`btn-view ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <i className='fas fa-th me-2'></i>
              Galería
            </button>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-5'>
            <div
              className='spinner-border text-warning'
              role='status'
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className='visually-hidden'>Cargando...</span>
            </div>
            <p className='text-white mt-3'>Cargando Pokédex...</p>
          </div>
        ) : (
          <>
            {viewMode === "select" ? (
              /* Vista de Selector */
              <div className='row justify-content-center'>
                <div className='col-12 col-lg-8 col-xl-6'>
                  <div className='selector-card animate-slide-up'>
                    {msgError && (
                      <div
                        className='alert alert-danger alert-dismissible fade show'
                        role='alert'
                      >
                        <i className='fas fa-exclamation-triangle me-2'></i>
                        <strong>¡Atención!</strong> Por favor selecciona un
                        Pokémon
                      </div>
                    )}

                    {/* Barra de búsqueda */}
                    <div className='search-box mb-4'>
                      <i className='fas fa-search search-icon'></i>
                      <input
                        type='text'
                        className='form-control search-input'
                        placeholder='Buscar Pokémon...'
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>

                    {/* Select personalizado */}
                    <div className='select-wrapper mb-4'>
                      <select
                        onChange={({ target }) => setPokemon(target.value)}
                        className='form-select pokemon-select'
                        value={pokemon}
                      >
                        <option value=''>🎯 Selecciona tu Pokémon</option>
                        {filteredPokemones.map(({ name }) => (
                          <option key={name} value={name}>
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </option>
                        ))}
                      </select>
                      <i className='fas fa-chevron-down select-arrow'></i>
                    </div>

                    {/* Botón de acción */}
                    <button
                      className='btn-pokemon-action w-100'
                      onClick={goCard}
                      disabled={!pokemon}
                    >
                      <i className='fas fa-eye me-2'></i>
                      Ver Detalles
                      <i className='fas fa-arrow-right ms-2'></i>
                    </button>

                    <p className='text-center text-white-50 mt-3 small'>
                      <i className='fas fa-info-circle me-2'></i>
                      {filteredPokemones.length} Pokémon disponibles
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Vista de Galería en Grid */
              <div className='animate-fade-in'>
                {/* Barra de búsqueda para grid */}
                <div className='row justify-content-center mb-4'>
                  <div className='col-12 col-md-8 col-lg-6'>
                    <div className='search-box'>
                      <i className='fas fa-search search-icon'></i>
                      <input
                        type='text'
                        className='form-control search-input'
                        placeholder='Buscar Pokémon...'
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                    <p className='text-center text-white-50 mt-2 small'>
                      Mostrando {filteredPokemones.length} de {pokemones.length}{" "}
                      Pokémon
                    </p>
                  </div>
                </div>

                {/* Grid de tarjetas */}
                <div className='row g-4'>
                  {filteredPokemones.slice(0, 150).map(({ name, url }) => {
                    const pokemonId = url.split("/").filter(Boolean).pop();
                    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

                    return (
                      <div
                        key={name}
                        className='col-6 col-sm-4 col-md-3 col-lg-2'
                      >
                        <div
                          className='pokemon-grid-card hover-lift'
                          onClick={() => handleCardClick(name)}
                        >
                          <div className='pokemon-card-image'>
                            <img
                              src={imageUrl}
                              alt={name}
                              onError={(e) => {
                                e.target.src =
                                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                                  pokemonId +
                                  ".png";
                              }}
                            />
                          </div>
                          <div className='pokemon-card-info'>
                            <span className='pokemon-id'>
                              #{pokemonId.padStart(3, "0")}
                            </span>
                            <h6 className='pokemon-name'>{name}</h6>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Gallery;
