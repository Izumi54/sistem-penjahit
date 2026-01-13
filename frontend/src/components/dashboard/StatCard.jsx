function StatCard({ icon, title, value, subtitle, color = 'blue', loading }) {
    const colorClasses = {
        blue: 'stat-card-blue',
        green: 'stat-card-green',
        orange: 'stat-card-orange',
        purple: 'stat-card-purple',
        teal: 'stat-card-teal',
        red: 'stat-card-red',
    }

    return (
        <div className={`stat-card ${colorClasses[color]}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <div className="stat-title">{title}</div>
                {loading ? (
                    <div className="stat-value">
                        <div className="skeleton-text"></div>
                    </div>
                ) : (
                    <>
                        <div className="stat-value">{value}</div>
                        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
                    </>
                )}
            </div>
        </div>
    )
}

export default StatCard
