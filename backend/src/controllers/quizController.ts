import { Request, Response } from 'express';
import { QuizScore } from '../models/QuizScore';

export const saveQuizScore = async (req: Request, res: Response) => {
  try {
    const { trainerName, score, correctAnswers, totalQuestions } = req.body;
    const name = (trainerName || 'Entrenador Anónimo').trim();

    if (score === undefined || correctAnswers === undefined) {
      return res.status(400).json({ error: 'Score and correctAnswers are required' });
    }

    // High Score Upsert: Update if player achieved a new record for their name
    const existingRecord = await QuizScore.findOne({ trainerName: name });

    if (existingRecord) {
      if (score > existingRecord.score) {
        existingRecord.score = score;
        existingRecord.correctAnswers = correctAnswers;
        existingRecord.totalQuestions = totalQuestions || 10;
        existingRecord.createdAt = new Date();
        await existingRecord.save();
        return res.json(existingRecord);
      }
      return res.json(existingRecord);
    }

    const newScore = await QuizScore.create({
      trainerName: name,
      score,
      correctAnswers,
      totalQuestions: totalQuestions || 10
    });

    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTopQuizScores = async (_req: Request, res: Response) => {
  try {
    const leaderboard = await QuizScore.find()
      .sort({ score: -1, correctAnswers: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
