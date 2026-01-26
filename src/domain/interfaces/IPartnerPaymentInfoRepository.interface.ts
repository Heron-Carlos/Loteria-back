import { PartnerPaymentInfo } from '../entities/PartnerPaymentInfo.entity';

export interface IPartnerPaymentInfoRepository {
  create(paymentInfo: PartnerPaymentInfo): Promise<PartnerPaymentInfo>;
  findById(id: string): Promise<PartnerPaymentInfo | null>;
  findByPartnerId(partnerId: string): Promise<PartnerPaymentInfo[]>;
  update(paymentInfo: PartnerPaymentInfo): Promise<PartnerPaymentInfo>;
  delete(id: string): Promise<boolean>;
}

