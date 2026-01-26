import { IPartnerPaymentInfoRepository } from '../../../domain/interfaces/IPartnerPaymentInfoRepository.interface';
import { PartnerPaymentInfo } from '../../../domain/entities/PartnerPaymentInfo.entity';
import { CreatePartnerPaymentInfoInput } from '../../validators/partner-payment-info.validator';
import { randomUUID } from 'crypto';

export class CreatePartnerPaymentInfoUseCase {
  constructor(
    private readonly partnerPaymentInfoRepository: IPartnerPaymentInfoRepository
  ) {}

  async execute(input: CreatePartnerPaymentInfoInput): Promise<PartnerPaymentInfo> {
    const paymentInfo: PartnerPaymentInfo = {
      id: randomUUID(),
      partnerId: input.partnerId,
      type: input.type,
      value: input.value,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    return this.partnerPaymentInfoRepository.create(paymentInfo);
  }
}

