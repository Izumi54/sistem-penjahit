import express from 'express'
import * as pesananController from '../controllers/pesananController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Pesanan CRUD
router.get('/', pesananController.getAllPesanan)
router.get('/:noNota', pesananController.getPesananById)
router.post('/', pesananController.createPesanan)
router.patch('/:noNota/status', pesananController.updatePesananStatus)
router.delete('/:noNota', pesananController.deletePesanan)

// History
router.get('/:noNota/history', pesananController.getHistoryStatus)

export default router
