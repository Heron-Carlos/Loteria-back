import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { IPartnerSiglaRepository } from '../../../domain/interfaces/IPartnerSiglaRepository.interface';
import { PartnerDto } from '../../types/auth.types';

export class GetPartnerByUsernameUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly partnerSiglaRepository: IPartnerSiglaRepository
  ) {}

  async execute(username: string, gameType: 'Mega' | 'Quina'): Promise<PartnerDto | null> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    const isValidRole = user.role === 'Partner' || user.role === 'Admin';
    if (!isValidRole || !user.partnerId) {
      return null;
    }

    const [gameSiglas, otherGameSiglas] = await Promise.all([
      this.partnerSiglaRepository.findByPartnerIdAndGameType(user.partnerId, gameType),
      this.partnerSiglaRepository.findByPartnerIdAndGameType(
        user.partnerId,
        gameType === 'Mega' ? 'Quina' : 'Mega'
      ),
    ]);

    const gameSigla = gameSiglas[0]?.sigla ?? '';
    if (!gameSigla) {
      return null;
    }

    const otherGameSigla = otherGameSiglas[0]?.sigla ?? '';

    return {
      id: user.id,
      partnerId: user.partnerId,
      username: user.username,
      megaSigla: gameType === 'Mega' ? gameSigla : otherGameSigla,
      quinaSigla: gameType === 'Quina' ? gameSigla : otherGameSigla,
    };
  }
}

