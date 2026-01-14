import { Pool } from 'pg';

let connectionPool: Pool | null = null;

export const getDatabaseConnection = (): Pool => {
  if (connectionPool) {
    return connectionPool;
  }

  connectionPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'loteria_db',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false,
    } : false,
  });

  return connectionPool;
};

