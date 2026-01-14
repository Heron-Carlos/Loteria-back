import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Password é obrigatório'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(6, 'Password deve ter no mínimo 6 caracteres'),
  role: z.enum(['Partner', 'Admin']),
  partnerId: z.string().uuid('PartnerId deve ser um UUID válido'),
  megaSigla: z.string().min(1, 'MegaSigla é obrigatória'),
  quinaSigla: z.string().min(1, 'QuinaSigla é obrigatória'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

