import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.js';
import auditRoutes from './routes/audits.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';

// Importar modelos para sincronizar la base de datos
import './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logear todas las peticiones
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir específicamente la carpeta Proyecto
app.use('/Proyecto', express.static(path.join(__dirname, '../frontend/Proyecto')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Proyecto/Index.html'));
});

// Servir todas las páginas HTML del proyecto
app.get('/Proyecto/:page', (req, res) => {
  const page = req.params.page;
  console.log(`📄 Solicitando página: ${page}`);
  const filePath = path.join(__dirname, '../frontend/Proyecto', page);
  console.log(`📂 Ruta del archivo: ${filePath}`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`❌ Error sirviendo ${page}:`, err);
      res.status(404).json({ error: 'Página no encontrada' });
    } else {
      console.log(`✅ Página ${page} servida correctamente`);
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Frontend disponible en http://localhost:${PORT}`);
});
