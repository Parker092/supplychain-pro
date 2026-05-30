import { findAllIncidents } from "../repositories/incident.repository.js";

export async function getIncidentsService() {
  return findAllIncidents();
}