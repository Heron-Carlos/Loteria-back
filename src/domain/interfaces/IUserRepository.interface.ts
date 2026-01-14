import { User } from '../entities/User.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllPartners(): Promise<User[]>;
}

