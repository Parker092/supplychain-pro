INSERT INTO shipments (
    code,
    product_name,
    origin,
    destination,
    max_temperature,
    min_temperature,
    status
)
VALUES
(
    'SHIP-001',
    'Carnes congeladas',
    'Santa Ana',
    'La Unión',
    5.00,
    0.00,
    'IN_TRANSIT'
),
(
    'SHIP-002',
    'Lácteos refrigerados',
    'San Salvador',
    'San Miguel',
    6.00,
    1.00,
    'PENDING'
),
(
    'SHIP-003',
    'Mariscos frescos',
    'Acajutla',
    'San Salvador',
    4.00,
    0.00,
    'PENDING'
)
ON CONFLICT (code) DO NOTHING;