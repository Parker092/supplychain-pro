import { AlertTriangle, Clock, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";

function getSeverityType(severity) {
    if (severity === "CRITICAL") return "danger";
    if (severity === "WARNING") return "warning";
    if (severity === "INFO") return "info";
    return "default";
}

function getIncidentLabel(type) {
    const labels = {
        COLD_CHAIN_BREACH: "Ruptura de cadena de frío",
        LOW_BATTERY: "Batería baja",
        GEOFENCE_VIOLATION: "Salida de perímetro",
        STORAGE_VOLUME_FULL: "Volumen lleno",
        SYSTEM_RESTART_DETECTED: "Reinicio detectado"
    };

    return labels[type] || type;
}

export default function IncidentCard({ incident }) {
    return (
        <article className="incident-card">
            <div className="incident-card-header">
                <div className="card-title-row">
                    <AlertTriangle size={20} />
                    <h3>{getIncidentLabel(incident.incident_type)}</h3>
                </div>

                <StatusBadge type={getSeverityType(incident.severity)}>
                    {incident.severity}
                </StatusBadge>
            </div>

            <p>{incident.description}</p>

            <div className="incident-meta">
                <span>
                    <MapPin size={15} />
                    {incident.latitude}, {incident.longitude}
                </span>

                <span>
                    <Clock size={15} />
                    {new Date(incident.occurred_at).toLocaleString()}
                </span>
            </div>

            <div className="incident-values">
                <span>Valor medido: {incident.measured_value ?? "N/A"}</span>
                <span>Umbral: {incident.threshold_value ?? "N/A"}</span>
            </div>
        </article>
    );
}