class ObjetivosAuditoria {
    /**
     * Agrega un nuevo objetivo a una auditoría
     * @param {string} auditoriaId - ID de la auditoría
     * @param {string} descripcion - Descripción del objetivo
     * @returns {boolean}
     */
    static agregarObjetivo(auditoriaId, descripcion) {
      if (!auditoriaId || !descripcion) {
        console.error('Faltan parámetros requeridos');
        return false;
      }
  
      const auditorias = this._obtenerAuditorias();
      const auditoria = auditorias.find(a => a.id === auditoriaId);
  
      if (!auditoria) {
        console.error('Auditoría no encontrada');
        return false;
      }
  
      // Inicializar array de objetivos si no existe
      if (!auditoria.objetivos) {
        auditoria.objetivos = [];
      }
  
      // Agregar el nuevo objetivo
      auditoria.objetivos.push({
        id: this._generarId('obj'),
        descripcion,
        cumplido: false,
        criterios: [],
        fechaCreacion: new Date().toISOString()
      });
  
      // Guardar los cambios
      this._guardarAuditorias(auditorias);
      return true;
    }
  
    /**
     * Agrega un criterio a un objetivo específico
     * @param {string} auditoriaId - ID de la auditoría
     * @param {string} objetivoId - ID del objetivo
     * @param {string} descripcion - Descripción del criterio
     * @returns {boolean} - True si se agregó correctamente
     */
    static agregarCriterio(auditoriaId, objetivoId, descripcion) {
      if (!auditoriaId || !objetivoId || !descripcion) {
        console.error('Faltan parámetros requeridos');
        return false;
      }
  
      const auditorias = this._obtenerAuditorias();
      const auditoria = auditorias.find(a => a.id === auditoriaId);
  
      if (!auditoria) {
        console.error('Auditoría no encontrada');
        return false;
      }
  
      const objetivo = auditoria.objetivos?.find(obj => obj.id === objetivoId);
      if (!objetivo) {
        console.error('Objetivo no encontrado');
        return false;
      }
  
      // Inicializar array de criterios si no existe
      if (!objetivo.criterios) {
        objetivo.criterios = [];
      }
  
      // Agregar el nuevo criterio
      objetivo.criterios.push({
        id: this._generarId('crt'),
        descripcion,
        cumplido: false,
        fechaCreacion: new Date().toISOString()
      });
  
      // Guardar los cambios
      this._guardarAuditorias(auditorias);
      return true;
    }
  
    /**
     * Marca un criterio como cumplido o no cumplido
     * @param {string} auditoriaId - ID de la auditoría
     * @param {string} objetivoId - ID del objetivo
     * @param {string} criterioId - ID del criterio
     * @param {boolean} cumplido - Estado a establecer
     * @returns {boolean} - True si se actualizó correctamente
     */
    static marcarCriterio(auditoriaId, objetivoId, criterioId, cumplido) {
      const auditorias = this._obtenerAuditorias();
      const auditoria = auditorias.find(a => a.id === auditoriaId);
      if (!auditoria) return false;
  
      const objetivo = auditoria.objetivos?.find(obj => obj.id === objetivoId);
      if (!objetivo) return false;
  
      const criterio = objetivo.criterios?.find(crt => crt.id === criterioId);
      if (!criterio) return false;
  
      criterio.cumplido = cumplido;
      this._guardarAuditorias(auditorias);
      return true;
    }
  
    /**
     * Obtiene todos los objetivos de una auditoría
     * @param {string} auditoriaId - ID de la auditoría
     * @returns {Array|null} - Array de objetivos o null si no se encuentra
     */
    static obtenerObjetivos(auditoriaId) {
      const auditorias = this._obtenerAuditorias();
      const auditoria = auditorias.find(a => a.id === auditoriaId);
      return auditoria?.objetivos || null;
    }
  
    /**
     * Obtiene todos los criterios de un objetivo
     * @param {string} auditoriaId - ID de la auditoría
     * @param {string} objetivoId - ID del objetivo
     * @returns {Array|null} - Array de criterios o null si no se encuentra
     */
    static obtenerCriterios(auditoriaId, objetivoId) {
      const objetivos = this.obtenerObjetivos(auditoriaId);
      if (!objetivos) return null;
  
      const objetivo = objetivos.find(obj => obj.id === objetivoId);
      return objetivo?.criterios || null;
    }
  
    // ==================== MÉTODOS PRIVADOS ====================
  
    /**
     * Genera un ID único con prefijo
     * @param {string} prefix - Prefijo para el ID
     * @returns {string}
     */
    static _generarId(prefix) {
      return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    }
  
    /**
     * Obtiene todas las auditorías de localStorage
     * @returns {Array}
     */
    static _obtenerAuditorias() {
      return JSON.parse(localStorage.getItem('auditorias')) || [];
    }
  
    /**
     * Guarda las auditorías en localStorage
     * @param {Array} auditorias - Array de auditorías
     */
    static _guardarAuditorias(auditorias) {
      localStorage.setItem('auditorias', JSON.stringify(auditorias));
    }
  }