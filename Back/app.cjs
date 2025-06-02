const readline = require("readline");

// ==== Clases ====

class Usuario {
    constructor(gmail, contraseña, rol) {
        this.gmail = gmail.trim();
        this.contraseña = contraseña;
        this.rol = rol;
    }

    static usuarios = []; // Solo para simular (en tu caso, puedes conectar DB)

    static registrar(gmail, contraseña, rol) {
        const existe = Usuario.usuarios.some(u => u.gmail === gmail);
        if (existe) {
            console.log("❌ Ya existe un usuario con ese Gmail.");
            return false;
        }

        const nuevoUsuario = new Usuario(gmail, contraseña, rol);
        Usuario.usuarios.push(nuevoUsuario);
        console.log("✅ Usuario registrado exitosamente.");
        return true;
    }

    static iniciarSesion(gmail, contraseña) {
        const usuario = Usuario.usuarios.find(
            u => u.gmail === gmail && u.contraseña === contraseña
        );

        if (!usuario) {
            console.log("❌ Usuario no registrado o credenciales incorrectas.");
            return null;
        }

        console.log(`✅ Bienvenido, ${usuario.gmail}. Rol: ${usuario.rol}`);
        return usuario;
    }
}

class Auditoria {
    static auditorias = [];

    static planear(usuario, descripcion) {
        Auditoria.auditorias.push({
            creador: usuario.gmail,
            descripcion
        });
        console.log("✅ Auditoría registrada exitosamente.");
    }

    static listarDe(usuario) {
        return Auditoria.auditorias.filter(a => a.creador === usuario.gmail);
    }

    static generarTablero(usuario) {
        const lista = Auditoria.listarDe(usuario);
        console.log("\n📊 Tablero de auditorías:");
        if (lista.length === 0) {
            console.log("No tienes auditorías registradas.");
        } else {
            lista.forEach((a, i) => {
                console.log(`${i + 1}. ${a.descripcion}`);
            });
        }
    }
}

// ==== Consola ====

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenuPrincipal() {
    console.log("\n=== MENÚ ===");
    console.log("1. Registrar usuario");
    console.log("2. Iniciar sesión");
    console.log("3. Salir");

    rl.question("Elige una opción: ", opcion => {
        switch (opcion.trim()) {
            case "1":
                registrarFlujo();
                break;
            case "2":
                loginFlujo();
                break;
            case "3":
                rl.close();
                break;
            default:
                console.log("❌ Opción inválida.");
                mostrarMenuPrincipal();
        }
    });
}

function registrarFlujo() {
    rl.question("Gmail: ", gmail => {
        rl.question("Contraseña: ", contraseña => {
            pedirRolValido(gmail, contraseña);
        });
    });
}

function pedirRolValido(gmail, contraseña) {
    rl.question("Rol (administrador / auditor): ", rol => {
        const rolLimpio = rol.trim().toLowerCase();
        if (!["administrador", "auditor"].includes(rolLimpio)) {
            console.log("❌ Rol inválido. Solo se permite 'administrador' o 'auditor'.");
            pedirRolValido(gmail, contraseña); // Reintenta sin salir
        } else {
            Usuario.registrar(gmail, contraseña, rolLimpio);
            mostrarMenuPrincipal();
        }
    });
}

function loginFlujo() {
    rl.question("Gmail: ", gmail => {
        rl.question("Contraseña: ", contraseña => {
            const usuario = Usuario.iniciarSesion(gmail, contraseña);
            if (usuario) {
                mostrarMenuUsuario(usuario);
            } else {
                mostrarMenuPrincipal();
            }
        });
    });
}

function mostrarMenuUsuario(usuario) {
    console.log("\n=== MENÚ DE USUARIO ===");
    console.log("1. Planear auditoría");
    console.log("2. Mis auditorías");
    console.log("3. Generar tablero");
    console.log("4. Cerrar sesión");

    rl.question("Elige una opción: ", opcion => {
        switch (opcion.trim()) {
            case "1":
                rl.question("Descripción de la auditoría: ", descripcion => {
                    Auditoria.planear(usuario, descripcion);
                    mostrarMenuUsuario(usuario);
                });
                break;
            case "2":
                const lista = Auditoria.listarDe(usuario);
                console.log("\n📋 Mis auditorías:");
                if (lista.length === 0) {
                    console.log("No tienes auditorías registradas.");
                } else {
                    lista.forEach((a, i) =>
                        console.log(`${i + 1}. ${a.descripcion}`)
                    );
                }
                mostrarMenuUsuario(usuario);
                break;
            case "3":
                Auditoria.generarTablero(usuario);
                mostrarMenuUsuario(usuario);
                break;
            case "4":
                console.log("🔒 Sesión cerrada.");
                mostrarMenuPrincipal();
                break;
            default:
                console.log("❌ Opción inválida.");
                mostrarMenuUsuario(usuario);
        }
    });
}

// Iniciar aplicación
mostrarMenuPrincipal();

rl.on("close", () => {
    console.log("👋 ¡Hasta luego!");
    process.exit(0);
});
