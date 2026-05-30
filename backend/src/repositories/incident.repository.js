import { pool } from "../config/database.js";

export async function findAllIncidents() {
  const result = await pool.query(`
    SELECT
      qi.id,
      qi.shipment_id,
      s.code AS shipment_code,
      qi.telemetry_event_id,
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
    ORDER BY qi.occurred_at DESC
    LIMIT 100;
  `);

  return result.rows;
}

export async function createQualityIncident(client, incidentData) {
  const result = await client.query(
    `
    INSERT INTO quality_incidents (
      shipment_id,
      telemetry_event_id,
      incident_type,
      severity,
      description,
      measured_value,
      threshold_value,
      latitude,
      longitude,
      immutable_hash
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
      id,
      shipment_id,
      telemetry_event_id,
      incident_type,
      severity,
      description,
      measured_value,
      threshold_value,
      latitude,
      longitude,
      immutable_hash,
      occurred_at;
    `,
    [
      incidentData.shipmentId,
      incidentData.telemetryEventId,
      incidentData.incidentType,
      incidentData.severity,
      incidentData.description,
      incidentData.measuredValue,
      incidentData.thresholdValue,
      incidentData.latitude,
      incidentData.longitude,
      incidentData.immutableHash
    ]
  );

  return result.rows[0];
}