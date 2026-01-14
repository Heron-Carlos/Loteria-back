import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './infrastructure/middleware/error-handler.middleware';
import { betsRouter } from './infrastructure/routes/bets.routes';
import { authRouter } from './infrastructure/routes/auth.routes';

dotenv.config();

const createApp = (): express.Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRouter);
  app.use('/api/bets', betsRouter);

  app.use(errorHandler);

  return app;
};

const startServer = (): void => {
  const app = createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

