import { NavLink, useLocation } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
    const location = useLocation()
    
    // Hide bottom nav on specific pages if needed (e.g., login, full screen wizard)
    // But for now, let's keep it consistent
    if (location.pathname === '/login') return null

    return (
        <nav className="bottom-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Home</span>
            </NavLink>
            
            <NavLink to="/pesanan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <span className="nav-icon">📋</span>
                <span className="nav-label">Pesanan</span>
            </NavLink>

            <NavLink to="/pesanan/baru" className="nav-item nav-fab">
                <span className="fab-icon">➕</span>
            </NavLink>

            <NavLink to="/pelanggan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">👥</span>
                <span className="nav-label">Pelanggan</span>
            </NavLink>

            <NavLink to="/jenis-pakaian" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">👕</span>
                <span className="nav-label">Jenis</span>
            </NavLink>
        </nav>
    )
}

export default BottomNav
