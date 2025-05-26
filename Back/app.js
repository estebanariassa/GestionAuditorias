import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import dbMiddleware from './Middlewares/dbMiddleware.js';
import auditoriasRoutes from './routes/auditorias.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(dbMiddleware); // Aplica a todas las rutas

// Rutas
app.use('/api/auditorias', auditoriasRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Conectado a MySQL: ${process.env.DB_NAME}`);
});