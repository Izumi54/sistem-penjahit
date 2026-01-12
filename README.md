# Sistem Jasa Penjahit

Website manajemen jasa penjahit dengan fitur lengkap untuk operasional harian.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 + Vite 5
- **State Management**: Zustand
- **Styling**: Vanilla CSS (Glassmorphism design)
- **Charts**: Chart.js
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Google Drive API

## 📁 Project Structure

```
sistem-penjahit/
├── frontend/          # React + Vite application
├── backend/           # Express API server
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 16 installed (or Railway account)
- Google Cloud account (untuk Google Drive API)

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials Anda
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env dengan API URL
npm run dev
```

## 📦 Features

### Phase 1 - MVP (Current)
- ✅ Authentication (JWT)
- ✅ Master Data Pelanggan (CRUD + ukuran dinamis)
- ✅ Master Data Jenis Pakaian (admin bisa tambah sendiri)
- ✅ Input Pesanan (Wizard 4 step + upload foto)
- ✅ Kelola Pesanan (list, detail, update status)
- ✅ Pembayaran (DP, cicilan, lunas)
- ✅ Dashboard Analytics (cards + charts)
- ✅ Laporan Bulanan
- ✅ Reminder WhatsApp

### Phase 2 - Enhancement (Future)
- [ ] WhatsApp API otomatis
- [ ] Multi-user & roles
- [ ] Backup & restore database
- [ ] PWA (Progressive Web App)

## 🌐 Deployment

- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway PostgreSQL

## 📄 License

Private project - All rights reserved

---

**Developed with ❤️ for usaha penjahit**
