import { Bet } from '../entities/Bet.entity';

export interface IBetRepository {
  create(bet: Bet): Promise<Bet>;
  findById(id: string): Promise<Bet | null>;
  findByPartnerId(partnerId: string, gameType?: string): Promise<Bet[]>;
  update(id: string, updates: Partial<Bet>): Promise<Bet | null>;
  delete(id: string): Promise<boolean>;
}

