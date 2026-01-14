import { Partner } from '../entities/Partner.entity';

export interface IPartnerRepository {
  create(partner: Partner): Promise<Partner>;
  findById(id: string): Promise<Partner | null>;
  findAll(): Promise<Partner[]>;
}

