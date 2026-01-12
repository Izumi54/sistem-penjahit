import prisma from '../config/database.js'

/**
 * Get all jenis pakaian
 */
export const getAllJenisPakaian = async (req, res) => {
    try {
        const jenisPakaian = await prisma.jenisPakaian.findMany({
            orderBy: { namaJenis: 'asc' },
            include: {
                _count: {
                    select: {
                        templateUkuran: true,
                        ukuranPelanggan: true,
                    },
                },
            },
        })

        res.json({ data: jenisPakaian })
    } catch (error) {
        console.error('Get jenis pakaian error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data jenis pakaian',
        })
    }
}

/**
 * Get single jenis pakaian with templates
 */
export const getJenisPakaianById = async (req, res) => {
    try {
        const { id } = req.params

        const jenisPakaian = await prisma.jenisPakaian.findUnique({
            where: { idJenis: id },
            include: {
                templateUkuran: {
                    orderBy: { urutan: 'asc' },
                },
            },
        })

        if (!jenisPakaian) {
            return res.status(404).json({
                error: 'Jenis pakaian tidak ditemukan',
            })
        }

        res.json({ data: jenisPakaian })
    } catch (error) {
        console.error('Get jenis pakaian by ID error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data jenis pakaian',
        })
    }
}

/**
 * Create new jenis pakaian
 */
export const createJenisPakaian = async (req, res) => {
    try {
        const { namaJenis, keterangan } = req.body

        if (!namaJenis) {
            return res.status(400).json({
                error: 'Nama jenis pakaian harus diisi',
            })
        }

        // Check if already exists
        const existing = await prisma.jenisPakaian.findFirst({
            where: {
                namaJenis: {
                    equals: namaJenis,
                    mode: 'insensitive',
                },
            },
        })

        if (existing) {
            return res.status(400).json({
                error: `Jenis pakaian "${namaJenis}" sudah ada`,
            })
        }

        // Generate idJenis (JP001, JP002, ...)
        const lastJenis = await prisma.jenisPakaian.findFirst({
            orderBy: { idJenis: 'desc' },
            select: { idJenis: true },
        })

        let newId = 'JP001'
        if (lastJenis) {
            const lastNumber = parseInt(lastJenis.idJenis.substring(2))
            const newNumber = lastNumber + 1
            newId = 'JP' + newNumber.toString().padStart(3, '0')
        }

        // Create jenis pakaian with manual ID
        const jenisPakaian = await prisma.jenisPakaian.create({
            data: {
                idJenis: newId,
                namaJenis,
                kategori: 'ATASAN', // Default
                untukGender: 'UNISEX', // Default
                deskripsi: keterangan || null, // Field name = deskripsi, not keterangan
            },
        })

        res.status(201).json({
            message: 'Jenis pakaian berhasil ditambahkan',
            data: jenisPakaian,
        })
    } catch (error) {
        console.error('Create jenis pakaian error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menambahkan jenis pakaian',
        })
    }
}

/**
 * Update jenis pakaian
 */
export const updateJenisPakaian = async (req, res) => {
    try {
        const { id } = req.params
        const { namaJenis, keterangan } = req.body

        const existing = await prisma.jenisPakaian.findUnique({
            where: { idJenis: id },
        })

        if (!existing) {
            return res.status(404).json({
                error: 'Jenis pakaian tidak ditemukan',
            })
        }

        // Check duplicate name (exclude current)
        if (namaJenis && namaJenis !== existing.namaJenis) {
            const duplicate = await prisma.jenisPakaian.findFirst({
                where: {
                    namaJenis: {
                        equals: namaJenis,
                        mode: 'insensitive',
                    },
                    idJenis: { not: id },
                },
            })

            if (duplicate) {
                return res.status(400).json({
                    error: `Jenis pakaian "${namaJenis}" sudah ada`,
                })
            }
        }

        const jenisPakaian = await prisma.jenisPakaian.update({
            where: { idJenis: id },
            data: {
                namaJenis: namaJenis || existing.namaJenis,
                deskripsi: keterangan !== undefined ? keterangan : existing.deskripsi,
            },
        })

        res.json({
            message: 'Jenis pakaian berhasil diupdate',
            data: jenisPakaian,
        })
    } catch (error) {
        console.error('Update jenis pakaian error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengupdate jenis pakaian',
        })
    }
}

/**
 * Delete jenis pakaian
 */
export const deleteJenisPakaian = async (req, res) => {
    try {
        const { id } = req.params

        const existing = await prisma.jenisPakaian.findUnique({
            where: { idJenis: id },
            include: {
                _count: {
                    select: {
                        ukuranPelanggan: true,
                        detailPesanan: true,
                    },
                },
            },
        })

        if (!existing) {
            return res.status(404).json({
                error: 'Jenis pakaian tidak ditemukan',
            })
        }

        // Check if used
        const usageCount =
            existing._count.ukuranPelanggan + existing._count.detailPesanan

        if (usageCount > 0) {
            return res.status(400).json({
                error: `Tidak bisa menghapus jenis pakaian yang sudah digunakan (${usageCount} data terkait)`,
            })
        }

        // Delete (cascade delete template)
        await prisma.jenisPakaian.delete({
            where: { idJenis: id },
        })

        res.json({
            message: 'Jenis pakaian berhasil dihapus',
        })
    } catch (error) {
        console.error('Delete jenis pakaian error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menghapus jenis pakaian',
        })
    }
}

/**
 * Get template ukuran for jenis pakaian
 */
export const getTemplateUkuran = async (req, res) => {
    try {
        const { id } = req.params

        const templates = await prisma.templateUkuran.findMany({
            where: { idJenis: id },
            orderBy: { urutan: 'asc' },
        })

        res.json({ data: templates })
    } catch (error) {
        console.error('Get template ukuran error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil template ukuran',
        })
    }
}

/**
 * Save template ukuran (bulk upsert)
 */
export const saveTemplateUkuran = async (req, res) => {
    try {
        const { id } = req.params
        const { templates } = req.body

        // templates: [{ kodeUkuran, namaUkuran, satuan, urutan }, ...]

        if (!Array.isArray(templates)) {
            return res.status(400).json({
                error: 'Data template harus berupa array',
            })
        }

        // Check if jenis exists
        const jenis = await prisma.jenisPakaian.findUnique({
            where: { idJenis: id },
        })

        if (!jenis) {
            return res.status(404).json({
                error: 'Jenis pakaian tidak ditemukan',
            })
        }

        // Delete existing templates
        await prisma.templateUkuran.deleteMany({
            where: { idJenis: id },
        })

        // Insert new templates
        if (templates.length > 0) {
            await prisma.templateUkuran.createMany({
                data: templates.map((t, index) => ({
                    idJenis: id,
                    kodeUkuran: t.kodeUkuran,
                    namaUkuran: t.namaUkuran,
                    satuan: t.satuan || 'cm',
                    urutan: t.urutan !== undefined ? t.urutan : index + 1,
                })),
            })
        }

        // Get updated templates
        const updated = await prisma.templateUkuran.findMany({
            where: { idJenis: id },
            orderBy: { urutan: 'asc' },
        })

        res.json({
            message: 'Template ukuran berhasil disimpan',
            data: updated,
        })
    } catch (error) {
        console.error('Save template ukuran error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat menyimpan template ukuran',
        })
    }
}
