import prisma from '../config/database.js'

/**
 * Input pembayaran baru untuk pesanan
 */
export const inputPembayaran = async (req, res) => {
    try {
        const { noNota } = req.params
        const { jumlahBayar, metodeBayar, keterangan } = req.body

        // Validation
        if (!jumlahBayar || !metodeBayar) {
            return res.status(400).json({
                error: 'Jumlah bayar dan metode bayar harus diisi',
            })
        }

        if (jumlahBayar <= 0) {
            return res.status(400).json({
                error: 'Jumlah bayar harus lebih dari 0',
            })
        }

        // Check if pesanan exists
        const pesanan = await prisma.pesanan.findUnique({
            where: { noNota },
        })

        if (!pesanan) {
            return res.status(404).json({
                error: 'Pesanan tidak ditemukan',
            })
        }

        // Check current sisa bayar
        const totalPaid = await prisma.pembayaran.aggregate({
            where: { noNota },
            _sum: { nominal: true },
        })

        const currentPaid = totalPaid._sum.nominal || 0
        const currentSisaBayar = pesanan.totalBiaya - currentPaid

        // Validate: can't overpay
        if (jumlahBayar > currentSisaBayar) {
            return res.status(400).json({
                error: `Jumlah bayar melebihi sisa bayar (Rp ${currentSisaBayar.toLocaleString('id-ID')})`,
            })
        }

        // Determine jenisBayar
        let jenisBayar = 'CICILAN'
        if (currentPaid === 0) {
            jenisBayar = 'DP'
        } else if (parseInt(jumlahBayar) >= currentSisaBayar) {
            jenisBayar = 'LUNAS'
        }

        // Create pembayaran record
        const pembayaran = await prisma.pembayaran.create({
            data: {
                noNota,
                nominal: parseInt(jumlahBayar),
                jenisBayar,
                metodeBayar,
                catatan: keterangan || null,
                tglBayar: new Date(),
            },
        })

        // Calculate new sisa bayar
        const newTotalPaid = currentPaid + parseInt(jumlahBayar)
        const newSisaBayar = pesanan.totalBiaya - newTotalPaid

        // Update pesanan sisa bayar
        await prisma.pesanan.update({
            where: { noNota },
            data: { sisaBayar: newSisaBayar },
        })

        res.status(201).json({
            message: 'Pembayaran berhasil dicatat',
            data: {
                pembayaran,
                sisaBayarSekarang: newSisaBayar,
            },
        })
    } catch (error) {
        console.error('Input pembayaran error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mencatat pembayaran',
        })
    }
}

/**
 * Get history pembayaran untuk pesanan
 */
export const getPembayaranHistory = async (req, res) => {
    try {
        const { noNota } = req.params

        // Get pesanan
        const pesanan = await prisma.pesanan.findUnique({
            where: { noNota },
            select: {
                totalBiaya: true,
                sisaBayar: true,
            },
        })

        if (!pesanan) {
            return res.status(404).json({
                error: 'Pesanan tidak ditemukan',
            })
        }

        // Get all pembayaran
        const pembayaranList = await prisma.pembayaran.findMany({
            where: { noNota },
            orderBy: { tglBayar: 'asc' },
        })

        // Calculate total paid
        const totalPaid = pembayaranList.reduce((sum, p) => sum + p.nominal, 0)

        res.json({
            data: pembayaranList,
            summary: {
                totalBiaya: pesanan.totalBiaya,
                totalPaid,
                sisaBayar: pesanan.sisaBayar,
            },
        })
    } catch (error) {
        console.error('Get pembayaran history error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil history pembayaran',
        })
    }
}
