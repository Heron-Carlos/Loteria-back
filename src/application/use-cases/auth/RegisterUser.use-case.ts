import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { IPartnerRepository } from '../../../domain/interfaces/IPartnerRepository.interface';
import { IPartnerSiglaRepository } from '../../../domain/interfaces/IPartnerSiglaRepository.interface';
import { RegisterInput } from '../../validators/auth.validator';
import { User } from '../../../domain/entities/User.entity';
import { Partner } from '../../../domain/entities/Partner.entity';
import { PartnerSigla } from '../../../domain/entities/PartnerSigla.entity';
import { hashPassword } from '../../services/password.service';
import { randomUUID } from 'crypto';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly partnerRepository: IPartnerRepository,
    private readonly partnerSiglaRepository: IPartnerSiglaRepository
  ) {}

  async execute(input: RegisterInput): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(
      input.username
    );

    if (existingUser) {
      throw new Error('Nome de usuário já existe.');
    }

    const passwordHash = hashPassword(input.password);

    const newPartner: Partner = {
      id: randomUUID(),
    };

    await this.partnerRepository.create(newPartner);

    const newUser: User = {
      id: randomUUID(),
      username: input.username,
      passwordHash,
      role: input.role || 'Partner',
      partnerId: newPartner.id,
    };

    const createdUser = await this.userRepository.create(newUser);

    if (input.megaSigla) {
      const megaSigla: PartnerSigla = {
        id: randomUUID(),
        partnerId: newPartner.id,
        gameType: 'Mega',
        sigla: input.megaSigla,
      };
      await this.partnerSiglaRepository.create(megaSigla);
    }

    if (input.quinaSigla) {
      const quinaSigla: PartnerSigla = {
        id: randomUUID(),
        partnerId: newPartner.id,
        gameType: 'Quina',
        sigla: input.quinaSigla,
      };
      await this.partnerSiglaRepository.create(quinaSigla);
    }

    return createdUser;
  }
}

