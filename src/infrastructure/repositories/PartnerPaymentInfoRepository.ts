import { IPartnerPaymentInfoRepository } from '../../domain/interfaces/IPartnerPaymentInfoRepository.interface';
import { PartnerPaymentInfo } from '../../domain/entities/PartnerPaymentInfo.entity';
import { getDatabaseConnection } from '../database/connection';

export class PartnerPaymentInfoRepository implements IPartnerPaymentInfoRepository {
  async create(paymentInfo: PartnerPaymentInfo): Promise<PartnerPaymentInfo> {
    const connection = getDatabaseConnection();
    const now = new Date();

    const query = `
      INSERT INTO partner_payment_info (id, partner_id, type, value, name, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await connection.query(query, [
      paymentInfo.id,
      paymentInfo.partnerId,
      paymentInfo.type,
      paymentInfo.value,
      paymentInfo.name,
      paymentInfo.createdAt ?? now,
      paymentInfo.updatedAt ?? now,
      paymentInfo.deletedAt ?? null,
    ]);

    return paymentInfo;
  }

  async findById(id: string): Promise<PartnerPaymentInfo | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, partner_id, type, value, name, created_at, updated_at, deleted_at
      FROM partner_payment_info
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPaymentInfo(result.rows[0]);
  }

  async findByPartnerId(partnerId: string): Promise<PartnerPaymentInfo[]> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, partner_id, type, value, name, created_at, updated_at, deleted_at
      FROM partner_payment_info
      WHERE partner_id = $1 AND deleted_at IS NULL
      ORDER BY type, name, value
    `;

    const result = await connection.query(query, [partnerId]);
    return result.rows.map((row) => this.mapRowToPaymentInfo(row));
  }

  async update(paymentInfo: PartnerPaymentInfo): Promise<PartnerPaymentInfo> {
    const connection = getDatabaseConnection();

    const query = `
      UPDATE partner_payment_info
      SET type = $2, value = $3, name = $4, updated_at = $5
      WHERE id = $1 AND deleted_at IS NULL
    `;

    await connection.query(query, [
      paymentInfo.id,
      paymentInfo.type,
      paymentInfo.value,
      paymentInfo.name,
      new Date(),
    ]);

    return paymentInfo;
  }

  async delete(id: string): Promise<boolean> {
    const connection = getDatabaseConnection();

    const query = `
      UPDATE partner_payment_info
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await connection.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  private mapRowToPaymentInfo(row: any): PartnerPaymentInfo {
    return {
      id: row.id,
      partnerId: row.partner_id,
      type: row.type as 'PIX' | 'WHATSAPP',
      value: row.value,
      name: row.name ?? '',
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }
}

