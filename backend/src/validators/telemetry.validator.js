import { z } from "zod";

export const telemetrySchema = z.object({
  shipmentCode: z.string().min(1),
  sequenceNumber: z.number().int().nonnegative(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),

  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  batteryLevel: z.number().min(0).max(100)
});