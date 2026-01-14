import { getDatabaseConnection } from '../src/infrastructure/database/connection';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminPartnerId = async (): Promise<void> => {
  const connection = getDatabaseConnection();

  const username = 'jorgeermelindo';

  const checkUser = await connection.query(
    'SELECT id, partner_id FROM users WHERE username = $1 AND role = $2',
    [username, 'Admin']
  );

  if (checkUser.rows.length === 0) {
    console.error(`\n❌ Erro: Usuário '${username}' não encontrado ou não é Admin.`);
    await connection.end();
    process.exit(1);
  }

  const user = checkUser.rows[0];

  if (user.partner_id !== null) {
    console.log(`\n✅ O usuário '${username}' já tem partner_id: ${user.partner_id}`);
    await connection.end();
    return;
  }

  const updateQuery = `
    UPDATE users
    SET partner_id = id
    WHERE username = $1 AND role = $2 AND partner_id IS NULL
  `;

  await connection.query(updateQuery, [username, 'Admin']);

  const verifyQuery = `
    SELECT id, username, role, partner_id, mega_sigla, quina_sigla
    FROM users
    WHERE username = $1
  `;

  const result = await connection.query(verifyQuery, [username]);
  const updatedUser = result.rows[0];

  console.log('\n✅ Partner ID do admin atualizado com sucesso!');
  console.log(`\nID: ${updatedUser.id}`);
  console.log(`Username: ${updatedUser.username}`);
  console.log(`Role: ${updatedUser.role}`);
  console.log(`Partner ID: ${updatedUser.partner_id}`);
  console.log(`Mega Sigla: ${updatedUser.mega_sigla}`);
  console.log(`Quina Sigla: ${updatedUser.quina_sigla}\n`);

  await connection.end();
};

updateAdminPartnerId().catch((error) => {
  console.error('❌ Erro ao atualizar partner ID do admin:', error);
  process.exit(1);
});

