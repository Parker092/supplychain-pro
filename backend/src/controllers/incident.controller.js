import { getIncidentsService } from "../services/incident.service.js";

export async function getIncidents(req, res, next) {
  try {
    const incidents = await getIncidentsService();
    res.json(incidents);
  } catch (error) {
    next(error);
  }
}