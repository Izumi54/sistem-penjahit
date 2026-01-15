import express from 'express'
import * as tambahanBahanController from '../controllers/tambahanBahanController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()
router.use(authMiddleware)

router.post('/', tambahanBahanController.createTambahanBahan)
router.get('/detail/:idDetail', tambahanBahanController.getTambahanByDetail)
router.delete('/:id', tambahanBahanController.deleteTambahanBahan)

export default router