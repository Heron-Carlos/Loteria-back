import { IBetRepository } from '../../../domain/interfaces/IBetRepository.interface';
import { Bet } from '../../../domain/entities/Bet.entity';
import { GetBetsByPartnerIdRequest } from '../../types/bet.types';

export class GetBetsByPartnerIdUseCase {
  constructor(private readonly betRepository: IBetRepository) {}

  async execute(request: GetBetsByPartnerIdRequest): Promise<Bet[]> {
    const bets = await this.betRepository.findByPartnerId(
      request.partnerId,
      request.gameType
    );

    return bets;
  }
}

