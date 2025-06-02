class Usuario {
    constructor(gmail, contraseña, rol = null) {
        this.gmail = gmail.trim();
        this.contraseña = contraseña;
        this.rol = rol;
    }

    async registrar() {
        if (!this.gmail || !this.contraseña || !this.rol) {
            alert("Todos los campos (gmail, contraseña y rol) son obligatorios para registrarse.");
            return;
        }

        if (!["administrador", "auditor"].includes(this.rol)) {
            alert("Rol inválido. Solo se permite 'administrador' o 'auditor'.");
            return;
        }

        try {
            const response = await fetch('/api/v1/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gmail: this.gmail,
                    contraseña: this.contraseña,
                    rol: this.rol
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Error al registrar usuario.");
            }

            alert("Registro exitoso: " + data.mensaje);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    async iniciarSesion() {
        if (!this.gmail || !this.contraseña) {
            alert("Debes ingresar tu Gmail y contraseña para iniciar sesión.");
            return;
        }

        try {
            const response = await fetch('/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gmail: this.gmail,
                    contraseña: this.contraseña
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Error al iniciar sesión.");
            }

            alert("Sesión iniciada: " + data.mensaje);
            localStorage.setItem("usuarioActual", this.gmail);
            localStorage.setItem("rol", data.rol);

            // Redirección según rol
            if (data.rol === "administrador") {
                window.location.href = "admin_dashboard.html";
            } else if (data.rol === "auditor") {
                window.location.href = "auditor_dashboard.html";
            } else {
                alert("Rol no autorizado.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
}
