import {
  findAllShipments,
  findShipmentStateByShipmentId
} from "../repositories/shipment.repository.js";

export async function getShipmentsService() {
  return findAllShipments();
}

export async function getShipmentStateService(shipmentId) {
  return findShipmentStateByShipmentId(shipmentId);
}