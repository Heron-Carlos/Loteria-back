import { PartnerSigla } from '../entities/PartnerSigla.entity';

export interface IPartnerSiglaRepository {
  create(partnerSigla: PartnerSigla): Promise<PartnerSigla>;
  findByPartnerId(partnerId: string, gameType?: 'Mega' | 'Quina'): Promise<PartnerSigla[]>;
  findByPartnerIdAndGameType(partnerId: string, gameType: 'Mega' | 'Quina'): Promise<PartnerSigla[]>;
  findById(id: string): Promise<PartnerSigla | null>;
  delete(id: string): Promise<boolean>;
}

