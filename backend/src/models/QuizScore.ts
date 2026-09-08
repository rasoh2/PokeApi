import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizScore extends Document {
  trainerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  createdAt: Date;
}

const QuizScoreSchema = new Schema<IQuizScore>({
  trainerName: { type: String, required: true, default: 'Entrenador Anónimo' },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const QuizScore = model<IQuizScore>('QuizScore', QuizScoreSchema);
