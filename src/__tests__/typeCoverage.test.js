// Simple unit test for Type Effectiveness Logic
import { describe, it, expect } from 'vitest';

const TYPE_CHART = {
  fire: { grass: 2, water: 0.5 },
  water: { fire: 2, grass: 0.5 },
  electric: { water: 2, ground: 0 }
};

function calculateDamageMultiplier(attackType, defenderTypes) {
  let mult = 1;
  defenderTypes.forEach((defType) => {
    if (TYPE_CHART[attackType] && TYPE_CHART[attackType][defType] !== undefined) {
      mult *= TYPE_CHART[attackType][defType];
    }
  });
  return mult;
}

describe('Type Effectiveness Calculations', () => {
  it('Fire attack against Grass pokemon should be super effective (2x)', () => {
    const mult = calculateDamageMultiplier('fire', ['grass']);
    expect(mult).toBe(2);
  });

  it('Water attack against Fire pokemon should be super effective (2x)', () => {
    const mult = calculateDamageMultiplier('water', ['fire']);
    expect(mult).toBe(2);
  });

  it('Electric attack against Ground pokemon should be immune (0x)', () => {
    const mult = calculateDamageMultiplier('electric', ['ground']);
    expect(mult).toBe(0);
  });
});
