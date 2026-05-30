"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

import IncidentCard from "../../components/IncidentCard";
import StatusBadge from "../../components/StatusBadge";
import { getIncidents } from "../../services/incident.service";

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function loadIncidents() {
        try {
            setError(null);

            const incidentsData = await getIncidents();
            setIncidents(incidentsData);
        } catch {
            setError("No fue posible cargar los incidentes desde el backend.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadIncidents();

        const interval = setInterval(() => {
            loadIncidents();
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
                    <p className="eyebrow">SupplyChain Pro</p>
                    <h1>Incidentes de calidad</h1>
                    <p className="hero-description">
                        Evidencia crítica generada automáticamente por el backend cuando la
                        telemetría incumple reglas operativas como ruptura de cadena de frío,
                        batería baja o salida de perímetro.
                    </p>
                </div>

                <button className="refresh-button" onClick={loadIncidents}>
                    <RefreshCcw size={16} />
                    Actualizar
                </button>
            </section>

            <section className="summary-grid">
                <div className="summary-card">
                    <AlertTriangle size={24} />
                    <div>
                        <span>Incidentes totales</span>
                        <strong>{incidents.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <AlertTriangle size={24} />
                    <div>
                        <span>Críticos</span>
                        <strong>{criticalIncidents}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <ShieldCheck size={24} />
                    <div>
                        <span>Advertencias</span>
                        <strong>{warningIncidents}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <ShieldCheck size={24} />
                    <div>
                        <span>Integridad</span>
                        <strong>Inmutabilidad DB</strong>
                    </div>
                </div>
            </section>

            <section className="section-header">
                <div>
                    <h2>Lista de incidentes</h2>
                    <p>
                        Los incidentes se almacenan en PostgreSQL y están protegidos contra
                        actualización o eliminación mediante triggers.
                    </p>
                </div>

                <Link href="/dashboard" className="refresh-button">
                    <ArrowLeft size={16} />
                    Volver al dashboard
                </Link>
            </section>

            {error && <div className="error-box">{error}</div>}

            {loading ? (
                <div className="loading-box">Cargando incidentes...</div>
            ) : incidents.length === 0 ? (
                <div className="empty-state">
                    No hay incidentes registrados todavía.
                </div>
            ) : (
                <section className="incidents-layout">
                    <div className="incidents-list">
                        {incidents.map((incident) => (
                            <IncidentCard key={incident.id} incident={incident} />
                        ))}
                    </div>

                    <aside className="card">
                        <h2>Reglas evaluadas</h2>

                        <div className="status-row">
                            <StatusBadge type="danger">COLD_CHAIN_BREACH</StatusBadge>
                            <StatusBadge type="warning">LOW_BATTERY</StatusBadge>
                            <StatusBadge type="warning">GEOFENCE_VIOLATION</StatusBadge>
                        </div>

                        <p className="muted">
                            La regla principal del sistema es detectar cuando la temperatura
                            reportada por el simulador supera la temperatura máxima permitida
                            del envío. En ese caso, el backend crea un incidente crítico.
                        </p>

                        <p className="small-muted">
                            Para la defensa técnica, este módulo demuestra trazabilidad,
                            auditoría e integridad de evidencia crítica.
                        </p>
                    </aside>
                </section>
            )}
        </main>
    );
}