import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { IPartnerSiglaRepository } from '../../../domain/interfaces/IPartnerSiglaRepository.interface';
import { LoginInput } from '../../validators/auth.validator';
import { LoginResponse } from '../../types/auth.types';
import { verifyPassword } from '../../services/password.service';
import { generateJwtToken } from '../../services/jwt.service';

export class AuthenticateUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly partnerSiglaRepository: IPartnerSiglaRepository
  ) {}

  async execute(input: LoginInput): Promise<LoginResponse | null> {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user) {
      return null;
    }

    const isPasswordValid = verifyPassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    const token = generateJwtToken(user);

    let megaSigla = '';
    let quinaSigla = '';

    if (user.partnerId) {
      const megaSiglas = await this.partnerSiglaRepository.findByPartnerIdAndGameType(
        user.partnerId,
        'Mega'
      );
      const quinaSiglas = await this.partnerSiglaRepository.findByPartnerIdAndGameType(
        user.partnerId,
        'Quina'
      );

      megaSigla = megaSiglas.length > 0 ? megaSiglas[0].sigla : '';
      quinaSigla = quinaSiglas.length > 0 ? quinaSiglas[0].sigla : '';
    }

    const response: LoginResponse = {
      token,
      username: user.username,
      userId: user.id,
      role: user.role,
      megaSigla,
      quinaSigla,
    };

    return response;
  }
}

