// Servidor estático para frontend en puerto diferente
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5173; // Puerto para el frontend

app.use(express.static(path.join(__dirname, '.')));


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
