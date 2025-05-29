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
