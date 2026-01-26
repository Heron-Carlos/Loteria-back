import { IPartnerPaymentInfoRepository } from '../../../domain/interfaces/IPartnerPaymentInfoRepository.interface';

export class DeletePartnerPaymentInfoUseCase {
  constructor(
    private readonly partnerPaymentInfoRepository: IPartnerPaymentInfoRepository
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.partnerPaymentInfoRepository.findById(id);

    if (!existing) {
      throw new Error('Informação de pagamento não encontrada.');
    }

    const deleted = await this.partnerPaymentInfoRepository.delete(id);

    if (!deleted) {
      throw new Error('Erro ao excluir informação de pagamento.');
    }
  }
}

