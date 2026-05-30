import { Router } from "express";
import {
  getShipments,
  getShipmentState
} from "../controllers/shipment.controller.js";

const router = Router();

router.get("/", getShipments);
router.get("/:id/state", getShipmentState);

export default router;