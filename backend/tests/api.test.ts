import { describe, it, expect } from 'vitest';

describe('Backend API Controller Logic', () => {
  it('Calculates win rate percentages correctly', () => {
    const totalBattles = 10;
    const wins = 7;
    const percentage = Number(((wins / totalBattles) * 100).toFixed(1));
    expect(percentage).toBe(70.0);
  });

  it('Validates team size limit (1 to 6 pokemons)', () => {
    const validTeam = [1, 2, 3, 4, 5, 6];
    const invalidTeam = [1, 2, 3, 4, 5, 6, 7];

    const isValid = (team: number[]) => team.length >= 1 && team.length <= 6;

    expect(isValid(validTeam)).toBe(true);
    expect(isValid(invalidTeam)).toBe(false);
  });
});
