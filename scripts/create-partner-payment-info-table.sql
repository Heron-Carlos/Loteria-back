-- Tabela de informações de pagamento dos sócios (PIX e WhatsApp)
CREATE TABLE IF NOT EXISTS partner_payment_info (
  id VARCHAR(36) PRIMARY KEY,
  partner_id VARCHAR(36) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('PIX', 'WHATSAPP')),
  value VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Trigger para atualizar updated_at automaticamente
-- (A função update_updated_at_column já deve existir, mas caso não exista, será criada)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partner_payment_info_updated_at BEFORE UPDATE ON partner_payment_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_partner_payment_info_partner_id ON partner_payment_info(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_payment_info_type ON partner_payment_info(type);
CREATE INDEX IF NOT EXISTS idx_partner_payment_info_deleted_at ON partner_payment_info(deleted_at);

