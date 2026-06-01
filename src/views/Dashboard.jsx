import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonList, usePokemonDetails } from '../hooks/usePokemonData';
import { usePokemonTheme } from '../context/PokemonThemeContext';
import SearchPredictive from '../components/SearchPredictive';
import PokemonCard from '../components/PokemonCard';
import { Card, Loader, Button } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';
import './Dashboard.css';

// Componente para cargar datos individuales de cada Pokémon en la grilla de manera diferida y segura
function PokemonCardLoader({ name, onClick }) {
  const { pokemon, isLoading, isError } = usePokemonDetails(name);

  if (isError) {
    // Fallback: Si falla la carga de detalles, renderizamos la tarjeta básica sin tipo
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
  const [itemsToShow, setItemsToShow] = useState(24); // Inicial de 24 para rapidez de renderizado y tipo coloreado
  const navigate = useNavigate();

  const filteredPokemones = pokemones.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loaderRef = useRef(null);

  // Cargar más de 48 en 48 de forma local instantánea al hacer scroll usando Intersection Observer
  useEffect(() => {
    if (isLoading || filteredPokemones.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && itemsToShow < filteredPokemones.length) {
          setItemsToShow((prev) => prev + 24);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, filteredPokemones.length, itemsToShow]);

  const handleSelectPokemon = (name) => {
    navigate(`/gallery/${name}`);
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
              Explora el universo Pokémon con físicas interactivas y estadísticas avanzadas
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
            <h2 className="section-title">
              📚 Listado de Pokémon (Mostrando {Math.min(itemsToShow, filteredPokemones.length)} de {filteredPokemones.length})
            </h2>

            {/* Grilla paginada localmente */}
            <motion.div 
              className="pokemon-grid"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.003,
                  },
                },
              }}
            >
              {filteredPokemones.slice(0, itemsToShow).map((p) => (
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

            {/* Indicador de carga al final del scroll */}
            {itemsToShow < filteredPokemones.length && (
              <div className="scroll-observer" ref={loaderRef}>
                <Loader size="m" />
                <span className="observer-text">Cargando más criaturas...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
