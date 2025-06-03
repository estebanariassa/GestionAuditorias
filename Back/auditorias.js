// auditorias.js

export class Auditoria {
  constructor(datos) {
    this.id = Date.now();
    this.proceso = datos.proceso;
    this.numeroAuditoria = datos.numeroAuditoria;
    this.ciclo = datos.ciclo;
    this.proposito = datos.proposito;
    this.alcance = datos.alcance;
    this.fecha = datos.fecha;
    this.auditorLider = datos.auditorLider;
    this.auditados = datos.auditados;
    this.fechaApertura = datos.fechaApertura;
    this.horaInicio = datos.horaInicio;
    this.lugarReunion = datos.lugarReunion;
    this.reunionCierre = datos.reunionCierre;
    this.horaCierre = datos.horaCierre;
    this.lugarCierre = datos.lugarCierre;
    this.segundoAuditor = datos.segundoAuditor;
    this.documentosAplicables = datos.documentosAplicables;
    this.codigoDocumento = datos.codigoDocumento;
    this.versionDocumento = datos.versionDocumento;
  }
}

export class AuditoriaManager {
  constructor() {
    this.auditoriasPorUsuario = {}; // { correo: [auditorias] }
  }

  registrar(usuario, datos) {
    if (!this.auditoriasPorUsuario[usuario.gmail]) {
      this.auditoriasPorUsuario[usuario.gmail] = [];
    }
    const nueva = new Auditoria(datos);
    this.auditoriasPorUsuario[usuario.gmail].push(nueva);
    return nueva;
  }

  obtenerPorUsuario(usuario) {
    return this.auditoriasPorUsuario[usuario.gmail] || [];
  }
}

