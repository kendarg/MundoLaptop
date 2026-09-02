
//Creamos la base de datos en PostgreSQL 

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE,
	rol VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (rol IN ('normal', 'admin')),
    telefono VARCHAR(30),
    direccion TEXT,
    documento_identidad VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL,
    marca_id INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    numero_serie VARCHAR(100) UNIQUE, 
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    condicion VARCHAR(30) NOT NULL CHECK (condicion IN ('nuevo', 'open_box', 'reacondicionado')),
    especificaciones JSONB, -- Ficha técnica dinámica en formato JSON
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    CONSTRAINT fk_productos_marca FOREIGN KEY (marca_id) REFERENCES marcas(id)
);


CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    precio_base NUMERIC(10, 2) NOT NULL CHECK (precio_base >= 0)
);


CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    fecha_venta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    CONSTRAINT fk_ventas_cliente FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
);


CREATE TABLE facturas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL UNIQUE,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    fecha_facturacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    monto_subtotal NUMERIC(12, 2) NOT NULL CHECK (monto_subtotal >= 0),
    impuestos NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (impuestos >= 0),
    monto_total NUMERIC(12, 2) NOT NULL CHECK (monto_total >= 0),
    CONSTRAINT fk_factura_venta FOREIGN KEY (venta_id) REFERENCES ventas(id)
);


CREATE TABLE ordenes_mantenimiento (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    servicio_id INTEGER NOT NULL,
    estado_orden VARCHAR(50) NOT NULL DEFAULT 'Pendiente' 
        CHECK (estado_orden IN ('Pendiente', 'En Diagnostico', 'En Proceso', 'Finalizado', 'Entregado', 'Cancelado')),
    diagnostico_notas TEXT,
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ordenes_cliente FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_ordenes_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);



//AGREGANDO DATOS : 

INSERT INTO usuarios (email, password_hash, rol) VALUES
('admin@tiendalaptops.com', '$2a$12$e8f932h1...', 'admin'),
('juan.perez@email.com', '$2a$12$9a8b7c6d...', 'normal');


INSERT INTO clientes (usuario_id, nombre, telefono, direccion, documento_identidad) VALUES
(2, 'Juan Pérez', '3001234567', 'Calle 10 #43-12, Medellín', '1035444555');


INSERT INTO categorias (nombre) VALUES 
('Portátiles'), 
('Memorias RAM'), 
('Almacenamiento (SSD)'), 
('Pantallas'), 
('Teclados');


INSERT INTO marcas (nombre) VALUES 
('Lenovo'), 
('ASUS'), 
('Kingston'), 
('Crucial');


INSERT INTO productos (categoria_id, marca_id, nombre, numero_serie, precio, stock, condicion, especificaciones) VALUES
(1, 1, 'Laptop Lenovo ThinkPad T480', 'SN-THINK-9821', 1450000.00, 3, 'reacondicionado', '{"procesador": "Core i5 8th Gen", "ram_gb": 16, "ssd_gb": 256, "pantalla": "14 FHD"}'),
(1, 2, 'Laptop ASUS ROG Strix G15', 'SN-ASUS-1029', 3200000.00, 2, 'open_box', '{"procesador": "Ryzen 7 6800H", "ram_gb": 16, "ssd_gb": 512, "gpu": "RTX 3060"}'),
(2, 3, 'Memoria RAM Kingston SO-DIMM 8GB DDR4', NULL, 110000.00, 15, 'nuevo', '{"tipo": "DDR4", "frecuencia_mhz": 3200, "formato": "SO-DIMM"}'),
(3, 4, 'Disco SSD Crucial NVMe 1TB', NULL, 280000.00, 10, 'nuevo', '{"interfaz": "NVMe M.2", "lectura_mbps": 3500}');


INSERT INTO servicios (nombre, precio_base) VALUES
('Mantenimiento Preventivo y Limpieza Térmica', 80000.00),
('Repotenciación e Instalación de Componentes', 50000.00),
('Diagnóstico Técnico General', 30000.00);


INSERT INTO ventas (cliente_id, total) VALUES (1, 1560000.00);


INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 1, 1450000.00),
(1, 3, 1, 110000.00);


INSERT INTO facturas (venta_id, numero_factura, monto_subtotal, impuestos, monto_total) VALUES
(1, 'FAC-0001', 1310924.37, 249075.63, 1560000.00);


INSERT INTO ordenes_mantenimiento (cliente_id, servicio_id, estado_orden, diagnostico_notas) VALUES
(1, 1, 'En Proceso', 'El equipo ingresa por sobrecalentamiento. Se requiere cambio de pasta térmica y limpieza de ventiladores.');


INSERT INTO ventas (usuario_id, fecha_venta, total) VALUES
(2, '2026-08-10 10:15:00-05', 3310000.00), -- Venta 3 (Ana López compró Laptop ASUS + Memoria RAM)
(3, '2026-08-18 14:40:00-05', 180000.00),  -- Venta 4 (David Gómez compró Teclado Mecánico)
(2, '2026-08-25 16:20:00-05', 280000.00);  -- Venta 5 (Ana López compró Disco SSD)


INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES
-- Detalle Venta 3
(3, 2, 1, 3200000.00), -- 1 Laptop ASUS ROG Strix G15
(3, 3, 1, 110000.00),  -- 1 Memoria RAM Kingston 8GB
-- Detalle Venta 4
(4, 5, 1, 180000.00),  -- 1 Teclado Mecánico RGB
-- Detalle Venta 5
(5, 4, 1, 280000.00);  -- 1 Disco SSD Crucial 1TB


INSERT INTO facturas (venta_id, numero_factura, fecha_facturacion, monto_subtotal, impuestos, monto_total) VALUES
(3, 'FAC-0003', '2026-08-10 10:15:00-05', 2781512.61, 528487.39, 3310000.00),
(4, 'FAC-0004', '2026-08-18 14:40:00-05', 151260.50, 28739.50, 180000.00),
(5, 'FAC-0005', '2026-08-25 16:20:00-05', 235294.12, 44705.88, 280000.00);




//CONSULTAS DESARROLLADAS PAR ALA VERIFICACION DE INFORMACION

-- Relacion de usuario con ventas -- cuenta la cantidad de ventas hechas por usuario ya registrado
SELECT 
    u.id AS usuario_id,
    u.nombre AS cliente,
    u.email,
    u.rol,
    COUNT(v.id) AS total_ventas_realizadas,
    SUM(v.total) AS total_dinero_comprado
FROM usuarios AS u
INNER JOIN ventas AS v 
    ON u.id = v.usuario_id
GROUP BY u.id
ORDER BY total_dinero_comprado DESC;


-- Muestra las ventas, los productos ligados al id de la venta, tambien el valor unitarios y cantidad comprada
SELECT 
    v.id AS venta_id,
    p.nombre AS producto,
    p.condicion,
    p.numero_serie,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) AS subtotal_item
FROM ventas AS v
INNER JOIN detalle_ventas AS dv 
    ON v.id = dv.venta_id
INNER JOIN productos AS p 
    ON dv.producto_id = p.id
ORDER BY v.id ASC;



-- relacion de ventas con facturas, cada venta esta ligada a una unica factura
SELECT 
    v.id AS venta_id,
    v.fecha_venta,
    f.numero_factura,
    f.fecha_facturacion,
    f.monto_subtotal,
    f.impuestos,
    f.monto_total
FROM ventas AS v
INNER JOIN facturas AS f 
    ON v.id = f.venta_id
ORDER BY f.fecha_facturacion DESC;



-- muestra la relacion de los servicios pedido por usuario ya registrado

SELECT 
    u.nombre AS cliente,
    u.telefono,
    om.id AS orden_id,
    s.nombre AS servicio_solicitado,
    s.precio_base,
    om.estado_orden,
    om.diagnostico_notas,
    om.fecha_solicitud
FROM usuarios AS u
INNER JOIN ordenes_mantenimiento AS om 
    ON u.id = om.usuario_id
INNER JOIN servicios AS s 
    ON om.servicio_id = s.id
ORDER BY om.fecha_solicitud DESC;




