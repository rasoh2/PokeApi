import React, { useState, useEffect, useRef } from 'react';
import { usePokemonList } from '../hooks/usePokemonData';
import { apiService } from '../services/apiService';
import { Button, Card, Loader, TextInput } from '@gravity-ui/uikit';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizView.css';

export default function QuizView() {
  const { pokemones, isLoading } = usePokemonList();
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [trainerName, setTrainerName] = useState('Ash');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (pokemones && pokemones.length > 10 && questionCount === 0 && !isFetchingRef.current && !gameOver) {
      loadNextQuestion();
    }
  }, [pokemones, questionCount, gameOver]);

  const loadLeaderboard = async () => {
    const data = await apiService.getQuizLeaderboard();
    setLeaderboard(data);
  };

  const loadNextQuestion = async () => {
    if (isFetchingRef.current) return;
    setIsRevealed(false);

    if (questionCount >= 10) {
      setGameOver(true);
      return;
    }

    isFetchingRef.current = true;

    // Select target random pokemon
    const randomIndex = Math.floor(Math.random() * Math.min(151, pokemones.length));
    const target = pokemones[randomIndex];

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${target.name}`);
      const data = await res.json();

      const targetObject = {
        name: data.name,
        sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
        cry: data.cries?.latest || data.cries?.legacy
      };

      // Generate 3 wrong options
      const wrongOptions = [];
      while (wrongOptions.length < 3) {
        const rand = pokemones[Math.floor(Math.random() * pokemones.length)].name;
        if (rand !== target.name && !wrongOptions.includes(rand)) {
          wrongOptions.push(rand);
        }
      }

      const allChoices = [...wrongOptions, target.name].sort(() => Math.random() - 0.5);

      setCurrentPokemon(targetObject);
      setOptions(allChoices);
      setQuestionCount((prev) => prev + 1);
    } catch (err) {
      console.error('Error fetching quiz question:', err);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const handleOptionClick = (chosenName) => {
    if (isRevealed) return;
    setIsRevealed(true);

    if (chosenName === currentPokemon.name) {
      const points = 100 + streak * 25;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setStreak(0);
    }
  };

  const handleSaveScoreToMongoDB = async () => {
    if (hasSaved) return;
    setIsSubmitting(true);
    try {
      await apiService.saveQuizScore({
        trainerName,
        score,
        correctAnswers: Math.round(score / 100),
        totalQuestions: 10
      });
      setHasSaved(true);
      await loadLeaderboard();
    } catch (err) {
      console.error('Error saving score:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setStreak(0);
    setQuestionCount(0);
    setGameOver(false);
    setHasSaved(false);
    setCurrentPokemon(null);
    isFetchingRef.current = false;
  };

  if (isLoading || (!currentPokemon && !gameOver)) {
    return (
      <div className="quiz-loading">
        <Loader size="l" />
        <p>Preparando desafío Poké-Quiz...</p>
      </div>
    );
  }

  return (
    <div className="quiz-view">
      <div className="quiz-header">
        <h1 className="quiz-title">❓ ¿Quién es este Pokémon?</h1>
        <p className="quiz-subtitle">Demuestra tu conocimiento pokémon y registra tu marca en MongoDB.</p>
      </div>

      {!gameOver ? (
        <div className="quiz-container">
          <div className="quiz-scoreboard">
            <div className="score-pill">Puntos: <span>{score}</span></div>
            <div className="score-pill">Racha: <span>🔥 {streak}x</span></div>
            <div className="score-pill">Pregunta: <span>{questionCount}/10</span></div>
          </div>

          <Card className="quiz-card">
            <div className="silhouette-wrapper">
              <img
                src={currentPokemon?.sprite}
                alt="Who is that Pokemon"
                className={`pokemon-silhouette ${isRevealed ? 'revealed' : ''}`}
              />
            </div>

            <div className="quiz-options-grid">
              {options.map((opt) => (
                <button
                  key={opt}
                  className={`quiz-option-btn ${
                    isRevealed
                      ? opt === currentPokemon.name
                        ? 'correct'
                        : 'wrong'
                      : ''
                  }`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isRevealed}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>

            {isRevealed && (
              <motion.div
                className="quiz-reveal-banner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>¡Es <span className="highlight-name">{currentPokemon.name.toUpperCase()}</span>!</h3>
                <Button size="l" view="action" onClick={loadNextQuestion} className="next-btn">
                  {questionCount >= 10 ? 'Finalizar Quiz 🏁' : 'Siguiente Pregunta ➡'}
                </Button>
              </motion.div>
            )}
          </Card>
        </div>
      ) : (
        <Card className="quiz-gameover-card">
          <h2>🎉 ¡Desafío Completado!</h2>
          <p className="final-score">Puntaje Final: <span>{score} pts</span></p>

          <div className="save-score-box">
            <label>Ingresa tu nombre de Entrenador:</label>
            <TextInput
              value={trainerName}
              disabled={hasSaved}
              onChange={(e) => setTrainerName(e.target.value)}
              placeholder="Tu apodo"
            />
            <Button
              view="action"
              size="l"
              disabled={isSubmitting || hasSaved}
              onClick={handleSaveScoreToMongoDB}
            >
              {isSubmitting ? (
                <Loader size="s" />
              ) : hasSaved ? (
                '✅ ¡Puntaje Registrado en MongoDB!'
              ) : (
                '💾 Guardar en Tabla de Posiciones MongoDB'
              )}
            </Button>
          </div>

          <Button view="outlined" size="l" onClick={handleRestartQuiz} className="restart-btn">
            🔄 Jugar de Nuevo
          </Button>

          {/* Leaderboard Table */}
          <div className="leaderboard-section">
            <h3>🏆 Tabla de Clasificación Global (MongoDB)</h3>
            <div className="leaderboard-list">
              {leaderboard.map((item, idx) => (
                <div key={item._id || idx} className="leaderboard-item">
                  <span className="lb-rank">#{idx + 1}</span>
                  <span className="lb-name">{item.trainerName}</span>
                  <span className="lb-score">{item.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
