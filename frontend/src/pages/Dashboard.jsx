import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { analyticsService } from '../services/analyticsService'
import StatCard from '../components/dashboard/StatCard'
import DonutChart from '../components/dashboard/DonutChart'
import BarChart from '../components/dashboard/BarChart'
import LineChart from '../components/dashboard/LineChart'
import './Dashboard.css'

function Dashboard() {
    const [overview, setOverview] = useState(null)
    const [statusData, setStatusData] = useState(null)
    const [revenueData, setRevenueData] = useState(null)
    const [trendData, setTrendData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch all analytics data in parallel
            const [overviewRes, statusRes, revenueRes, trendRes] = await Promise.all([
                analyticsService.getOverview(),
                analyticsService.getStatusDistribution(),
                analyticsService.getRevenueMonthly(6),
                analyticsService.getTrendDaily(30),
            ])

            setOverview(overviewRes.data)
            setStatusData(statusRes.data)
            setRevenueData(revenueRes.data)
            setTrendData(trendRes.data)
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
        <div className="dashboard-page">
            {/* Header */}
            <div className="dashboard-header">
                <div className="container">
                    <h1 className="page-title">📊 Dashboard Analytics</h1>
                    <p className="page-subtitle">Ringkasan performa toko penjahit</p>
                </div>
            </div>

            <div className="container dashboard-content">
                {error && (
                    <div className="alert alert-error mb-lg">
                        {error}
                        <button onClick={fetchAnalytics} className="btn btn-sm btn-secondary ml-md">
                            🔄 Retry
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="stats-grid">
                    <StatCard
                        icon="📦"
                        title="Total Pesanan"
                        value={overview ? overview.totalPesanan : '-'}
                        subtitle="Bulan ini"
                        color="blue"
                        loading={loading}
                    />
                    <StatCard
                        icon="💰"
                        title="Revenue"
                        value={overview ? formatCurrency(overview.revenueBulanIni) : '-'}
                        subtitle="Bulan ini"
                        color="green"
                        loading={loading}
                    />
                    <StatCard
                        icon="⏳"
                        title="Pesanan Pending"
                        value={overview ? overview.pesananPending : '-'}
                        subtitle="Antri + Potong + Jahit"
                        color="orange"
                        loading={loading}
                    />
                    <StatCard
                        icon="✅"
                        title="Selesai Hari Ini"
                        value={overview ? overview.pesananSelesaiHariIni : '-'}
                        subtitle="Hari ini"
                        color="green"
                        loading={loading}
                    />
                    <StatCard
                        icon="👥"
                        title="Pelanggan Baru"
                        value={overview ? overview.pelangganBaru : '-'}
                        subtitle="Bulan ini"
                        color="purple"
                        loading={loading}
                    />
                    <StatCard
                        icon="💵"
                        title="Omzet Hari Ini"
                        value={overview ? formatCurrency(overview.omzetHariIni) : '-'}
                        subtitle="Hari ini"
                        color="teal"
                        loading={loading}
                    />
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    <div className="chart-card">
                        <h3 className="chart-title">🍩 Distribusi Status Pesanan</h3>
                        {loading ? (
                            <div className="chart-placeholder">
                                <p className="text-muted">Loading chart...</p>
                            </div>
                        ) : (
                            <DonutChart data={statusData} />
                        )}
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">📊 Revenue per Bulan (6 Bulan)</h3>
                        {loading ? (
                            <div className="chart-placeholder">
                                <p className="text-muted">Loading chart...</p>
                            </div>
                        ) : (
                            <BarChart data={revenueData} />
                        )}
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">📈 Trend Pesanan (30 Hari)</h3>
                        {loading ? (
                            <div className="chart-placeholder">
                                <p className="text-muted">Loading chart...</p>
                            </div>
                        ) : (
                            <LineChart data={trendData} />
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="quick-links-section">
                    <h3 className="section-title">🚀 Quick Actions</h3>
                    <div className="quick-links-grid">
                        <Link to="/pelanggan" className="quick-link-card">
                            <span className="quick-link-icon">👥</span>
                            <span className="quick-link-title">Kelola Pelanggan</span>
                        </Link>
                        <Link to="/jenis-pakaian" className="quick-link-card">
                            <span className="quick-link-icon">👔</span>
                            <span className="quick-link-title">Jenis Pakaian</span>
                        </Link>
                        <Link to="/pesanan" className="quick-link-card">
                            <span className="quick-link-icon">📦</span>
                            <span className="quick-link-title">List Pesanan</span>
                        </Link>
                        <Link to="/pesanan/baru" className="quick-link-card quick-link-primary">
                            <span className="quick-link-icon">➕</span>
                            <span className="quick-link-title">Input Pesanan Baru</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
