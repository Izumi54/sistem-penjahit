-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "foto_profil" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "pelanggan" (
    "id_pelanggan" VARCHAR(10) NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "jenis_kelamin" VARCHAR(1) NOT NULL,
    "no_wa" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100),
    "alamat" TEXT,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pelanggan_pkey" PRIMARY KEY ("id_pelanggan")
);

-- CreateTable
CREATE TABLE "jenis_pakaian" (
    "id_jenis" VARCHAR(10) NOT NULL,
    "nama_jenis" VARCHAR(50) NOT NULL,
    "kategori" VARCHAR(20) NOT NULL,
    "untuk_gender" VARCHAR(10) NOT NULL,
    "harga_mulai_dari" INTEGER,
    "deskripsi" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jenis_pakaian_pkey" PRIMARY KEY ("id_jenis")
);

-- CreateTable
CREATE TABLE "template_ukuran" (
    "id_template" SERIAL NOT NULL,
    "id_jenis" VARCHAR(10) NOT NULL,
    "nama_ukuran" VARCHAR(50) NOT NULL,
    "kode_ukuran" VARCHAR(10) NOT NULL,
    "satuan" VARCHAR(10) NOT NULL DEFAULT 'cm',
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL,

    CONSTRAINT "template_ukuran_pkey" PRIMARY KEY ("id_template")
);

-- CreateTable
CREATE TABLE "ukuran_pelanggan" (
    "id_ukuran" SERIAL NOT NULL,
    "id_pelanggan" VARCHAR(10) NOT NULL,
    "id_jenis" VARCHAR(10) NOT NULL,
    "kode_ukuran" VARCHAR(10) NOT NULL,
    "nilai" DECIMAL(5,2) NOT NULL,
    "catatan" TEXT,
    "tanggal_ukur" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ukuran_pelanggan_pkey" PRIMARY KEY ("id_ukuran")
);

-- CreateTable
CREATE TABLE "history_ukuran" (
    "id_history" SERIAL NOT NULL,
    "id_pelanggan" VARCHAR(10) NOT NULL,
    "id_jenis" VARCHAR(10) NOT NULL,
    "kode_ukuran" VARCHAR(10) NOT NULL,
    "nilai_lama" DECIMAL(5,2),
    "nilai_baru" DECIMAL(5,2) NOT NULL,
    "tanggal_ubah" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT,

    CONSTRAINT "history_ukuran_pkey" PRIMARY KEY ("id_history")
);

-- CreateTable
CREATE TABLE "pesanan" (
    "no_nota" VARCHAR(20) NOT NULL,
    "id_pelanggan" VARCHAR(10) NOT NULL,
    "id_user" INTEGER NOT NULL,
    "tgl_masuk" DATE NOT NULL,
    "tgl_janji_selesai" DATE NOT NULL,
    "tgl_selesai_aktual" DATE,
    "total_biaya" INTEGER NOT NULL DEFAULT 0,
    "total_dp" INTEGER NOT NULL DEFAULT 0,
    "sisa_bayar" INTEGER NOT NULL DEFAULT 0,
    "status_pesanan" VARCHAR(20) NOT NULL,
    "catatan_pesanan" TEXT,
    "notif_wa_sent" BOOLEAN NOT NULL DEFAULT false,
    "notif_wa_date" TIMESTAMP(3),
    "last_reminder_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("no_nota")
);

-- CreateTable
CREATE TABLE "detail_pesanan" (
    "id_detail" SERIAL NOT NULL,
    "no_nota" VARCHAR(20) NOT NULL,
    "id_jenis" VARCHAR(10) NOT NULL,
    "nama_item" VARCHAR(100) NOT NULL,
    "model_spesifik" TEXT,
    "jumlah_pcs" INTEGER NOT NULL DEFAULT 1,
    "harga_satuan" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "catatan_penjahit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detail_pesanan_pkey" PRIMARY KEY ("id_detail")
);

-- CreateTable
CREATE TABLE "tambahan_bahan" (
    "id_tambahan" TEXT NOT NULL,
    "id_detail" INTEGER NOT NULL,
    "nama_bahan" VARCHAR(100) NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "harga" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tambahan_bahan_pkey" PRIMARY KEY ("id_tambahan")
);

-- CreateTable
CREATE TABLE "foto_referensi" (
    "id_foto" SERIAL NOT NULL,
    "id_detail" INTEGER NOT NULL,
    "path_foto" TEXT NOT NULL,
    "keterangan" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foto_referensi_pkey" PRIMARY KEY ("id_foto")
);

