"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCcw, Truck } from "lucide-react";
import Link from "next/link";

import ShipmentCard from "../../components/ShipmentCard";
import StatusBadge from "../../components/StatusBadge";
import { getShipments, getShipmentState } from "../../services/shipment.service";
import { createSocketClient } from "../../lib/socket";

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [shipmentStates, setShipmentStates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [realtimeStatus, setRealtimeStatus] = useState("Conectando");

    async function loadShipments() {
        try {
            setError(null);

            const shipmentsData = await getShipments();
            const stateMap = {};

            for (const shipment of shipmentsData) {
                try {
                    const state = await getShipmentState(shipment.id);
                    stateMap[shipment.id] = state;
                } catch {
                    stateMap[shipment.id] = null;
                }
            }

            setShipments(shipmentsData);
            setShipmentStates(stateMap);
            setLastRefresh(new Date());
        } catch {
            setError("No fue posible cargar los envíos desde el backend.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadShipments();

        const socket = createSocketClient();

        socket.on("connect", () => {
            setRealtimeStatus("WebSocket conectado");
            console.log("Shipments page connected to realtime channel");
        });

        socket.on("telemetry:created", () => {
            loadShipments();
        });

        socket.on("incident:created", () => {
            loadShipments();
        });

        socket.on("system:alert", () => {
            loadShipments();
        });

        socket.on("disconnect", () => {
            setRealtimeStatus("WebSocket desconectado");
        });

        socket.on("connect_error", (socketError) => {
            setRealtimeStatus("WebSocket con error");
            console.error("Shipments WebSocket error:", socketError.message);
        });

        const fallbackInterval = setInterval(() => {
            loadShipments();
        }, 10000);

        return () => {
            clearInterval(fallbackInterval);
            socket.disconnect();
        };
    }, []);

    return (
        <main className="page">
            <section className="hero">
                <div>
                    <p className="eyebrow">SupplyChain Pro</p>
                    <h1>Envíos monitoreados</h1>
                    <p className="hero-description">
                        Vista de los envíos refrigerados registrados en PostgreSQL y su
                        último estado recibido desde el simulador de telemetría.
                    </p>
                </div>

                <button className="refresh-button" onClick={loadShipments}>
                    <RefreshCcw size={16} />
                    Actualizar
                </button>
            </section>

            <section className="section-header">
                <div>
                    <h2>Listado de envíos</h2>
                    <p>
                        Cada tarjeta muestra temperatura, humedad, batería, ubicación y
                        estado operativo del envío.
                    </p>
                </div>

                <div className="status-row">
                    <StatusBadge
                        type={realtimeStatus === "WebSocket conectado" ? "success" : "warning"}
                    >
                        {realtimeStatus}
                    </StatusBadge>

                    <Link href="/dashboard" className="refresh-button">
                        <ArrowLeft size={16} />
                        Volver al dashboard
                    </Link>
                </div>
            </section>

            {lastRefresh && (
                <p className="small-muted">
                    Última actualización: {lastRefresh.toLocaleTimeString()}
                </p>
            )}

            {error && <div className="error-box">{error}</div>}

            {loading ? (
                <div className="loading-box">Cargando envíos...</div>
            ) : shipments.length === 0 ? (
                <div className="empty-state">
                    No hay envíos registrados en la base de datos.
                </div>
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

            <section className="card" style={{ marginTop: "24px" }}>
                <div className="card-title-row">
                    <Truck size={22} />
                    <h2>Lectura arquitectónica</h2>
                </div>

                <p className="muted">
                    Esta vista recibe actualizaciones en tiempo real mediante WebSockets
                    cuando el backend procesa nueva telemetría. El flujo correcto sigue
                    siendo simulador → backend → PostgreSQL → backend → frontend.
                </p>
            </section>
        </main>
    );
}