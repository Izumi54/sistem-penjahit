import express from 'express'
import * as authController from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// Public routes (no auth required)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

// Protected routes (auth required)
router.get('/me', authMiddleware, authController.me)

export default router
