import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import ProtectedRoute from './components/common/ProtectedRoute'
import Header from './components/Header'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pelanggan from './pages/Pelanggan'
import JenisPakaian from './pages/JenisPakaian'
import Pesanan from './pages/Pesanan'
import InputPesanan from './pages/InputPesanan'
import DetailPesanan from './pages/DetailPesanan'
import './App.css'
import BottomNav from './components/BottomNav'

// Layout wrapper for protected pages
const AppLayout = ({ children }) => (
    <ProtectedRoute>
        <>
            <Header />
            <main className="app-main">
                {children}
            </main>
            <BottomNav />
        </>
    </ProtectedRoute>
)

function App() {
    const { isAuthenticated, initAuth } = useAuthStore()

    // Initialize auth from localStorage on app load
    useEffect(() => {
        initAuth()
    }, [initAuth])

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                    }
                />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    }
                />
                <Route
                    path="/pelanggan"
                    element={
                        <AppLayout>
                            <Pelanggan />
                        </AppLayout>
                    }
                />
                <Route
                    path="/jenis-pakaian"
                    element={
                        <AppLayout>
                            <JenisPakaian />
                        </AppLayout>
                    }
                />
                <Route
                    path="/pesanan"
                    element={
                        <AppLayout>
                            <Pesanan />
                        </AppLayout>
                    }
                />
                <Route
                    path="/pesanan/baru"
                    element={
                        <AppLayout>
                            <InputPesanan />
                        </AppLayout>
                    }
                />
                <Route
                    path="/pesanan/:noNota"
                    element={
                        <AppLayout>
                            <DetailPesanan />
                        </AppLayout>
                    }
                />

                {/* Default redirect */}
                <Route
                    path="/"
                    element={
                        <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
                    }
                />

                {/* 404 - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
