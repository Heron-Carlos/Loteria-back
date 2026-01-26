import { IPartnerPaymentInfoRepository } from '../../../domain/interfaces/IPartnerPaymentInfoRepository.interface';
import { UpdatePartnerPaymentInfoInput } from '../../validators/partner-payment-info.validator';

export class UpdatePartnerPaymentInfoUseCase {
  constructor(
    private readonly partnerPaymentInfoRepository: IPartnerPaymentInfoRepository
  ) {}

  async execute(input: UpdatePartnerPaymentInfoInput): Promise<void> {
    const existing = await this.partnerPaymentInfoRepository.findById(input.id);

    if (!existing) {
      throw new Error('Informação de pagamento não encontrada.');
    }

    await this.partnerPaymentInfoRepository.update({
      ...existing,
      type: input.type,
      value: input.value,
      name: input.name,
      updatedAt: new Date(),
    });
  }
}

