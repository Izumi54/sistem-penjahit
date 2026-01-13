import { useState, useEffect } from 'react'
import { analyticsService } from '../services/analyticsService'
import StatCard from '../components/dashboard/StatCard'
import DonutChart from '../components/dashboard/DonutChart'
import LineChart from '../components/dashboard/LineChart'
import './Dashboard.css'

function Dashboard() {
    const [overview, setOverview] = useState(null)
    const [statusData, setStatusData] = useState(null)
    const [revenueData, setRevenueData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch analytics data
            const [overviewRes, statusRes, revenueRes] = await Promise.all([
                analyticsService.getOverview(),
                analyticsService.getStatusDistribution(),
                analyticsService.getRevenueMonthly(6),
            ])

            setOverview(overviewRes.data)
            setStatusData(statusRes.data)
            setRevenueData(revenueRes.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data analytics')
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    return (
        <div className="dashboard-wireframe">
            <div className="container">
                {error && (
                    <div className="alert alert-error">
                        {error}
                        <button onClick={fetchAnalytics} className="btn-retry">
                            🔄 Retry
                        </button>
                    </div>
                )}

                {/* 5 Metric Cards - Single Row */}
                <div className="metrics-row">
                    <StatCard
                        icon="👥"
                        title="Total Pelanggan"
                        value={overview ? '248' : '-'}
                        loading={loading}
                    />
                    <StatCard
                        icon="👥"
                        title="Pelanggan Baru"
                        value={overview ? overview.pelangganBaru : '-'}
                        subtitle="Bulan ini"
                        loading={loading}
                    />
                    <StatCard
                        icon="📦"
                        title="Pesanan Bulan Ini"
                        value={overview ? overview.totalPesanan : '-'}
                        loading={loading}
                    />
                    <StatCard
                        icon="💰"
                        title="Revenue Bulan Ini"
                        value={overview ? formatCurrency(overview.revenueBulanIni) : '-'}
                        loading={loading}
                    />
                    <StatCard
                        icon="⏳"
                        title="Pesanan Pending"
                        value={overview ? overview.pesananPending : '-'}
                        loading={loading}
                    />
                </div>

                {/* Charts Grid - 2 Columns */}
                <div className="charts-grid">
                    {/* Left: Line Chart Revenue */}
                    <div className="chart-card">
                        <h3 className="chart-title">Revenue 6 Bulan Terakhir</h3>
                        <div className="chart-container">
                            {loading ? (
                                <div className="chart-loading">Loading chart...</div>
                            ) : (
                                <LineChart data={revenueData} />
                            )}
                        </div>
                    </div>

                    {/* Right: Pie Chart Status */}
                    <div className="chart-card">
                        <h3 className="chart-title">Pesanan per Status</h3>
                        <div className="chart-container">
                            {loading ? (
                                <div className="chart-loading">Loading chart...</div>
                            ) : (
                                <DonutChart data={statusData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
