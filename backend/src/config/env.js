import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.BACKEND_PORT || process.env.PORT || 8080),
  databaseUrl: process.env.DATABASE_URL,
  minAllowedBattery: Number(process.env.MIN_ALLOWED_BATTERY || 10),
  geofence: {
    minLatitude: Number(process.env.GEOFENCE_MIN_LATITUDE || 13.0),
    maxLatitude: Number(process.env.GEOFENCE_MAX_LATITUDE || 14.5),
    minLongitude: Number(process.env.GEOFENCE_MIN_LONGITUDE || -90.2),
    maxLongitude: Number(process.env.GEOFENCE_MAX_LONGITUDE || -87.5)
  }
};

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}