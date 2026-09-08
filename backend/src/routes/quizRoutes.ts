import { Router } from 'express';
import { saveQuizScore, getTopQuizScores } from '../controllers/quizController';

const router = Router();

router.post('/score', saveQuizScore);
router.get('/leaderboard', getTopQuizScores);

export default router;
