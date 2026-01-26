import { IPartnerPaymentInfoRepository } from '../../../domain/interfaces/IPartnerPaymentInfoRepository.interface';
import { PartnerPaymentInfo } from '../../../domain/entities/PartnerPaymentInfo.entity';

export class GetPartnerPaymentInfoUseCase {
  constructor(
    private readonly partnerPaymentInfoRepository: IPartnerPaymentInfoRepository
  ) {}

  async execute(partnerId: string): Promise<PartnerPaymentInfo[]> {
    return this.partnerPaymentInfoRepository.findByPartnerId(partnerId);
  }
}

