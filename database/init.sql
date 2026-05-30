\i /docker-entrypoint-initdb.d/migrations/001_create_shipments.sql
\i /docker-entrypoint-initdb.d/migrations/002_create_telemetry_events.sql
\i /docker-entrypoint-initdb.d/migrations/003_create_shipment_state.sql
\i /docker-entrypoint-initdb.d/migrations/004_create_quality_incidents.sql
\i /docker-entrypoint-initdb.d/migrations/005_create_incident_immutability_trigger.sql

\i /docker-entrypoint-initdb.d/seeds/seed_shipments.sql