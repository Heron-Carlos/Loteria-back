export interface PartnerPaymentInfo {
  id: string;
  partnerId: string;
  type: 'PIX' | 'WHATSAPP';
  value: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

