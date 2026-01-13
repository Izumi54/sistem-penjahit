import prisma from '../config/database.js'

/**
 * Get overview analytics
 */
export const getOverview = async (req, res) => {
    try {
        const { startDate, endDate } = req.query

        // Default: bulan ini
        const now = new Date()
        const start = startDate
            ? new Date(startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1)
        const end = endDate ? new Date(endDate) : new Date()

        // Hari ini (untuk metrics hari ini)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const todayEnd = new Date(todayStart)
        todayEnd.setDate(todayEnd.getDate() + 1)

        // 1. Total Pesanan (bulan ini)
        const totalPesanan = await prisma.pesanan.count({
            where: {
                tglMasuk: {
                    gte: start,
                    lte: end,
                },
            },
        })

        // 2. Revenue Bulan Ini
        const revenueBulanIni = await prisma.pesanan.aggregate({
            where: {
                tglMasuk: {
                    gte: start,
                    lte: end,
                },
                statusPesanan: {
                    notIn: ['BATAL'],
                },
            },
            _sum: {
                totalBiaya: true,
            },
        })

        // 3. Pesanan Pending (ANTRI + POTONG + JAHIT)
        const pesananPending = await prisma.pesanan.count({
            where: {
                statusPesanan: {
                    in: ['ANTRI', 'POTONG', 'JAHIT'],
                },
            },
        })

        // 4. Pesanan Selesai Hari Ini
        const pesananSelesaiHariIni = await prisma.pesanan.count({
            where: {
                tglSelesaiAktual: {
                    gte: todayStart,
                    lt: todayEnd,
                },
                statusPesanan: 'SELESAI',
            },
        })

        // 5. Pelanggan Baru (bulan ini)
        const pelangganBaru = await prisma.pelanggan.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        })

        // 6. Omzet Hari Ini
        const omzetHariIni = await prisma.pesanan.aggregate({
            where: {
                tglMasuk: {
                    gte: todayStart,
                    lt: todayEnd,
                },
                statusPesanan: {
                    notIn: ['BATAL'],
                },
            },
            _sum: {
                totalBiaya: true,
            },
        })

        res.json({
            data: {
                totalPesanan,
                revenueBulanIni: revenueBulanIni._sum.totalBiaya || 0,
                pesananPending,
                pesananSelesaiHariIni,
                pelangganBaru,
                omzetHariIni: omzetHariIni._sum.totalBiaya || 0,
            },
        })
    } catch (error) {
        console.error('Get overview analytics error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data analytics',
        })
    }
}

/**
 * Get status distribution for donut chart
 */
export const getStatusDistribution = async (req, res) => {
    try {
        const statusCounts = await prisma.pesanan.groupBy({
            by: ['statusPesanan'],
            _count: {
                statusPesanan: true,
            },
        })

        const data = {}
        statusCounts.forEach((item) => {
            data[item.statusPesanan] = item._count.statusPesanan
        })

        res.json({ data })
    } catch (error) {
        console.error('Get status distribution error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil distribusi status',
        })
    }
}

/**
 * Get revenue per month for bar chart
 */
export const getRevenueMonthly = async (req, res) => {
    try {
        const { months = 6 } = req.query
        const monthsCount = parseInt(months)

        const now = new Date()
        const labels = []
        const data = []

        // Generate last N months
        for (let i = monthsCount - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)

            // Label (e.g., "Jan 2026")
            const label = date.toLocaleDateString('id-ID', {
                month: 'short',
                year: 'numeric',
            })
            labels.push(label)

            // Revenue untuk bulan ini
            const revenue = await prisma.pesanan.aggregate({
                where: {
                    tglMasuk: {
                        gte: date,
                        lt: nextMonth,
                    },
                    statusPesanan: {
                        notIn: ['BATAL'],
                    },
                },
                _sum: {
                    totalBiaya: true,
                },
            })

            data.push(revenue._sum.totalBiaya || 0)
        }

        res.json({
            data: {
                labels,
                data,
            },
        })
    } catch (error) {
        console.error('Get revenue monthly error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data revenue bulanan',
        })
    }
}

/**
 * Get daily trend for line chart
 */
export const getTrendDaily = async (req, res) => {
    try {
        const { days = 30 } = req.query
        const daysCount = parseInt(days)

        const now = new Date()
        const labels = []
        const data = []

        // Generate last N days
        for (let i = daysCount - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            const nextDay = new Date(date)
            nextDay.setDate(nextDay.getDate() + 1)

            // Label (e.g., "1 Jan")
            const label = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
            })
            labels.push(label)

            // Count pesanan untuk hari ini
            const count = await prisma.pesanan.count({
                where: {
                    tglMasuk: {
                        gte: date,
                        lt: nextDay,
                    },
                },
            })

            data.push(count)
        }

        res.json({
            data: {
                labels,
                data,
            },
        })
    } catch (error) {
        console.error('Get trend daily error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data trend harian',
        })
    }
}
