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
                        <strong>🚧 Coming Soon:</strong> Dashboard analytics, kelola pelanggan, input pesanan, dan fitur lainnya akan segera hadir!
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
