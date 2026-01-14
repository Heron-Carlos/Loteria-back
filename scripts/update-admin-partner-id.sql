-- Script para atualizar o partner_id do admin existente
-- Este script define o partner_id do admin como sendo o próprio ID do usuário

UPDATE users
SET partner_id = id
WHERE username = 'jorgeermelindo' AND role = 'Admin' AND partner_id IS NULL;

-- Verificar se foi atualizado
SELECT id, username, role, partner_id, mega_sigla, quina_sigla
FROM users
WHERE username = 'jorgeermelindo';

