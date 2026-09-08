import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import battleRoutes from './routes/battleRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import quizRoutes from './routes/quizRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PokeAPI MongoDB Backend',
    timestamp: new Date().toISOString()
  });
});

const startServer = (portToTry: number) => {
  const server = app.listen(portToTry, () => {
    console.log(`🚀 PokeAPI Backend running on http://localhost:${portToTry}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is in use. Trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
