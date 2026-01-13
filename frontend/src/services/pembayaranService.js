import api from './api'

/**
 * Pembayaran API Service
 */
export const pembayaranService = {
    /**
     * Input pembayaran baru
     */
    create: async (noNota, data) => {
        const response = await api.post(`/pesanan/${noNota}/pembayaran`, data)
        return response.data
    },

    /**
     * Get history pembayaran
     */
    getHistory: async (noNota) => {
        const response = await api.get(`/pesanan/${noNota}/pembayaran`)
        return response.data
    },
}
