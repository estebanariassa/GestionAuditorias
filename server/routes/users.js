import express from 'express';
import { User, Audit } from '../models/index.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const { role, active = true } = req.query;
    
    const where = { isActive: active === 'true' };
    
    if (role) {
      where.role = role;
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'username', 'fullName', 'email', 'role', 'isActive', 'createdAt'],
      include: [
        {
          model: Audit,
          as: 'audits',
          attributes: ['id', 'name', 'status', 'auditDate'],
          required: false
        }
      ],
      order: [['fullName', 'ASC']]
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'fullName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Audit,
          as: 'audits',
          attributes: ['id', 'name', 'status', 'auditDate', 'score']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { username, password, fullName, email, role } = req.body;

    // Validaciones básicas
    if (!username || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: username, password, fullName'
      });
    }

    // Verificar que el usuario no existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe'
      });
    }

    const user = await User.create({
      username,
      password, // En producción usar hash
      fullName,
      email,
      role: role || 'auditor'
    });

    // Responder sin la contraseña
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario'
    });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si se está actualizando el username, verificar que no existe
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ where: { username: req.body.username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya existe'
        });
      }
    }

    await user.update(req.body);

    // Responder sin la contraseña
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario'
    });
  }
});

// Desactivar usuario (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error desactivando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar usuario'
    });
  }
});

// Obtener auditores disponibles
router.get('/auditors/available', async (req, res) => {
  try {
    const auditors = await User.findAll({
      where: {
        role: ['auditor', 'admin'],
        isActive: true
      },
      attributes: ['id', 'username', 'fullName', 'email']
    });

    res.json({
      success: true,
      data: auditors
    });

  } catch (error) {
    console.error('Error obteniendo auditores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditores'
    });
  }
});

export default router;
