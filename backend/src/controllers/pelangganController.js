import prisma from '../config/database.js'
import { generateKodePelanggan, formatPhoneNumber } from '../utils/helpers.js'

/**
 * Get all pelanggan with pagination, search, and filter
 */
export const getAllPelanggan = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            gender = '',
            sortBy = 'terbaru', // Changed default to 'terbaru'
        } = req.query

        // Build where clause for search & filter
        const where = {
            AND: [
                // Search by name, phone, or email
                search
                    ? {
                        OR: [
                            { namaLengkap: { contains: search, mode: 'insensitive' } },
                            { noWa: { contains: search } },
                            { email: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {},
                // Filter by gender
                gender ? { jenisKelamin: gender } : {},
            ],
        }

        // Map sortBy to actual orderBy clause
        let orderBy = { createdAt: 'desc' } // default

        switch (sortBy) {
            case 'terbaru':
                orderBy = { createdAt: 'desc' }
                break
            case 'terlama':
                orderBy = { createdAt: 'asc' }
                break
            case 'nama-az':
                orderBy = { namaLengkap: 'asc' }
                break
            case 'nama-za':
                orderBy = { namaLengkap: 'desc' }
                break
            default:
                orderBy = { createdAt: 'desc' }
        }

        // Get total count for pagination
        const total = await prisma.pelanggan.count({ where })

        // Get pelanggan with pagination
        const pelanggan = await prisma.pelanggan.findMany({
            where,
            skip: (page - 1) * limit,
            take: parseInt(limit),
            orderBy,
            select: {
                idPelanggan: true,
                namaLengkap: true,
                jenisKelamin: true,
                noWa: true,
                email: true,
                alamat: true,
                createdAt: true,
                _count: {
                    select: {
                        pesanan: true,
                        ukuran: true,
                    },
                },
            },
        })

        res.json({
            data: pelanggan,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Get pelanggan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data pelanggan',
        })
    }
}

/**
 * Get single pelanggan by ID with ukuran
 */
export const getPelangganById = async (req, res) => {
    try {
        const { id } = req.params

        const pelanggan = await prisma.pelanggan.findUnique({
            where: { idPelanggan: id },
            include: {
                ukuran: {
                    include: {
                        jenisPakaian: {
                            select: {
                                idJenis: true,
                                namaJenis: true,
                            },
                        },
                    },
                },
                pesanan: {
                    select: {
                        noNota: true,
                        tglMasuk: true,
                        statusPesanan: true,
                        totalBiaya: true,
                    },
                    orderBy: { tglMasuk: 'desc' },
                    take: 5,
                },
            },
        })

        if (!pelanggan) {
            return res.status(404).json({
                error: 'Pelanggan tidak ditemukan',
            })
        }

        res.json({ data: pelanggan })
    } catch (error) {
        console.error('Get pelanggan by ID error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data pelanggan',
        })
    }
}

/**
 * Create new pelanggan
 */
export const createPelanggan = async (req, res) => {
    try {
        const { namaLengkap, jenisKelamin, noWa, email, alamat, catatan } = req.body

        // Validation
        if (!namaLengkap || !jenisKelamin || !noWa) {
            return res.status(400).json({
                error: 'Nama lengkap, jenis kelamin, dan nomor WA harus diisi',
            })
        }

        // Check for duplicate pelanggan
        const existing = await prisma.pelanggan.findFirst({
            where: {
                OR: [
                    { namaLengkap: { equals: namaLengkap, mode: 'insensitive' } },
                    { noWa: formatPhoneNumber(noWa) }
                ]
            }
        })

        if (existing) {
            const duplicateField = existing.namaLengkap.toLowerCase() === namaLengkap.toLowerCase()
                ? 'nama'
                : 'nomor WA'
            return res.status(409).json({
                error: `Pelanggan dengan ${duplicateField} ini sudah terdaftar`,
                existingId: existing.idPelanggan,
                existingNama: existing.namaLengkap
            })
        }

        // Generate kode pelanggan
        const lastPelanggan = await prisma.pelanggan.findFirst({
            orderBy: { idPelanggan: 'desc' },
            select: { idPelanggan: true },
        })

        const idPelanggan = generateKodePelanggan(lastPelanggan?.idPelanggan)

        // Format phone number
        const formattedPhone = formatPhoneNumber(noWa)

        // Create pelanggan
        const pelanggan = await prisma.pelanggan.create({
            data: {
                idPelanggan,
                namaLengkap,
                jenisKelamin,
                noWa: formattedPhone,
                email: email || null,
                alamat: alamat || null,
                catatan: catatan || null,
            },
        })

        res.status(201).json({
            message: 'Pelanggan berhasil ditambahkan',
            data: pelanggan,
        })
    } catch (error) {
        console.error('Create pelanggan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menambahkan pelanggan',
        })
    }
}

/**
 * Update pelanggan
 */
