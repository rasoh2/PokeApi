import { Router } from 'express';
import { saveBattle, getRecentBattles } from '../controllers/battleController';

const router = Router();

router.post('/', saveBattle);
router.get('/', getRecentBattles);

export default router;
