import express from 'express';
import { User } from '../models/index.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    const user = await User.findOne({ 
      where: { 
        username,
        isActive: true 
      } 
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // En producción, aquí generarías un JWT token
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Logout (simple response para compatibilidad)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

// Verificar sesión
router.get('/verify', async (req, res) => {
  try {
    // En producción verificarías el token JWT aquí
    const userId = req.headers['user-id']; // Simplificado para desarrollo
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inválido'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error verificando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;
