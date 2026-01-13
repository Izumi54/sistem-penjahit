import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function BarChart({ data }) {
    if (!data || !data.labels || data.labels.length === 0) {
        return (
            <div className="chart-placeholder">
                <p className="text-muted">Tidak ada data untuk ditampilkan</p>
            </div>
        )
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Revenue (Rp)',
                data: data.data,
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 2,
                borderRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.parsed.y || 0
                        return `Revenue: Rp ${value.toLocaleString('id-ID')}`
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}jt`
                        } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}rb`
                        }
                        return value
                    },
                },
            },
        },
    }

    return (
        <div style={{ height: '300px' }}>
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default BarChart
