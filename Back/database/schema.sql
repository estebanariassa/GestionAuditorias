-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestion_auditorias;
USE gestion_auditorias;

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

-- Tabla de auditores
CREATE TABLE auditores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rol ENUM('Líder', 'Secundario') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación auditorías-auditores
CREATE TABLE auditoria_auditores (
    auditoria_id INT,
    auditor_id INT,
    rol ENUM('Líder', 'Secundario') NOT NULL,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id),
    FOREIGN KEY (auditor_id) REFERENCES auditores(id),
    PRIMARY KEY (auditoria_id, auditor_id)
);

-- Tabla de auditados
CREATE TABLE auditados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    area VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación auditorías-auditados
CREATE TABLE auditoria_auditados (
    auditoria_id INT,
    auditado_id INT,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id),
    FOREIGN KEY (auditado_id) REFERENCES auditados(id),
    PRIMARY KEY (auditoria_id, auditado_id)
);

-- Tabla de documentos
CREATE TABLE documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    version INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación auditorías-documentos
CREATE TABLE auditoria_documentos (
    auditoria_id INT,
    documento_id INT,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id),
    FOREIGN KEY (documento_id) REFERENCES documentos(id),
    PRIMARY KEY (auditoria_id, documento_id)
);

-- Tabla de hallazgos
CREATE TABLE hallazgos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auditoria_id INT,
    descripcion TEXT NOT NULL,
    tipo ENUM('No Conformidad', 'Observación', 'Oportunidad de Mejora') NOT NULL,
    estado ENUM('Abierto', 'En Proceso', 'Cerrado') DEFAULT 'Abierto',
    fecha_identificacion DATE NOT NULL,
    fecha_compromiso DATE,
    fecha_cierre DATE,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO auditores (nombre, email, rol) VALUES
('Juan Pérez', 'juan.perez@empresa.com', 'Líder'),
('María García', 'maria.garcia@empresa.com', 'Secundario'),
('Carlos López', 'carlos.lopez@empresa.com', 'Líder');

INSERT INTO auditados (nombre, cargo, area) VALUES
('Ana Martínez', 'Gerente', 'Recursos Humanos'),
('Pedro Sánchez', 'Coordinador', 'Calidad'),
('Laura Torres', 'Directora', 'Operaciones');

INSERT INTO documentos (codigo, version, nombre, descripcion) VALUES
('PRO-001', 1, 'Procedimiento de Auditoría', 'Documento que describe el proceso de auditoría'),
('MAN-001', 2, 'Manual de Calidad', 'Manual general del sistema de gestión de calidad'),
('FOR-001', 1, 'Formato de Hallazgos', 'Formato para documentar hallazgos de auditoría');

-- Insertar una auditoría de ejemplo
INSERT INTO auditorias (
    proceso, numero, ciclo, proposito, alcance,
    fecha_creacion, fecha_apertura, hora_inicio, lugar_reunion,
    fecha_cierre, hora_cierre, lugar_cierre, estado
) VALUES (
    'Gestión de Calidad',
    2024001,
    1,
    'Verificar el cumplimiento de los requisitos del sistema de gestión de calidad',
    'Todos los procesos del sistema de gestión de calidad',
    '2024-03-20',
    '2024-04-01',
    '09:00:00',
    'Sala de Juntas Principal',
    '2024-04-05',
    '16:00:00',
    'Sala de Conferencias',
    'Planeada'
);

-- Relacionar auditores con la auditoría
INSERT INTO auditoria_auditores (auditoria_id, auditor_id, rol)
SELECT 1, id, rol FROM auditores WHERE nombre IN ('Juan Pérez', 'María García');

-- Relacionar auditados con la auditoría
INSERT INTO auditoria_auditados (auditoria_id, auditado_id)
SELECT 1, id FROM auditados WHERE nombre IN ('Ana Martínez', 'Pedro Sánchez');

-- Relacionar documentos con la auditoría
INSERT INTO auditoria_documentos (auditoria_id, documento_id)
SELECT 1, id FROM documentos;

-- Insertar algunos hallazgos de ejemplo
INSERT INTO hallazgos (
    auditoria_id, descripcion, tipo, estado,
    fecha_identificacion, fecha_compromiso
) VALUES
(1, 'No se encontró evidencia de la revisión periódica de los documentos', 'No Conformidad', 'Abierto', '2024-04-01', '2024-05-01'),
(1, 'Oportunidad de mejora en el proceso de comunicación interna', 'Oportunidad de Mejora', 'Abierto', '2024-04-01', '2024-05-15'),
(1, 'Registros de capacitación incompletos', 'Observación', 'Abierto', '2024-04-02', '2024-04-30');

-- Crear índices para optimizar las consultas
CREATE INDEX idx_auditoria_estado ON auditorias(estado);
CREATE INDEX idx_hallazgos_estado ON hallazgos(estado);
CREATE INDEX idx_auditoria_fecha ON auditorias(fecha_creacion);
CREATE INDEX idx_documentos_codigo ON documentos(codigo); 