import { create } from 'zustand'
import { authService } from '../services/authService'

const useAuthStore = create((set) => ({
    // State
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    login: async (username, password) => {
        set({ isLoading: true, error: null })
        try {
            const response = await authService.login(username, password)
            const { user, token } = response.data

            // Save to localStorage
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            // Update state
            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            })

            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login gagal'
            set({
                error: errorMessage,
                isLoading: false,
            })
            return { success: false, error: errorMessage }
        }
    },

    logout: () => {
        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Clear state
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        })

        // Call backend logout (optional - JWT is stateless)
        authService.logout().catch(() => {
            // Ignore error - already logged out locally
        })
    },

    // Initialize from localStorage (on app load)
    initAuth: () => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr)
                set({
                    user,
                    token,
                    isAuthenticated: true,
                })
            } catch (error) {
                // Invalid data - clear
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
    },

    clearError: () => set({ error: null }),
}))

export default useAuthStore
