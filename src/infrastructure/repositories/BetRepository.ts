import { IBetRepository, FindByPartnerIdParams, PaginatedBetsResult, BetStats } from '../../domain/interfaces/IBetRepository.interface';
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

    query += ' ORDER BY player_name ASC, created_at DESC';

    const result = await connection.query(query, params);

    return result.rows.map((row) => this.mapRowToBet(row));
  }

  async findByPartnerIdPaginated(
    params: FindByPartnerIdParams
  ): Promise<PaginatedBetsResult> {
    const connection = getDatabaseConnection();
    
    const {
      partnerId,
      gameType,
      search,
      isPaid,
      page = 1,
      limit = 50,
    } = params;

    const offset = (page - 1) * limit;
    const queryParams: any[] = [partnerId];
    let paramIndex = 2;

    let whereClause = 'WHERE partner_id = $1 AND deleted_at IS NULL';

    if (gameType) {
      whereClause += ` AND game_type = $${paramIndex}`;
      queryParams.push(gameType);
      paramIndex++;
    }

    if (search && search.trim()) {
      whereClause += ` AND LOWER(player_name) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    if (isPaid !== undefined) {
      whereClause += ` AND is_paid = $${paramIndex}`;
      queryParams.push(isPaid);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM bets
      ${whereClause}
    `;

    const countResult = await connection.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total, 10);

    const dataQuery = `
      SELECT id, player_name, game_type, selected_numbers, is_paid, partner_id, deleted_at
      FROM bets
      ${whereClause}
      ORDER BY player_name ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await connection.query(dataQuery, queryParams);

    const bets = dataResult.rows.map((row) => this.mapRowToBet(row));

    return {
      bets,
      total,
    };
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

  async getStatsByPartnerId(partnerId: string): Promise<BetStats> {
    const connection = getDatabaseConnection();

    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_paid = true) as paid,
        COUNT(*) FILTER (WHERE is_paid = false) as pending,
        COUNT(*) FILTER (WHERE game_type = 'Mega') as mega,
        COUNT(*) FILTER (WHERE game_type = 'Quina') as quina
      FROM bets
      WHERE partner_id = $1 AND deleted_at IS NULL
    `;

    const result = await connection.query(query, [partnerId]);
    const row = result.rows[0];

    return {
      total: parseInt(row.total, 10),
      paid: parseInt(row.paid, 10),
      pending: parseInt(row.pending, 10),
      mega: parseInt(row.mega, 10),
      quina: parseInt(row.quina, 10),
    };
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

