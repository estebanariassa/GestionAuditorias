import readline from "readline";
import { AuditoriaManager } from "./auditorias.js";
import { Usuario } from "./usuario.js"; // 👈 importación externa

const auditoriaManager = new AuditoriaManager();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

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
      rl.question("Rol (administrador / auditor): ", async rol => {
        rol = rol.trim().toLowerCase();
        const usuario = new Usuario(gmail, pass, rol);
        const registrado = await usuario.registrar();
        if (registrado) {
          mainMenu();
        } else {
          registrarUsuario();
        }
      });
    });
  });
}

function iniciarSesion() {
  rl.question("Gmail: ", gmail => {
    rl.question("Contraseña: ", async pass => {
      const usuario = new Usuario(gmail, pass);
      const logeado = await usuario.iniciarSesion();
      if (logeado) {
        menuUsuario(logeado);
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


// (TODO: mantener sin cambios funciones: menuUsuario, planearAuditoria, verAuditorias)

mainMenu();

rl.on("close", () => {
  console.log("👋 Sesión finalizada.");
  process.exit(0);
});
