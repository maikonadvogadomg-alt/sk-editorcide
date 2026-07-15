const { Pool } = require('pg');

// Neon PostgreSQL - Banco de dados PostgreSQL gratuito na nuvem
// 1. Crie uma conta em: console.neon.tech
// 2. Crie um projeto e copie a connection string
// 3. Cole a connection string no arquivo .env como DATABASE_URL

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessario para Neon
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Testar conexao
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as now, version()');
    console.log('✓ Neon PostgreSQL conectado!');
    console.log('  Hora:', res.rows[0].now);
    console.log('  Versao:', res.rows[0].version.split(' ').slice(0,2).join(' '));
  } catch (err) {
    console.error('✗ Erro ao conectar:', err.message);
    console.log('Verifique a DATABASE_URL no arquivo .env');
  }
}

// Criar tabelas de exemplo
async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  `);
  console.log('✓ Tabelas criadas no Neon!');
}

// Funcoes utilitarias
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Query executada:', { text: text.slice(0, 50), duration: duration + 'ms', rows: res.rowCount });
  return res;
}

async function getClient() {
  const client = await pool.connect();
  const release = client.release;
  client.release = () => {
    client.release = release;
    return release.apply(client);
  };
  return client;
}

// Inicializar
testConnection()
  .then(() => setupDatabase())
  .catch(console.error);

module.exports = { pool, query, getClient };
