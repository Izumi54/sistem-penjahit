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

    // 2. Seed Jenis Pakaian
    const jenisPakaianData = [
        {
            idJenis: 'JP001',
            namaJenis: 'Kemeja Pria',
            kategori: 'ATASAN',
            untukGender: 'L',
            hargaMulaiDari: 150000,
            deskripsi: 'Kemeja lengan panjang/pendek untuk pria',
        },
        {
            idJenis: 'JP002',
            namaJenis: 'Kemeja Wanita / Blouse',
            kategori: 'ATASAN',
            untukGender: 'P',
            hargaMulaiDari: 150000,
            deskripsi: 'Kemeja atau blouse untuk wanita',
        },
        {
            idJenis: 'JP003',
            namaJenis: 'Gamis Wanita',
            kategori: 'DRESS',
            untukGender: 'P',
            hargaMulaiDari: 200000,
            deskripsi: 'Gamis panjang untuk wanita',
        },
        {
            idJenis: 'JP004',
            namaJenis: 'Kebaya',
            kategori: 'FORMAL',
            untukGender: 'P',
            hargaMulaiDari: 250000,
            deskripsi: 'Kebaya untuk acara formal',
        },
        {
            idJenis: 'JP005',
            namaJenis: 'Celana Panjang Pria',
            kategori: 'BAWAHAN',
            untukGender: 'L',
            hargaMulaiDari: 120000,
            deskripsi: 'Celana panjang untuk pria',
        },
        {
            idJenis: 'JP006',
            namaJenis: 'Celana Panjang Wanita',
            kategori: 'BAWAHAN',
            untukGender: 'P',
            hargaMulaiDari: 120000,
            deskripsi: 'Celana panjang untuk wanita',
        },
        {
            idJenis: 'JP007',
            namaJenis: 'Rok Panjang',
            kategori: 'BAWAHAN',
            untukGender: 'P',
            hargaMulaiDari: 100000,
            deskripsi: 'Rok panjang untuk wanita',
        },
        {
            idJenis: 'JP008',
            namaJenis: 'Seragam Sekolah',
            kategori: 'FORMAL',
            untukGender: 'UNISEX',
            hargaMulaiDari: 100000,
            deskripsi: 'Seragam sekolah tergantung institusi',
        },
        {
            idJenis: 'JP009',
            namaJenis: 'Seragam Kantor',
            kategori: 'FORMAL',
            untukGender: 'UNISEX',
            hargaMulaiDari: 150000,
            deskripsi: 'Seragam kantor custom',
        },
    ]

    for (const item of jenisPakaianData) {
        await prisma.jenisPakaian.upsert({
            where: { idJenis: item.idJenis },
            update: {},
            create: item,
        })
    }
    console.log('✅ Jenis Pakaian seeded: 9 items')

    // 3. Seed Template Ukuran untuk Kemeja Pria (JP001)
    const templateKemejaPria = [
        { namaUkuran: 'Lingkar Leher', kodeUkuran: 'LL', urutan: 1 },
        { namaUkuran: 'Lebar Bahu', kodeUkuran: 'LB', urutan: 2 },
        { namaUkuran: 'Lingkar Dada', kodeUkuran: 'LD', urutan: 3 },
        { namaUkuran: 'Lingkar Pinggang', kodeUkuran: 'LP', urutan: 4 },
        { namaUkuran: 'Panjang Baju', kodeUkuran: 'PB', urutan: 5 },
        { namaUkuran: 'Panjang Lengan', kodeUkuran: 'PL', urutan: 6 },
        { namaUkuran: 'Lingkar Lengan', kodeUkuran: 'LL2', urutan: 7 },
    ]

    for (const template of templateKemejaPria) {
        await prisma.templateUkuran.create({
            data: {
                idJenis: 'JP001',
                ...template,
            },
        })
    }
    console.log('✅ Template Ukuran seeded: Kemeja Pria')

    // 4. Template Ukuran Gamis Wanita (JP003) - lebih lengkap
    const templateGamis = [
        { namaUkuran: 'Lingkar Dada', kodeUkuran: 'LD', urutan: 1 },
        { namaUkuran: 'Lingkar Pinggang', kodeUkuran: 'LP', urutan: 2 },
        { namaUkuran: 'Lingkar Pinggul', kodeUkuran: 'LPg', urutan: 3 },
        { namaUkuran: 'Panjang Baju', kodeUkuran: 'PB', urutan: 4 },
        { namaUkuran: 'Panjang Lengan', kodeUkuran: 'PL', urutan: 5 },
        { namaUkuran: 'Lebar Bahu', kodeUkuran: 'LBh', urutan: 6 },
        { namaUkuran: 'Lingkar Lengan', kodeUkuran: 'LL', urutan: 7 },
        { namaUkuran: 'Jarak Payudara', kodeUkuran: 'JPD', urutan: 8, isRequired: false },
    ]

    for (const template of templateGamis) {
        await prisma.templateUkuran.create({
            data: {
                idJenis: 'JP003',
                ...template,
            },
        })
    }
    console.log('✅ Template Ukuran seeded: Gamis Wanita')

    // 5. Template Celana Panjang Pria (JP005)
    const templateCelana = [
        { namaUkuran: 'Lingkar Pinggang', kodeUkuran: 'LP', urutan: 1 },
        { namaUkuran: 'Lingkar Pinggul', kodeUkuran: 'LPg', urutan: 2 },
        { namaUkuran: 'Panjang Celana', kodeUkuran: 'PC', urutan: 3 },
        { namaUkuran: 'Lingkar Paha', kodeUkuran: 'LPh', urutan: 4 },
        { namaUkuran: 'Lingkar Lutut', kodeUkuran: 'LK', urutan: 5 },
        { namaUkuran: 'Lingkar Kaki', kodeUkuran: 'LKk', urutan: 6 },
    ]

    for (const template of templateCelana) {
        await prisma.templateUkuran.create({
            data: {
                idJenis: 'JP005',
                ...template,
            },
        })
    }
    console.log('✅ Template Ukuran seeded: Celana Panjang')

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
