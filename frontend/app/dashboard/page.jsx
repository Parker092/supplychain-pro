"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Database, RefreshCcw, Server, ShieldCheck } from "lucide-react";

import ShipmentCard from "../../components/ShipmentCard";
import IncidentCard from "../../components/IncidentCard";
import StatusBadge from "../../components/StatusBadge";
import { getShipments, getShipmentState } from "../../services/shipment.service";
import { getIncidents } from "../../services/incident.service";

export default function DashboardPage() {
    const [shipments, setShipments] = useState([]);
    const [shipmentStates, setShipmentStates] = useState({});
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [error, setError] = useState(null);

    async function loadDashboardData() {
        try {
            setError(null);

            const shipmentsData = await getShipments();
            const incidentsData = await getIncidents();

            const stateMap = {};

            for (const shipment of shipmentsData) {
                try {
                    const state = await getShipmentState(shipment.id);
                    stateMap[shipment.id] = state;
                } catch (stateError) {
                    stateMap[shipment.id] = null;
                }
            }

            setShipments(shipmentsData);
            setShipmentStates(stateMap);
            setIncidents(incidentsData);
            setLastRefresh(new Date());
        } catch (requestError) {
            setError("No fue posible cargar los datos desde el backend.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboardData();

        const interval = setInterval(() => {
            loadDashboardData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const criticalIncidents = incidents.filter(
        (incident) => incident.severity === "CRITICAL"
    ).length;

    const warningIncidents = incidents.filter(
        (incident) => incident.severity === "WARNING"
    ).length;

    return (
        <main className="page">
            <section className="hero">
                <div>
                    <p className="eyebrow">Diseño de Arquitectura de Sistemas</p>
                    <h1>SupplyChain Pro</h1>
                    <p className="hero-description">
                        Monitoreo de trazabilidad crítica para mercancía perecedera mediante
                        telemetría simulada, persistencia en PostgreSQL y detección automática
                        de incidentes.
                    </p>
                </div>

                <button className="refresh-button" onClick={loadDashboardData}>
                    <RefreshCcw size={16} />
                    Actualizar
                </button>
            </section>

            {error && <div className="error-box">{error}</div>}

            <section className="summary-grid">
                <div className="summary-card">
                    <Server size={24} />
                    <div>
                        <span>Servicios</span>
                        <strong>Frontend · Backend · DB · Simulador</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <Database size={24} />
                    <div>
                        <span>Persistencia</span>
                        <strong>PostgreSQL + Docker Volume</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <AlertTriangle size={24} />
                    <div>
                        <span>Incidentes críticos</span>
                        <strong>{criticalIncidents}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <ShieldCheck size={24} />
                    <div>
                        <span>Alertas warning</span>
                        <strong>{warningIncidents}</strong>
                    </div>
                </div>
            </section>

            <section className="section-header">
                <div>
                    <h2>Envíos monitoreados</h2>
                    <p>Último estado recibido desde el simulador de telemetría.</p>
                </div>

                <StatusBadge type="info">
                    Auto-refresh cada 5 segundos
                </StatusBadge>
            </section>

            {loading ? (
                <div className="loading-box">Cargando datos del backend...</div>
            ) : (
                <section className="shipments-grid">
                    {shipments.map((shipment) => (
                        <ShipmentCard
                            key={shipment.id}
                            shipment={shipment}
                            state={shipmentStates[shipment.id]}
                        />
                    ))}
                </section>
            )}

            <section className="section-header">
                <div>
                    <h2>Incidentes registrados</h2>
                    <p>
                        Evidencia crítica generada por reglas de negocio del backend e
                        insertada en PostgreSQL.
                    </p>
                </div>

                {lastRefresh && (
                    <span className="small-muted">
                        Última actualización: {lastRefresh.toLocaleTimeString()}
                    </span>
                )}
            </section>

            <section className="incidents-layout">
                <div className="incidents-list">
                    {incidents.length === 0 ? (
                        <div className="empty-state">
                            No hay incidentes registrados todavía.
                        </div>
                    ) : (
                        incidents.slice(0, 6).map((incident) => (
                            <IncidentCard key={incident.id} incident={incident} />
                        ))
                    )}
                </div>

                <div className="card">
                    <h2>Lectura arquitectónica</h2>
                    <p>
                        El frontend no recibe datos del simulador directamente. El flujo
                        correcto es: simulador → backend → PostgreSQL → backend → frontend.
                    </p>

                    <div className="architecture-flow">
                        <span>Simulador</span>
                        <span>→</span>
                        <span>Backend</span>
                        <span>→</span>
                        <span>PostgreSQL</span>
                        <span>→</span>
                        <span>Frontend</span>
                    </div>

                    <p className="small-muted">
                        Esto permite validar separación de responsabilidades, red interna,
                        persistencia e integridad de datos.
                    </p>
                </div>
            </section>
        </main>
    );
}