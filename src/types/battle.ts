export interface BattlePokemonSummary {
  id: number;
  name: string;
  type: string;
}

export interface BattleRecord {
  _id?: string;
  userId?: string;
  playerPokemon: BattlePokemonSummary;
  rivalPokemon: BattlePokemonSummary;
  winner: 'player' | 'rival';
  turns: number;
  log: string[];
  createdAt?: string;
}
