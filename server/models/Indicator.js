import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Indicator = sequelize.define('Indicator', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('compliance', 'efficiency', 'effectiveness', 'quality'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  target: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '%'
  },
  period: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'monthly'
  },
  auditId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'audits',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'indicators',
  indexes: [
    {
      fields: ['auditId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['period']
    }
  ]
});

export default Indicator;
