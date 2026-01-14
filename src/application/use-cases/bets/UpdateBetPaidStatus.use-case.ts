import { IBetRepository } from '../../../domain/interfaces/IBetRepository.interface';
import { UpdateBetPaidStatusRequest } from '../../types/bet.types';

export class UpdateBetPaidStatusUseCase {
  constructor(private readonly betRepository: IBetRepository) {}

  async execute(request: UpdateBetPaidStatusRequest): Promise<void> {
    const bet = await this.betRepository.findById(request.betId);

    if (!bet) {
      throw new Error('Aposta não encontrada.');
    }

    if (bet.partnerId !== request.requesterPartnerId) {
      throw new Error('Você não tem permissão para atualizar esta aposta.');
    }

    await this.betRepository.update(request.betId, {
      isPaid: request.isPaid,
    });
  }
}

