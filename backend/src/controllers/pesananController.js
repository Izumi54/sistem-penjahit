import prisma from '../config/database.js'
import { generateNoNota } from '../utils/helpers.js'

/**
 * Get all pesanan with filters, search, pagination
 */
export const getAllPesanan = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            sortBy = 'terbaru',
        } = req.query

        // Build where clause
        const where = {
            AND: [
                // Search by noNota or nama pelanggan
                search
                    ? {
                        OR: [
                            { noNota: { contains: search, mode: 'insensitive' } },
                            {
                                pelanggan: {
                                    namaLengkap: { contains: search, mode: 'insensitive' },
                                },
                            },
                        ],
                    }
                    : {},
                // Filter by status
                status ? { statusPesanan: status } : {},
            ],
        }

        // Map sortBy to orderBy clause
        let orderBy = { tglMasuk: 'desc' } // default

        switch (sortBy) {
            case 'terbaru':
                orderBy = { tglMasuk: 'desc' }
                break
            case 'terlama':
                orderBy = { tglMasuk: 'asc' }
                break
            case 'total-tinggi':
                orderBy = { totalBiaya: 'desc' }
                break
            case 'total-rendah':
                orderBy = { totalBiaya: 'asc' }
                break
            default:
                orderBy = { tglMasuk: 'desc' }
        }

        const total = await prisma.pesanan.count({ where })

        const pesanan = await prisma.pesanan.findMany({
            where,
            skip: (page - 1) * limit,
            take: parseInt(limit),
            orderBy,
            include: {
                pelanggan: {
                    select: {
                        idPelanggan: true,
                        namaLengkap: true,
                        noWa: true,
                    },
                },
                _count: {
                    select: {
                        detailPesanan: true,
                        pembayaran: true,
                    },
                },
            },
        })

        res.json({
            data: pesanan,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Get pesanan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data pesanan',
        })
    }
}

/**
 * Get single pesanan by noNota with full details
 */
