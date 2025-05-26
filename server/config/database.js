const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_auditorias',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-05:00',
  decimalNumbers: true,
  supportBigNumbers: true
});

// Verificación de conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión exitosa a MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión a MySQL:', err.message);
    process.exit(1);
  });

module.exports = {
  pool,
  query: async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  }
}; 