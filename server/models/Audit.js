import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Audit = sequelize.define('Audit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  auditNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  cycle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  process: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scope: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  criteria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  methodology: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  auditDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  auditorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  findings: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'audits',
  indexes: [
    {
      unique: true,
      fields: ['auditNumber']
    },
    {
      fields: ['auditorId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['auditDate']
    }
  ]
});

export default Audit;
