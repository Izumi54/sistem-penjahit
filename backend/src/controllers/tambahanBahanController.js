import prisma from '../config/database.js'

export const createTambahanBahan = async (req, res) => {
    try {
        const { idDetail, namaBahan, qty, harga } = req.body
        const subtotal = qty * harga

        const tambahan = await prisma.tambahanBahan.create({
            data: {
                idDetail: parseInt(idDetail),
                namaBahan,
                qty: parseInt(qty),
                harga: parseInt(harga),
                subtotal
            }
        })

        res.status(201).json({ message: 'Berhasil', data: tambahan })
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan' })
    }
}

export const getTambahanByDetail = async (req, res) => {
    try {
        const { idDetail } = req.params
        const tambahan = await prisma.tambahanBahan.findMany({
            where: { idDetail: parseInt(idDetail) }
        })
        res.json({ data: tambahan })
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' })
    }
}

export const deleteTambahanBahan = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.tambahanBahan.delete({ where: { idTambahan: id } })
        res.json({ message: 'Berhasil dihapus' })
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus' })
    }
}