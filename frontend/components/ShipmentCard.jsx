import { Battery, Droplets, MapPin, Thermometer, Truck } from "lucide-react";
import StatusBadge from "./StatusBadge";

function getTemperatureStatus(temperature, maxAllowedTemperature) {
    if (temperature === null || temperature === undefined) {
        return {
            type: "default",
            label: "Sin telemetría"
        };
    }

    const temp = Number(temperature);
    const maxTemp = Number(maxAllowedTemperature);

    if (temp > maxTemp) {
        return {
            type: "danger",
            label: "Ruptura de cadena de frío"
        };
    }

    return {
        type: "success",
        label: "Temperatura controlada"
    };
}

function getBatteryStatus(batteryLevel) {
    if (batteryLevel === null || batteryLevel === undefined) {
        return {
            type: "default",
            label: "Sin datos"
        };
    }

    const battery = Number(batteryLevel);

    if (battery <= 10) {
        return {
            type: "warning",
            label: "Batería baja"
        };
    }

    return {
        type: "success",
        label: "Batería estable"
    };
}

export default function ShipmentCard({ shipment, state }) {
    const temperatureStatus = getTemperatureStatus(
        state?.last_temperature,
        shipment?.max_temperature
    );

    const batteryStatus = getBatteryStatus(state?.last_battery_level);

    return (
        <article className="card shipment-card">
            <div className="card-header">
                <div>
                    <div className="card-title-row">
                        <Truck size={22} />
                        <h2>{shipment.code}</h2>
                    </div>
                    <p className="muted">{shipment.product_name}</p>
                </div>

                <StatusBadge type={shipment.status === "IN_TRANSIT" ? "info" : "default"}>
                    {shipment.status}
                </StatusBadge>
            </div>

            <div className="route-line">
                <span>{shipment.origin}</span>
                <span>→</span>
                <span>{shipment.destination}</span>
            </div>

            <div className="status-row">
                <StatusBadge type={temperatureStatus.type}>
                    {temperatureStatus.label}
                </StatusBadge>

                <StatusBadge type={batteryStatus.type}>
                    {batteryStatus.label}
                </StatusBadge>
            </div>

            {state ? (
                <div className="metrics-grid">
                    <div className="metric">
                        <Thermometer size={18} />
                        <div>
                            <span className="metric-label">Temperatura</span>
                            <strong>{state.last_temperature} °C</strong>
                        </div>
                    </div>

                    <div className="metric">
                        <Droplets size={18} />
                        <div>
                            <span className="metric-label">Humedad</span>
                            <strong>{state.last_humidity} %</strong>
                        </div>
                    </div>

                    <div className="metric">
                        <Battery size={18} />
                        <div>
                            <span className="metric-label">Batería</span>
                            <strong>{state.last_battery_level} %</strong>
                        </div>
                    </div>

                    <div className="metric">
                        <MapPin size={18} />
                        <div>
                            <span className="metric-label">Ubicación</span>
                            <strong>
                                {state.last_latitude}, {state.last_longitude}
                            </strong>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    Esperando telemetría del simulador.
                </div>
            )}

            {state && (
                <p className="small-muted">
                    Última secuencia: {state.last_sequence_number} · Actualizado:{" "}
                    {new Date(state.updated_at).toLocaleString()}
                </p>
            )}
        </article>
    );
}