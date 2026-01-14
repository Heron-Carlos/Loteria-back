import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { LoginInput } from '../../validators/auth.validator';
import { LoginResponse } from '../../types/auth.types';
import { verifyPassword } from '../../services/password.service';
import { generateJwtToken } from '../../services/jwt.service';

export class AuthenticateUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

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

    const response: LoginResponse = {
      token,
      username: user.username,
      userId: user.id,
      role: user.role,
      megaSigla: user.megaSigla,
      quinaSigla: user.quinaSigla,
    };

    return response;
  }
}

