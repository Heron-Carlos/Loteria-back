import { IBetRepository } from '../../../domain/interfaces/IBetRepository.interface';
import { Bet } from '../../../domain/entities/Bet.entity';
import { CreateBetInput } from '../../validators/bet.validator';
import { randomUUID } from 'crypto';

export class CreateBetUseCase {
  constructor(private readonly betRepository: IBetRepository) {}

  async execute(input: CreateBetInput): Promise<string> {
    const bet: Bet = {
      id: randomUUID(),
      playerName: input.playerName,
      gameType: input.gameType,
      selectedNumbers: [...input.selectedNumbers].sort((a, b) => a - b),
      isPaid: false,
      partnerId: input.partnerId,
    };

    const createdBet = await this.betRepository.create(bet);
    return createdBet.id;
  }
}

