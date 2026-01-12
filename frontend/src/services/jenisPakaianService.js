import api from './api'

/**
 * Jenis Pakaian API Service
 */
export const jenisPakaianService = {
    /**
     * Get all jenis pakaian
     */
    getAll: async () => {
        const response = await api.get('/jenis-pakaian')
        return response.data
    },

    /**
     * Get single jenis pakaian with templates
     */
    getById: async (id) => {
        const response = await api.get(`/jenis-pakaian/${id}`)
        return response.data
    },

    /**
     * Create new jenis pakaian
     */
    create: async (data) => {
        const response = await api.post('/jenis-pakaian', data)
        return response.data
    },

    /**
     * Update jenis pakaian
     */
    update: async (id, data) => {
        const response = await api.put(`/jenis-pakaian/${id}`, data)
        return response.data
    },

    /**
     * Delete jenis pakaian
     */
    delete: async (id) => {
        const response = await api.delete(`/jenis-pakaian/${id}`)
        return response.data
    },

    /**
     * Get template ukuran
     */
    getTemplate: async (id) => {
        const response = await api.get(`/jenis-pakaian/${id}/template`)
        return response.data
    },

    /**
     * Save template ukuran
     */
    saveTemplate: async (id, templates) => {
        const response = await api.post(`/jenis-pakaian/${id}/template`, {
            templates,
        })
        return response.data
    },
}
