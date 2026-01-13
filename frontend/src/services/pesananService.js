import api from './api'

/**
 * Pesanan API Service
 */
export const pesananService = {
    /**
     * Get all pesanan with pagination, search, filter
     */
    getAll: async (params = {}) => {
        const response = await api.get('/pesanan', { params })
        return response.data
    },

    /**
     * Get single pesanan by noNota
     */
    getById: async (noNota) => {
        const response = await api.get(`/pesanan/${noNota}`)
        return response.data
    },

    /**
     * Create new pesanan
     */
    create: async (data) => {
        const response = await api.post('/pesanan', data)
        return response.data
    },

    /**
     * Update pesanan status
     */
    updateStatus: async (noNota, data) => {
        const response = await api.patch(`/pesanan/${noNota}/status`, data)
        return response.data
    },

    /**
     * Delete pesanan
     */
    delete: async (noNota) => {
        const response = await api.delete(`/pesanan/${noNota}`)
        return response.data
    },

    /**
     * Get history status
     */
    getHistory: async (noNota) => {
        const response = await api.get(`/pesanan/${noNota}/history`)
        return response.data
    },
}
