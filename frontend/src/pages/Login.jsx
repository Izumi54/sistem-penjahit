import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const { login, isLoading, error, clearError } = useAuthStore()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        clearError()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = await login(formData.username, formData.password)

        if (result.success) {
            navigate('/dashboard')
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="card login-card">
                    <div className="login-header">
                        <h1 className="login-title">Sistem Jasa Penjahit</h1>
                        <p className="login-subtitle">Silakan login untuk melanjutkan</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="alert alert-error">
                                <span className="alert-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                placeholder="Masukkan username"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="Masukkan password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={isLoading}
                        >
                            {isLoading ? '⏳ Loading...' : '🔐 Login'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="text-sm text-muted">
                            Demo: username: <code>admin</code>, password: <code>admin123</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
