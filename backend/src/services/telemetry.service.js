import { findShipmentByCode } from "../repositories/shipment.repository.js";
import {
  createTelemetryEvent,
  upsertShipmentState,
  withDatabaseTransaction
} from "../repositories/telemetry.repository.js";
import { createQualityIncident } from "../repositories/incident.repository.js";
import { evaluateTelemetryRules } from "./rule-engine.service.js";
import { createImmutableHash } from "../utils/hash.util.js";

export async function processTelemetryService(telemetryPayload) {
  const shipment = await findShipmentByCode(telemetryPayload.shipmentCode);

  if (!shipment) {
    const error = new Error(`Shipment with code ${telemetryPayload.shipmentCode} was not found`);
    error.statusCode = 404;
    throw error;
  }

  return withDatabaseTransaction(async (client) => {
    const telemetryEvent = await createTelemetryEvent(client, {
      shipmentId: shipment.id,
      sequenceNumber: telemetryPayload.sequenceNumber,
      latitude: telemetryPayload.latitude,
      longitude: telemetryPayload.longitude,
      temperature: telemetryPayload.temperature,
      humidity: telemetryPayload.humidity,
      batteryLevel: telemetryPayload.batteryLevel
    });

    const shipmentState = await upsertShipmentState(client, {
      shipmentId: shipment.id,
      lastTelemetryEventId: telemetryEvent.id,
      lastSequenceNumber: telemetryPayload.sequenceNumber,
      lastLatitude: telemetryPayload.latitude,
      lastLongitude: telemetryPayload.longitude,
      lastTemperature: telemetryPayload.temperature,
      lastHumidity: telemetryPayload.humidity,
      lastBatteryLevel: telemetryPayload.batteryLevel
    });

    const incidentRules = evaluateTelemetryRules({
      shipment,
      telemetry: telemetryPayload
    });

    const createdIncidents = [];

    for (const incidentRule of incidentRules) {
      const hashPayload = {
        shipmentId: shipment.id,
        telemetryEventId: telemetryEvent.id,
        incidentType: incidentRule.incidentType,
        severity: incidentRule.severity,
        description: incidentRule.description,
        measuredValue: incidentRule.measuredValue,
        thresholdValue: incidentRule.thresholdValue,
        latitude: telemetryPayload.latitude,
        longitude: telemetryPayload.longitude,
        createdAt: new Date().toISOString()
      };

      const immutableHash = createImmutableHash(hashPayload);

      const incident = await createQualityIncident(client, {
        shipmentId: shipment.id,
        telemetryEventId: telemetryEvent.id,
        incidentType: incidentRule.incidentType,
        severity: incidentRule.severity,
        description: incidentRule.description,
        measuredValue: incidentRule.measuredValue,
        thresholdValue: incidentRule.thresholdValue,
        latitude: telemetryPayload.latitude,
        longitude: telemetryPayload.longitude,
        immutableHash
      });

      createdIncidents.push(incident);
    }

    return {
      shipment,
      telemetryEvent,
      shipmentState,
      incidents: createdIncidents
    };
  });
}