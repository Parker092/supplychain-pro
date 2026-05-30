import test from "node:test";
import assert from "node:assert/strict";

const API_URL = process.env.TEST_API_URL || "http://localhost:8080";

async function requestJson(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    let body = null;

    try {
        body = await response.json();
    } catch {
        body = null;
    }

    return {
        status: response.status,
        ok: response.ok,
        body
    };
}

test("GET /health should return backend status ok", async () => {
    const response = await requestJson("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
    assert.equal(response.body.service, "supplychain-backend");
    assert.equal(response.body.database, "connected");
});

test("GET /api/shipments should return a list of shipments", async () => {
    const response = await requestJson("/api/shipments");

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(response.body), true);
    assert.equal(response.body.length > 0, true);
});

test("POST /api/telemetry should accept valid telemetry", async () => {
    const sequenceNumber = Date.now();

    const payload = {
        shipmentCode: "SHIP-001",
        sequenceNumber,
        latitude: 13.9942,
        longitude: -89.5597,
        temperature: 4,
        humidity: 70,
        batteryLevel: 95
    };

    const response = await requestJson("/api/telemetry", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.message, "Telemetry processed successfully");
    assert.equal(response.body.data.telemetryEvent.sequence_number, sequenceNumber);
});

test("POST /api/telemetry should reject invalid telemetry", async () => {
    const invalidPayload = {
        shipmentCode: "SHIP-001",
        sequenceNumber: "invalid-sequence",
        latitude: 200,
        longitude: -89.5597,
        temperature: 4,
        humidity: 170,
        batteryLevel: 95
    };

    const response = await requestJson("/api/telemetry", {
        method: "POST",
        body: JSON.stringify(invalidPayload)
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "Validation error");
});

test("POST /api/telemetry should create COLD_CHAIN_BREACH incident when temperature is above max threshold", async () => {
    const sequenceNumber = Date.now() + 1;

    const payload = {
        shipmentCode: "SHIP-001",
        sequenceNumber,
        latitude: 13.6929,
        longitude: -89.2182,
        temperature: 12,
        humidity: 78,
        batteryLevel: 90
    };

    const response = await requestJson("/api/telemetry", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.message, "Telemetry processed successfully");

    const incidents = response.body.data.incidents;

    assert.equal(Array.isArray(incidents), true);
    assert.equal(incidents.length > 0, true);

    const coldChainIncident = incidents.find(
        (incident) => incident.incident_type === "COLD_CHAIN_BREACH"
    );

    assert.ok(coldChainIncident);
    assert.equal(coldChainIncident.severity, "CRITICAL");
});