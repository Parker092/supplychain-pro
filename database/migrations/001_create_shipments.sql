CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,

    origin VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,

    max_temperature NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    min_temperature NUMERIC(5,2) NOT NULL DEFAULT 0.00,

    status VARCHAR(30) NOT NULL DEFAULT 'IN_TRANSIT',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_shipments_temperature_range
        CHECK (min_temperature < max_temperature),

    CONSTRAINT chk_shipments_status
        CHECK (status IN ('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'INCIDENT_REPORTED'))
);