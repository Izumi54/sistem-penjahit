import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import './Header.css'

function Header() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    return (
        <header className="app-header">
            <div className="header-content">
                <div className="header-brand">
                    <span className="brand-icon">✂️</span>
                    <span className="brand-text">Sistem Penjahit</span>
                </div>

                <nav className="header-nav">
                    <Link
                        to="/dashboard"
                        className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/pelanggan"
                        className={`nav-link ${isActive('/pelanggan') ? 'active' : ''}`}
                    >
                        Pelanggan
                    </Link>
                    <Link
                        to="/pesanan"
                        className={`nav-link ${location.pathname === '/pesanan' ? 'active' : ''}`}
                    >
                        Pesanan
                    </Link>
                    <Link
                        to="/jenis-pakaian"
                        className={`nav-link ${isActive('/jenis-pakaian') ? 'active' : ''}`}
                    >
                        Jenis Pakaian
                    </Link>
                    <Link
                        to="/pesanan/baru"
                        className="nav-link nav-link-primary"
                    >
                        ➕ Input Pesanan Baru
                    </Link>
                </nav>

                <div className="header-actions">
                    <button onClick={handleLogout} className="logout-btn">
                        Logout →
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
