class ObjetivosAuditoria {
    static agregarCriterio(auditoriaId, objetivoId, criterio) {
        const auditorias = Auditorias.obtenerAuditorias();
        const auditoria = auditorias.find(a => a.id === auditoriaId);
        
        if (auditoria) {
            const objetivo = auditoria.objetivos?.find(obj => obj.id === objetivoId);
            
            if (objetivo) {
                objetivo.criterios = objetivo.criterios || [];
                objetivo.criterios.push({
                    id: `CRT-${Date.now()}`,
                    descripcion: criterio,
                    cumplido: false
                });
                localStorage.setItem('auditorias', JSON.stringify(auditorias));
                return true;
            }
        }
        return false;
    }

    static agregarObjetivo(auditoriaId, objetivo) {
        const auditorias = Auditorias.obtenerAuditorias();
        const auditoria = auditorias.find(a => a.id === auditoriaId);
        
        if (auditoria) {
            auditoria.objetivos = auditoria.objetivos || [];
            auditoria.objetivos.push({
                id: `OBJ-${Date.now()}`,
                descripcion: objetivo,
                cumplido: false,
                criterios: []
            });
            localStorage.setItem('auditorias', JSON.stringify(auditorias));
        }
    }
}
const { pool, query } = require('../Config/db');

exports.crearAuditoria = async (req, res) => {
  try {
    const { proceso, numero, ciclo, proposito, alcance } = req.body;
    
    const result = await query(
      `INSERT INTO auditorias 
       (proceso, numero, ciclo, proposito, alcance) 
       VALUES (?, ?, ?, ?, ?)`,
      [proceso, numero, ciclo, proposito, alcance]
    );
    
    res.status(201).json({
      id: result.insertId,
      mensaje: 'Auditoría creada exitosamente'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El número de auditoría ya existe' });
    }
    res.status(500).json({ error: 'Error al crear auditoría', detalles: error.message });
  }
};