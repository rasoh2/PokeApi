import { Request, Response } from 'express';
import { Battle } from '../models/Battle';
import { Team } from '../models/Team';

// Aggregation Pipeline 1: Most picked Pokemons in saved teams
export const getTopTeamPokemons = async (_req: Request, res: Response) => {
  try {
    const topPokemons = await Team.aggregate([
      { $unwind: '$pokemons' },
      {
        $group: {
          _id: '$pokemons.pokemonId',
          name: { $first: '$pokemons.name' },
          sprite: { $first: '$pokemons.sprite' },
          types: { $first: '$pokemons.types' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(topPokemons);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Aggregation Pipeline 2: Most active Pokemon types in battles
export const getTypePopularityInBattles = async (_req: Request, res: Response) => {
  try {
    const typeStats = await Battle.aggregate([
      {
        $project: {
          types: ['$playerPokemon.type', '$rivalPokemon.type'],
          winner: 1
        }
      },
      { $unwind: '$types' },
      {
        $group: {
          _id: '$types',
          totalBattles: { $sum: 1 }
        }
      },
      { $sort: { totalBattles: -1 } }
    ]);

    res.json(typeStats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Aggregation Pipeline 3: Win Rate stats by Pokemon
export const getBattleWinRates = async (_req: Request, res: Response) => {
  try {
    const winRates = await Battle.aggregate([
      {
        $project: {
          pokemonName: '$playerPokemon.name',
          isWin: { $cond: [{ $eq: ['$winner', 'player'] }, 1, 0] }
        }
      },
      {
        $group: {
          _id: '$pokemonName',
          totalBattles: { $sum: 1 },
          wins: { $sum: '$isWin' }
        }
      },
      {
        $project: {
          pokemonName: '$_id',
          totalBattles: 1,
          wins: 1,
          winRatePercentage: {
            $round: [{ $multiply: [{ $divide: ['$wins', '$totalBattles'] }, 100] }, 1]
          }
        }
      },
      { $sort: { totalBattles: -1, winRatePercentage: -1 } },
      { $limit: 10 }
    ]);

    res.json(winRates);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
