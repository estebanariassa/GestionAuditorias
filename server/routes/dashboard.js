import express from 'express';
import { Audit, User, Indicator } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Obtener datos para el dashboard principal
router.get('/overview', async (req, res) => {
  try {
    // Estadísticas generales
    const totalAudits = await Audit.count();
    const completedAudits = await Audit.count({ where: { status: 'completed' } });
    const inProgressAudits = await Audit.count({ where: { status: 'in_progress' } });
    const plannedAudits = await Audit.count({ where: { status: 'planned' } });

    // Promedio de puntuaciones
    const avgScoreResult = await Audit.findOne({
      attributes: [
        [Audit.sequelize.fn('AVG', Audit.sequelize.col('score')), 'avgScore']
      ],
      where: {
        status: 'completed',
        score: { [Op.not]: null }
      }
    });

    const avgScore = parseFloat(avgScoreResult?.dataValues?.avgScore || 0);

    // Auditorías por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const auditsByMonth = await Audit.findAll({
      attributes: [
        [Audit.sequelize.fn('strftime', '%Y-%m', Audit.sequelize.col('auditDate')), 'month'],
        [Audit.sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        auditDate: { [Op.gte]: sixMonthsAgo }
      },
      group: [Audit.sequelize.fn('strftime', '%Y-%m', Audit.sequelize.col('auditDate'))],
      order: [[Audit.sequelize.fn('strftime', '%Y-%m', Audit.sequelize.col('auditDate')), 'ASC']]
    });

    // Distribución por estado
    const statusDistribution = await Audit.findAll({
      attributes: [
        'status',
        [Audit.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['status']
    });

    // Top auditores
    const topAuditors = await User.findAll({
      attributes: [
        'id', 'fullName',
        [Audit.sequelize.fn('COUNT', Audit.sequelize.col('audits.id')), 'auditCount'],
        [Audit.sequelize.fn('AVG', Audit.sequelize.col('audits.score')), 'avgScore']
      ],
      include: [
        {
          model: Audit,
          as: 'audits',
          attributes: [],
          where: { status: 'completed' },
          required: true
        }
      ],
      group: ['User.id'],
      order: [[Audit.sequelize.fn('COUNT', Audit.sequelize.col('audits.id')), 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalAudits,
          completedAudits,
          inProgressAudits,
          plannedAudits,
          averageScore: avgScore.toFixed(2)
        },
        auditsByMonth: auditsByMonth.map(item => ({
          month: item.dataValues.month,
          count: parseInt(item.dataValues.count)
        })),
        statusDistribution: statusDistribution.map(item => ({
          status: item.status,
          count: parseInt(item.dataValues.count)
        })),
        topAuditors: topAuditors.map(auditor => ({
          id: auditor.id,
          name: auditor.fullName,
          auditCount: parseInt(auditor.dataValues.auditCount),
          avgScore: parseFloat(auditor.dataValues.avgScore || 0).toFixed(2)
        }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos del dashboard'
    });
  }
});

// Obtener indicadores
router.get('/indicators', async (req, res) => {
  try {
    const { type, auditId } = req.query;
    
    const where = { isActive: true };
    
    if (type) {
      where.type = type;
    }
    
    if (auditId) {
      where.auditId = auditId;
    }

    const indicators = await Indicator.findAll({
      where,
      include: [
        {
          model: Audit,
          as: 'audit',
          attributes: ['id', 'name', 'auditNumber'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Agrupar por tipo para gráficos
    const indicatorsByType = indicators.reduce((acc, indicator) => {
      const type = indicator.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        id: indicator.id,
        name: indicator.name,
        value: parseFloat(indicator.value),
        target: parseFloat(indicator.target || 0),
        unit: indicator.unit,
        period: indicator.period,
        audit: indicator.audit
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        indicators,
        indicatorsByType
      }
    });

  } catch (error) {
    console.error('Error obteniendo indicadores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener indicadores'
    });
  }
});

// Crear nuevo indicador
router.post('/indicators', async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      value,
      target,
      unit,
      period,
      auditId
    } = req.body;

    // Validaciones básicas
    if (!name || !type || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: name, type, value'
      });
    }

    // Verificar que la auditoría existe si se proporciona auditId
    if (auditId) {
      const audit = await Audit.findByPk(auditId);
      if (!audit) {
        return res.status(400).json({
          success: false,
          message: 'Auditoría no encontrada'
        });
      }
    }

    const indicator = await Indicator.create({
      name,
      description,
      type,
      value,
      target,
      unit: unit || '%',
      period: period || 'monthly',
      auditId
    });

    const indicatorWithAudit = await Indicator.findByPk(indicator.id, {
      include: [
        {
          model: Audit,
          as: 'audit',
          attributes: ['id', 'name', 'auditNumber']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Indicador creado exitosamente',
      data: indicatorWithAudit
    });

  } catch (error) {
    console.error('Error creando indicador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear indicador'
    });
  }
});

// Obtener métricas de rendimiento
router.get('/performance', async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    // Calcular métricas según el período
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'weekly':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarterly':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Auditorías completadas en el período
    const completedInPeriod = await Audit.count({
      where: {
        status: 'completed',
        updatedAt: { [Op.gte]: dateFilter }
      }
    });

    // Puntuación promedio en el período
    const avgScoreInPeriod = await Audit.findOne({
      attributes: [
        [Audit.sequelize.fn('AVG', Audit.sequelize.col('score')), 'avgScore']
      ],
      where: {
        status: 'completed',
        score: { [Op.not]: null },
        updatedAt: { [Op.gte]: dateFilter }
      }
    });

    // Tiempo promedio de auditoría (días entre creación y completado)
    const avgDuration = await Audit.findOne({
      attributes: [
        [
          Audit.sequelize.fn('AVG', 
            Audit.sequelize.fn('julianday', Audit.sequelize.col('updatedAt')) - 
            Audit.sequelize.fn('julianday', Audit.sequelize.col('createdAt'))
          ), 
          'avgDays'
        ]
      ],
      where: {
        status: 'completed',
        updatedAt: { [Op.gte]: dateFilter }
      }
    });

    res.json({
      success: true,
      data: {
        period,
        completedAudits: completedInPeriod,
        averageScore: parseFloat(avgScoreInPeriod?.dataValues?.avgScore || 0).toFixed(2),
        averageDuration: parseFloat(avgDuration?.dataValues?.avgDays || 0).toFixed(1)
      }
    });

  } catch (error) {
    console.error('Error obteniendo métricas de rendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas de rendimiento'
    });
  }
});

export default router;
