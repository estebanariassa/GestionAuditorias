class AccionCorrectivaPreventiva {
    constructor(descripcion, tipo, responsable, fechaCompromiso) {
      this.descripcion = descripcion; // Texto de la acción
      this.tipo = tipo; // 'Correctiva' o 'Preventiva'
      this.responsable = responsable; // Instancia de Usuario
      this.fechaCompromiso = fechaCompromiso;
      this.estado = 'Pendiente';
    }
  
    marcarCompletada() {
      this.estado = 'Completada';
    }
  }