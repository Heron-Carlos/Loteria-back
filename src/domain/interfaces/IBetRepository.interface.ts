import { Bet } from '../entities/Bet.entity';

export type FindByPartnerIdParams = {
  partnerId: string;
  gameType?: string;
  search?: string;
  isPaid?: boolean;
  page?: number;
  limit?: number;
};

export type PaginatedBetsResult = {
  bets: Bet[];
  total: number;
};

export type BetStats = {
  total: number;
  paid: number;
  pending: number;
  mega: number;
  quina: number;
};

export interface IBetRepository {
  create(bet: Bet): Promise<Bet>;
  findById(id: string): Promise<Bet | null>;
  findByPartnerId(partnerId: string, gameType?: string): Promise<Bet[]>;
  findByPartnerIdPaginated(params: FindByPartnerIdParams): Promise<PaginatedBetsResult>;
  getStatsByPartnerId(partnerId: string): Promise<BetStats>;
  update(id: string, updates: Partial<Bet>): Promise<Bet | null>;
  delete(id: string): Promise<boolean>;
}

