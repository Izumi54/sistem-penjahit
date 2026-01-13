import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // 1. Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            namaLengkap: 'Administrator',
        },
    })
    console.log('✅ Admin user created:', admin.username)

    // 2. Seed Jenis Pakaian with Template Ukuran
    console.log('Seeding jenis pakaian with template ukuran...')

    const jenisPakaianData = [
        {
            idJenis: 'JP001',
            namaJenis: 'Kemeja Pria',
            kategori: 'ATASAN',
            untukGender: 'L',
            hargaMulaiDari: 150000,
            deskripsi: 'Kemeja formal dan casual untuk pria',
            templateUkuran: [
                { kodeUkuran: 'LD', namaUkuran: 'Lingkar Dada', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LB', namaUkuran: 'Lebar Bahu', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'PB', namaUkuran: 'Panjang Baju', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PT', namaUkuran: 'Panjang Tangan', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'LLg', namaUkuran: 'Lingkar Lengan', satuan: 'cm', urutan: 6 },
                { kodeUkuran: 'LK', namaUkuran: 'Lingkar Kerung', satuan: 'cm', urutan: 7 },
            ],
        },
        {
            idJenis: 'JP002',
            namaJenis: 'Blouse Wanita',
            kategori: 'ATASAN',
            untukGender: 'P',
            hargaMulaiDari: 120000,
            deskripsi: 'Blouse dan atasan untuk wanita',
            templateUkuran: [
                { kodeUkuran: 'LD', namaUkuran: 'Lingkar Dada', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LB', namaUkuran: 'Lebar Bahu', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'PB', namaUkuran: 'Panjang Baju', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PT', namaUkuran: 'Panjang Tangan', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'LLg', namaUkuran: 'Lingkar Lengan', satuan: 'cm', urutan: 6 },
                { kodeUkuran: 'PPy', namaUkuran: 'Panjang Payudara', satuan: 'cm', urutan: 7 },
            ],
        },
        {
            idJenis: 'JP003',
            namaJenis: 'Celana Panjang',
            kategori: 'BAWAHAN',
            untukGender: 'UNISEX',
            hargaMulaiDari: 100000,
            deskripsi: 'Celana panjang formal dan casual',
            templateUkuran: [
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LPh', namaUkuran: 'Lingkar Panggul', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LPa', namaUkuran: 'Lingkar Paha', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'LLu', namaUkuran: 'Lingkar Lutut', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PC', namaUkuran: 'Panjang Celana', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'LK', namaUkuran: 'Lingkar Kaki', satuan: 'cm', urutan: 6 },
            ],
        },
        {
            idJenis: 'JP004',
            namaJenis: 'Rok',
            kategori: 'BAWAHAN',
            untukGender: 'P',
            hargaMulaiDari: 80000,
            deskripsi: 'Rok dengan berbagai model',
            templateUkuran: [
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LPh', namaUkuran: 'Lingkar Panggul', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'PR', namaUkuran: 'Panjang Rok', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'LBw', namaUkuran: 'Lingkar Bawah', satuan: 'cm', urutan: 4 },
            ],
        },
        {
            idJenis: 'JP005',
            namaJenis: 'Gamis',
            kategori: 'DRESS',
            untukGender: 'P',
            hargaMulaiDari: 200000,
            deskripsi: 'Gamis dan dress panjang muslimah',
            templateUkuran: [
                { kodeUkuran: 'LD', namaUkuran: 'Lingkar Dada', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LPh', namaUkuran: 'Lingkar Panggul', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'LB', namaUkuran: 'Lebar Bahu', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PG', namaUkuran: 'Panjang Gamis', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'PT', namaUkuran: 'Panjang Tangan', satuan: 'cm', urutan: 6 },
                { kodeUkuran: 'LLg', namaUkuran: 'Lingkar Lengan', satuan: 'cm', urutan: 7 },
            ],
        },
        {
            idJenis: 'JP006',
            namaJenis: 'Jas/Blazer',
            kategori: 'FORMAL',
            untukGender: 'UNISEX',
            hargaMulaiDari: 300000,
            deskripsi: 'Jas dan blazer formal',
            templateUkuran: [
                { kodeUkuran: 'LD', namaUkuran: 'Lingkar Dada', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LB', namaUkuran: 'Lebar Bahu', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'PJ', namaUkuran: 'Panjang Jas', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PT', namaUkuran: 'Panjang Tangan', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'LLg', namaUkuran: 'Lingkar Lengan', satuan: 'cm', urutan: 6 },
                { kodeUkuran: 'PP', namaUkuran: 'Panjang Punggung', satuan: 'cm', urutan: 7 },
            ],
        },
        {
            idJenis: 'JP007',
            namaJenis: 'Dress Casual',
            kategori: 'DRESS',
            untukGender: 'P',
            hargaMulaiDari: 150000,
            deskripsi: 'Dress casual untuk sehari-hari',
            templateUkuran: [
                { kodeUkuran: 'LD', namaUkuran: 'Lingkar Dada', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LPh', namaUkuran: 'Lingkar Panggul', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'LB', namaUkuran: 'Lebar Bahu', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PD', namaUkuran: 'Panjang Dress', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'PT', namaUkuran: 'Panjang Tangan', satuan: 'cm', urutan: 6 },
            ],
        },
        {
            idJenis: 'JP008',
            namaJenis: 'Koko/Muslim Pria',
            kategori: 'ATASAN',
            untukGender: 'L',
            hargaMulaiDari: 130000,
            deskripsi: 'Baju koko dan muslim untuk pria',
            templateUkuran: [
                { kodeUkuran: 'LD', namaUkuran: 'Lingkar Dada', satuan: 'cm', urutan: 1 },
                { kodeUkuran: 'LP', namaUkuran: 'Lingkar Pinggang', satuan: 'cm', urutan: 2 },
                { kodeUkuran: 'LB', namaUkuran: 'Lebar Bahu', satuan: 'cm', urutan: 3 },
                { kodeUkuran: 'PK', namaUkuran: 'Panjang Koko', satuan: 'cm', urutan: 4 },
                { kodeUkuran: 'PT', namaUkuran: 'Panjang Tangan', satuan: 'cm', urutan: 5 },
                { kodeUkuran: 'LLg', namaUkuran: 'Lingkar Lengan', satuan: 'cm', urutan: 6 },
            ],
        },
    ]

    for (const data of jenisPakaianData) {
        const { templateUkuran, ...jenisPakaianFields } = data

        // Create or update jenis pakaian
        const jenisPakaian = await prisma.jenisPakaian.upsert({
            where: { idJenis: data.idJenis },
            update: jenisPakaianFields,
            create: jenisPakaianFields,
        })

        // Create template ukuran
        if (templateUkuran && templateUkuran.length > 0) {
            // Delete existing templates first
            await prisma.templateUkuran.deleteMany({
                where: { idJenis: jenisPakaian.idJenis },
            })

            // Create new templates
            await prisma.templateUkuran.createMany({
                data: templateUkuran.map((t) => ({
                    idJenis: jenisPakaian.idJenis,
                    ...t,
                })),
            })
        }

        console.log(
            `✓ ${jenisPakaian.namaJenis} - ${templateUkuran?.length || 0} template ukuran`
        )
    }

    console.log('✅ Jenis Pakaian & Template Ukuran seeded!')
    console.log('🎉 Seed complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
