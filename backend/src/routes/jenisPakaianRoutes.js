import express from 'express'
import * as jenisPakaianController from '../controllers/jenisPakaianController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Jenis Pakaian CRUD
router.get('/', jenisPakaianController.getAllJenisPakaian)
router.get('/:id', jenisPakaianController.getJenisPakaianById)
router.post('/', jenisPakaianController.createJenisPakaian)
router.put('/:id', jenisPakaianController.updateJenisPakaian)
router.delete('/:id', jenisPakaianController.deleteJenisPakaian)

// Template Ukuran
router.get('/:id/template', jenisPakaianController.getTemplateUkuran)
router.post('/:id/template', jenisPakaianController.saveTemplateUkuran)

export default router
