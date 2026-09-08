import { Schema, model, Document, Types } from 'mongoose';

export interface IBattle extends Document {
  userId?: Types.ObjectId;
  playerPokemon: {
    id: number;
    name: string;
    type: string;
  };
  rivalPokemon: {
    id: number;
    name: string;
    type: string;
  };
  winner: 'player' | 'rival';
  turns: number;
  log: string[];
  createdAt: Date;
}

const BattleSchema = new Schema<IBattle>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  playerPokemon: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  rivalPokemon: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  winner: { type: String, enum: ['player', 'rival'], required: true },
  turns: { type: Number, required: true },
  log: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Battle = model<IBattle>('Battle', BattleSchema);
