
// usuario.js
import fetch from 'node-fetch';

export class Usuario {
    constructor(gmail, contraseña, rol = null) {
        this.gmail = gmail.trim();
        this.contraseña = contraseña;
        this.rol = rol;
    }

    async registrar() {
        if (!this.gmail || !this.contraseña || !this.rol) {
            console.log("❌ Todos los campos son obligatorios.");
            return false;
        }

        if (!["administrador", "auditor"].includes(this.rol)) {
            console.log("❌ Rol inválido.");
            return false;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gmail: this.gmail,
                    contraseña: this.contraseña,
                    rol: this.rol
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Error al registrar.");

            console.log("✅ Registro exitoso:", data.mensaje);
            return true;
        } catch (err) {
            console.log("❌", err.message);
            return false;
        }
    }

    async iniciarSesion() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gmail: this.gmail,
                    contraseña: this.contraseña
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Error al iniciar sesión.");

            console.log(`✅ Sesión iniciada: ${data.mensaje}`);
            this.rol = data.rol;
            return this;
        } catch (err) {
            console.log("❌", err.message);
            return null;
        }
    }
}
