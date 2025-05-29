import express from 'express';
import { Audit, User, Indicator } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Obtener todas las auditorías
router.get('/', async (req, res) => {
  try {
    const { search, status, auditorId, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { process: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (auditorId) {
      where.auditorId = auditorId;
    }

    const offset = (page - 1) * limit;

    const { count, rows: audits } = await Audit.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'auditor',
          attributes: ['id', 'username', 'fullName']
        }
      ],
      order: [['auditDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: audits,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo auditorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditorías'
    });
  }
});

// Obtener una auditoría por ID
router.get('/:id', async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'auditor',
          attributes: ['id', 'username', 'fullName', 'email']
        },
        {
          model: Indicator,
          as: 'indicators'
        }
      ]
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: audit
    });

  } catch (error) {
    console.error('Error obteniendo auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditoría'
    });
  }
});

// Crear nueva auditoría
router.post('/', async (req, res) => {
  try {
    const {
      name,
      auditNumber,
      cycle,
      process,
      purpose,
      scope,
      criteria,
      methodology,
      auditDate,
      auditorId
    } = req.body;

    // Validaciones básicas
    if (!name || !auditNumber || !process || !auditorId) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: name, auditNumber, process, auditorId'
      });
    }

    // Verificar que el número de auditoría no existe
    const existingAudit = await Audit.findOne({ where: { auditNumber } });
    if (existingAudit) {
      return res.status(400).json({
        success: false,
        message: 'El número de auditoría ya existe'
      });
    }

    // Verificar que el auditor existe
    const auditor = await User.findByPk(auditorId);
    if (!auditor) {
      return res.status(400).json({
        success: false,
        message: 'Auditor no encontrado'
      });
    }

    const audit = await Audit.create({
      name,
      auditNumber,
      cycle: cycle || 1,
      process,
      purpose,
      scope,
      criteria,
      methodology,
      auditDate: auditDate || new Date(),
      auditorId,
      status: 'planned'
    });

    const auditWithAuditor = await Audit.findByPk(audit.id, {
      include: [
        {
          model: User,
          as: 'auditor',
          attributes: ['id', 'username', 'fullName']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Auditoría creada exitosamente',
      data: auditWithAuditor
    });

  } catch (error) {
    console.error('Error creando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear auditoría'
    });
  }
});

// Actualizar auditoría
router.put('/:id', async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    await audit.update(req.body);

    const updatedAudit = await Audit.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'auditor',
          attributes: ['id', 'username', 'fullName']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Auditoría actualizada exitosamente',
      data: updatedAudit
    });

  } catch (error) {
    console.error('Error actualizando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar auditoría'
    });
  }
});

// Eliminar auditoría
router.delete('/:id', async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    await audit.destroy();

    res.json({
      success: true,
      message: 'Auditoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar auditoría'
    });
  }
});

// Obtener estadísticas de auditorías
router.get('/stats/summary', async (req, res) => {
  try {
    const totalAudits = await Audit.count();
    const completedAudits = await Audit.count({ where: { status: 'completed' } });
    const inProgressAudits = await Audit.count({ where: { status: 'in_progress' } });
    const plannedAudits = await Audit.count({ where: { status: 'planned' } });

    // Promedio de scores de auditorías completadas
    const avgScore = await Audit.findOne({
      attributes: [
        [Audit.sequelize.fn('AVG', Audit.sequelize.col('score')), 'avgScore']
      ],
      where: {
        status: 'completed',
        score: { [Op.not]: null }
      }
    });

    res.json({
      success: true,
      data: {
        total: totalAudits,
        completed: completedAudits,
        inProgress: inProgressAudits,
        planned: plannedAudits,
        averageScore: parseFloat(avgScore?.dataValues?.avgScore || 0).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

export default router;
