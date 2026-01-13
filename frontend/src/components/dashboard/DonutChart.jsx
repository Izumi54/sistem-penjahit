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
                    'rgba(156, 163, 175, 0.9)', // ANTRI - gray
                    'rgba(59, 130, 246, 0.9)',  // POTONG - blue
                    'rgba(251, 191, 36, 0.9)',  // JAHIT - yellow
                    'rgba(34, 197, 94, 0.9)',   // SELESAI - green
                    'rgba(16, 185, 129, 0.9)',  // DIAMBIL - teal
                    'rgba(239, 68, 68, 0.9)',   // BATAL - red
                ],
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 8,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%', // Donut hole size
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: '500',
                    },
                    color: '#374151',
                    boxWidth: 14,
                    boxHeight: 14,
                    generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            const dataset = data.datasets[0];
                            const total = dataset.data.reduce((a, b) => a + b, 0);

                            return data.labels.map((label, i) => {
                                const value = dataset.data[i];
                                const percentage = ((value / total) * 100).toFixed(0);

                                return {
                                    text: `${label} (${percentage}%)`,
                                    fillStyle: dataset.backgroundColor[i],
                                    strokeStyle: dataset.borderColor,
                                    lineWidth: dataset.borderWidth,
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 13,
                    weight: '600',
                },
                bodyFont: {
                    size: 12,
                },
                callbacks: {
                    label: function (context) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: ${value} pesanan (${percentage}%)`
                    },
                },
            },
        },
        layout: {
            padding: {
                top: 10,
                bottom: 5,
            }
        }
    }

    return (
        <div style={{ height: '350px', width: '100%' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    )
}

export default DonutChart
