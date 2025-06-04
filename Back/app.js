// app.js
import express from 'express';
import dotenv from 'dotenv';
import auditoriasRoutes from './routes/auditorias.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // para recibir JSON en las solicitudes

// Rutas de la API
app.use('/api/auditorias', auditoriasRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
