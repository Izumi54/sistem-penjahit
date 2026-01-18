import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pesananService } from '../services/pesananService'
import './Pesanan.css'

const STATUS_OPTIONS = [
    { value: '', label: 'Semua Status' },
    { value: 'ANTRI', label: 'Antri', color: 'gray' },
    { value: 'POTONG', label: 'Potong', color: 'blue' },
    { value: 'JAHIT', label: 'Jahit', color: 'yellow' },
    { value: 'SELESAI', label: 'Selesai', color: 'green' },
    { value: 'DIAMBIL', label: 'Diambil', color: 'teal' },
    { value: 'BATAL', label: 'Batal', color: 'red' },
]

function Pesanan() {
    const navigate = useNavigate()
    const [pesanan, setPesanan] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Filters
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [sortBy, setSortBy] = useState('terbaru')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const ITEMS_PER_PAGE = 10

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = {
                page,
                limit: ITEMS_PER_PAGE,
                search,
                status,
                sortBy
            }
            const data = await pesananService.getAll(params)
            setPesanan(data.data)
            setTotalPages(data.pagination.totalPages)
            setTotalItems(data.pagination.total)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, search, status, sortBy])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleStatusFilter = (e) => {
        setStatus(e.target.value)
        setPage(1)
    }

    const handleSortChange = (e) => {
        setSortBy(e.target.value)
        setPage(1)
    }

    const getStatusBadgeClass = (status) => {
        const map = {
            ANTRI: 'status-badge-gray',
            POTONG: 'status-badge-blue',
            JAHIT: 'status-badge-yellow',
            SELESAI: 'status-badge-green',
            DIAMBIL: 'status-badge-teal',
            BATAL: 'status-badge-red',
        }
        return map[status] || 'status-badge-gray'
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    // Pagination helpers
    const startIndex = (page - 1) * ITEMS_PER_PAGE + 1
    const endIndex = Math.min(page * ITEMS_PER_PAGE, totalItems)

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            if (page > 3) pages.push('...')

            const start = Math.max(2, page - 1)
            const end = Math.min(totalPages - 1, page + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (page < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="pesanan-wireframe">
            <div className="container">
                {/* Header */}
                <div className="page-header-wireframe">
                    <div>
                        <h1 className="page-title-wireframe">Kelola Pesanan</h1>
                    </div>
                    <button
                        onClick={() => navigate('/pesanan/baru')}
                        className="btn-add-wireframe"
                    >
                        ➕ Buat Pesanan Baru
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="search-filter-wireframe">
                    <div className="search-box-wireframe">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Cari no nota, nama pelanggan..."
                            className="search-input-wireframe"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>

                    <select
                        className="filter-select-wireframe"
                        value={status}
                        onChange={handleStatusFilter}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.value ? `Status: ${opt.label}` : 'Status: Semua'}
                            </option>
                        ))}
                    </select>

                    <select
                        className="filter-select-wireframe"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="terbaru">Urutan: Terbaru</option>
                        <option value="terlama">Urutan: Terlama</option>
                        <option value="total-tinggi">Urutan: Total Tertinggi</option>
                        <option value="total-rendah">Urutan: Total Terendah</option>
                    </select>
                </div>

                {/* Table Card */}
                <div className="table-card-wireframe">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading data pesanan...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={fetchData} className="btn-retry">
                                🔄 Coba Lagi
                            </button>
                        </div>
                    ) : pesanan.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                {search || status
                                    ? 'Tidak ada pesanan yang sesuai filter'
                                    : 'Belum ada data pesanan'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="table-wrapper-wireframe">
                                <table className="table-wireframe">
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
                                                className="clickable-row-wireframe"
                                                onClick={() => navigate(`/pesanan/${p.noNota}`)}
                                            >
                                                <td data-label="No Nota" className="mobile-header-content">
                                                    <span className="nota-badge">{p.noNota}</span>
                                                </td>
                                                <td data-label="Pelanggan" className="nama-cell">{p.pelanggan.namaLengkap}</td>
                                                <td data-label="Tgl Masuk" className="date-cell">{formatDate(p.tglMasuk)}</td>
                                                <td data-label="Tgl Selesai" className="date-cell">{formatDate(p.tglJanjiSelesai)}</td>
                                                <td data-label="Status">
                                                    <span className={`status-badge ${getStatusBadgeClass(p.statusPesanan)}`}>
                                                        {p.statusPesanan}
                                                    </span>
                                                </td>
                                                <td data-label="Total" className="currency-cell">{formatCurrency(p.totalBiaya)}</td>
                                                <td data-label="Sisa Bayar">
                                                    <span className={p.sisaBayar > 0 ? 'sisa-bayar-pending' : 'sisa-bayar-lunas'}>
                                                        {formatCurrency(p.sisaBayar)}
                                                    </span>
                                                </td>
                                                <td data-label="Aksi">
                                                    <div className="action-buttons-wireframe">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                navigate(`/pesanan/${p.noNota}`)
                                                            }}
                                                            className="action-btn action-btn-view"
                                                            title="Detail"
                                                        >
                                                            👁️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="pagination-wireframe">
                                <div className="pagination-info-wireframe">
                                    Showing {startIndex}-{endIndex} of {totalItems}
                                </div>

                                <div className="pagination-controls">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="page-btn page-btn-nav"
                                    >
                                        ‹
                                    </button>

                                    {getPageNumbers().map((pageNum, idx) =>
                                        pageNum === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="page-ellipsis">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`page-btn ${page === pageNum ? 'page-btn-active' : ''
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="page-btn page-btn-nav"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Pesanan
