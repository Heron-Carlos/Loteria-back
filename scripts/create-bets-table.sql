-- Primeiro, criar a função se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tabela de apostas
CREATE TABLE IF NOT EXISTS bets (
  id VARCHAR(36) PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  game_type VARCHAR(50) NOT NULL,
  selected_numbers JSONB NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  partner_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TRIGGER update_bets_updated_at BEFORE UPDATE ON bets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_bets_partner_id ON bets(partner_id);
CREATE INDEX IF NOT EXISTS idx_bets_game_type ON bets(game_type);
CREATE INDEX IF NOT EXISTS idx_bets_deleted_at ON bets(deleted_at);
