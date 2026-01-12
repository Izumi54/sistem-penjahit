import bcrypt from 'bcryptjs'
import prisma from '../config/database.js'
import { generateToken } from '../utils/jwt.js'

/**
 * Login admin user
 */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                error: 'Username dan password harus diisi',
            })
        }

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                idUser: true,
                username: true,
                password: true,
                namaLengkap: true,
                fotoProfil: true,
            },
        })

        if (!user) {
            return res.status(401).json({
                error: 'Username atau password salah',
            })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Username atau password salah',
            })
        }

        // Generate JWT token
        const token = generateToken({
            idUser: user.idUser,
            username: user.username,
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        // Success response
        res.json({
            message: 'Login berhasil',
            data: {
                user: userWithoutPassword,
                token,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat login',
        })
    }
}

/**
 * Get current user info (from token)
 */
export const me = async (req, res) => {
    try {
        // req.user sudah di-set oleh auth middleware
        const user = await prisma.user.findUnique({
            where: { idUser: req.user.idUser },
            select: {
                idUser: true,
                username: true,
                namaLengkap: true,
                fotoProfil: true,
                createdAt: true,
            },
        })

        if (!user) {
            return res.status(404).json({
                error: 'User tidak ditemukan',
            })
        }

        res.json({
            data: user,
        })
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil data user',
        })
    }
}

/**
 * Logout (client-side only - hapus token)
 */
export const logout = (req, res) => {
    // JWT stateless, jadi logout dilakukan di client (hapus token dari localStorage)
    res.json({
        message: 'Logout berhasil',
    })
}
