import { verifyToken } from '../utils/jwt.js'

/**
 * Middleware untuk verify JWT token
 */
export const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
            })
        }

        const token = authHeader.substring(7) // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token)

        if (!decoded) {
            return res.status(401).json({
                error: 'Token tidak valid atau sudah expired. Silakan login kembali.',
            })
        }

        // Set user info ke request object
        req.user = {
            idUser: decoded.idUser,
            username: decoded.username,
        }

        // Continue to next middleware/controller
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat verifikasi token',
        })
    }
}
