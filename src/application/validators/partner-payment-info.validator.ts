import { z } from 'zod';

export const createPartnerPaymentInfoSchema = z.object({
  partnerId: z.string().uuid('PartnerId deve ser um UUID válido'),
  type: z.enum(['PIX', 'WHATSAPP'], {
    errorMap: () => ({ message: 'Tipo deve ser PIX ou WHATSAPP' }),
  }),
  value: z.string().min(1, 'Valor é obrigatório').max(255, 'Valor muito longo'),
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
});

export const updatePartnerPaymentInfoSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  type: z.enum(['PIX', 'WHATSAPP'], {
    errorMap: () => ({ message: 'Tipo deve ser PIX ou WHATSAPP' }),
  }),
  value: z.string().min(1, 'Valor é obrigatório').max(255, 'Valor muito longo'),
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
});

export type CreatePartnerPaymentInfoInput = z.infer<typeof createPartnerPaymentInfoSchema>;
export type UpdatePartnerPaymentInfoInput = z.infer<typeof updatePartnerPaymentInfoSchema>;