-- CreateTable
CREATE TABLE "pembayaran" (
    "id_bayar" SERIAL NOT NULL,
    "no_nota" VARCHAR(20) NOT NULL,
    "tgl_bayar" DATE NOT NULL,
    "nominal" INTEGER NOT NULL,
    "jenis_bayar" VARCHAR(10) NOT NULL,
    "metode_bayar" VARCHAR(20) NOT NULL,
    "bukti_transfer" TEXT,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id_bayar")
);

-- CreateTable
CREATE TABLE "history_status_pesanan" (
    "id_history" SERIAL NOT NULL,
    "no_nota" VARCHAR(20) NOT NULL,
    "status_lama" VARCHAR(20),
    "status_baru" VARCHAR(20) NOT NULL,
    "id_user" INTEGER NOT NULL,
    "catatan_perubahan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_status_pesanan_pkey" PRIMARY KEY ("id_history")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "template_ukuran_id_jenis_idx" ON "template_ukuran"("id_jenis");

-- CreateIndex
CREATE INDEX "ukuran_pelanggan_id_pelanggan_id_jenis_idx" ON "ukuran_pelanggan"("id_pelanggan", "id_jenis");

-- CreateIndex
CREATE UNIQUE INDEX "ukuran_pelanggan_id_pelanggan_id_jenis_kode_ukuran_key" ON "ukuran_pelanggan"("id_pelanggan", "id_jenis", "kode_ukuran");

-- CreateIndex
CREATE INDEX "history_ukuran_id_pelanggan_id_jenis_idx" ON "history_ukuran"("id_pelanggan", "id_jenis");

-- CreateIndex
CREATE INDEX "pesanan_id_pelanggan_idx" ON "pesanan"("id_pelanggan");

-- CreateIndex
CREATE INDEX "pesanan_status_pesanan_idx" ON "pesanan"("status_pesanan");

-- CreateIndex
CREATE INDEX "pesanan_tgl_janji_selesai_idx" ON "pesanan"("tgl_janji_selesai");

-- CreateIndex
CREATE INDEX "detail_pesanan_no_nota_idx" ON "detail_pesanan"("no_nota");

-- CreateIndex
CREATE INDEX "tambahan_bahan_id_detail_idx" ON "tambahan_bahan"("id_detail");

-- CreateIndex
CREATE INDEX "foto_referensi_id_detail_idx" ON "foto_referensi"("id_detail");

-- CreateIndex
CREATE INDEX "pembayaran_no_nota_idx" ON "pembayaran"("no_nota");

-- CreateIndex
CREATE INDEX "history_status_pesanan_no_nota_idx" ON "history_status_pesanan"("no_nota");

-- AddForeignKey
ALTER TABLE "template_ukuran" ADD CONSTRAINT "template_ukuran_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "jenis_pakaian"("id_jenis") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ukuran_pelanggan" ADD CONSTRAINT "ukuran_pelanggan_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "pelanggan"("id_pelanggan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ukuran_pelanggan" ADD CONSTRAINT "ukuran_pelanggan_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "jenis_pakaian"("id_jenis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_ukuran" ADD CONSTRAINT "history_ukuran_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "pelanggan"("id_pelanggan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_ukuran" ADD CONSTRAINT "history_ukuran_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "jenis_pakaian"("id_jenis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "pelanggan"("id_pelanggan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pesanan" ADD CONSTRAINT "detail_pesanan_no_nota_fkey" FOREIGN KEY ("no_nota") REFERENCES "pesanan"("no_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pesanan" ADD CONSTRAINT "detail_pesanan_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "jenis_pakaian"("id_jenis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tambahan_bahan" ADD CONSTRAINT "tambahan_bahan_id_detail_fkey" FOREIGN KEY ("id_detail") REFERENCES "detail_pesanan"("id_detail") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_referensi" ADD CONSTRAINT "foto_referensi_id_detail_fkey" FOREIGN KEY ("id_detail") REFERENCES "detail_pesanan"("id_detail") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_no_nota_fkey" FOREIGN KEY ("no_nota") REFERENCES "pesanan"("no_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_status_pesanan" ADD CONSTRAINT "history_status_pesanan_no_nota_fkey" FOREIGN KEY ("no_nota") REFERENCES "pesanan"("no_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_status_pesanan" ADD CONSTRAINT "history_status_pesanan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
