import api from './api'

/**
 * Pelanggan API Service
 */
export const pelangganService = {
    /**
     * Get all pelanggan with pagination, search, filter
     */
    getAll: async (params = {}) => {
        const response = await api.get('/pelanggan', { params })
        return response.data
    },

    /**
     * Get single pelanggan by ID
     */
    getById: async (id) => {
        const response = await api.get(`/pelanggan/${id}`)
        return response.data
    },

    /**
     * Create new pelanggan
     */
    create: async (data) => {
        const response = await api.post('/pelanggan', data)
        return response.data
    },

    /**
     * Update pelanggan
     */
    update: async (id, data) => {
        const response = await api.put(`/pelanggan/${id}`, data)
        return response.data
    },

    /**
     * Delete pelanggan
     */
    delete: async (id) => {
        const response = await api.delete(`/pelanggan/${id}`)
        return response.data
    },

    /**
     * Get ukuran pelanggan by jenis
     */
    getUkuran: async (id, idJenis) => {
        const response = await api.get(`/pelanggan/${id}/ukuran/${idJenis}`)
        return response.data
    },

    /**
     * Save ukuran pelanggan
     */
    saveUkuran: async (id, data) => {
        const response = await api.post(`/pelanggan/${id}/ukuran`, data)
        return response.data
    },
}
