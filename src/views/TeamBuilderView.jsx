import React, { useState, useEffect } from 'react';
import { usePokemonList, usePokemonDetails } from '../hooks/usePokemonData';
import TypeCoverageMatrix from '../components/TypeCoverageMatrix';
import SearchPredictive from '../components/SearchPredictive';
import { apiService } from '../services/apiService';
import { Button, Card, TextInput, Modal, Loader } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';
import './TeamBuilderView.css';

export default function TeamBuilderView() {
  const [teamName, setTeamName] = useState('Mi Equipo Legendario');
  const [teamNotes, setTeamNotes] = useState('');
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [searchPokemon, setSearchPokemon] = useState('');
  const [publicTeams, setPublicTeams] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'community'

  const { pokemones } = usePokemonList();

  useEffect(() => {
    loadPublicTeams();
  }, []);

  const loadPublicTeams = async () => {
    const teams = await apiService.getPublicTeams();
    setPublicTeams(teams);
  };

  const handleAddPokemonToSlot = async (name) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = await res.json();

      const newPokemon = {
        pokemonId: data.id,
        name: data.name,
        sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        stats: {
          hp: data.stats[0]?.base_stat || 50,
          attack: data.stats[1]?.base_stat || 50,
          defense: data.stats[2]?.base_stat || 50,
          specialAttack: data.stats[3]?.base_stat || 50,
          specialDefense: data.stats[4]?.base_stat || 50,
          speed: data.stats[5]?.base_stat || 50
        }
      };

      if (activeSlot !== null && activeSlot < selectedPokemons.length) {
        const updated = [...selectedPokemons];
        updated[activeSlot] = newPokemon;
        setSelectedPokemons(updated);
      } else {
        if (selectedPokemons.length < 6) {
          setSelectedPokemons([...selectedPokemons, newPokemon]);
        }
      }
      setActiveSlot(null);
    } catch (err) {
      console.error('Error fetching pokemon details for team:', err);
    }
  };

  const handleRemovePokemon = (index) => {
    setSelectedPokemons(selectedPokemons.filter((_, i) => i !== index));
  };

  const handleSaveTeamToMongoDB = async () => {
    if (selectedPokemons.length === 0) {
      setSaveMessage('⚠️ Agrega al menos 1 Pokémon a tu equipo.');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    try {
      await apiService.saveTeam({
        name: teamName,
        pokemons: selectedPokemons,
        notes: teamNotes,
        isPublic: true
      });
      setSaveMessage('🎉 ¡Equipo guardado exitosamente en MongoDB!');
      loadPublicTeams();
    } catch (err) {
      setSaveMessage(`❌ Error al guardar en MongoDB: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="team-builder-view">
      <div className="builder-header">
        <h1 className="builder-title">⚡ Team Builder & Analizador Táctico</h1>
        <p className="builder-subtitle">
          Crea tu alineación competitiva de 6 Pokémon, analiza su cobertura defensiva en tiempo real y guárdala en MongoDB.
        </p>

        <div className="builder-tabs">
          <button
            className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            🛠️ Diseñador de Equipo
          </button>
          <button
            className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            🌐 Equipos de la Comunidad (MongoDB)
          </button>
        </div>
      </div>

      {activeTab === 'builder' && (
        <div className="builder-content">
          <div className="team-form-card">
            <div className="form-row">
              <label>Nombre del Equipo:</label>
              <TextInput
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ej. Kanto Competitive Squad"
                size="l"
              />
            </div>

            <div className="form-row">
              <label>Notas Tácticas:</label>
              <TextInput
                value={teamNotes}
                onChange={(e) => setTeamNotes(e.target.value)}
                placeholder="Estrategia principal, combos, items..."
                size="m"
              />
            </div>
          </div>

          <h2 className="section-title">Alineación del Equipo ({selectedPokemons.length}/6)</h2>
          <div className="team-slots-grid">
            {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
              const pokemon = selectedPokemons[slotIndex];
              return (
                <div key={slotIndex} className="team-slot-card">
                  {pokemon ? (
                    <motion.div
                      className="slot-filled"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <button className="remove-btn" onClick={() => handleRemovePokemon(slotIndex)}>
                        ×
                      </button>
                      <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-sprite" />
                      <h4 className="pokemon-name">{pokemon.name}</h4>
                      <div className="pokemon-types">
                        {pokemon.types.map((t) => (
                          <span key={t} className={`type-tag type-${t}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div
                      className="slot-empty"
                      onClick={() => setActiveSlot(slotIndex)}
                    >
                      <span className="plus-icon">+</span>
                      <span>Agregar Pokémon</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Type Coverage Matrix */}
          <TypeCoverageMatrix pokemons={selectedPokemons} />

          {/* Action Bar */}
          <div className="builder-actions">
            <Button
              view="action"
              size="xl"
              disabled={isSaving || selectedPokemons.length === 0}
              onClick={handleSaveTeamToMongoDB}
            >
              {isSaving ? <Loader size="s" /> : '💾 Guardar Equipo en MongoDB'}
            </Button>
            {saveMessage && <div className="save-message">{saveMessage}</div>}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="community-content">
          <h2 className="section-title">Equipos Guardados en la Base de Datos (MongoDB)</h2>
          {publicTeams.length === 0 ? (
            <div className="empty-state">No hay equipos públicos guardados aún en MongoDB.</div>
          ) : (
            <div className="community-teams-grid">
              {publicTeams.map((team) => (
                <Card key={team._id} className="community-team-card">
                  <h3 className="team-card-title">{team.name}</h3>
                  {team.notes && <p className="team-card-notes">{team.notes}</p>}
                  <div className="community-sprites">
                    {team.pokemons.map((p, idx) => (
                      <img key={idx} src={p.sprite} alt={p.name} title={p.name} className="micro-sprite" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for selecting Pokemon */}
      <Modal open={activeSlot !== null} onClose={() => setActiveSlot(null)}>
        <div className="modal-search-content">
          <h3>Seleccionar Pokémon para el Slot #{activeSlot !== null ? activeSlot + 1 : ''}</h3>
          <SearchPredictive
            pokemones={pokemones}
            onSelectPokemon={(name) => handleAddPokemonToSlot(name)}
          />
        </div>
      </Modal>
    </div>
  );
}
