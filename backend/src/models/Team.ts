import { Schema, model, Document, Types } from 'mongoose';

export interface ITeamPokemon {
  pokemonId: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  moves?: string[];
  notes?: string;
}

export interface ITeam extends Document {
  userId: Types.ObjectId;
  name: string;
  pokemons: ITeamPokemon[];
  isPublic: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamPokemonSchema = new Schema<ITeamPokemon>({
  pokemonId: { type: Number, required: true },
  name: { type: String, required: true },
  sprite: { type: String, required: true },
  types: [{ type: String, required: true }],
  stats: {
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    specialAttack: { type: Number, required: true },
    specialDefense: { type: Number, required: true },
    speed: { type: Number, required: true }
  },
  moves: [{ type: String }],
  notes: { type: String }
}, { _id: false });

const TeamSchema = new Schema<ITeam>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  pokemons: {
    type: [TeamPokemonSchema],
    validate: [
      (val: ITeamPokemon[]) => val.length >= 1 && val.length <= 6,
      'A Pokemon team must have between 1 and 6 pokemons'
    ]
  },
  isPublic: { type: Boolean, default: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Team = model<ITeam>('Team', TeamSchema);
