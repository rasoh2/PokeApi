import React, { useState, useEffect, useRef } from 'react';
import { TextInput } from '@gravity-ui/uikit';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchPredictive.css';

export default function SearchPredictive({ pokemones, onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Cerrar sugerencias al hacer clic fuera del componente
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value) => {
    setQuery(value);
    if (value.trim().length > 1) {
      const filtered = pokemones
        .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Mostrar máximo 5
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onSelect(name);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      // Buscar primera coincidencia
      const match = pokemones.find((p) => p.name.toLowerCase().includes(query.toLowerCase()));
      if (match) {
        handleSuggestionClick(match.name);
      }
    }
  };

  return (
    <div className="predictive-search-container" ref={containerRef}>
      <div className="input-wrapper">
        <TextInput
          placeholder="¿Quién es ese Pokémon?..."
          size="xl"
          value={query}
          onUpdate={handleInputChange}
          onKeyDown={handleSearchSubmit}
          className="gravity-search-input"
          hasClear
        />
        <div className="pokeball-search-icon">🔴</div>
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="suggestions-dropdown glass-card"
          >
            <div className="dropdown-header">
              <span>Sugerencias de la Pokédex</span>
            </div>
            <ul className="suggestions-list">
              {suggestions.map((p, idx) => {
                const pokemonId = p.url.split('/').filter(Boolean).pop();
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

                return (
                  <motion.li
                    key={p.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(p.name)}
                  >
                    <div className="silhouette-container">
                      <img
                        src={imageUrl}
                        alt="Who's that Pokemon?"
                        className="suggestion-pokemon-img silhouette"
                        onError={(e) => {
                          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                        }}
                      />
                    </div>
                    <div className="suggestion-info">
                      <span className="suggestion-name">{p.name}</span>
                      <span className="suggestion-id">#{String(pokemonId).padStart(3, '0')}</span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
