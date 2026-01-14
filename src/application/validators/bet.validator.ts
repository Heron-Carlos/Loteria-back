import { z } from 'zod';

const gameTypeSchema = z.enum(['Mega', 'Quina']);

const megaNumbersSchema = z
  .array(z.number().int().min(1).max(60))
  .length(10, 'Devem ser escolhidos exatamente 10 números');

const quinaNumbersSchema = z
  .array(z.number().int().min(1).max(80))
  .length(10, 'Devem ser escolhidos exatamente 10 números');

const createBetBaseSchema = z.object({
  playerName: z.string().min(1, 'O nome do jogador é obrigatório'),
  gameType: gameTypeSchema,
  selectedNumbers: z.array(z.number().int()),
  partnerId: z.string().uuid('PartnerId deve ser um UUID válido'),
});

export const createBetSchema = createBetBaseSchema.superRefine((data, ctx) => {
  if (data.gameType === 'Mega') {
    const result = megaNumbersSchema.safeParse(data.selectedNumbers);
    if (!result.success) {
      result.error.errors.forEach((error) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error.message,
          path: ['selectedNumbers'],
        });
      });
    }
  }

  if (data.gameType === 'Quina') {
    const result = quinaNumbersSchema.safeParse(data.selectedNumbers);
    if (!result.success) {
      result.error.errors.forEach((error) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error.message,
          path: ['selectedNumbers'],
        });
      });
    }
  }
});

export type CreateBetInput = z.infer<typeof createBetSchema>;

