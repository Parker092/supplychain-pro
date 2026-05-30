import { api } from "../lib/api";
export async function getIncidents() {
    const response = await api.get("/api/incidents");
    return response.data;
}