import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { PartnerDto } from '../../types/auth.types';

export class GetAllPartnersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<PartnerDto[]> {
    const partners = await this.userRepository.findAllPartners();

    const partnersDto: PartnerDto[] = partners.map((partner) => ({
      id: partner.id,
      partnerId: partner.partnerId ?? '',
      username: partner.username,
      megaSigla: partner.megaSigla,
      quinaSigla: partner.quinaSigla,
    }));

    return partnersDto;
  }
}