export const updatePelanggan = async (req, res) => {
    try {
        const { id } = req.params
        const { namaLengkap, jenisKelamin, noWa, email, alamat, catatan } = req.body

        // Check if pelanggan exists
        const existing = await prisma.pelanggan.findUnique({
            where: { idPelanggan: id },
        })

        if (!existing) {
            return res.status(404).json({
                error: 'Pelanggan tidak ditemukan',
            })
        }

        // Format phone if provided
        const formattedPhone = noWa ? formatPhoneNumber(noWa) : existing.noWa

        // Update pelanggan
        const pelanggan = await prisma.pelanggan.update({
            where: { idPelanggan: id },
            data: {
                namaLengkap: namaLengkap || existing.namaLengkap,
                jenisKelamin: jenisKelamin || existing.jenisKelamin,
                noWa: formattedPhone,
                email: email !== undefined ? email : existing.email,
                alamat: alamat !== undefined ? alamat : existing.alamat,
                catatan: catatan !== undefined ? catatan : existing.catatan,
            },
        })

        res.json({
            message: 'Pelanggan berhasil diupdate',
            data: pelanggan,
        })
    } catch (error) {
        console.error('Update pelanggan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengupdate pelanggan',
        })
    }
}

/**
 * Delete pelanggan
 */
export const deletePelanggan = async (req, res) => {
    try {
        const { id } = req.params

        // Check if pelanggan exists
        const existing = await prisma.pelanggan.findUnique({
            where: { idPelanggan: id },
            include: {
                pesanan: { select: { noNota: true } },
            },
        })

        if (!existing) {
            return res.status(404).json({
                error: 'Pelanggan tidak ditemukan',
            })
        }

        // Check if pelanggan has orders
        if (existing.pesanan.length > 0) {
            return res.status(400).json({
                error: `Tidak bisa menghapus pelanggan yang sudah memiliki ${existing.pesanan.length} pesanan. Hapus pesanan terlebih dahulu.`,
            })
        }

        // Delete pelanggan (cascade delete ukuran)
        await prisma.pelanggan.delete({
            where: { idPelanggan: id },
        })

        res.json({
            message: 'Pelanggan berhasil dihapus',
        })
    } catch (error) {
        console.error('Delete pelanggan error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menghapus pelanggan',
        })
    }
}

/**
 * Get ukuran by pelanggan ID
 * For modal display in pelanggan list
 */
export const getUkuranByPelanggan = async (req, res) => {
    try {
        const { id } = req.params

        const ukuran = await prisma.ukuran.findMany({
            where: { idPelanggan: id },
            include: {
                jenisPakaian: {
                    select: {
                        idJenis: true,
                        namaJenis: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        res.json({ data: ukuran })
    } catch (error) {
        console.error('Get ukuran error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data ukuran',
        })
    }
}

/**
 * Get ukuran pelanggan by jenis pakaian
 */
export const getUkuranPelanggan = async (req, res) => {
    try {
        const { id, idJenis } = req.params

        const ukuran = await prisma.ukuranPelanggan.findMany({
            where: {
                idPelanggan: id,
                idJenis: idJenis,
            },
            include: {
                jenisPakaian: {
                    select: {
                        namaJenis: true,
                    },
                },
            },
        })

        res.json({ data: ukuran })
    } catch (error) {
        console.error('Get ukuran error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data ukuran',
        })
    }
}

/**
 * Save/Update ukuran pelanggan
 */
export const saveUkuranPelanggan = async (req, res) => {
    try {
        const { id } = req.params
        const { idJenis, ukuran, catatan } = req.body

        // ukuran format: [{ kodeUkuran: 'LD', nilai: 90 }, ...]

        if (!idJenis || !Array.isArray(ukuran)) {
            return res.status(400).json({
                error: 'ID jenis pakaian dan data ukuran harus diisi',
            })
        }

        // Check if pelanggan exists
        const pelanggan = await prisma.pelanggan.findUnique({
            where: { idPelanggan: id },
        })

        if (!pelanggan) {
            return res.status(404).json({
                error: 'Pelanggan tidak ditemukan',
            })
        }

        const tanggalUkur = new Date()

        // Process each ukuran
        const results = await Promise.all(
            ukuran.map(async (item) => {
                const { kodeUkuran, nilai } = item

                // Get existing ukuran to create history
                const existing = await prisma.ukuranPelanggan.findUnique({
                    where: {
                        idPelanggan_idJenis_kodeUkuran: {
                            idPelanggan: id,
                            idJenis,
                            kodeUkuran,
                        },
                    },
                })

                // If exists and value changed, create history
                if (existing && existing.nilai !== nilai) {
                    await prisma.historyUkuran.create({
                        data: {
                            idPelanggan: id,
                            idJenis,
                            kodeUkuran,
                            nilaiLama: existing.nilai,
                            nilaiBaru: nilai,
                            keterangan: catatan || null,
                        },
                    })
                }

                // Upsert ukuran
                return prisma.ukuranPelanggan.upsert({
                    where: {
                        idPelanggan_idJenis_kodeUkuran: {
                            idPelanggan: id,
                            idJenis,
                            kodeUkuran,
                        },
                    },
                    update: {
                        nilai,
                        catatan: catatan || null,
                        tanggalUkur,
                    },
                    create: {
                        idPelanggan: id,
                        idJenis,
                        kodeUkuran,
                        nilai,
                        catatan: catatan || null,
                        tanggalUkur,
                    },
                })
            })
        )

        res.json({
            message: 'Ukuran pelanggan berhasil disimpan',
            data: results,
        })
    } catch (error) {
        console.error('Save ukuran error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menyimpan ukuran',
        })
    }
}
