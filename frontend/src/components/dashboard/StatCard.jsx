import './StatCard.css'

function StatCard({ icon, title, value, subtitle, loading }) {
    return (
        <div className="stat-card-wireframe">
            <div className="stat-icon-circle">
                <span className="icon-emoji">{icon}</span>
            </div>
            <div className="stat-info">
                <div className="stat-label">{title}</div>
                {loading ? (
                    <div className="stat-number">
                        <div className="skeleton-loader"></div>
                    </div>
                ) : (
                    <>
                        <div className="stat-number">{value}</div>
                        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
                    </>
                )}
            </div>
        </div>
    )
}

export default StatCard
