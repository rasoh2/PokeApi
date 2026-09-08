import { PokemonStat } from './pokemon';

export interface TeamMember {
  pokemonId: number;
  name: string;
  sprite: string;
  types: string[];
  stats: PokemonStat;
  moves?: string[];
  notes?: string;
}

export interface PokemonTeam {
  _id?: string;
  userId?: string;
  name: string;
  pokemons: TeamMember[];
  isPublic?: boolean;
  notes?: string;
  createdAt?: string;
}
