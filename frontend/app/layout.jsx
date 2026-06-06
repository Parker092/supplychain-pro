import "../styles/globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
    title: "SupplyChain Pro",
    description: "Trazabilidad crítica de mercancía perecedera"
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <div className="app-shell">
                    <Sidebar />

                    <div className="app-content">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}