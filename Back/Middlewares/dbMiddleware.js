import { pool } from '../Config/db.js';

const dbMiddleware = async (req, res, next) => {
  try {
    console.log('⌛ Intentando conectar a la base de datos...');
    req.db = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos');
    req.db.release(); // Importante liberar después de usar
    next();
  } catch (error) {
    console.error('❌ Error en middleware de DB:', error);
    console.error('Detalles de conexión:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    res.status(503).json({ error: 'Servicio de base de datos no disponible: ' + error.message });
  }
};

export default dbMiddleware;