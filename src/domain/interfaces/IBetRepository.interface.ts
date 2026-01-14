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

export interface IBetRepository {
  create(bet: Bet): Promise<Bet>;
  findById(id: string): Promise<Bet | null>;
  findByPartnerId(partnerId: string, gameType?: string): Promise<Bet[]>;
  findByPartnerIdPaginated(params: FindByPartnerIdParams): Promise<PaginatedBetsResult>;
  update(id: string, updates: Partial<Bet>): Promise<Bet | null>;
  delete(id: string): Promise<boolean>;
}

