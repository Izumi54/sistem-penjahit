import api from './api'

/**
 * Auth API Service
 */
export const authService = {
    /**
     * Login user
     */
    login: async (username, password) => {
        const response = await api.post('/auth/login', {
            username,
            password,
        })
        return response.data
    },

    /**
     * Logout user
     */
    logout: async () => {
        const response = await api.post('/auth/logout')
        return response.data
    },

    /**
     * Get current user info
     */
    me: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },
}
