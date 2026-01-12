# 🧪 Testing API Authentication

Panduan lengkap untuk test API authentication

---

## 🛠️ Tools untuk Testing API

### **Opsi 1: Browser Langsung** (untuk GET requests)
Buka browser, ketik URL di address bar

### **Opsi 2: Thunder Client** (VSCode Extension) ⭐ REKOMENDASI
1. Install extension "Thunder Client" di VSCode
2. Click icon petir ⚡ di sidebar
3. New Request → Isi URL, method, body
4. Send

### **Opsi 3: Postman** (Desktop App)
Download di https://postman.com

### **Opsi 4: curl** (Command Line)
Via terminal CMD

---

## 📝 Test Endpoints

### **1. Test Root Endpoint** (Health Check)

**URL**: `http://localhost:5000/`  
**Method**: GET  
**Browser**: Buka langsung di browser

**Expected Response**:
```json
{
  "message": "🚀 Sistem Penjahit API Server",
  "status": "running",
  "version": "1.0.0",
  "timestamp": "2026-01-12T10:50:00.000Z"
}
```

---

### **2. Test API Info**

**URL**: `http://localhost:5000/api`  
**Method**: GET  
**Browser**: Buka langsung

**Expected Response**:
```json
{
  "message": "API v1",
  "endpoints": {
    "auth": "/api/auth",
    ...
  }
}
```

---

### **3. Test Login** ✅

**URL**: `http://localhost:5000/api/auth/login`  
**Method**: POST  
**Headers**: `Content-Type: application/json`

**Body (JSON)**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Thunder Client Steps**:
1. New Request
2. Method: POST
3. URL: `http://localhost:5000/api/auth/login`
4. Tab "Body" → JSON
5. Paste JSON di atas
6. Click "Send"

**Expected Success Response** (200):
```json
{
  "message": "Login berhasil",
  "data": {
    "user": {
      "idUser": 1,
      "username": "admin",
      "namaLengkap": "Administrator",
      "fotoProfil": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Expected Error (wrong password)** (401):
```json
{
  "error": "Username atau password salah"
}
```

**IMPORTANT**: **Copy token** dari response untuk test endpoint berikutnya!

---

### **4. Test Get Current User** (Protected Route) 🔒

**URL**: `http://localhost:5000/api/auth/me`  
**Method**: GET  
**Headers**: 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Thunder Client Steps**:
1. New Request
2. Method: GET
3. URL: `http://localhost:5000/api/auth/me`
4. Tab "Headers"
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (paste token dari login)
6. Click "Send"

**Expected Success Response** (200):
```json
{
  "data": {
    "idUser": 1,
    "username": "admin",
    "namaLengkap": "Administrator",
    "fotoProfil": null,
    "createdAt": "2026-01-12T10:00:00.000Z"
  }
}
```

**Expected Error (no token)** (401):
```json
{
  "error": "Token tidak ditemukan. Silakan login terlebih dahulu."
}
```
7
**Expected Error (invalid token)** (401):
```json
{
  "error": "Token tidak valid atau sudah expired. Silakan login kembali."
}
```

---

### **5. Test Logout**

**URL**: `http://localhost:5000/api/auth/logout`  
**Method**: POST

**Expected Response** (200):
```json
{
  "message": "Logout berhasil"
}
```

**Note**: Logout bersifat client-side (hapus token di localStorage frontend). Server tidak menyimpan token (stateless JWT).

---

## 🐛 Troubleshooting

### Error: "Cannot POST /api/auth/login"
- ✅ Pastikan server sudah running (`npm run dev`)
- ✅ Restart server setelah edit code
- ✅ Cek typo di URL

### Error: "Route not found"
- ✅ Auth routes belum termount di server.js
- ✅ Check `app.use('/api/auth', authRoutes)` ada
- ✅ Restart server

### Error: "Unexpected token" (saat test login)
- ✅ Pastikan Body type: JSON (bukan Text)
- ✅ Pastikan JSON valid (no trailing comma, quotes benar)

### Error 500 "Internal server error"
- ✅ Check terminal backend untuk error message detail
- ✅ Cek DATABASE_URL di .env sudah benar
- ✅ Pastikan Prisma client sudah generated (`npx prisma generate`)

---

## ✅ Success Checklist

Authentication API berhasil jika:
- [x] Server running tanpa error
- [ ] GET `/api` → return list endpoints
- [ ] POST `/api/auth/login` dengan credentials benar → return token
- [ ] POST `/api/auth/login` dengan credentials salah → return error 401
- [ ] GET `/api/auth/me` tanpa token → return error 401
- [ ] GET `/api/auth/me` dengan token valid → return user data
- [ ] POST `/api/auth/logout` → return success message

---

**Setelah semua test pass, lanjut ke Frontend Login Page! 🎨**
