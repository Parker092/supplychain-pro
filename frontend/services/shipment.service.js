import { api } from "../lib/api";

export async function getShipments() {
    const response = await api.get("/api/shipments");
    return response.data;
}

export async function getShipmentState(shipmentId) {
    const response = await api.get(`/api/shipments/${shipmentId}/state`);
    return response.data;
}