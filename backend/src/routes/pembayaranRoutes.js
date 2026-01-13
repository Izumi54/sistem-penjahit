import express from 'express'
import * as pembayaranController from '../controllers/pembayaranController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router({ mergeParams: true })

// Protect all routes
router.use(authMiddleware)

// Pembayaran routes (nested under pesanan)
// These will be mounted at /api/pesanan/:noNota/pembayaran
router.post('/', pembayaranController.inputPembayaran)
router.get('/', pembayaranController.getPembayaranHistory)

export default router
