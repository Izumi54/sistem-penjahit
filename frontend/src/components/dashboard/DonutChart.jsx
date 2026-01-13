import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

function DonutChart({ data }) {
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="chart-placeholder">
                <p className="text-muted">Tidak ada data untuk ditampilkan</p>
            </div>
        )
    }

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Jumlah Pesanan',
                data: Object.values(data),
                backgroundColor: [
                    'rgba(156, 163, 175, 0.8)', // ANTRI - gray
                    'rgba(59, 130, 246, 0.8)',  // POTONG - blue
                    'rgba(251, 191, 36, 0.8)',  // JAHIT - yellow
                    'rgba(34, 197, 94, 0.8)',   // SELESAI - green
                    'rgba(16, 185, 129, 0.8)',  // DIAMBIL - teal
                    'rgba(239, 68, 68, 0.8)',   // BATAL - red
                ],
                borderColor: [
                    'rgb(156, 163, 175)',
                    'rgb(59, 130, 246)',
                    'rgb(251, 191, 36)',
                    'rgb(34, 197, 94)',
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: ${value} (${percentage}%)`
                    },
                },
            },
        },
    }

    return (
        <div style={{ height: '300px' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    )
}

export default DonutChart
