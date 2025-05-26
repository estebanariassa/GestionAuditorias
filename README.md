# Sistema de Gestión de Auditorías

Sistema web para la gestión y seguimiento de auditorías internas.

## Estructura del Proyecto

```
gestion-auditorias/
├── client/                 # Frontend de la aplicación
│   ├── public/            # Archivos públicos
│   │   ├── index.html
│   │   └── assets/       # Imágenes, fuentes, etc.
│   ├── src/              # Código fuente del frontend
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/       # Páginas principales
│   │   ├── styles/      # Archivos CSS
│   │   ├── utils/       # Utilidades y helpers
│   │   └── App.js       # Componente principal
│   └── package.json     # Dependencias del frontend
│
├── server/                # Backend de la aplicación
│   ├── config/          # Configuraciones
│   │   └── database.js  # Configuración de la base de datos
│   ├── controllers/     # Controladores
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas de la API
│   ├── middleware/     # Middlewares
│   ├── utils/          # Utilidades
│   ├── database/       # Scripts de base de datos
│   │   └── schema.sql  # Estructura de la base de datos
│   └── app.js         # Aplicación Express
│
├── docs/                 # Documentación
│   ├── api/            # Documentación de la API
│   └── database/       # Documentación de la base de datos
│
└── package.json         # Dependencias principales
```

## Tecnologías Utilizadas

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Base de datos: MySQL
- Otras herramientas: npm

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
3. Configurar la base de datos:
   - Crear archivo `.env` en la carpeta `server`
   - Ejecutar script de base de datos

## Desarrollo

1. Iniciar el servidor:
   ```bash
   cd server
   npm run dev
   ```

2. Iniciar el cliente:
   ```bash
   cd client
   npm start
   ```

## Contribución

Por favor, asegúrate de seguir las convenciones de código establecidas y documentar adecuadamente los cambios.