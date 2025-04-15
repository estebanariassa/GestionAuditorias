class ObjetivosAuditoria {
    static agregarObjetivo(auditoriaId, objetivo){
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
    static agregarCriterio(auditoriaId, objetivoId, criterio){
        const auditorias = Auditorias.obtenerAuditorias();
        const auditoria = auditorias.find(a => a.id === auditoriaId);
        
        if (auditoria) {
            const objetivo = auditoria.objetivos.find(o => o.id === objetivoId);
            if (objetivo) {
                objetivo.criterios.push({
                    id: `CRI-${Date.now()}`,
                    descripcion: criterio,
                    cumplido: false
                });
                localStorage.setItem('auditorias', JSON.stringify(auditorias));
            }
        }
}   }