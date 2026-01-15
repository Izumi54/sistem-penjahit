import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './DashboardCalendar.css'
import { analyticsService } from '../services/analyticsService'
import StatCard from '../components/dashboard/StatCard'
import DonutChart from '../components/dashboard/DonutChart'
import LineChart from '../components/dashboard/LineChart'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const [overview, setOverview] = useState(null)
    const [statusData, setStatusData] = useState(null)
    const [revenueData, setRevenueData] = useState(null)
    const [jadwalData, setJadwalData] = useState({})
    const [pesananList, setPesananList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAnalytics()
        fetchJadwal(new Date())
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

    const fetchJadwal = async (date) => {
        try {
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const response = await fetch(
                `/api/pesanan/jadwal?month=${month}&year=${year}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            const data = await response.json()
            setJadwalData(data.data || {})

            // Fetch actual pesanan for events
            const pesananResponse = await fetch(
                `/api/pesanan?page=1&limit=100&status=ANTRI,POTONG,JAHIT`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            const pesananData = await pesananResponse.json()
            setPesananList(pesananData.data || [])
        } catch (err) {
            console.error('Fetch jadwal error:', err)
        }
    }

    const getTileContent = ({ date }) => {
        const dateKey = date.toISOString().split('T')[0]
        const count = jadwalData[dateKey] || 0
        if (count > 0) {
            return <div className="tile-badge">{count}</div>
        }
        return null
    }

    const getTileClass = ({ date }) => {
        const dateKey = date.toISOString().split('T')[0]
        const count = jadwalData[dateKey] || 0
        if (count === 0) return ''
        if (count <= 3) return 'has-events-low'
        if (count <= 7) return 'has-events-medium'
        return 'has-events-high'
    }

    const handleDateClick = (date) => {
        const dateKey = date.toISOString().split('T')[0]
        const pesananOnDate = pesananList.filter(p => {
            const tglSelesai = new Date(p.tglJanjiSelesai).toISOString().split('T')[0]
            return tglSelesai === dateKey
        })

        if (pesananOnDate.length > 0) {
            // Navigate to first pesanan detail
            navigate(`/pesanan/${pesananOnDate[0].noNota}`)
        }
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

            {/* Jadwal Calendar - Full Width */}
            <div className="calendar-section">
                <h3 className="section-title">📅 Jadwal Jahitan</h3>
                <div className="dashboard-calendar-container">
                    <Calendar
                        value={new Date()}
                        tileContent={getTileContent}
                        tileClassName={getTileClass}
                        onClickDay={handleDateClick}
                        onActiveStartDateChange={({ activeStartDate }) => fetchJadwal(activeStartDate)}
                    />
                    <div className="calendar-info">
                        <p className="info-text">
                            <strong>Klik pada tanggal</strong> untuk melihat detail pesanan.
                        </p>
                        <p className="info-text">
                            Badge menunjukkan jumlah pesanan yang dijadwalkan selesai pada tanggal tersebut.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
