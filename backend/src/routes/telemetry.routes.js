import { Router } from "express";
import { receiveTelemetry } from "../controllers/telemetry.controller.js";

const router = Router();

router.post("/", receiveTelemetry);

export default router;