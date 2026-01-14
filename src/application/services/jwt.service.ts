import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User.entity';

export const generateJwtToken = (user: User): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não configurado.');
  }

  const expirationHours = parseInt(
    process.env.JWT_EXPIRATION_HOURS || '24',
    10
  );

  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    partnerId: user.partnerId,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: `${expirationHours}h`,
  });

  return token;
};

export const verifyJwtToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não configurado.');
  }

  const decoded = jwt.verify(token, secret);
  return decoded;
};

