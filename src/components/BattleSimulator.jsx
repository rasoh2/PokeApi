import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { retroAudio } from '../utils/retroAudio';
import { apiService } from '../services/apiService';
import confetti from 'canvas-confetti';
import './BattleSimulator.css';

// Tabla de Efectividad de Tipos
const TYPE_CHART = {
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
  normal: { rock: 0.5, steel: 0.5, ghost: 0 }
};

const DEFAULT_RIVAL_TEAM = [
  {
    pokemonId: 6,
    name: 'charizard',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    types: ['fire', 'flying'],
    stats: { hp: 160, attack: 84, defense: 78, specialAttack: 109, speed: 100 }
  },
  {
    pokemonId: 9,
    name: 'blastoise',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    types: ['water'],
    stats: { hp: 170, attack: 83, defense: 100, specialAttack: 85, speed: 78 }
  },
  {
    pokemonId: 3,
    name: 'venusaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    types: ['grass', 'poison'],
    stats: { hp: 165, attack: 82, defense: 83, specialAttack: 100, speed: 80 }
  }
];

export default function BattleSimulator({ playerTeam = [], onClose }) {
  const [playerPokemons, setPlayerPokemons] = useState([]);
  const [rivalPokemons, setRivalPokemons] = useState([]);
  
  const [playerActiveIdx, setPlayerActiveIdx] = useState(0);
  const [rivalActiveIdx, setRivalActiveIdx] = useState(0);

  const [battleMessage, setBattleMessage] = useState('¡Empieza el combate GBA! Selecciona tu acción.');
  const [menuMode, setMenuMode] = useState('main'); // 'main' | 'moves' | 'switch' | 'rules'
  const [isAnimating, setIsAnimating] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [turnCount, setTurnCount] = useState(1);
  const [battleLogs, setBattleLogs] = useState([]);

  // Impact flash states for target sprite
  const [hitEffectPlayer, setHitEffectPlayer] = useState(null);
  const [hitEffectRival, setHitEffectRival] = useState(null);

  useEffect(() => {
    let pTeam = playerTeam.length > 0 ? playerTeam.slice(0, 3) : DEFAULT_RIVAL_TEAM;
    const formattedPlayer = pTeam.map((p) => ({
      ...p,
      currentHp: p.stats?.hp || 150,
      maxHp: p.stats?.hp || 150,
      isFainted: false
    }));

    const formattedRival = DEFAULT_RIVAL_TEAM.map((p) => ({
      ...p,
      currentHp: p.stats?.hp || 150,
      maxHp: p.stats?.hp || 150,
      isFainted: false
    }));

    setPlayerPokemons(formattedPlayer);
    setRivalPokemons(formattedRival);
    setPlayerActiveIdx(0);
    setRivalActiveIdx(0);
  }, [playerTeam]);

  const activePlayer = playerPokemons[playerActiveIdx] || playerPokemons[0];
  const activeRival = rivalPokemons[rivalActiveIdx] || rivalPokemons[0];

  const getTypeMultiplier = (moveType, targetTypes) => {
    let mult = 1;
    targetTypes.forEach((t) => {
      const charMult = TYPE_CHART[moveType]?.[t];
      if (charMult !== undefined) mult *= charMult;
    });
    return mult;
  };

  const getMoves = (pokemon) => {
    if (!pokemon) return [];
    const primaryType = pokemon.types?.[0] || 'normal';
    const secondaryType = pokemon.types?.[1] || primaryType;

    return [
      { name: `Ataque ${primaryType.toUpperCase()}`, type: primaryType, power: 75 },
      { name: `Golpe ${secondaryType.toUpperCase()}`, type: secondaryType, power: 80 },
      { name: 'Impacto Veloz', type: 'normal', power: 60 },
      { name: 'Ataque Potente', type: primaryType, power: 95 }
    ];
  };

  const handleExecuteMove = async (move) => {
    if (isAnimating || battleOver || !activePlayer || !activeRival) return;
    setIsAnimating(true);
    setMenuMode('main');

    const playerSpeed = activePlayer.stats?.speed || 50;
    const rivalSpeed = activeRival.stats?.speed || 50;
    const playerFirst = playerSpeed >= rivalSpeed;

    if (playerFirst) {
      await executeAttack(activePlayer, activeRival, move, 'player');
      if (checkBattleState()) {
        setIsAnimating(false);
        return;
      }
      if (rivalPokemons[rivalActiveIdx]?.currentHp > 0) {
        const rivalMoves = getMoves(activeRival);
        const randomRivalMove = rivalMoves[Math.floor(Math.random() * rivalMoves.length)];
        await executeAttack(activeRival, activePlayer, randomRivalMove, 'rival');
        checkBattleState();
      }
    } else {
      const rivalMoves = getMoves(activeRival);
      const randomRivalMove = rivalMoves[Math.floor(Math.random() * rivalMoves.length)];
      await executeAttack(activeRival, activePlayer, randomRivalMove, 'rival');
      if (checkBattleState()) {
        setIsAnimating(false);
        return;
      }
      if (playerPokemons[playerActiveIdx]?.currentHp > 0) {
        await executeAttack(activePlayer, activeRival, move, 'player');
        checkBattleState();
      }
    }

    setTurnCount((prev) => prev + 1);
    setIsAnimating(false);
  };

  const executeAttack = async (attacker, defender, move, attackerSide) => {
    setBattleMessage(`¡${attacker.name.toUpperCase()} usó ${move.name}!`);
    retroAudio.playAttackSound(move.type);

    // Apply clean hit animation to defender sprite only
    if (attackerSide === 'player') {
      setHitEffectRival(move.type);
      setTimeout(() => setHitEffectRival(null), 450);
    } else {
      setHitEffectPlayer(move.type);
      setTimeout(() => setHitEffectPlayer(null), 450);
    }

    await new Promise((r) => setTimeout(r, 450));

    // Calculate Damage
    const multiplier = getTypeMultiplier(move.type, defender.types);
    const attackStat = attacker.stats?.attack || 50;
    const defenseStat = defender.stats?.defense || 50;

    let baseDamage = Math.floor((((2 * 50) / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2);
    let finalDamage = Math.max(8, Math.floor(baseDamage * multiplier));

    let effectText = '';
    if (multiplier > 1) {
      effectText = ' ¡Es súper efectivo!';
      retroAudio.playSuperEffectiveSound();
    } else if (multiplier === 0) {
      effectText = ' No afecta al objetivo...';
      finalDamage = 0;
    } else if (multiplier < 1) {
      effectText = ' No es muy efectivo...';
    }

    setBattleMessage(`¡${attacker.name.toUpperCase()} usó ${move.name}!${effectText}`);

    // Update HP cleanly with new immutable object references for React state
    if (attackerSide === 'player') {
      setRivalPokemons((prev) => {
        const copy = [...prev];
        const newHp = Math.max(0, copy[rivalActiveIdx].currentHp - finalDamage);
        copy[rivalActiveIdx] = {
          ...copy[rivalActiveIdx],
          currentHp: newHp,
          isFainted: newHp === 0
        };
        return copy;
      });
    } else {
      setPlayerPokemons((prev) => {
        const copy = [...prev];
        const newHp = Math.max(0, copy[playerActiveIdx].currentHp - finalDamage);
        copy[playerActiveIdx] = {
          ...copy[playerActiveIdx],
          currentHp: newHp,
          isFainted: newHp === 0
        };
        return copy;
      });
    }

    setBattleLogs((prev) => [
      ...prev,
      `Turno ${turnCount}: ${attacker.name.toUpperCase()} usó ${move.name} ➔ ${finalDamage} de daño a ${defender.name.toUpperCase()}.${effectText}`
    ]);

    await new Promise((r) => setTimeout(r, 800));
  };

  const handleSwitchPokemon = (newIdx) => {
    if (newIdx === playerActiveIdx || playerPokemons[newIdx]?.isFainted || isAnimating) return;
    setIsAnimating(true);
    setMenuMode('main');
    setPlayerActiveIdx(newIdx);
    setBattleMessage(`¡Adelante ${playerPokemons[newIdx].name.toUpperCase()}!`);
    
    setBattleLogs((prev) => [
      ...prev,
      `Turno ${turnCount}: Cambiaste a ${playerPokemons[newIdx].name.toUpperCase()}`
    ]);

    setTimeout(async () => {
      if (!battleOver && rivalPokemons[rivalActiveIdx]?.currentHp > 0) {
        const rivalMoves = getMoves(activeRival);
        const randomMove = rivalMoves[Math.floor(Math.random() * rivalMoves.length)];
        await executeAttack(activeRival, playerPokemons[newIdx], randomMove, 'rival');
        checkBattleState();
      }
      setIsAnimating(false);
    }, 800);
  };

  const checkBattleState = () => {
    const currentRival = rivalPokemons[rivalActiveIdx];
    if (currentRival && currentRival.currentHp <= 0) {
      retroAudio.playFaintSound();
      const nextRivalIdx = rivalPokemons.findIndex((p) => !p.isFainted);
      if (nextRivalIdx !== -1) {
        setRivalActiveIdx(nextRivalIdx);
        setBattleMessage(`¡El ${currentRival.name.toUpperCase()} enemigo fue debilitado! Entra ${rivalPokemons[nextRivalIdx].name.toUpperCase()}.`);
      } else {
        setBattleOver(true);
        setWinner('player');
        retroAudio.playVictorySound();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setBattleMessage('🏆 ¡VICTORIA! Has derrotado a todo el equipo rival.');
        saveBattleReportToMongoDB('Jugador');
        return true;
      }
    }

    const currentPlayer = playerPokemons[playerActiveIdx];
    if (currentPlayer && currentPlayer.currentHp <= 0) {
      retroAudio.playFaintSound();
      const nextPlayerIdx = playerPokemons.findIndex((p) => !p.isFainted);
      if (nextPlayerIdx !== -1) {
        setPlayerActiveIdx(nextPlayerIdx);
        setBattleMessage(`¡Tu ${currentPlayer.name.toUpperCase()} se debilitó! ¡Sal ${playerPokemons[nextPlayerIdx].name.toUpperCase()}!`);
      } else {
        setBattleOver(true);
        setWinner('rival');
        setBattleMessage('💀 Has sido derrotado. Todos tus Pokémon están fuera de combate.');
        saveBattleReportToMongoDB('Rival');
        return true;
      }
    }

    return false;
  };

  const saveBattleReportToMongoDB = async (winnerName) => {
    try {
      await apiService.saveBattleLog({
        playerTeam: playerPokemons.map((p) => p.name),
        rivalTeam: rivalPokemons.map((p) => p.name),
        winner: winnerName,
        turns: turnCount,
        logDetails: battleLogs
      });
    } catch (e) {
      console.warn('Battle report save error:', e);
    }
  };

  return (
    <div className="gba-arena-wrapper">
      <div className="gba-screen">
        {/* Top Header / Arena HUD */}
        <div className="gba-top-hud">
          <span className="gba-badge">🎮 Arena de Combate GBA 3v3</span>
          <button className="gba-rules-btn" onClick={() => setMenuMode(menuMode === 'rules' ? 'main' : 'rules')}>
            📜 Reglas
          </button>
          {onClose && <button className="gba-close-btn" onClick={onClose}>×</button>}
        </div>

        {/* Battlefield Stage */}
        <div className="gba-battlefield">
          {/* Enemy Side (Top Right) */}
          <div className="gba-fighter enemy-side">
            <div className="gba-status-card enemy-card">
              <div className="status-name-row">
                <span className="poke-name">{activeRival?.name?.toUpperCase()}</span>
                <span className="poke-level">Nv. 50</span>
              </div>
              <div className="hp-bar-container">
                <span className="hp-label">HP</span>
                <div className="hp-track">
                  <div
                    className="hp-fill"
                    style={{
                      width: `${Math.max(0, (activeRival?.currentHp / activeRival?.maxHp) * 100)}%`,
                      backgroundColor: activeRival?.currentHp > activeRival?.maxHp * 0.5 ? '#00FF66' : activeRival?.currentHp > activeRival?.maxHp * 0.2 ? '#FFD700' : '#FF3333'
                    }}
                  />
                </div>
              </div>
              <div className="hp-numbers">{activeRival?.currentHp} / {activeRival?.maxHp}</div>
            </div>

            <div className={`sprite-platform enemy-platform ${hitEffectRival ? `hit-flash hit-type-${hitEffectRival}` : ''}`}>
              <img src={activeRival?.sprite} alt={activeRival?.name} className="enemy-sprite" />
            </div>
          </div>

          {/* Player Side (Bottom Left) */}
          <div className="gba-fighter player-side">
            <div className={`sprite-platform player-platform ${hitEffectPlayer ? `hit-flash hit-type-${hitEffectPlayer}` : ''}`}>
              <img src={activePlayer?.sprite} alt={activePlayer?.name} className="player-sprite" />
            </div>

            <div className="gba-status-card player-card">
              <div className="status-name-row">
                <span className="poke-name">{activePlayer?.name?.toUpperCase()}</span>
                <span className="poke-level">Nv. 50</span>
              </div>
              <div className="hp-bar-container">
                <span className="hp-label">HP</span>
                <div className="hp-track">
                  <div
                    className="hp-fill"
                    style={{
                      width: `${Math.max(0, (activePlayer?.currentHp / activePlayer?.maxHp) * 100)}%`,
                      backgroundColor: activePlayer?.currentHp > activePlayer?.maxHp * 0.5 ? '#00FF66' : activePlayer?.currentHp > activePlayer?.maxHp * 0.2 ? '#FFD700' : '#FF3333'
                    }}
                  />
                </div>
              </div>
              <div className="hp-numbers">{activePlayer?.currentHp} / {activePlayer?.maxHp}</div>
            </div>
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="gba-dialogue-box">
          <p className="dialogue-text">{battleMessage}</p>
        </div>

        {/* Command Control Box */}
        <div className="gba-command-box">
          {menuMode === 'main' && !battleOver && (
            <div className="gba-main-controls">
              <button className="gba-btn btn-attack" disabled={isAnimating} onClick={() => setMenuMode('moves')}>
                ⚔️ ATACAR
              </button>
              <button className="gba-btn btn-switch" disabled={isAnimating} onClick={() => setMenuMode('switch')}>
                🔄 POKÉMON (3v3)
              </button>
            </div>
          )}

          {menuMode === 'moves' && !battleOver && (
            <div className="gba-moves-grid">
              {getMoves(activePlayer).map((move, idx) => (
                <button
                  key={idx}
                  className={`gba-move-btn move-type-${move.type}`}
                  disabled={isAnimating}
                  onClick={() => handleExecuteMove(move)}
                >
                  <span className="move-name">{move.name}</span>
                  <span className="move-power">Poder: {move.power}</span>
                </button>
              ))}
              <button className="gba-btn btn-back" onClick={() => setMenuMode('main')}>
                ↩ VOLVER
              </button>
            </div>
          )}

          {menuMode === 'switch' && !battleOver && (
            <div className="gba-switch-panel">
              <span className="panel-title">Selecciona Pokémon para enviar al combate:</span>
              <div className="switch-options-grid">
                {playerPokemons.map((p, idx) => (
                  <button
                    key={idx}
                    className={`switch-poke-card ${idx === playerActiveIdx ? 'active-poke' : ''} ${p.isFainted ? 'fainted-poke' : ''}`}
                    disabled={idx === playerActiveIdx || p.isFainted || isAnimating}
                    onClick={() => handleSwitchPokemon(idx)}
                  >
                    <img src={p.sprite} alt={p.name} className="switch-icon" />
                    <div className="switch-info">
                      <span className="switch-name">{p.name}</span>
                      <span className="switch-hp">HP: {p.currentHp}/{p.maxHp}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button className="gba-btn btn-back mt-2" onClick={() => setMenuMode('main')}>
                ↩ VOLVER
              </button>
            </div>
          )}

          {menuMode === 'rules' && (
            <div className="gba-rules-modal">
              <h4>📜 Reglamento de la Arena GBA</h4>
              <ul>
                <li>⚔️ **Formato:** Combate 1vs1 activo con equipos de 3 Pokémon.</li>
                <li>⚡ **Iniciativa:** El Pokémon más veloz (`speed`) efectúa el ataque primero.</li>
                <li>🎯 **Efectividad:** Bonificador de tipo (x2 Súper efectivo, x0.5 Poco efectivo, x0 Inmune).</li>
                <li>🔄 **Relevos:** Cambiar de Pokémon consume la acción del turno.</li>
                <li>💾 **Registro:** El reporte final se guarda automáticamente en MongoDB.</li>
              </ul>
              <button className="gba-btn btn-back mt-2" onClick={() => setMenuMode('main')}>
                Cerrar Reglas
              </button>
            </div>
          )}

          {battleOver && (
            <div className="gba-battle-over">
              <h3>{winner === 'player' ? '🎉 ¡HAS GANADO LA BATALLA!' : '💀 HAS SIDO DERROTADO'}</h3>
              <p>Registro sincronizado exitosamente con MongoDB Atlas.</p>
              <button className="gba-btn btn-attack" onClick={() => window.location.reload()}>
                🔄 Jugar Otra Batalla
              </button>
            </div>
          )}
        </div>

        {/* Historial de los últimos 6 movimientos */}
        <div className="gba-log-panel">
          <div className="log-panel-header">📜 Historial de los últimos 6 movimientos:</div>
          {battleLogs.length === 0 ? (
            <div className="log-empty">Sin movimientos aún. Selecciona un ataque para comenzar.</div>
          ) : (
            <div className="log-list">
              {battleLogs.slice(-6).map((logItem, index) => (
                <div key={index} className="log-entry">
                  {logItem}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
