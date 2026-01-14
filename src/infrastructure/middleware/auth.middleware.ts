import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '../../application/services/jwt.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
    partnerId?: string;
    megaSigla?: string;
    quinaSigla?: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

export const authorize = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Acesso negado.' });
      return;
    }

    next();
  };
};

