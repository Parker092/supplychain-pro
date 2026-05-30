CREATE OR REPLACE FUNCTION prevent_quality_incident_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'quality_incidents records are immutable and cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_quality_incident_update ON quality_incidents;
DROP TRIGGER IF EXISTS trg_prevent_quality_incident_delete ON quality_incidents;

CREATE TRIGGER trg_prevent_quality_incident_update
BEFORE UPDATE ON quality_incidents
FOR EACH ROW
EXECUTE FUNCTION prevent_quality_incident_modification();

CREATE TRIGGER trg_prevent_quality_incident_delete
BEFORE DELETE ON quality_incidents
FOR EACH ROW
EXECUTE FUNCTION prevent_quality_incident_modification();