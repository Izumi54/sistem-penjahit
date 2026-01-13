import api from './api'

/**
 * Analytics API Service
 */
export const analyticsService = {
    /**
     * Get overview metrics
     */
    getOverview: async (params = {}) => {
        const response = await api.get('/analytics/overview', { params })
        return response.data
    },

    /**
     * Get status distribution for donut chart
     */
    getStatusDistribution: async () => {
        const response = await api.get('/analytics/charts/status-distribution')
        return response.data
    },

    /**
     * Get revenue monthly for bar chart
     */
    getRevenueMonthly: async (months = 6) => {
        const response = await api.get('/analytics/charts/revenue-monthly', {
            params: { months },
        })
        return response.data
    },

    /**
     * Get trend daily for line chart
     */
    getTrendDaily: async (days = 30) => {
        const response = await api.get('/analytics/charts/trend-daily', {
            params: { days },
        })
        return response.data
    },
}
