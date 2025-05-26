import express from 'express';
import { pool, query } from '../Config/db.js';

const router = express.Router();

// Obtener todas las auditorías
router.get('/', async (req, res) => {
  try {
    const auditorias = await query('SELECT * FROM auditorias');
    res.json(auditorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener auditorías' });
  }
});

// Crear una nueva auditoría
router.post('/', async (req, res) => {
  try {
    console.log('📝 Iniciando petición POST...');
    
    // Prueba con todos los campos requeridos
    const result = await query(
      `INSERT INTO auditorias (
        proceso, numero, ciclo, proposito, alcance,
        fecha_creacion, fecha_apertura, hora_inicio,
        lugar_reunion, fecha_cierre, hora_cierre, lugar_cierre
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Prueba',           // proceso
        1,                  // numero
        2024,              // ciclo
        'Propósito test',   // proposito
        'Alcance test',     // alcance
        '2024-03-20',      // fecha_creacion
        '2024-03-25',      // fecha_apertura
        '09:00',           // hora_inicio
        'Sala 1',          // lugar_reunion
        '2024-03-26',      // fecha_cierre
        '17:00',           // hora_cierre
        'Sala 1'           // lugar_cierre
      ]
    );
    
    console.log('✅ Resultado de prueba:', result);
    
    res.status(201).json({
      id: result.insertId,
      mensaje: 'Prueba completada'
    });
  } catch (error) {
    console.error('❌ Error detallado:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({ 
      error: 'Error en prueba',
      detalles: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
});

// Obtener una auditoría por ID
router.get('/:id', async (req, res) => {
  try {
    const [auditoria] = await query('SELECT * FROM auditorias WHERE id = ?', [req.params.id]);
    if (!auditoria) {
      return res.status(404).json({ error: 'Auditoría no encontrada' });
    }
    res.json(auditoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la auditoría' });
  }
});

export default router; 