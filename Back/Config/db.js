import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('📝 Configuración de base de datos:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-05:00', // Zona horaria UTC
  decimalNumbers: true, // Para manejar correctamente valores decimales
  supportBigNumbers: true // Para IDs grandes
});

// Verificación de conexión al iniciar
pool.getConnection()
  .then(async conn => {
    console.log('✅ Conexión exitosa a MySQL');
    
    // Verificar la base de datos actual
    const [rows] = await conn.execute('SELECT DATABASE()');
    console.log('📁 Base de datos actual:', rows[0]);
    
    // Verificar las tablas
    const [tables] = await conn.execute('SHOW TABLES');
    console.log('📋 Tablas disponibles:', tables);
    
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión a MySQL:', err.message);
    console.error('Detalles de conexión:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    process.exit(1);
  });

export { pool };
export const query = async (sql, params) => {
  try {
    console.log('🔍 Ejecutando consulta:', sql);
    console.log('📝 Parámetros:', params);
    const [rows] = await pool.execute(sql, params);
    console.log('✅ Resultado:', rows);
    return rows;
  } catch (error) {
    console.error('❌ Error en consulta SQL:', error);
    throw error;
  }
};