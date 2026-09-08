import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonList, usePokemonDetails } from '../hooks/usePokemonData';
import { usePokemonTheme } from '../context/PokemonThemeContext';
import SearchPredictive from '../components/SearchPredictive';
import PokemonCard from '../components/PokemonCard';
import { Card, Loader, Button } from '@gravity-ui/uikit';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';

// Componente para cargar datos individuales de cada Pokémon en la grilla de manera diferida y segura
function PokemonCardLoader({ name, onClick }) {
  const { pokemon, isLoading, isError } = usePokemonDetails(name);

  if (isError) {
    const fallbackPokemon = { name };
    return <PokemonCard pokemon={fallbackPokemon} onClick={onClick} />;
  }

  if (isLoading || !pokemon) {
    return (
      <div className="pokemon-card-skeleton">
        <Card className="skeleton-inner" theme="normal" view="raised">
          <div className="skeleton-image pulse" />
          <div className="skeleton-title pulse" />
          <div className="skeleton-badges">
            <div className="skeleton-badge pulse" />
            <div className="skeleton-badge pulse" />
          </div>
        </Card>
      </div>
    );
  }

  return <PokemonCard pokemon={pokemon} onClick={onClick} />;
}

export default function Dashboard() {
  const { pokemones, isLoading } = usePokemonList();
  const { theme } = usePokemonTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const filteredPokemones = pokemones.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPokemones.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPokemones = filteredPokemones.slice(startIndex, startIndex + pageSize);

  const handleSelectPokemon = (name) => {
    navigate(`/gallery/${name}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      document.querySelector('.grid-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="dashboard-container">
      <div className="dashboard-content container">
        {/* Header interactivo */}
        <header className="dashboard-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="header-title-container"
          >
            <h1 className="main-title text-shadow">
              <span>Ultimate</span> Pokédex
            </h1>
            <p className="subtitle">
              Explora el universo Pokémon con físicas interactivas, filtrado predictivo y estadísticas avanzadas
            </p>
          </motion.div>

          {/* Buscador Predictivo */}
          <div className="search-section">
            <SearchPredictive 
              pokemones={pokemones} 
              onSelect={handleSelectPokemon} 
            />
          </div>
        </header>

        {/* Zona del Arena Battle Simulator CTA */}
        <motion.div 
          className="battle-cta-banner glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/battle')}
          whileHover={{ scale: 1.02 }}
        >
          <div className="battle-cta-glow"></div>
          <div className="battle-cta-content">
            <div className="battle-cta-text">
              <h3>⚔️ Simulador de Batalla en Vivo</h3>
              <p>Arrastra dos Pokémon a la arena para calcular afinidades, ventajas y simular combates interactivos.</p>
            </div>
            <Button size="xl" view="action" className="go-battle-btn">
              Entrar a la Arena
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="loader-container">
            <Loader size="l" />
            <p>Sincronizando con los servidores del Profesor Oak...</p>
          </div>
        ) : (
          <div className="grid-section">
            <div className="pagination-top-bar">
              <h2 className="section-title">
                📚 Catálogo Pokémon (Página {currentPage} de {totalPages})
              </h2>

              {/* Selector de Por Página */}
              <div className="page-size-selector">
                <label>Mostrar:</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="page-size-select"
                >
                  <option value={24}>24 por pág</option>
                  <option value={48}>48 por pág</option>
                  <option value={96}>96 por pág</option>
                  <option value={120}>120 por pág</option>
                </select>
              </div>
            </div>

            {/* Grilla de la página actual */}
            <motion.div 
              key={`${currentPage}-${pageSize}`}
              className="pokemon-grid"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.02,
                  },
                },
              }}
            >
              {currentPokemones.map((p) => (
                <motion.div
                  key={p.name}
                  variants={{
                    hidden: { opacity: 0, y: 15, scale: 0.95 },
                    show: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="grid-item"
                >
                  <PokemonCardLoader 
                    name={p.name} 
                    onClick={handleSelectPokemon} 
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Paginador Inferior Completo */}
            <div className="pagination-controls-container">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
                title="Primera página"
              >
                ⏮️ Primera
              </button>
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ◀ Anterior
              </button>

              <span className="page-indicator">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredPokemones.length} Pokémon)
              </span>

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente ▶
              </button>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                title="Última página"
              >
                Última ⏭️
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
