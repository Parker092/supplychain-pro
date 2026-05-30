CREATE TABLE IF NOT EXISTS quality_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    shipment_id UUID NOT NULL,
    telemetry_event_id UUID,

    incident_type VARCHAR(80) NOT NULL,
    severity VARCHAR(30) NOT NULL,

    description TEXT NOT NULL,

    measured_value NUMERIC(10,2),
    threshold_value NUMERIC(10,2),

    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,

    immutable_hash TEXT NOT NULL,

    occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_quality_incidents_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_quality_incidents_telemetry_event
        FOREIGN KEY (telemetry_event_id)
        REFERENCES telemetry_events(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_quality_incidents_type
        CHECK (
            incident_type IN (
                'COLD_CHAIN_BREACH',
                'LOW_BATTERY',
                'GEOFENCE_VIOLATION',
                'STORAGE_VOLUME_FULL',
                'SYSTEM_RESTART_DETECTED'
            )
        ),

    CONSTRAINT chk_quality_incidents_severity
        CHECK (
            severity IN (
                'INFO',
                'WARNING',
                'CRITICAL'
            )
        ),

    CONSTRAINT chk_quality_incidents_latitude
        CHECK (latitude BETWEEN -90 AND 90),

    CONSTRAINT chk_quality_incidents_longitude
        CHECK (longitude BETWEEN -180 AND 180)
);

CREATE INDEX IF NOT EXISTS idx_quality_incidents_shipment_id
    ON quality_incidents(shipment_id);

CREATE INDEX IF NOT EXISTS idx_quality_incidents_type
    ON quality_incidents(incident_type);

CREATE INDEX IF NOT EXISTS idx_quality_incidents_severity
    ON quality_incidents(severity);

CREATE INDEX IF NOT EXISTS idx_quality_incidents_occurred_at
    ON quality_incidents(occurred_at);