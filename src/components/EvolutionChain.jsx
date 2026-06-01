import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from '@gravity-ui/uikit';
import './EvolutionChain.css';

export default function EvolutionChain({ evolutionChainUrl, currentPokemonName }) {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evolvingId, setEvolvingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!evolutionChainUrl) return;

    const fetchEvolutionChain = async () => {
      try {
        setLoading(true);
        const res = await fetch(evolutionChainUrl);
        const data = await res.json();
        
        // Función recursiva para recorrer el árbol de evoluciones
        const evolutions = [];
        let current = data.chain;

        do {
          const pokemonName = current.species.name;
          const id = current.species.url.split('/').filter(Boolean).pop();
          evolutions.push({
            name: pokemonName,
            id: parseInt(id),
          });
          current = current.evolves_to[0]; // Simplificar tomando la primera línea
        } while (current);

        setChain(evolutions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching evolution chain:', err);
        setLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [evolutionChainUrl]);

  const handleEvoClick = (name, id) => {
    if (name === currentPokemonName) return;

    // Disparar destello luminoso
    setEvolvingId(id);
    setTimeout(() => {
      setEvolvingId(null);
      navigate(`/gallery/${name}`);
    }, 850); // Tiempo del flash de evolución
  };

  if (loading) {
    return (
      <div className="evo-loader">
        <Loader size="m" />
        <p>Cargando línea evolutiva...</p>
      </div>
    );
  }

  if (chain.length <= 1) {
    return (
      <div className="evo-no-chain">
        <p>✨ Este Pokémon no evoluciona o es único ✨</p>
      </div>
    );
  }

  return (
    <div className="evolution-chain-container">
      <h5 className="section-title">
        🧬 Línea de Evolución
      </h5>
      
      <div className="evolution-flow">
        {chain.map((p, idx) => {
          const isCurrent = p.name === currentPokemonName;
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
          const isEvolving = evolvingId === p.id;

          return (
            <React.Fragment key={p.name}>
              {/* Nodo del Pokémon */}
              <div 
                className={`evo-node ${isCurrent ? 'current-node' : ''} ${isEvolving ? 'evolving-flash' : ''}`}
                onClick={() => handleEvoClick(p.name, p.id)}
              >
                {/* Efecto de destello de luz */}
                {isEvolving && <div className="evolution-light-flash" />}

                <div className="evo-image-wrapper">
                  <img 
                    src={imageUrl} 
                    alt={p.name} 
                    className="evo-pokemon-img"
                    onError={(e) => {
                      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
                    }}
                  />
                </div>
                <span className="evo-name">{p.name}</span>
                <span className="evo-id">#{String(p.id).padStart(3, '0')}</span>
              </div>

              {/* Flecha conectora */}
              {idx < chain.length - 1 && (
                <div className="evo-connector">
                  <motion.span 
                    className="connector-arrow"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ⚡
                  </motion.span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
