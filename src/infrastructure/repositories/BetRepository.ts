import { IBetRepository } from '../../domain/interfaces/IBetRepository.interface';
import { Bet } from '../../domain/entities/Bet.entity';
import { getDatabaseConnection } from '../database/connection';

export class BetRepository implements IBetRepository {
  async create(bet: Bet): Promise<Bet> {
    const connection = getDatabaseConnection();

    const query = `
      INSERT INTO bets (id, player_name, game_type, selected_numbers, is_paid, partner_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await connection.query(query, [
      bet.id,
      bet.playerName,
      bet.gameType,
      JSON.stringify(bet.selectedNumbers),
      bet.isPaid,
      bet.partnerId,
    ]);

    return bet;
  }

  async findById(id: string): Promise<Bet | null> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT id, player_name, game_type, selected_numbers, is_paid, partner_id, deleted_at
      FROM bets
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToBet(row);
  }

  async findByPartnerId(
    partnerId: string,
    gameType?: string
  ): Promise<Bet[]> {
    const connection = getDatabaseConnection();

    let query = `
      SELECT id, player_name, game_type, selected_numbers, is_paid, partner_id, deleted_at
      FROM bets
      WHERE partner_id = $1 AND deleted_at IS NULL
    `;

    const params: any[] = [partnerId];

    if (gameType) {
      query += ' AND game_type = $2';
      params.push(gameType);
    }

    query += ' ORDER BY created_at DESC';

    const result = await connection.query(query, params);

    return result.rows.map((row) => this.mapRowToBet(row));
  }

  async update(id: string, updates: Partial<Bet>): Promise<Bet | null> {
    const connection = getDatabaseConnection();

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (updates.isPaid !== undefined) {
      updateFields.push(`is_paid = $${paramIndex}`);
      updateValues.push(updates.isPaid);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    updateValues.push(id);
    const idParamIndex = paramIndex;

    const query = `
      UPDATE bets
      SET ${updateFields.join(', ')}
      WHERE id = $${idParamIndex}
    `;

    await connection.query(query, updateValues);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const connection = getDatabaseConnection();

    const query = `
      UPDATE bets 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await connection.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }

  private mapRowToBet(row: any): Bet {
    const selectedNumbers = typeof row.selected_numbers === 'string' 
      ? JSON.parse(row.selected_numbers) 
      : row.selected_numbers;

    return {
      id: row.id,
      playerName: row.player_name,
      gameType: row.game_type,
      selectedNumbers,
      isPaid: row.is_paid === true || row.is_paid === 1,
      partnerId: row.partner_id,
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }
}

