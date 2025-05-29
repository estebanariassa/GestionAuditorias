
class IndicadoresAuditoria {
    constructor(db) {
      this.db = db; // instancia de conexión a la base de datos
    }
  
    async totalAuditorias() {
      return await this.db.collection('auditorias').countDocuments();
    }
  
    async porcentajeHallazgosResueltos() {
      const total = await this.db.collection('hallazgos').countDocuments();
      const resueltos = await this.db.collection('hallazgos').countDocuments({ estado: 'Resuelto' });
      return total === 0 ? 0 : (resueltos / total) * 100;
    }
  
    async promedioDiasCierreAuditoria() {
      const auditorias = await this.db.collection('auditorias').find().toArray();
  
      const totalDias = auditorias.reduce((acum, auditoria) => {
        if (auditoria.fechaInicio && auditoria.fechaCierre) {
          const inicio = new Date(auditoria.fechaInicio);
          const cierre = new Date(auditoria.fechaCierre);
          const dias = (cierre - inicio) / (1000 * 60 * 60 * 24);
          return acum + dias;
        }
        return acum;
      }, 0);
  
      return auditorias.length === 0 ? 0 : (totalDias / auditorias.length).toFixed(2);
    }
  
    async obtenerResumen() {
      const totalAuditorias = await this.totalAuditorias();
      const porcentajeResueltos = await this.porcentajeHallazgosResueltos();
      const promedioDiasCierre = await this.promedioDiasCierreAuditoria();
  
      return {
        totalAuditorias,
        porcentajeResueltos,
        promedioDiasCierre,
      };
    }
  }
  
  module.exports = IndicadoresAuditoria;

  const express = require('express');
const router = express.Router();
const IndicadoresAuditoria = require('../services/IndicadoresAuditoria');
const { getDB } = require('../db/connection'); // tu módulo de conexión a la base de datos

router.get('/api/auditorias/indicadores', async (req, res) => {
  try {
    const db = await getDB();
    const indicadores = new IndicadoresAuditoria(db);
    const resumen = await indicadores.obtenerResumen();
    res.json(resumen);
  } catch (error) {
    console.error('Error al obtener indicadores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;