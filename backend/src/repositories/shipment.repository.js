import { pool } from "../config/database.js";

export async function findAllShipments() {
  const result = await pool.query(`
    SELECT
      id,
      code,
      product_name,
      origin,
      destination,
      max_temperature,
      min_temperature,
      status,
      created_at,
      updated_at
    FROM shipments
    ORDER BY created_at DESC;
  `);

  return result.rows;
}

export async function findShipmentByCode(code) {
  const result = await pool.query(
    `
    SELECT
      id,
      code,
      product_name,
      origin,
      destination,
      max_temperature,
      min_temperature,
      status,
      created_at,
      updated_at
    FROM shipments
    WHERE code = $1;
    `,
    [code]
  );

  return result.rows[0] || null;
}

export async function findShipmentStateByShipmentId(shipmentId) {
  const result = await pool.query(
    `
    SELECT
      shipment_id,
      last_telemetry_event_id,
      last_sequence_number,
      last_latitude,
      last_longitude,
      last_temperature,
      last_humidity,
      last_battery_level,
      updated_at
    FROM shipment_state
    WHERE shipment_id = $1;
    `,
    [shipmentId]
  );

  return result.rows[0] || null;
}