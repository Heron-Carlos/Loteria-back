import { IPartnerSiglaRepository } from '../../domain/interfaces/IPartnerSiglaRepository.interface';
import { PartnerSigla } from '../../domain/entities/PartnerSigla.entity';
import { getDatabaseConnection } from '../database/connection';

export class PartnerSiglaRepository implements IPartnerSiglaRepository {
  async create(partnerSigla: PartnerSigla): Promise<PartnerSigla> {
    const connection = getDatabaseConnection();

    const query = `
      INSERT INTO partner_siglas (id, partner_id, game_type, sigla, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await connection.query(query, [
      partnerSigla.id,
      partnerSigla.partnerId,
      partnerSigla.gameType,
      partnerSigla.sigla,
      partnerSigla.createdAt || new Date(),
      partnerSigla.updatedAt || new Date(),
      partnerSigla.deletedAt || null,
    ]);

    return partnerSigla;
  }

  async findByPartnerId(partnerId: string, gameType?: 'Mega' | 'Quina'): Promise<PartnerSigla[]> {
    const connection = getDatabaseConnection();

    let query = `
      SELECT id, partner_id, game_type, sigla, created_at, updated_at, deleted_at
      FROM partner_siglas
      WHERE partner_id = $1 AND deleted_at IS NULL
    `;

    const params: any[] = [partnerId];

    if (gameType) {
      query += ' AND game_type = $2';
      params.push(gameType);
    }

    query += ' ORDER BY game_type, sigla';

    const result = await connection.query(query, params);
    return result.rows.map((row) => this.mapRowToPartnerSigla(row));
  }

  async findByPartnerIdAndGameType(partnerId: string, gameType: 'Mega' | 'Quina'): Promise<PartnerSigla[]> {
    return this.findByPartnerId(partnerId, gameType);
  }

  async findById(id: string): Promise<PartnerSigla | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, partner_id, game_type, sigla, created_at, updated_at, deleted_at
      FROM partner_siglas
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToPartnerSigla(row);
  }

  async delete(id: string): Promise<boolean> {
    const connection = getDatabaseConnection();

    const query = `
      UPDATE partner_siglas 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await connection.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }

  private mapRowToPartnerSigla(row: any): PartnerSigla {
    return {
      id: row.id,
      partnerId: row.partner_id,
      gameType: row.game_type,
      sigla: row.sigla,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }
}

