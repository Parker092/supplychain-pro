let ioInstance = null;

export function initializeSocket(io) {
  ioInstance = io;

  ioInstance.on("connection", (socket) => {
    console.log(`[WEBSOCKET] Client connected: ${socket.id}`);

    socket.emit("connection:ready", {
      message: "Connected to SupplyChain Pro realtime channel"
    });

    socket.on("disconnect", () => {
      console.log(`[WEBSOCKET] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
}

export function emitTelemetryCreated(payload) {
  if (!ioInstance) {
    console.warn("[WEBSOCKET] Cannot emit telemetry: socket server is not initialized");
    return;
  }

  ioInstance.emit("telemetry:created", payload);
}

export function emitIncidentCreated(payload) {
  if (!ioInstance) {
    console.warn("[WEBSOCKET] Cannot emit incident: socket server is not initialized");
    return;
  }

  ioInstance.emit("incident:created", payload);
}

export function emitSystemAlert(payload) {
  if (!ioInstance) {
    console.warn("[WEBSOCKET] Cannot emit system alert: socket server is not initialized");
    return;
  }

  ioInstance.emit("system:alert", payload);
}
