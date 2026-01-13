import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import pelangganRoutes from './routes/pelangganRoutes.js'
import jenisPakaianRoutes from './routes/jenisPakaianRoutes.js'
import pesananRoutes from './routes/pesananRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Sistem Penjahit API Server',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/pelanggan', pelangganRoutes)
app.use('/api/jenis-pakaian', jenisPakaianRoutes)
app.use('/api/pesanan', pesananRoutes)
app.use('/api/analytics', analyticsRoutes)

// API routes will be mounted here
app.get('/api', (req, res) => {
    res.json({
        message: 'API v1',
        endpoints: {
            auth: '/api/auth',
            pelanggan: '/api/pelanggan',
            jenisPakaian: '/api/jenis-pakaian',
            pesanan: '/api/pesanan',
            pembayaran: '/api/pembayaran',
            dashboard: '/api/dashboard',
        },
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err)
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})

export default app
