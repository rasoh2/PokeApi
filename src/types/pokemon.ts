export interface PokemonStat {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonTypeInfo {
  name: string;
  url?: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites?: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: PokemonTypeInfo;
  }>;
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height?: number;
  weight?: number;
  abilities?: Array<{
    ability: {
      name: string;
    };
  }>;
}

export interface TypeCoverageSummary {
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}
