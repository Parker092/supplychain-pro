import { telemetrySchema } from "../validators/telemetry.validator.js";
import { processTelemetryService } from "../services/telemetry.service.js";

export async function receiveTelemetry(req, res, next) {
  try {
    const payload = telemetrySchema.parse(req.body);

    const result = await processTelemetryService(payload);

    res.status(201).json({
      message: "Telemetry processed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
}