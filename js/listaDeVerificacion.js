// Clase que representa un ítem dentro de la lista de verificación
class ItemVerificacion {
    constructor(criterio, evidencia = '', cumplimiento = 'No evaluado', observaciones = '') {
      this.criterio = criterio;
      this.evidencia = evidencia;
      this.cumplimiento = cumplimiento; // 'Cumple', 'No cumple', 'No aplica'
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
  
  // Clase principal para la lista de verificación de auditoría
  class ListaVerificacion {
    constructor(nombreProceso, auditor, fecha) {
      this.nombreProceso = nombreProceso;
      this.auditor = auditor; // Instancia de Usuario
      this.fecha = fecha;
      this.items = [];
    }
  
    agregarItem(criterio) {
      const item = new ItemVerificacion(criterio);
      this.items.push(item);
    }
  
    obtenerResumen() {
      return this.items.map((item, i) => {
        return `${i + 1}. ${item.criterio} → ${item.cumplimiento}`;
      }).join('\n');
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

  