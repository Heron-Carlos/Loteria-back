import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './infrastructure/middleware/error-handler.middleware';
import { betsRouter } from './infrastructure/routes/bets.routes';
import { authRouter } from './infrastructure/routes/auth.routes';

dotenv.config();

const createApp = (): express.Application => {
  const app = express();

  // Configurar CORS para aceitar requisições de qualquer origem
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    })
  );
  
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

// Exportar o app para a Vercel
export const app = createApp();

// Iniciar o servidor apenas se não estiver em ambiente serverless
if (process.env.VERCEL !== '1') {
  startServer();
}

