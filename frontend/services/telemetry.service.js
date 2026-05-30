import { api } from "../lib/api";

export async function sendTelemetry(payload) {
    const response = await api.post("/api/telemetry", payload);
    return response.data;
}