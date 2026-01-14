import { IPartnerRepository } from '../../domain/interfaces/IPartnerRepository.interface';
import { Partner } from '../../domain/entities/Partner.entity';
import { getDatabaseConnection } from '../database/connection';

export class PartnerRepository implements IPartnerRepository {
  async create(partner: Partner): Promise<Partner> {
    const connection = getDatabaseConnection();

    const query = `
      INSERT INTO partners (id, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4)
    `;

    await connection.query(query, [
      partner.id,
      partner.createdAt || new Date(),
      partner.updatedAt || new Date(),
      partner.deletedAt || null,
    ]);

    return partner;
  }

  async findById(id: string): Promise<Partner | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, created_at, updated_at, deleted_at
      FROM partners
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToPartner(row);
  }

  async findAll(): Promise<Partner[]> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, created_at, updated_at, deleted_at
      FROM partners
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await connection.query(query);
    return result.rows.map((row) => this.mapRowToPartner(row));
  }

  private mapRowToPartner(row: any): Partner {
    return {
      id: row.id,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }
}