export const getPesananById = async (req, res) => {
    try {
        const { noNota } = req.params

        const pesanan = await prisma.pesanan.findUnique({
            where: { noNota },
            include: {
                pelanggan: true,
                user: {
                    select: {
                        idUser: true,
                        username: true,
                        namaLengkap: true,
                    },
                },
                detailPesanan: {
                    include: {
                        jenisPakaian: {
                            select: {
                                idJenis: true,
                                namaJenis: true,
                            },
                        },
                    },
                },
                pembayaran: {
                    orderBy: { tglBayar: 'asc' },
                },
                historyStatus: {
                    include: {
                        user: {
                            select: {
                                namaLengkap: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!pesanan) {
            return res.status(404).json({
                error: 'Pesanan tidak ditemukan',
            })
        }

        res.json({ data: pesanan })
    } catch (error) {
        console.error('Get pesanan by ID error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil detail pesanan',
        })
    }
}

/**
 * Create new pesanan
 */
export const createPesanan = async (req, res) => {
    try {
        const {
            idPelanggan,
            tglMasuk,
            tglJanjiSelesai,
            totalDp = 0,
            catatanPesanan,
            detailPesanan, // Array of items
        } = req.body

        const idUser = req.user.idUser // From auth middleware

        // Validation
        if (!idPelanggan || !tglJanjiSelesai || !detailPesanan || detailPesanan.length === 0) {
            return res.status(400).json({
                error: 'Data pesanan tidak lengkap',
            })
        }

        // Generate noNota
        const lastPesanan = await prisma.pesanan.findFirst({
            orderBy: { noNota: 'desc' },
            select: { noNota: true },
        })

        const noNota = generateNoNota(lastPesanan?.noNota)

        // Calculate total biaya
        let totalBiaya = 0
        detailPesanan.forEach((item) => {
            item.subtotal = item.hargaSatuan * (item.jumlahPcs || 1)
            totalBiaya += item.subtotal
        })

        const sisaBayar = totalBiaya - totalDp

        // Create pesanan with details in transaction
        const pesanan = await prisma.$transaction(async (tx) => {
            // Create pesanan
            const newPesanan = await tx.pesanan.create({
                data: {
                    noNota,
                    idPelanggan,
                    idUser,
                    tglMasuk: tglMasuk ? new Date(tglMasuk) : new Date(),
                    tglJanjiSelesai: new Date(tglJanjiSelesai),
                    totalBiaya,
                    totalDp,
                    sisaBayar,
                    statusPesanan: 'ANTRI',
                    catatanPesanan: catatanPesanan || null,
                },
            })

            // Create detail pesanan
            await tx.detailPesanan.createMany({
                data: detailPesanan.map((item) => ({
                    noNota,
                    idJenis: item.idJenis,
                    namaItem: item.namaItem,
                    modelSpesifik: item.modelSpesifik || null,
                    jumlahPcs: item.jumlahPcs || 1,
                    hargaSatuan: item.hargaSatuan,
                    subtotal: item.subtotal,
                    catatanPenjahit: item.catatanPenjahit || null,
                })),
            })

            // Create initial history status
            await tx.historyStatusPesanan.create({
                data: {
                    noNota,
                    statusLama: null,
                    statusBaru: 'ANTRI',
                    idUser,
                    catatanPerubahan: 'Pesanan dibuat',
                },
            })

            // Create DP payment if exists
            if (totalDp > 0) {
                await tx.pembayaran.create({
                    data: {
                        noNota,
                        tglBayar: tglMasuk ? new Date(tglMasuk) : new Date(),
                        nominal: totalDp,
                        jenisBayar: 'DP',
                        metodeBayar: 'CASH',
                    },
                })
            }

            return newPesanan
        })

        res.status(201).json({
            message: 'Pesanan berhasil dibuat',
            data: pesanan,
        })
    } catch (error) {
        console.error('Create pesanan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat membuat pesanan',
        })
    }
}

/**
 * Update pesanan status
 */
export const updatePesananStatus = async (req, res) => {
    try {
        const { noNota } = req.params
        const { statusBaru, catatanPerubahan } = req.body
        const idUser = req.user.idUser

        if (!statusBaru) {
            return res.status(400).json({
                error: 'Status baru harus diisi',
            })
        }

        const existing = await prisma.pesanan.findUnique({
            where: { noNota },
            select: { statusPesanan: true },
        })

        if (!existing) {
            return res.status(404).json({
                error: 'Pesanan tidak ditemukan',
            })
        }

        // Update in transaction
        await prisma.$transaction(async (tx) => {
            // Update status
            await tx.pesanan.update({
                where: { noNota },
                data: {
                    statusPesanan: statusBaru,
                    ...(statusBaru === 'SELESAI' && { tglSelesaiAktual: new Date() }),
                },
            })

            // Create history
            await tx.historyStatusPesanan.create({
                data: {
                    noNota,
                    statusLama: existing.statusPesanan,
                    statusBaru,
                    idUser,
                    catatanPerubahan: catatanPerubahan || null,
                },
            })
        })

        res.json({
            message: 'Status pesanan berhasil diupdate',
        })
    } catch (error) {
        console.error('Update status error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengupdate status',
        })
    }
}

/**
 * Delete/cancel pesanan
 */
export const deletePesanan = async (req, res) => {
    try {
        const { noNota } = req.params

        const existing = await prisma.pesanan.findUnique({
            where: { noNota },
            include: {
                pembayaran: true,
            },
        })

        if (!existing) {
            return res.status(404).json({
                error: 'Pesanan tidak ditemukan',
            })
        }

        if (existing.statusPesanan === 'DIAMBIL') {
            return res.status(400).json({
                error: 'Tidak bisa menghapus pesanan yang sudah diambil',
            })
        }

        // Delete (cascade delete detail, history, pembayaran)
        await prisma.pesanan.delete({
            where: { noNota },
        })

        res.json({
            message: 'Pesanan berhasil dihapus',
        })
    } catch (error) {
        console.error('Delete pesanan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menghapus pesanan',
        })
    }
}

/**
 * Get history status pesanan
 */
export const getHistoryStatus = async (req, res) => {
    try {
        const { noNota } = req.params

        const history = await prisma.historyStatusPesanan.findMany({
            where: { noNota },
            include: {
                user: {
                    select: {
                        namaLengkap: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        res.json({ data: history })
    } catch (error) {
        console.error('Get history error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil history',
        })
    }
}
