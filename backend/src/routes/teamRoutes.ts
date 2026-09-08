import { Router } from 'express';
import { createTeam, getUserTeams, getPublicTeams, deleteTeam } from '../controllers/teamController';
import { authenticateToken, optionalAuthToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/public', getPublicTeams);
router.post('/', optionalAuthToken, createTeam);
router.get('/', authenticateToken, getUserTeams);
router.delete('/:id', authenticateToken, deleteTeam);

export default router;
