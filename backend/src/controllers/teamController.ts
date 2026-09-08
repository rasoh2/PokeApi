import { Response } from 'express';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, pokemons, isPublic, notes } = req.body;

    if (!name || !pokemons || !Array.isArray(pokemons) || pokemons.length === 0) {
      return res.status(400).json({ error: 'Team name and at least 1 pokemon are required' });
    }

    let userId = req.user?.id;

    // Fallback: If user is not logged in, find or create Guest Trainer so saving works seamlessly
    if (!userId) {
      let guestUser = await User.findOne({ email: 'guest@pokeapi.dev' });
      if (!guestUser) {
        guestUser = await User.create({
          name: 'Entrenador Invitado',
          email: 'guest@pokeapi.dev',
          passwordHash: 'guest_pass_hash_123',
          trainerLevel: 1
        });
      }
      userId = guestUser._id.toString();
    }

    const newTeam = await Team.create({
      userId,
      name,
      pokemons,
      isPublic: isPublic ?? true,
      notes
    });

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserTeams = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.json([]);
    const teams = await Team.find({ userId }).sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getPublicTeams = async (_req: AuthRequest, res: Response) => {
  try {
    const teams = await Team.find({ isPublic: true })
      .populate('userId', 'name avatar trainerLevel')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    const team = await Team.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found or unauthorized' });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
