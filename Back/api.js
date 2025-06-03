// api.js
import express from 'express';
const app = express();
app.use(express.json());

const usuarios = [];

app.post('/api/v1/registrar', (req, res) => {
  const { gmail, contraseña, rol } = req.body;
  if (usuarios.some(u => u.gmail === gmail)) {
    return res.status(400).json({ detail: 'Usuario ya existe' });
  }
  usuarios.push({ gmail, contraseña, rol });
  res.json({ mensaje: 'Usuario registrado con éxito' });
});

app.post('/api/v1/login', (req, res) => {
  const { gmail, contraseña } = req.body;
  const usuario = usuarios.find(u => u.gmail === gmail && u.contraseña === contraseña);
  if (!usuario) {
    return res.status(401).json({ detail: 'Credenciales inválidas' });
  }
  res.json({ mensaje: 'Inicio de sesión exitoso', rol: usuario.rol });
});

app.listen(3000, () => console.log('✅ API escuchando en http://localhost:3000'));
