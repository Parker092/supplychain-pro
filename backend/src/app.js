import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import shipmentRoutes from "./routes/shipment.routes.js";
import incidentRoutes from "./routes/incident.routes.js";
import telemetryRoutes from "./routes/telemetry.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { checkDatabaseConnection } from "./config/database.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", async (req, res, next) => {
  try {
    const dbStatus = await checkDatabaseConnection();

    res.json({
      status: "ok",
      service: "supplychain-backend",
      database: "connected",
      databaseTime: dbStatus.current_time,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/shipments", shipmentRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/telemetry", telemetryRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

app.use(errorMiddleware);