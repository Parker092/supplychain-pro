SELECT
    s.code AS shipment_code,
    s.product_name,
    s.origin,
    s.destination,
    ss.last_sequence_number,
    ss.last_latitude,
    ss.last_longitude,
    ss.last_temperature,
    ss.last_humidity,
    ss.last_battery_level,
    ss.updated_at
FROM shipment_state ss
INNER JOIN shipments s
    ON s.id = ss.shipment_id
ORDER BY ss.updated_at DESC;