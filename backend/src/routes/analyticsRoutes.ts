import { Router } from 'express';
import { getTopTeamPokemons, getTypePopularityInBattles, getBattleWinRates } from '../controllers/analyticsController';

const router = Router();

router.get('/top-pokemons', getTopTeamPokemons);
router.get('/type-popularity', getTypePopularityInBattles);
router.get('/win-rates', getBattleWinRates);

export default router;
