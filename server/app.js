const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Ruta estática: sirve archivos como CSS, JS, imágenes desde /public
app.use(express.static(path.join(__dirname, 'public')));

// 2. Ruta raíz: sirve el archivo Index.html al ingresar a localhost:3000/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

// 3. Rutas futuras de API (ejemplo)
//app.use('/api/auditorias', require('./routes/auditorias')); // si lo implementas después

// 4. Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
