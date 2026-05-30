import { pool } from "../config/database.js";

export async function createTelemetryEvent(client, telemetryData) {
  const result = await client.query(
    `
    INSERT INTO telemetry_events (
      shipment_id,
      sequence_number,
      latitude,
      longitude,
      temperature,
      humidity,
      battery_level
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      shipment_id,
      sequence_number,
      latitude,
      longitude,
      temperature,
      humidity,
      battery_level,
      recorded_at;
    `,
    [
      telemetryData.shipmentId,
      telemetryData.sequenceNumber,
      telemetryData.latitude,
      telemetryData.longitude,
      telemetryData.temperature,
      telemetryData.humidity,
      telemetryData.batteryLevel
    ]
  );

  return result.rows[0];
}

export async function upsertShipmentState(client, stateData) {
  const result = await client.query(
    `
    INSERT INTO shipment_state (
      shipment_id,
      last_telemetry_event_id,
      last_sequence_number,
      last_latitude,
      last_longitude,
      last_temperature,
      last_humidity,
      last_battery_level,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (shipment_id)
    DO UPDATE SET
      last_telemetry_event_id = EXCLUDED.last_telemetry_event_id,
      last_sequence_number = EXCLUDED.last_sequence_number,
      last_latitude = EXCLUDED.last_latitude,
      last_longitude = EXCLUDED.last_longitude,
      last_temperature = EXCLUDED.last_temperature,
      last_humidity = EXCLUDED.last_humidity,
      last_battery_level = EXCLUDED.last_battery_level,
      updated_at = NOW()
    RETURNING
      shipment_id,
      last_telemetry_event_id,
      last_sequence_number,
      last_latitude,
      last_longitude,
      last_temperature,
      last_humidity,
      last_battery_level,
      updated_at;
    `,
    [
      stateData.shipmentId,
      stateData.lastTelemetryEventId,
      stateData.lastSequenceNumber,
      stateData.lastLatitude,
      stateData.lastLongitude,
      stateData.lastTemperature,
      stateData.lastHumidity,
      stateData.lastBatteryLevel
    ]
  );

  return result.rows[0];
}

export async function withDatabaseTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}