import express from 'express'
import * as pelangganController from '../controllers/pelangganController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// All pelanggan routes require authentication
router.use(authMiddleware)

// Pelanggan CRUD
router.get('/', pelangganController.getAllPelanggan)
router.get('/:id', pelangganController.getPelangganById)
router.post('/', pelangganController.createPelanggan)
router.put('/:id', pelangganController.updatePelanggan)
router.delete('/:id', pelangganController.deletePelanggan)

// Ukuran pelanggan
router.get('/:id/ukuran/:idJenis', pelangganController.getUkuranPelanggan)
router.post('/:id/ukuran', pelangganController.saveUkuranPelanggan)

export default router
