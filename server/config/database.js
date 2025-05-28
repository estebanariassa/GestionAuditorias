import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/auditorias.db'),
  logging: false, // Cambiar a console.log para ver las consultas SQL
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

// Función para sincronizar modelos
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // force: true borra y recrea las tablas
    console.log('✅ Base de datos sincronizada correctamente.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  }
};

export default sequelize;
