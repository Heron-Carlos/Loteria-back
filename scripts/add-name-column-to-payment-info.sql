-- Adicionar coluna name na tabela partner_payment_info
ALTER TABLE partner_payment_info 
ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT '';

-- Se você já tem dados na tabela, pode remover o DEFAULT depois de preencher os valores
-- ALTER TABLE partner_payment_info ALTER COLUMN name DROP DEFAULT;

