SELECT
    qi.id,
    s.code AS shipment_code,
    qi.incident_type,
    qi.severity,
    qi.description,
    qi.measured_value,
    qi.threshold_value,
    qi.latitude,
    qi.longitude,
    qi.immutable_hash,
    qi.occurred_at
FROM quality_incidents qi
INNER JOIN shipments s
    ON s.id = qi.shipment_id
ORDER BY qi.occurred_at DESC;