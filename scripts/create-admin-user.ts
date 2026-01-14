import { getDatabaseConnection } from '../src/infrastructure/database/connection';
import { hashPassword } from '../src/application/services/password.service';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const createAdminUser = async (): Promise<void> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, resolve);
    });
  };

  const username = 'jorgeermelindo';
  const role = 'Admin';
  const megaSigla = 'JE';
  const quinaSigla = 'JRG';

  console.log('\n=== Criar Usuário Admin ===\n');
  console.log(`Nome: Jorge Ermelindo`);
  console.log(`Username: ${username}`);
  console.log(`Role: ${role}`);
  console.log(`Mega Sigla: ${megaSigla}`);
  console.log(`Quina Sigla: ${quinaSigla}\n`);

  const password = await question('Digite a senha para o usuário admin: ');

  if (!password || password.length < 6) {
    console.error('\n❌ Erro: A senha deve ter no mínimo 6 caracteres.');
    rl.close();
    process.exit(1);
  }

  const confirmPassword = await question('Confirme a senha: ');

  if (password !== confirmPassword) {
    console.error('\n❌ Erro: As senhas não coincidem.');
    rl.close();
    process.exit(1);
  }

  rl.close();

  const connection = getDatabaseConnection();

  const existingUser = await connection.query(
    'SELECT id FROM users WHERE username = $1',
    [username]
  );

  if (existingUser.rows.length > 0) {
    console.error(`\n❌ Erro: O usuário '${username}' já existe no banco de dados.`);
    await connection.end();
    process.exit(1);
  }

  const userId = randomUUID();
  const passwordHash = hashPassword(password);
  const partnerId = userId;

  const query = `
    INSERT INTO users (id, username, password_hash, role, partner_id, mega_sigla, quina_sigla)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  await connection.query(query, [
    userId,
    username,
    passwordHash,
    role,
    partnerId,
    megaSigla,
    quinaSigla,
  ]);

  console.log('\n✅ Usuário admin criado com sucesso!');
  console.log(`\nID: ${userId}`);
  console.log(`Username: ${username}`);
  console.log(`Role: ${role}`);
  console.log(`Partner ID: ${partnerId}`);
  console.log(`Mega Sigla: ${megaSigla}`);
  console.log(`Quina Sigla: ${quinaSigla}\n`);

  await connection.end();
};

createAdminUser().catch((error) => {
  console.error('❌ Erro ao criar usuário admin:', error);
  process.exit(1);
});

