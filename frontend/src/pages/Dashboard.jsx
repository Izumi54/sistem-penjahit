import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import './Dashboard.css'

function Dashboard() {
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="dashboard-title">Dashboard</h1>
                            <p className="dashboard-subtitle">
                                Welcome back, {user?.namaLengkap || user?.username}!
                            </p>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card">
                    <h2>✅ Login Berhasil!</h2>
                    <p>Anda telah berhasil login ke sistem.</p>

                    <div className="user-info">
                        <h3>Informasi User:</h3>
                        <ul>
                            <li><strong>ID:</strong> {user?.idUser}</li>
                            <li><strong>Username:</strong> {user?.username}</li>
                            <li><strong>Nama Lengkap:</strong> {user?.namaLengkap}</li>
                        </ul>
                    </div>

                    <div className="alert alert-info mt-lg">
                        <strong>🚀 Quick Links:</strong>
                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Link to="/pelanggan" className="btn btn-sm btn-primary">
                                👥 Kelola Pelanggan
                            </Link>
                            <Link to="/jenis-pakaian" className="btn btn-sm btn-primary">
                                👔 Jenis Pakaian
                            </Link>
                            <Link to="/pesanan" className="btn btn-sm btn-primary">
                                📦 List Pesanan
                            </Link>
                            <Link to="/pesanan/baru" className="btn btn-sm btn-success">
                                ➕ Input Pesanan Baru
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
