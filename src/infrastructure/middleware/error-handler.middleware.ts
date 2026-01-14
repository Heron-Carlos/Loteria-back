import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    res.status(400).json({
      message: 'Erro de validação',
      errors,
    });
    return;
  }

  if (err.message.includes('não encontrada') || err.message.includes('não encontrado')) {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err.message.includes('permissão') || err.message.includes('Acesso negado')) {
    res.status(403).json({ message: err.message });
    return;
  }

  if (err.message.includes('já existe')) {
    res.status(400).json({ message: err.message });
    return;
  }

  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
};

