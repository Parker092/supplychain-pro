import { env } from "../config/env.js";
import { INCIDENT_SEVERITIES, INCIDENT_TYPES } from "../constants/incident-types.js";

function isOutsideGeofence(latitude, longitude) {
  return (
    latitude < env.geofence.minLatitude ||
    latitude > env.geofence.maxLatitude ||
    longitude < env.geofence.minLongitude ||
    longitude > env.geofence.maxLongitude
  );
}

export function evaluateTelemetryRules({ shipment, telemetry }) {
  const incidents = [];

  const maxTemperature = Number(shipment.max_temperature);
  const currentTemperature = Number(telemetry.temperature);
  const batteryLevel = Number(telemetry.batteryLevel);

  if (currentTemperature > maxTemperature) {
    incidents.push({
      incidentType: INCIDENT_TYPES.COLD_CHAIN_BREACH,
      severity: INCIDENT_SEVERITIES.CRITICAL,
      description: `Cold chain breach detected. Current temperature ${currentTemperature}°C exceeds allowed maximum ${maxTemperature}°C.`,
      measuredValue: currentTemperature,
      thresholdValue: maxTemperature
    });
  }

  if (batteryLevel <= env.minAllowedBattery) {
    incidents.push({
      incidentType: INCIDENT_TYPES.LOW_BATTERY,
      severity: INCIDENT_SEVERITIES.WARNING,
      description: `Monitoring device battery is low. Current battery level is ${batteryLevel}%.`,
      measuredValue: batteryLevel,
      thresholdValue: env.minAllowedBattery
    });
  }

  if (isOutsideGeofence(Number(telemetry.latitude), Number(telemetry.longitude))) {
    incidents.push({
      incidentType: INCIDENT_TYPES.GEOFENCE_VIOLATION,
      severity: INCIDENT_SEVERITIES.WARNING,
      description: "GPS coordinates are outside the allowed delivery corridor.",
      measuredValue: null,
      thresholdValue: null
    });
  }

  return incidents;
}