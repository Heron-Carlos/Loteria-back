import { Bet } from '../../domain/entities/Bet.entity';

export type CreateBetRequest = {
  playerName: string;
  gameType: 'Mega' | 'Quina';
  selectedNumbers: number[];
  partnerId: string;
};

export type UpdateBetPaidStatusRequest = {
  betId: string;
  isPaid: boolean;
  requesterPartnerId: string;
};

export type DeleteBetRequest = {
  betId: string;
  requesterPartnerId: string;
};

export type GetBetsByPartnerIdRequest = {
  partnerId: string;
  gameType?: string;
  search?: string;
  isPaid?: boolean;
  page?: number;
  limit?: number;
};

export type PaginatedBetsResponse = {
  bets: Bet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
