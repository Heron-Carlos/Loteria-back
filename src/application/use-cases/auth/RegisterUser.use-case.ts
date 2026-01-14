import { IUserRepository } from '../../../domain/interfaces/IUserRepository.interface';
import { RegisterInput } from '../../validators/auth.validator';
import { User } from '../../../domain/entities/User.entity';
import { hashPassword } from '../../services/password.service';
import { randomUUID } from 'crypto';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(
      input.username
    );

    if (existingUser) {
      throw new Error('Nome de usuário já existe.');
    }

    const passwordHash = hashPassword(input.password);

    const newUser: User = {
      id: randomUUID(),
      username: input.username,
      passwordHash,
      role: input.role,
      partnerId: input.partnerId,
      megaSigla: input.megaSigla,
      quinaSigla: input.quinaSigla,
    };

    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }
}

