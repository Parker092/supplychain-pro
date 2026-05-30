CREATE TABLE IF NOT EXISTS shipment_state (
    shipment_id UUID PRIMARY KEY,

    last_telemetry_event_id UUID,

    last_sequence_number INTEGER NOT NULL,

    last_latitude NUMERIC(10,7) NOT NULL,
    last_longitude NUMERIC(10,7) NOT NULL,

    last_temperature NUMERIC(5,2) NOT NULL,
    last_humidity NUMERIC(5,2) NOT NULL,
    last_battery_level NUMERIC(5,2) NOT NULL,

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_shipment_state_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_shipment_state_last_telemetry
        FOREIGN KEY (last_telemetry_event_id)
        REFERENCES telemetry_events(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_shipment_state_latitude
        CHECK (last_latitude BETWEEN -90 AND 90),

    CONSTRAINT chk_shipment_state_longitude
        CHECK (last_longitude BETWEEN -180 AND 180),

    CONSTRAINT chk_shipment_state_humidity
        CHECK (last_humidity BETWEEN 0 AND 100),

    CONSTRAINT chk_shipment_state_battery
        CHECK (last_battery_level BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS idx_shipment_state_updated_at
    ON shipment_state(updated_at);