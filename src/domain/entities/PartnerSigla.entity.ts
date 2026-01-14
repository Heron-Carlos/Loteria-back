export interface PartnerSigla {
  id: string;
  partnerId: string;
  gameType: 'Mega' | 'Quina';
  sigla: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

