import { useState } from 'react'
import './App.css'

function App() {
    return (
        <div className="app">
            <div className="container">
                <div className="card card-center">
                    <h1 className="text-gradient">Sistem Jasa Penjahit</h1>
                    <p className="text-muted">Setup berhasil! Frontend siap dikembangkan 🚀</p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="icon">✅</span>
                            <span>React 18 + Vite</span>
                        </div>
                        <div className="feature-item">
                            <span className="icon">✅</span>
                            <span>Zustand State Management</span>
                        </div>
                        <div className="feature-item">
                            <span className="icon">✅</span>
                            <span>Axios HTTP Client</span>
                        </div>
                        <div className="feature-item">
                            <span className="icon">✅</span>
                            <span>Chart.js Analytics</span>
                        </div>
                    </div>

                    <div className="alert alert-info">
                        <strong>Next Step:</strong> Setup backend (Express + PostgreSQL)
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
