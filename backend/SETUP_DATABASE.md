# 🐘 Setup PostgreSQL Database - Neon.tech

Panduan lengkap setup database PostgreSQL gratis dengan Neon.tech

---

## 📋 Step-by-Step Setup

### **Step 1: Buat Akun Neon.tech**

1. Buka browser, kunjungi: **https://neon.tech**
2. Click tombol **"Sign Up"** atau **"Get Started"**
3. Pilih salah satu cara sign up:
   - **Sign up with GitHub** (REKOMENDASI - paling cepat) ✅
   - Sign up with Google
   - Sign up with Email

4. Authorize Neon (jika pakai GitHub/Google)

---

### **Step 2: Create Project**

Setelah login, Anda akan masuk ke dashboard Neon.

1. Click tombol **"Create a project"** atau **"New Project"**
2. Isi form:
   - **Project name**: `sistem-penjahit` (atau nama bebas)
   - **Region**: Pilih yang terdekat dengan Indonesia:
     - **Singapore (ap-southeast-1)** ✅ REKOMENDASI
     - atau Tokyo (ap-northeast-1)
   - **Postgres version**: Biarkan default (PostgreSQL 16)
   
3. Click **"Create project"**

⏳ Tunggu ~30 detik, database akan dibuat otomatis

---

### **Step 3: Copy Connection String**

Setelah project dibuat, Anda akan lihat halaman project dashboard.

1. Cari section **"Connection Details"** atau **"Connection String"**
2. Pilih **"Pooled connection"** (lebih stabil untuk Prisma)
3. Anda akan lihat connection string seperti ini:

```
postgresql://username:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
```

4. **COPY** connection string tersebut (ada tombol copy 📋)

---

### **Step 4: Update File .env Backend**

1. Buka file `.env` di folder `backend/`
2. Cari baris `DATABASE_URL=...`
3. **Replace** dengan connection string dari Neon:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require"
```

**PENTING**: Pastikan ada tanda kutip `"..."` di sekitar URL

4. **Save** file `.env`

---

### **Step 5: Test Connection dengan Prisma**

Buka terminal cmd di folder `backend`, jalankan:

```bash
npx prisma generate
```

Output yang benar:
```
✔ Generated Prisma Client
```

Lalu jalankan:
```bash
npx prisma db push
```

Ini akan:
- ✅ Connect ke Neon database
- ✅ Create semua tabel (11 tabel)
- ✅ Setup relasi antar tabel

Output sukses:
```
✔ Your database is now in sync with your schema
```

---

### **Step 6: Seed Data Default**

Populate database dengan data awal (admin user, jenis pakaian, template ukuran):

```bash
npm run prisma:seed
```

Output yang benar:
```
🌱 Seeding database...
✅ Admin user created: admin
✅ Jenis Pakaian seeded: 9 items
✅ Template Ukuran seeded: Kemeja Pria
✅ Template Ukuran seeded: Gamis Wanita
✅ Template Ukuran seeded: Celana Panjang
🎉 Seed complete!
```

---

### **Step 7: Verify Database (Optional)**

Lihat data di database dengan Prisma Studio:

```bash
npm run prisma:studio
```

Akan buka browser di `http://localhost:5555` dengan GUI untuk explore database.

---

## ✅ Checklist

- [ ] Akun Neon.tech berhasil dibuat
- [ ] Project `sistem-penjahit` dibuat
- [ ] Connection string berhasil di-copy
- [ ] File `.env` sudah di-update dengan DATABASE_URL
- [ ] `npx prisma generate` berhasil
- [ ] `npx prisma db push` berhasil (11 tabel dibuat)
- [ ] `npm run prisma:seed` berhasil (data default masuk)
- [ ] Prisma Studio bisa dibuka (optional)

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- ✅ Pastikan ada internet connection
- ✅ Cek DATABASE_URL di `.env` tidak ada typo
- ✅ Pastikan ada `?sslmode=require` di akhir URL

### Error: "Authentication failed"
- ✅ Copy ulang connection string dari Neon dashboard
- ✅ Jangan edit password di connection string

### Error: "Environment variable not found: DATABASE_URL"
- ✅ Pastikan file `.env` ada di folder `backend/`
- ✅ Restart terminal setelah edit `.env`

---

## 📊 Database Schema Summary

Setelah setup sukses, Anda akan punya:

**11 Tabel:**
1. `users` - Admin account
2. `pelanggan` - Customer data
3. `jenis_pakaian` - 9 jenis pakaian default
4. `template_ukuran` - Template ukuran per jenis
5. `ukuran_pelanggan` - Ukuran customer (flexible)
6. `history_ukuran` - Tracking perubahan ukuran
7. `pesanan` - Order headers
8. `detail_pesanan` - Order items
9. `foto_referensi` - Photo references
10. `pembayaran` - Payment records
11. `history_status_pesanan` - Status change logs

**Default Data:**
- 1 Admin user: `username: admin`, `password: admin123`
- 9 Jenis pakaian (Kemeja Pria/Wanita, Gamis, Kebaya, Celana, Rok, Seragam)
- Template ukuran untuk Kemeja Pria, Gamis, Celana

---

## 🎯 Next Steps

Setelah database setup sukses:
1. ✅ Test backend server: `npm run dev`
2. ✅ Test API endpoint di browser: `http://localhost:5000`
3. ✅ Lanjut development API routes

---

**Need Help?** Tanya saya jika ada error! 🚀
