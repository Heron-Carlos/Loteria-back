import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { IPartnerSiglaRepository } from '../../../domain/interfaces/IPartnerSiglaRepository.interface';
import { PartnerDto } from '../../types/auth.types';

export class GetAllPartnersUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly partnerSiglaRepository: IPartnerSiglaRepository
  ) {}

  async execute(): Promise<PartnerDto[]> {
    const partners = await this.userRepository.findAllPartners();

    const partnersDto = await Promise.all(
      partners.map(async (partner) => {
        let megaSigla = '';
        let quinaSigla = '';

        if (partner.partnerId) {
          const megaSiglas = await this.partnerSiglaRepository.findByPartnerIdAndGameType(
            partner.partnerId,
            'Mega'
          );
          const quinaSiglas = await this.partnerSiglaRepository.findByPartnerIdAndGameType(
            partner.partnerId,
            'Quina'
          );

          megaSigla = megaSiglas.length > 0 ? megaSiglas[0].sigla : '';
          quinaSigla = quinaSiglas.length > 0 ? quinaSiglas[0].sigla : '';
        }

        return {
          id: partner.id,
          partnerId: partner.partnerId ?? '',
          username: partner.username,
          megaSigla,
          quinaSigla,
        };
      })
    );

    return partnersDto;
  }
}

