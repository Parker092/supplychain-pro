"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Gauge,
  Settings,
  Truck,
  Wifi
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Gauge
  },
  {
    label: "Envíos",
    href: "/shipments",
    icon: Truck
  },
  {
    label: "Incidentes",
    href: "/incidents",
    icon: AlertTriangle
  },
  {
    label: "Reportes",
    href: "/reports",
    icon: BarChart3,
    disabled: true
  },
  {
    label: "Configuración",
    href: "/settings",
    icon: Settings,
    disabled: true
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Boxes size={20} />
        </div>

        <div>
          <h2>SupplyChain Pro</h2>
          <p>Cadena de frío</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="sidebar-link sidebar-link-disabled"
                title="Módulo reservado para mejora futura"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-status">
        <div className="sidebar-status-row">
          <Wifi size={16} />
          <span>En línea</span>
        </div>

        <p>Frontend conectado al backend mediante API y WebSocket.</p>
      </div>
    </aside>
  );
}