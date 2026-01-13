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
                        <ProtectedRoute>
                            <>
                                <Header />
                                <Dashboard />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pelanggan"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <Pelanggan />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jenis-pakaian"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <JenisPakaian />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pesanan"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <Pesanan />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pesanan/baru"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <InputPesanan />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pesanan/:noNota"
                    element={
                        <ProtectedRoute>
                            <>
                                <Header />
                                <DetailPesanan />
                            </>
                        </ProtectedRoute>
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
