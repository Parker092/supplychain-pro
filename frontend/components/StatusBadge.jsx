export default function StatusBadge({ type = "default", children }) {
    const className = `status-badge status-badge-${type}`;

    return <span className={className}>{children}</span>;
}