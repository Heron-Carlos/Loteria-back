-- ============================================================
-- Script de Criação do Schema Normalizado
-- Banco de Dados: Loteria
-- Estrutura: users, partners, partner_siglas, bets
-- ============================================================

-- Dropar tabelas existentes (se necessário)
-- ATENÇÃO: Isso vai apagar todos os dados!
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS partner_siglas CASCADE;

-- Dropar função e triggers se existirem
DROP TRIGGER IF EXISTS update_bets_updated_at ON bets;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
DROP TRIGGER IF EXISTS update_partner_siglas_updated_at ON partner_siglas;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================================
-- Função para atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- 1. Tabela PARTNERS (deve ser criada primeiro por causa das FKs)
-- ============================================================
CREATE TABLE partners (
  id VARCHAR(36) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TRIGGER update_partners_updated_at 
  BEFORE UPDATE ON partners
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_partners_deleted_at ON partners(deleted_at);

-- ============================================================
-- 2. Tabela USERS
-- ============================================================
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Partner',
  partner_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(id)
);

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_partner_id ON users(partner_id);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- ============================================================
-- 3. Tabela PARTNER_SIGLAS
-- ============================================================
CREATE TABLE partner_siglas (
  id VARCHAR(36) PRIMARY KEY,
  partner_id VARCHAR(36) NOT NULL,
  game_type VARCHAR(50) NOT NULL,
  sigla VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(id),
  UNIQUE(partner_id, game_type, sigla)
);

CREATE TRIGGER update_partner_siglas_updated_at 
  BEFORE UPDATE ON partner_siglas
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_partner_siglas_partner_id ON partner_siglas(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_siglas_game_type ON partner_siglas(game_type);
CREATE INDEX IF NOT EXISTS idx_partner_siglas_deleted_at ON partner_siglas(deleted_at);

-- ============================================================
-- 4. Tabela BETS
-- ============================================================
CREATE TABLE bets (
  id VARCHAR(36) PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  game_type VARCHAR(50) NOT NULL,
  selected_numbers JSONB NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  partner_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(id)
);

CREATE TRIGGER update_bets_updated_at 
  BEFORE UPDATE ON bets
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_bets_partner_id ON bets(partner_id);
CREATE INDEX IF NOT EXISTS idx_bets_game_type ON bets(game_type);
CREATE INDEX IF NOT EXISTS idx_bets_deleted_at ON bets(deleted_at);

-- ============================================================
-- Verificação das tabelas criadas
-- ============================================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('users', 'partners', 'partner_siglas', 'bets')
ORDER BY table_name;

