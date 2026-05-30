import dotenv from "dotenv";
import { createSimulator } from "./services/simulator.service.js";

dotenv.config();

const backendUrl =
    process.env.BACKEND_URL || "http://backend:8080/api/telemetry";

const intervalMs = Number(process.env.SIMULATION_INTERVAL_MS || 5000);

const simulator = createSimulator({
    backendUrl,
    intervalMs
});

simulator.start();