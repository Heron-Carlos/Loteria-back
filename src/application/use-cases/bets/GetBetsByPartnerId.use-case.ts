import { IBetRepository } from '../../../domain/interfaces/IBetRepository.interface';
import { GetBetsByPartnerIdRequest, PaginatedBetsResponse } from '../../types/bet.types';

export class GetBetsByPartnerIdUseCase {
  constructor(private readonly betRepository: IBetRepository) {}

  async execute(request: GetBetsByPartnerIdRequest): Promise<PaginatedBetsResponse> {
    const page = request.page ?? 1;
    const limit = request.limit ?? 50;

    const result = await this.betRepository.findByPartnerIdPaginated({
      partnerId: request.partnerId,
      gameType: request.gameType,
      search: request.search,
      isPaid: request.isPaid,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      bets: result.bets,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
