import { IBetRepository } from '../../../domain/interfaces/IBetRepository.interface';
import { DeleteBetRequest } from '../../types/bet.types';

export class DeleteBetUseCase {
  constructor(private readonly betRepository: IBetRepository) {}

  async execute(request: DeleteBetRequest): Promise<void> {
    const bet = await this.betRepository.findById(request.betId);

    if (!bet) {
      throw new Error('Aposta não encontrada.');
    }

    if (bet.partnerId !== request.requesterPartnerId) {
      throw new Error('Você não tem permissão para excluir esta aposta.');
    }

    const deleted = await this.betRepository.delete(request.betId);

    if (!deleted) {
      throw new Error('Erro ao excluir a aposta.');
    }
  }
}

