-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS gestion_auditorias;

-- Crear la base de datos
CREATE DATABASE gestion_auditorias;
USE gestion_auditorias;

-- Tabla de auditores
CREATE TABLE auditores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    rol ENUM('Líder', 'Secundario') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditados
CREATE TABLE auditados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditorías
CREATE TABLE auditorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proceso VARCHAR(255) NOT NULL,
    numero INT NOT NULL UNIQUE,
    ciclo INT NOT NULL,
    proposito TEXT NOT NULL,
    alcance TEXT NOT NULL,
    fecha_creacion DATE NOT NULL,
    fecha_apertura DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    lugar_reunion VARCHAR(255) NOT NULL,
    fecha_cierre DATE NOT NULL,
    hora_cierre TIME NOT NULL,
    lugar_cierre VARCHAR(255) NOT NULL,
    estado ENUM('Planeada', 'En Proceso', 'Completada', 'Cancelada') DEFAULT 'Planeada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de documentos
CREATE TABLE documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    version INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_documento ENUM('Procedimiento', 'Manual', 'Formato', 'Política', 'Otro') NOT NULL,
    fecha_vigencia DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de hallazgos
CREATE TABLE hallazgos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auditoria_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    tipo ENUM('No Conformidad', 'Observación', 'Oportunidad de Mejora') NOT NULL,
    estado ENUM('Abierto', 'En Proceso', 'Cerrado') DEFAULT 'Abierto',
    fecha_identificacion DATE NOT NULL,
    fecha_compromiso DATE,
    fecha_cierre DATE,
    responsable_id INT,
    evidencia TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES auditados(id)
);

-- Tabla de relación auditorías-auditores
CREATE TABLE auditoria_auditores (
    auditoria_id INT,
    auditor_id INT,
    rol ENUM('Líder', 'Secundario') NOT NULL,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (auditor_id) REFERENCES auditores(id),
    PRIMARY KEY (auditoria_id, auditor_id)
);

-- Tabla de relación auditorías-auditados
CREATE TABLE auditoria_auditados (
    auditoria_id INT,
    auditado_id INT,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (auditado_id) REFERENCES auditados(id),
    PRIMARY KEY (auditoria_id, auditado_id)
);

-- Tabla de relación auditorías-documentos
CREATE TABLE auditoria_documentos (
    auditoria_id INT,
    documento_id INT,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (documento_id) REFERENCES documentos(id),
    PRIMARY KEY (auditoria_id, documento_id)
);

-- Tabla de acciones correctivas
CREATE TABLE acciones_correctivas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hallazgo_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_planificada DATE NOT NULL,
    fecha_implementacion DATE,
    estado ENUM('Planificada', 'En Proceso', 'Implementada', 'Verificada') DEFAULT 'Planificada',
    responsable_id INT,
    evidencia TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hallazgo_id) REFERENCES hallazgos(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES auditados(id)
);

-- Insertar datos de ejemplo para auditores
INSERT INTO auditores (nombre, email, cargo, departamento, rol) VALUES
('Juan Pérez', 'juan.perez@empresa.com', 'Auditor Senior', 'Calidad', 'Líder'),
('María García', 'maria.garcia@empresa.com', 'Auditor Junior', 'Calidad', 'Secundario'),
('Carlos López', 'carlos.lopez@empresa.com', 'Auditor Senior', 'Operaciones', 'Líder');

-- Insertar datos de ejemplo para auditados
INSERT INTO auditados (nombre, cargo, area, email, telefono) VALUES
('Ana Martínez', 'Gerente', 'Recursos Humanos', 'ana.martinez@empresa.com', '123-456-7890'),
('Pedro Sánchez', 'Coordinador', 'Calidad', 'pedro.sanchez@empresa.com', '123-456-7891'),
('Laura Torres', 'Directora', 'Operaciones', 'laura.torres@empresa.com', '123-456-7892');

-- Insertar datos de ejemplo para documentos
INSERT INTO documentos (codigo, version, nombre, descripcion, tipo_documento, fecha_vigencia) VALUES
('PRO-001', 1, 'Procedimiento de Auditoría', 'Documento que describe el proceso de auditoría', 'Procedimiento', '2024-12-31'),
('MAN-001', 2, 'Manual de Calidad', 'Manual general del sistema de gestión de calidad', 'Manual', '2024-12-31'),
('FOR-001', 1, 'Formato de Hallazgos', 'Formato para documentar hallazgos de auditoría', 'Formato', '2024-12-31');

-- Crear índices para optimizar las consultas
CREATE INDEX idx_auditoria_estado ON auditorias(estado);
CREATE INDEX idx_hallazgos_estado ON hallazgos(estado);
CREATE INDEX idx_auditoria_fecha ON auditorias(fecha_creacion);
CREATE INDEX idx_documentos_codigo ON documentos(codigo); 