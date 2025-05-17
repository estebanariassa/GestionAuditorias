export class AccionCorrectivaPreventiva {
  constructor(descripcion, tipo, responsable, fechaCompromiso) {
    this.descripcion = descripcion;
    this.tipo = tipo;
    this.responsable = responsable;
    this.fechaCompromiso = fechaCompromiso;
    this.estado = 'Pendiente';
  }

  marcarCompletada() {
    this.estado = 'Completada';
  }
}
