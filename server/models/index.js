import sequelize, { testConnection, syncDatabase } from '../config/database.js';
import User from './User.js';
import Audit from './Audit.js';
import Indicator from './Indicator.js';

// Definir asociaciones
User.hasMany(Audit, {
  foreignKey: 'auditorId',
  as: 'audits'
});

Audit.belongsTo(User, {
  foreignKey: 'auditorId',
  as: 'auditor'
});

Audit.hasMany(Indicator, {
  foreignKey: 'auditId',
  as: 'indicators'
});

Indicator.belongsTo(Audit, {
  foreignKey: 'auditId',
  as: 'audit'
});

// Función para inicializar la base de datos con datos de prueba
export const initializeDatabase = async () => {
  try {
    await testConnection();
    await syncDatabase();
    
    // Crear usuario administrador por defecto si no existe
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      await User.create({
        username: 'admin',
        password: '1234', // En producción usar hash
        fullName: 'Administrador',
        email: 'admin@comite.com',
        role: 'admin'
      });
      console.log('✅ Usuario administrador creado');
    }

    // Crear usuarios de prueba
    const testUsers = [
      { username: 'luis', password: '1234', fullName: 'Luis García', email: 'luis@comite.com', role: 'auditor' },
      { username: 'luisa', password: '1234', fullName: 'Luis A. Rodríguez', email: 'luisa@comite.com', role: 'auditor' },
      { username: 'luisb', password: '1234', fullName: 'Luis B. Martínez', email: 'luisb@comite.com', role: 'auditor' }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Usuario de prueba ${userData.username} creado`);
      }
    }

    // Crear auditorías de prueba
    const users = await User.findAll();
    const auditors = users.filter(user => user.role === 'auditor');
    
    const testAudits = [
      {
        name: 'Auditoría 1',
        auditNumber: 1,
        cycle: 1,
        process: 'Gestión de Calidad',
        purpose: 'Evaluar el cumplimiento de procesos de calidad',
        scope: 'Departamento de producción',
        auditDate: new Date('2025-03-19'),
        status: 'completed',
        auditorId: auditors[0]?.id || 1,
        score: 85.5
      },
      {
        name: 'Auditoría 2',
        auditNumber: 2,
        cycle: 1,
        process: 'Gestión Financiera',
        purpose: 'Revisar controles financieros internos',
        scope: 'Departamento contable',
        auditDate: new Date('2025-03-18'),
        status: 'completed',
        auditorId: auditors[1]?.id || 1,
        score: 92.0
      },
      {
        name: 'Auditoría 3',
        auditNumber: 3,
        cycle: 1,
        process: 'Gestión de RRHH',
        purpose: 'Evaluar procesos de recursos humanos',
        scope: 'Departamento de RRHH',
        auditDate: new Date('2025-03-17'),
        status: 'in_progress',
        auditorId: auditors[2]?.id || 1,
        score: null
      }
    ];

    for (const auditData of testAudits) {
      const existingAudit = await Audit.findOne({ where: { auditNumber: auditData.auditNumber } });
      if (!existingAudit) {
        await Audit.create(auditData);
        console.log(`✅ Auditoría ${auditData.name} creada`);
      }
    }

    // Crear indicadores de prueba
    const audits = await Audit.findAll();
    const testIndicators = [
      {
        name: 'Cumplimiento de Procedimientos',
        description: 'Porcentaje de procedimientos ejecutados correctamente',
        type: 'compliance',
        value: 85.5,
        target: 90.0,
        unit: '%',
        period: 'monthly',
        auditId: audits[0]?.id
      },
      {
        name: 'Eficiencia Operacional',
        description: 'Tiempo promedio de ejecución de procesos',
        type: 'efficiency',
        value: 92.0,
        target: 95.0,
        unit: '%',
        period: 'monthly',
        auditId: audits[1]?.id
      }
    ];

    for (const indicatorData of testIndicators) {
      if (indicatorData.auditId) {
        await Indicator.create(indicatorData);
        console.log(`✅ Indicador ${indicatorData.name} creado`);
      }
    }

    console.log('🎉 Base de datos inicializada correctamente con datos de prueba');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
};

// Inicializar automáticamente
initializeDatabase();

export { sequelize, User, Audit, Indicator };
