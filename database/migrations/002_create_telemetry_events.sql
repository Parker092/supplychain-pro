CREATE TABLE IF NOT EXISTS telemetry_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    shipment_id UUID NOT NULL,

    sequence_number INTEGER NOT NULL,

    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,

    temperature NUMERIC(5,2) NOT NULL,
    humidity NUMERIC(5,2) NOT NULL,
    battery_level NUMERIC(5,2) NOT NULL,

    recorded_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_telemetry_events_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_telemetry_shipment_sequence
        UNIQUE (shipment_id, sequence_number),

    CONSTRAINT chk_telemetry_latitude
        CHECK (latitude BETWEEN -90 AND 90),

    CONSTRAINT chk_telemetry_longitude
        CHECK (longitude BETWEEN -180 AND 180),

    CONSTRAINT chk_telemetry_humidity
        CHECK (humidity BETWEEN 0 AND 100),

    CONSTRAINT chk_telemetry_battery
        CHECK (battery_level BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_events_shipment_id
    ON telemetry_events(shipment_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_events_recorded_at
    ON telemetry_events(recorded_at);

CREATE INDEX IF NOT EXISTS idx_telemetry_events_sequence
    ON telemetry_events(shipment_id, sequence_number);