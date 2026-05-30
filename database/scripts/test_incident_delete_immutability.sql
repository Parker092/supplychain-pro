DO $$
DECLARE
    target_incident_id UUID;
BEGIN
    SELECT id
    INTO target_incident_id
    FROM quality_incidents
    ORDER BY occurred_at DESC
    LIMIT 1;

    IF target_incident_id IS NULL THEN
        RAISE EXCEPTION 'No quality incidents found. Generate an incident before testing delete immutability.';
    END IF;

    RAISE NOTICE 'Testing DELETE immutability for incident: %', target_incident_id;

    DELETE FROM quality_incidents
    WHERE id = target_incident_id;
END $$;