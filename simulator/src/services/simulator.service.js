import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { sendTelemetry } from "./telemetry-client.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJsonFile(relativePath) {
    const filePath = path.join(__dirname, "..", relativePath);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawContent);
}

function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}

function buildTelemetryPayload({
    routeConfig,
    scenarios,
    sequenceNumber,
    batteryLevel
}) {
    const points = routeConfig.points;
    const point = points[sequenceNumber % points.length];

    let temperature = point.baseTemperature;
    let latitude = point.latitude;
    let longitude = point.longitude;

    if (
        scenarios.coldChainBreach?.enabled &&
        sequenceNumber === scenarios.coldChainBreach.triggerAtSequence
    ) {
        temperature = scenarios.coldChainBreach.forcedTemperature;
    }

    if (
        scenarios.geofenceViolation?.enabled &&
        sequenceNumber === scenarios.geofenceViolation.triggerAtSequence
    ) {
        latitude = scenarios.geofenceViolation.latitude;
        longitude = scenarios.geofenceViolation.longitude;
    }

    return {
        shipmentCode: routeConfig.shipmentCode,
        sequenceNumber,
        latitude,
        longitude,
        temperature: roundToTwoDecimals(temperature),
        humidity: roundToTwoDecimals(point.humidity),
        batteryLevel: roundToTwoDecimals(batteryLevel)
    };
}

export function createSimulator({ backendUrl, intervalMs }) {
    const routeConfig = readJsonFile("data/routes.json");
    const scenarios = readJsonFile("data/scenarios.json");

    let sequenceNumber = Number(process.env.SIMULATION_START_SEQUENCE || 1);
    let batteryLevel = Number(process.env.SIMULATION_START_BATTERY || 100);

    const batteryDecreasePerStep =
        Number(scenarios.lowBattery?.batteryDecreasePerStep) || 5;

    async function runStep() {
        const payload = buildTelemetryPayload({
            routeConfig,
            scenarios,
            sequenceNumber,
            batteryLevel
        });

        try {
            const response = await sendTelemetry({
                backendUrl,
                payload
            });

            console.log("Telemetry sent successfully");
            console.log({
                sequenceNumber: payload.sequenceNumber,
                shipmentCode: payload.shipmentCode,
                latitude: payload.latitude,
                longitude: payload.longitude,
                temperature: payload.temperature,
                humidity: payload.humidity,
                batteryLevel: payload.batteryLevel,
                incidentsCreated: response?.data?.incidents?.length || 0
            });

            if (response?.data?.incidents?.length > 0) {
                console.log("Incidents created:");
                for (const incident of response.data.incidents) {
                    console.log({
                        type: incident.incident_type,
                        severity: incident.severity,
                        description: incident.description
                    });
                }
            }

            sequenceNumber += 1;

            if (scenarios.lowBattery?.enabled) {
                batteryLevel = Math.max(
                    scenarios.lowBattery.minimumBattery || 5,
                    batteryLevel - batteryDecreasePerStep
                );
            }
        } catch (error) {
            console.error("Error sending telemetry");
            console.error({
                message: error.message,
                status: error.status,
                responseBody: error.responseBody
            });
        }
    }

    function start() {
        console.log("SupplyChain Pro simulator started");
        console.log(`Backend URL: ${backendUrl}`);
        console.log(`Interval: ${intervalMs} ms`);
        console.log(`Shipment code: ${routeConfig.shipmentCode}`);
        console.log(`Route: ${routeConfig.routeName}`);
        console.log("Simulator has no public port. It only communicates through Docker internal network.");

        runStep();

        return setInterval(runStep, intervalMs);
    }

    return {
        start
    };
}