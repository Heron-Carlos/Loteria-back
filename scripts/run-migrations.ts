import { getDatabaseConnection } from '../src/infrastructure/database/connection';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const runMigrations = async (): Promise<void> => {
  const connection = getDatabaseConnection();
  
  const sqlPath = path.join(
    __dirname,
    '../src/infrastructure/database/migrations.sql'
  );
  
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    const statements: string[] = [];
    let currentStatement = '';
    let inDollarQuote = false;
    let dollarTag = '';

    const lines = sql.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('--')) {
        continue;
      }

      if (trimmed.includes('$$')) {
        const dollarMatches = trimmed.match(/\$\$[^$]*\$\$/g);
        if (dollarMatches && dollarMatches.length > 0) {
          for (const match of dollarMatches) {
            if (!inDollarQuote) {
              dollarTag = match;
              inDollarQuote = true;
            } else if (match === dollarTag) {
              inDollarQuote = false;
              dollarTag = '';
            }
          }
        }
      }

      currentStatement += line + '\n';

      if (!inDollarQuote && trimmed.endsWith(';')) {
        const statement = currentStatement.trim();
        if (statement.length > 0) {
          statements.push(statement);
        }
        currentStatement = '';
      }
    }

    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }

    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err: any) {
          if (err.code === '42P07' || err.message?.includes('already exists')) {
            console.log(`⚠️  Skipping (already exists)`);
            continue;
          }
          throw err;
        }
      }
    }

    console.log('✅ Migrations executed successfully!');
  } catch (error) {
    console.error('❌ Error executing migrations:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

runMigrations().catch((error) => {
  console.error(error);
  process.exit(1);
});
