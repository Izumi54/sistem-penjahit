import express from 'express'
import * as analyticsController from '../controllers/analyticsController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// Protect all analytics routes
router.use(authMiddleware)

// Overview metrics
router.get('/overview', analyticsController.getOverview)

// Chart data
router.get('/charts/status-distribution', analyticsController.getStatusDistribution)
router.get('/charts/revenue-monthly', analyticsController.getRevenueMonthly)
router.get('/charts/trend-daily', analyticsController.getTrendDaily)

export default router
