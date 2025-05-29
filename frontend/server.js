// Servidor estático para frontend en puerto diferente
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5173; // Puerto para el frontend

// Servir archivos estáticos desde la raíz del frontend
app.use(express.static(path.join(__dirname, '.')));

// Servir archivos estáticos específicamente desde la carpeta Proyecto
app.use('/Proyecto', express.static(path.join(__dirname, 'Proyecto')));

// Servir archivos CSS desde la carpeta css
app.use('/css', express.static(path.join(__dirname, 'css')));

// Ruta principal que sirve el Index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Proyecto', 'Index.html'));
});

// Solo servir Index.html para rutas que NO sean archivos estáticos
app.get('*', (req, res, next) => {
  // Si la ruta tiene extensión (ej: .css, .js, .png), pasar al siguiente middleware
  if (path.extname(req.path)) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'Proyecto', 'Index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend corriendo en http://localhost:${PORT}`);
});
