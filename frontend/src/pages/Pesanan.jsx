import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pesananService } from '../services/pesananService'
import './Pesanan.css'

const STATUS_OPTIONS = [
    { value: '', label: 'Semua Status' },
    { value: 'ANTRI', label: '🕐 Antri' },
    { value: 'POTONG', label: '✂️ Potong' },
    { value: 'JAHIT', label: '🧵 Jahit' },
    { value: 'SELESAI', label: '✅ Selesai' },
    { value: 'DIAMBIL', label: '📦 Diambil' },
    { value: 'BATAL', label: '❌ Batal' },
]

function Pesanan() {
    const navigate = useNavigate()
    const [pesanan, setPesanan] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Filters
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({})

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = { page, limit: 10, search, status }
            const data = await pesananService.getAll(params)
            setPesanan(data.data)
            setPagination(data.pagination)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, search, status])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleStatusFilter = (e) => {
        setStatus(e.target.value)
        setPage(1)
    }

    const getStatusBadgeClass = (status) => {
        const map = {
            ANTRI: 'badge-default',
            POTONG: 'badge-info',
            JAHIT: 'badge-warning',
            SELESAI: 'badge-success',
            DIAMBIL: 'badge-success-dark',
            BATAL: 'badge-error',
        }
        return map[status] || 'badge-default'
    }

    return (
        <div className="pesanan-page">
            <div className="page-header">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="page-title">📦 Kelola Pesanan</h1>
                            <p className="page-subtitle">Daftar semua pesanan</p>
                        </div>
                        <Link to="/pesanan/baru" className="btn btn-success">
                            ➕ Buat Pesanan Baru
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container page-content">
                <div className="card">
                    {/* Filters */}
                    <div className="filters">
                        <div className="filter-group">
                            <input
                                type="text"
                                className="input search-input"
                                placeholder="🔍 Cari no nota atau nama pelanggan..."
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="filter-group">
                            <select className="input" value={status} onChange={handleStatusFilter}>
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="text-center p-xl">
                            <div className="spinner"></div>
                            <p className="text-muted mt-md">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error">{error}</div>
                    ) : pesanan.length === 0 ? (
                        <div className="text-center p-xl">
                            <p className="text-muted">Tidak ada pesanan ditemukan</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No Nota</th>
                                            <th>Pelanggan</th>
                                            <th>Tgl Masuk</th>
                                            <th>Tgl Selesai</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Sisa Bayar</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pesanan.map((p) => (
                                            <tr
                                                key={p.noNota}
                                                className="clickable-row"
                                                onClick={() => navigate(`/pesanan/${p.noNota}`)}
                                            >
                                                <td>
                                                    <span className="badge badge-info">{p.noNota}</span>
                                                </td>
                                                <td className="font-semibold">{p.pelanggan.namaLengkap}</td>
                                                <td>{new Date(p.tglMasuk).toLocaleDateString('id-ID')}</td>
                                                <td>{new Date(p.tglJanjiSelesai).toLocaleDateString('id-ID')}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(p.statusPesanan)}`}>
                                                        {p.statusPesanan}
                                                    </span>
                                                </td>
                                                <td>Rp {p.totalBiaya.toLocaleString('id-ID')}</td>
                                                <td>
                                                    <span className={p.sisaBayar > 0 ? 'text-error font-semibold' : 'text-success'}>
                                                        Rp {p.sisaBayar.toLocaleString('id-ID')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigate(`/pesanan/${p.noNota}`)
                                                        }}
                                                    >
                                                        Detail →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        ← Prev
                                    </button>
                                    <span className="pagination-info">
                                        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                                    </span>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === pagination.totalPages}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Pesanan
