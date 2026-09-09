import React, { useState, useEffect } from 'react';
import { usePokemonList } from '../hooks/usePokemonData';
import TypeCoverageMatrix from '../components/TypeCoverageMatrix';
import SearchPredictive from '../components/SearchPredictive';
import BattleSimulator from '../components/BattleSimulator';
import { apiService } from '../services/apiService';
import { Button, Card, TextInput, Modal, Loader } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';
import './TeamBuilderView.css';

export default function TeamBuilderView() {
  const [teamName, setTeamName] = useState('Mi Trío Competitivo GBA');
  const [teamNotes, setTeamNotes] = useState('Estrategia de ataque rápido y cobertura defensiva');
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [publicTeams, setPublicTeams] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'community'
  const [inArenaMode, setInArenaMode] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

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
        if (selectedPokemons.length < 3) {
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
      setSaveMessage('🎉 ¡Equipo guardado exitosamente en MongoDB Atlas!');
      loadPublicTeams();
    } catch (err) {
      setSaveMessage(`❌ Error al guardar en MongoDB: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (inArenaMode) {
    return (
      <div className="arena-mode-container">
        <BattleSimulator playerTeam={selectedPokemons} onClose={() => setInArenaMode(false)} />
      </div>
    );
  }

  return (
    <div className="team-builder-view">
      <div className="builder-header">
        <h1 className="builder-title">⚡ Team Builder 3v3 & Arena GBA</h1>
        <p className="builder-subtitle">
          Diseña tu trío de Pokémon, analiza la matriz defensiva y combate en la Arena estilo Game Boy Advance por turnos.
        </p>

        <div className="builder-tabs">
          <button
            className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            🛠️ Diseñador de Trío (3vs3)
          </button>
          <button
            className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            🌐 Equipos de la Comunidad (MongoDB)
          </button>
          <button
            className="tab-btn rules-tab-btn"
            onClick={() => setShowRulesModal(true)}
          >
            📜 Reglamento de Arena
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
                placeholder="Ej. Kanto Competitive Trio"
                size="l"
              />
            </div>

            <div className="form-row">
              <label>Notas Tácticas:</label>
              <TextInput
                value={teamNotes}
                onChange={(e) => setTeamNotes(e.target.value)}
                placeholder="Estrategia de combate, cobertura..."
                size="m"
              />
            </div>
          </div>

          <h2 className="section-title">Alineación del Trío ({selectedPokemons.length}/3)</h2>
          <div className="team-slots-grid gba-3slots">
            {[0, 1, 2].map((slotIndex) => {
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
                      <span>Agregar Pokémon #{slotIndex + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Type Coverage Matrix */}
          <TypeCoverageMatrix pokemons={selectedPokemons} />

          {/* Action Bar */}
          <div className="builder-actions-bar">
            <Button
              view="action"
              size="xl"
              className="arena-launch-btn"
              onClick={() => setInArenaMode(true)}
            >
              🎮 ¡Entrar a la Arena GBA (3v3)!
            </Button>

            <Button
              view="outlined"
              size="xl"
              disabled={isSaving || selectedPokemons.length === 0}
              onClick={handleSaveTeamToMongoDB}
            >
              {isSaving ? <Loader size="s" /> : '💾 Guardar Equipo en MongoDB'}
            </Button>
          </div>
          {saveMessage && <div className="save-message">{saveMessage}</div>}
        </div>
      )}

      {activeTab === 'community' && (
        <div className="community-content">
          <h2 className="section-title">Equipos Guardados en MongoDB Atlas</h2>
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

      {/* Modal for Arena Rules */}
      <Modal open={showRulesModal} onClose={() => setShowRulesModal(false)}>
        <div className="modal-rules-content">
          <h2>📜 Reglamento Oficial de la Arena GBA (3v3)</h2>
          <ul>
            <li>🎮 **Peleas 1v1 Activas:** Cada combate enfrenta a un Pokémon en el campo de batalla.</li>
            <li>👥 **Trío Competitivo:** Cada entrenador entra a la arena con un equipo de 3 Pokémon.</li>
            <li>⚡ **Iniciativa por Velocidad (`speed`):** El Pokémon con mayor atributo ataca primero en el turno.</li>
            <li>🎯 **Multiplicadores de Daño:** Bonificador de tipo (x2 Súper efectivo, x0.5 Poco efectivo, x0 Inmune).</li>
            <li>🔄 **Relevos Tácticos:** Puedes cambiar de Pokémon activo consumiendo la acción del turno.</li>
            <li>💾 **Sincronización:** Al concluir la batalla, el reporte se registra en **MongoDB Atlas**.</li>
          </ul>
          <Button view="action" size="l" onClick={() => setShowRulesModal(false)}>
            ¡Entendido, a Combatir!
          </Button>
        </div>
      </Modal>
    </div>
  );
}
