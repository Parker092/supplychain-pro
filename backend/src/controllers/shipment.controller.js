import {
  getShipmentsService,
  getShipmentStateService
} from "../services/shipment.service.js";

export async function getShipments(req, res, next) {
  try {
    const shipments = await getShipmentsService();
    res.json(shipments);
  } catch (error) {
    next(error);
  }
}

export async function getShipmentState(req, res, next) {
  try {
    const { id } = req.params;

    const state = await getShipmentStateService(id);

    if (!state) {
      return res.status(404).json({
        error: "Shipment state not found"
      });
    }

    res.json(state);
  } catch (error) {
    next(error);
  }
}