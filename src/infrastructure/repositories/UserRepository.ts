import { IUserRepository } from '../../domain/interfaces/IUserRepository.interface';
import { User } from '../../domain/entities/User.entity';
import { getDatabaseConnection } from '../database/connection';

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const connection = getDatabaseConnection();

    const query = `
      INSERT INTO users (id, username, password_hash, role, partner_id, mega_sigla, quina_sigla)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await connection.query(query, [
      user.id,
      user.username,
      user.passwordHash,
      user.role,
      user.partnerId,
      user.megaSigla,
      user.quinaSigla,
    ]);

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, username, password_hash, role, partner_id, mega_sigla, quina_sigla
      FROM users
      WHERE username = $1
    `;

    const result = await connection.query(query, [username]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToUser(row);
  }

  async findById(id: string): Promise<User | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, username, password_hash, role, partner_id, mega_sigla, quina_sigla
      FROM users
      WHERE id = $1
    `;

    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToUser(row);
  }

  async findAllPartners(): Promise<User[]> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, username, password_hash, role, partner_id, mega_sigla, quina_sigla
      FROM users
      WHERE role = 'Partner'
    `;

    const result = await connection.query(query);
    return result.rows.map((row) => this.mapRowToUser(row));
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      username: row.username || '',
      passwordHash: row.password_hash || '',
      role: row.role || 'Partner',
      partnerId: row.partner_id || null,
      megaSigla: row.mega_sigla || '',
      quinaSigla: row.quina_sigla || '',
    };
  }
}

