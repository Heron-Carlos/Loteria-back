import { IUserRepository } from '../../domain/interfaces/IUserRepository.interface';
import { User } from '../../domain/entities/User.entity';
import { getDatabaseConnection } from '../database/connection';

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const connection = getDatabaseConnection();

    const query = `
      INSERT INTO users (id, username, password_hash, role, partner_id, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await connection.query(query, [
      user.id,
      user.username,
      user.passwordHash,
      user.role,
      user.partnerId,
      user.createdAt || new Date(),
      user.updatedAt || new Date(),
      user.deletedAt || null,
    ]);

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, username, password_hash, role, partner_id, created_at, updated_at, deleted_at
      FROM users
      WHERE username = $1 AND deleted_at IS NULL
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
      SELECT id, username, password_hash, role, partner_id, created_at, updated_at, deleted_at
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
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
      SELECT id, username, password_hash, role, partner_id, created_at, updated_at, deleted_at
      FROM users
      WHERE role = 'Partner' AND deleted_at IS NULL
      ORDER BY username
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
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }
}

