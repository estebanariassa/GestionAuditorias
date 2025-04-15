// En informes.js
class GestionCorreos {
    static obtenerCorreos() {
      return JSON.parse(localStorage.getItem('correos') || '[]');
    }
  
    static filtrarCorreos(filtros = {}) {
      const correos = this.obtenerCorreos();
      return correos.filter(correo => {
        return Object.entries(filtros).every(([key, value]) => {
          if (!value) return true;
          return correo[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
  }


class EnvioInformes {
    static enviarInforme(auditoriaId, destinatarios, asunto, mensaje) {
      const informe = Informes.generarInformeAuditoria(auditoriaId);
      if (!informe) return false;
  
      const correos = JSON.parse(localStorage.getItem('correos') || '[]');
      const nuevoCorreo = {
        id: `COR-${Date.now()}`,
        auditoriaId,
        asunto,
        destinatarios: Array.isArray(destinatarios) ? destinatarios : [destinatarios],
        mensaje,
        informe: informe.id,
        fechaEnvio: new Date().toISOString(),
        estado: 'Pendiente'
      };
  
      correos.push(nuevoCorreo);
      localStorage.setItem('correos', JSON.stringify(correos));
  
      // Simular envío (en producción sería una llamada API)
      setTimeout(() => {
        nuevoCorreo.estado = 'Enviado';
        localStorage.setItem('correos', JSON.stringify(correos));
        UI.actualizarEstadoCorreo(nuevoCorreo.id, 'Enviado');
      }, 2000);
  
      return true;
    }
  }  