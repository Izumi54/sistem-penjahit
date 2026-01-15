import { useState, useEffect } from 'react'
import './ModalUkuran.css'

function ModalUkuran({ pelanggan, onClose }) {
    const [ukuran, setUkuran] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUkuran = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`/api/pelanggan/${pelanggan.idPelanggan}/ukuran`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (!response.ok) throw new Error('Gagal mengambil data')

                const data = await response.json()
                setUkuran(data.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUkuran()
    }, [pelanggan.idPelanggan])

    return (
        <div className="modal-overlay-ukuran" onClick={onClose}>
            <div className="modal-content-ukuran" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-ukuran">
                    <h3>📏 Data Ukuran - {pelanggan.namaLengkap}</h3>
                    <button onClick={onClose} className="btn-close-ukuran">✕</button>
                </div>

                <div className="modal-body-ukuran">
                    {loading ? (
                        <div className="loading-ukuran">
                            <div className="spinner"></div>
                            <p>Loading ukuran...</p>
                        </div>
                    ) : error ? (
                        <div className="error-ukuran">
                            <p>{error}</p>
                        </div>
                    ) : ukuran.length === 0 ? (
                        <div className="empty-ukuran">
                            <p>Belum ada data ukuran untuk pelanggan ini</p>
                        </div>
                    ) : (
                        <div className="ukuran-list">
                            {ukuran.map((item) => (
                                <div key={item.idUkuran} className="ukuran-card">
                                    <div className="ukuran-header">
                                        <span className="jenis-badge">{item.jenisPakaian.namaJenis}</span>
                                        <span className="ukuran-date">
                                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="ukuran-grid">
                                        {item.lingkarDada && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Lingkar Dada:</span>
                                                <span className="ukuran-value">{item.lingkarDada} cm</span>
                                            </div>
                                        )}
                                        {item.panjangBaju && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Panjang Baju:</span>
                                                <span className="ukuran-value">{item.panjangBaju} cm</span>
                                            </div>
                                        )}
                                        {item.lingkarPinggang && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Lingkar Pinggang:</span>
                                                <span className="ukuran-value">{item.lingkarPinggang} cm</span>
                                            </div>
                                        )}
                                        {item.panjangLengan && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Panjang Lengan:</span>
                                                <span className="ukuran-value">{item.panjangLengan} cm</span>
                                            </div>
                                        )}
                                        {item.lingkarLeher && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Lingkar Leher:</span>
                                                <span className="ukuran-value">{item.lingkarLeher} cm</span>
                                            </div>
                                        )}
                                        {item.lingkarPinggul && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Lingkar Pinggul:</span>
                                                <span className="ukuran-value">{item.lingkarPinggul} cm</span>
                                            </div>
                                        )}
                                        {item.panjangCelana && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Panjang Celana:</span>
                                                <span className="ukuran-value">{item.panjangCelana} cm</span>
                                            </div>
                                        )}
                                        {item.lingkarPaha && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Lingkar Paha:</span>
                                                <span className="ukuran-value">{item.lingkarPaha} cm</span>
                                            </div>
                                        )}
                                        {item.lingkarBetis && (
                                            <div className="ukuran-item">
                                                <span className="ukuran-label">Lingkar Betis:</span>
                                                <span className="ukuran-value">{item.lingkarBetis} cm</span>
                                            </div>
                                        )}
                                    </div>
                                    {item.catatan && (
                                        <div className="ukuran-note">
                                            <strong>Catatan:</strong> {item.catatan}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalUkuran
