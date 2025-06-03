import readline from "readline";
import { AuditoriaManager } from "./auditorias.js";

class Usuario {
  constructor(gmail, contraseña, rol) {
    this.gmail = gmail;
    this.contraseña = contraseña;
    this.rol = rol;
  }

  static usuarios = [];

  static registrar(gmail, contraseña, rol) {
    const existe = Usuario.usuarios.some(u => u.gmail === gmail);
    if (existe) {
      console.log("❌ Ya existe ese usuario.");
      return false;
    }

    const nuevo = new Usuario(gmail, contraseña, rol);
    Usuario.usuarios.push(nuevo);
    console.log("✅ Usuario registrado.");
    return true;
  }

  static login(gmail, contraseña) {
    const usuario = Usuario.usuarios.find(
      u => u.gmail === gmail && u.contraseña === contraseña
    );
    if (!usuario) {
      console.log("❌ Usuario o contraseña incorrecta.");
      return null;
    }
    return usuario;
  }
}

const auditoriaManager = new AuditoriaManager();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function mainMenu() {
  console.log("\n=== MENÚ PRINCIPAL ===");
  console.log("1. Registrar usuario");
  console.log("2. Iniciar sesión");
  console.log("3. Salir");

  rl.question("Opción: ", op => {
    switch (op.trim()) {
      case "1": registrarUsuario(); break;
      case "2": iniciarSesion(); break;
      case "3": rl.close(); break;
      default: mainMenu();
    }
  });
}

function registrarUsuario() {
  rl.question("Gmail: ", gmail => {
    rl.question("Contraseña: ", pass => {
      pedirRol(gmail, pass);
    });
  });
}

function pedirRol(gmail, pass) {
  rl.question("Rol (administrador / auditor): ", rol => {
    rol = rol.trim().toLowerCase();
    if (!["administrador", "auditor"].includes(rol)) {
      console.log("❌ Rol inválido.");
      return pedirRol(gmail, pass);
    }

    Usuario.registrar(gmail, pass, rol);
    mainMenu();
  });
}

function iniciarSesion() {
  rl.question("Gmail: ", gmail => {
    rl.question("Contraseña: ", pass => {
      const usuario = Usuario.login(gmail, pass);
      if (usuario) {
        console.log(`✅ Bienvenido, ${usuario.gmail}`);
        menuUsuario(usuario);
      } else {
        mainMenu();
      }
    });
  });
}

function menuUsuario(usuario) {
  console.log("\n=== MENÚ USUARIO ===");
  console.log("1. Planear auditoría");
  console.log("2. Ver mis auditorías");
  console.log("3. Cerrar sesión");

  rl.question("Opción: ", op => {
    switch (op.trim()) {
      case "1": planearAuditoria(usuario); break;
      case "2": verAuditorias(usuario); break;
      case "3": mainMenu(); break;
      default: menuUsuario(usuario);
    }
  });
}

function planearAuditoria(usuario) {
  const datos = {};
  const preguntas = [
    ["proceso", "Proceso: "],
    ["numeroAuditoria", "Número de auditoría: "],
    ["ciclo", "Ciclo: "],
    ["proposito", "Propósito: "],
    ["alcance", "Alcance: "],
    ["fecha", "Fecha: "],
    ["auditorLider", "Auditor líder: "],
    ["auditados", "Auditados: "],
    ["fechaApertura", "Fecha apertura: "],
    ["horaInicio", "Hora inicio: "],
    ["lugarReunion", "Lugar reunión: "],
    ["reunionCierre", "Fecha cierre: "],
    ["horaCierre", "Hora cierre: "],
    ["lugarCierre", "Lugar cierre: "],
    ["segundoAuditor", "Segundo auditor: "],
    ["documentosAplicables", "Documentos aplicables: "],
    ["codigoDocumento", "Código del documento: "],
    ["versionDocumento", "Versión del documento: "],
  ];

  function hacerPregunta(i = 0) {
    if (i >= preguntas.length) {
      auditoriaManager.registrar(usuario, datos);
      console.log("✅ Auditoría registrada.");
      return menuUsuario(usuario);
    }

    const [clave, texto] = preguntas[i];
    rl.question(texto, valor => {
      datos[clave] = valor;
      hacerPregunta(i + 1);
    });
  }

  hacerPregunta();
}

function verAuditorias(usuario) {
  const auditorias = auditoriaManager.obtenerPorUsuario(usuario);
  if (auditorias.length === 0) {
    console.log("⚠️ No tienes auditorías registradas.");
  } else {
    auditorias.forEach((a, i) => {
      console.log(`\n📁 Auditoría ${i + 1}`);
      console.log(`Proceso: ${a.proceso}`);
      console.log(`Fecha: ${a.fecha}`);
      console.log(`Auditor líder: ${a.auditorLider}`);
    });
  }
  menuUsuario(usuario);
}

mainMenu();

rl.on("close", () => {
  console.log("👋 Sesión finalizada.");
  process.exit(0);
});
