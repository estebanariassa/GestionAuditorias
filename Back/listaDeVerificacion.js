// Clase que representa un ítem dentro de la lista de verificación
export class ItemVerificacion {
  constructor(criterio, evidencia = '', cumplimiento = 'No evaluado', observaciones = '') {
    this.criterio = criterio;
    this.evidencia = evidencia;
    this.cumplimiento = cumplimiento;
    this.observaciones = observaciones;
  }

  actualizarEvidencia(nuevaEvidencia) {
    this.evidencia = nuevaEvidencia;
  }

  marcarCumplimiento(estado) {
    const validos = ['Cumple', 'No cumple', 'No aplica'];
    if (validos.includes(estado)) {
      this.cumplimiento = estado;
    }
  }

  agregarObservacion(texto) {
    this.observaciones = texto;
  }
}

export class ListaVerificacion {
  constructor(nombreProceso, auditor, fecha) {
    this.nombreProceso = nombreProceso;
    this.auditor = auditor;
    this.fecha = fecha;
    this.items = [];
  }

  agregarItem(criterio) {
    const item = new ItemVerificacion(criterio);
    this.items.push(item);
  }

  obtenerResumen() {
    return this.items.map((item, i) => `${i + 1}. ${item.criterio} → ${item.cumplimiento}`).join('\n');
  }

  exportarJSON() {
    return JSON.stringify({
      proceso: this.nombreProceso,
      auditor: this.auditor.nombre,
      fecha: this.fecha,
      criterios: this.items
    }, null, 2);
  }
}