import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Card, Loader } from '@gravity-ui/uikit';
import { motion } from 'framer-motion';
import './AnalyticsView.css';

export default function AnalyticsView() {
  const [topPokemons, setTopPokemons] = useState([]);
  const [typeStats, setTypeStats] = useState([]);
  const [winRates, setWinRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [topRes, typesRes, winRes] = await Promise.all([
        apiService.getTopTeamPokemons(),
        apiService.getTypePopularity(),
        apiService.getWinRates()
      ]);

      setTopPokemons(topRes);
      setTypeStats(typesRes);
      setWinRates(winRes);
    } catch (err) {
      console.error('Error loading MongoDB analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <Loader size="l" />
        <p>Procesando Agregaciones de MongoDB en tiempo real...</p>
      </div>
    );
  }

  return (
    <div className="analytics-view">
      <div className="analytics-header">
        <h1 className="analytics-title">📊 MongoDB Meta Analytics & Insights</h1>
        <p className="analytics-subtitle">
          Métricas consolidadas directamente mediante **MongoDB Aggregation Pipelines** (`$unwind`, `$group`, `$sort`, `$project`).
        </p>
      </div>

      <div className="analytics-grid">
        {/* Aggregation 1: Most Picked Pokemons */}
        <Card className="analytics-card">
          <h2 className="card-header">⭐ Pokémon más Populares en Equipos Guardados</h2>
          <p className="card-subtext">Obtenido mediante `$unwind: "$pokemons"` y `$group` por `pokemonId`</p>
          <div className="ranking-list">
            {topPokemons.length === 0 ? (
              <p className="no-data">No hay suficientes equipos en MongoDB aún.</p>
            ) : (
              topPokemons.map((p, idx) => (
                <div key={p._id || idx} className="ranking-item">
                  <span className="rank-number">#{idx + 1}</span>
                  <img src={p.sprite} alt={p.name} className="rank-sprite" />
                  <span className="rank-name">{p.name}</span>
                  <span className="rank-count">{p.count} selección(es)</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Aggregation 2: Win Rates */}
        <Card className="analytics-card">
          <h2 className="card-header">🏆 Tasa de Victoria (% WinRate) en Combates</h2>
          <p className="card-subtext">Calculado dinámicamente con `$divide` y `$multiply` en la colección de Batallas</p>
          <div className="winrate-list">
            {winRates.length === 0 ? (
              <p className="no-data">No hay batallas registradas en MongoDB aún.</p>
            ) : (
              winRates.map((w, idx) => (
                <div key={idx} className="winrate-item">
                  <span className="win-name">{w.pokemonName}</span>
                  <div className="winrate-bar-container">
                    <motion.div
                      className="winrate-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${w.winRatePercentage}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="win-percentage">{w.winRatePercentage}% ({w.wins}/{w.totalBattles})</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Aggregation 3: Type Popularity */}
        <Card className="analytics-card full-width">
          <h2 className="card-header">🛡️ Presencia por Tipo de Pokémon en Combates</h2>
          <div className="types-grid">
            {typeStats.length === 0 ? (
              <p className="no-data">Esperando datos de batallas en MongoDB...</p>
            ) : (
              typeStats.map((t) => (
                <div key={t._id} className="type-stat-card">
                  <span className="type-stat-name">{t._id.toUpperCase()}</span>
                  <span className="type-stat-count">{t.totalBattles} Combate(s)</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
