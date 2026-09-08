import { Request, Response } from 'express';
import { Battle } from '../models/Battle';

export const saveBattle = async (req: Request, res: Response) => {
  try {
    const { playerPokemon, rivalPokemon, winner, turns, log } = req.body;

    if (!playerPokemon || !rivalPokemon || !winner || !turns) {
      return res.status(400).json({ error: 'Incomplete battle log data' });
    }

    const battle = await Battle.create({
      playerPokemon,
      rivalPokemon,
      winner,
      turns,
      log: log || []
    });

    res.status(201).json(battle);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRecentBattles = async (_req: Request, res: Response) => {
  try {
    const battles = await Battle.find().sort({ createdAt: -1 }).limit(20);
    res.json(battles);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
