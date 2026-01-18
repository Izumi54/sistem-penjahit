import { useState, useEffect } from 'react'
import { pelangganService } from '../services/pelangganService'
import FormPelanggan from '../components/pelanggan/FormPelanggan'
import ModalUkuran from '../components/pelanggan/ModalUkuran'
import './Pelanggan.css'

function Pelanggan() {
    const [pelanggan, setPelanggan] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Pagination & search
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [search, setSearch] = useState('')
    const [gender, setGender] = useState('')
    const [sortBy, setSortBy] = useState('terbaru') // NEW: Sort filter

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [editData, setEditData] = useState(null)
    const [showUkuranModal, setShowUkuranModal] = useState(false)
    const [selectedPelanggan, setSelectedPelanggan] = useState(null)

    const ITEMS_PER_PAGE = 10

    // Fetch pelanggan
    const fetchPelanggan = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await pelangganService.getAll({
                page,
                limit: ITEMS_PER_PAGE,
                search,
                gender,
                sortBy, // Send sortBy to backend
            })

            setPelanggan(data.data)
            setTotalPages(data.pagination.totalPages)
            setTotalItems(data.pagination.total)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data pelanggan')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPelanggan()
    }, [page, search, gender, sortBy]) // Added sortBy dependency

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1) // Reset to first page
    }

    const handleFilterGender = (e) => {
        setGender(e.target.value)
        setPage(1)
    }

    const handleSortChange = (e) => {
        setSortBy(e.target.value)
        setPage(1)
    }

    const handleAdd = () => {
        setEditData(null)
        setShowModal(true)
    }

    const handleEdit = (item) => {
        setEditData(item)
        setShowModal(true)
    }

    const handleDelete = async (id, nama) => {
        if (!confirm(`Yakin ingin menghapus pelanggan "${nama}"?`)) {
            return
        }

        try {
            await pelangganService.delete(id)
            fetchPelanggan() // Refresh list
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal menghapus pelanggan')
        }
    }

    const handleFormSuccess = () => {
        setShowModal(false)
        fetchPelanggan() // Refresh list
    }

    const handleViewUkuran = (item) => {
        setSelectedPelanggan(item)
        setShowUkuranModal(true)
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    // Pagination helper
    const startIndex = (page - 1) * ITEMS_PER_PAGE + 1
    const endIndex = Math.min(page * ITEMS_PER_PAGE, totalItems)

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            if (page > 3) {
                pages.push('...')
            }

            // Show current page and neighbors
            const start = Math.max(2, page - 1)
            const end = Math.min(totalPages - 1, page + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (page < totalPages - 2) {
                pages.push('...')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="pelanggan-wireframe">
            <div className="container">
                {/* Header */}
                <div className="page-header-wireframe">
                    <div>
                        <h1 className="page-title-wireframe">Data Pelanggan</h1>
                    </div>
                    <button onClick={handleAdd} className="btn-add-wireframe">
                        ➕ Tambah Pelanggan Baru
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="search-filter-wireframe">
                    <div className="search-box-wireframe">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Cari nama, no WA..."
                            className="search-input-wireframe"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>

                    <select
                        className="filter-select-wireframe"
                        value={gender}
                        onChange={handleFilterGender}
                    >
                        <option value="">Jenis Kelamin: Semua</option>
                        <option value="L">Jenis Kelamin: Laki-laki</option>
                        <option value="P">Jenis Kelamin: Perempuan</option>
                    </select>

                    <select
                        className="filter-select-wireframe"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="terbaru">Urutan: Terbaru</option>
                        <option value="terlama">Urutan: Terlama</option>
                        <option value="nama-az">Urutan: Nama A-Z</option>
                        <option value="nama-za">Urutan: Nama Z-A</option>
                    </select>
                </div>

                {/* Table Card */}
                <div className="table-card-wireframe">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading data pelanggan...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={fetchPelanggan} className="btn-retry">
                                🔄 Coba Lagi
                            </button>
                        </div>
                    ) : pelanggan.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                {search || gender
                                    ? 'Tidak ada pelanggan yang sesuai filter'
                                    : 'Belum ada data pelanggan'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="table-wrapper-wireframe">
                                <table className="table-wireframe">
                                    <thead>
                                        <tr>
                                            <th>Kode</th>
                                            <th>Nama Lengkap</th>
                                            <th>Jenis Kelamin</th>
                                            <th>No. WhatsApp</th>
                                            <th>Total Pesanan</th>
                                            <th>Terdaftar</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pelanggan.map((item) => (
                                            <tr key={item.idPelanggan}>
                                                <td data-label="Kode">
                                                    <span className="kode-badge">{item.idPelanggan}</span>
                                                </td>
                                                <td data-label="Nama Lengkap" className="nama-cell mobile-header-content">{item.namaLengkap}</td>
                                                <td data-label="Jenis Kelamin">
                                                    <span
                                                        className={`gender-badge ${item.jenisKelamin === 'L'
                                                            ? 'gender-badge-male'
                                                            : 'gender-badge-female'
                                                            }`}
                                                    >
                                                        {item.jenisKelamin}
                                                    </span>
                                                </td>
                                                <td data-label="WhatsApp">{item.noWa}</td>
                                                <td data-label="Total Pesanan">
                                                    <span className="pesanan-count">
                                                        {item._count?.pesanan || 0}x
                                                    </span>
                                                </td>
                                                <td data-label="Terdaftar" className="date-cell">{formatDate(item.createdAt)}</td>
                                                <td data-label="Aksi">
                                                    <div className="action-buttons-wireframe">
                                                        <button
                                                            onClick={() => handleViewUkuran(item)}
                                                            className="action-btn action-btn-view"
                                                            title="Lihat Ukuran"
                                                            style={{background: '#e0f2fe', color: '#0284c7'}} // Explicit style for view button
                                                        >
                                                            📏
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="action-btn action-btn-edit"
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(item.idPelanggan, item.namaLengkap)
                                                            }
                                                            className="action-btn action-btn-delete"
                                                            title="Hapus"
                                                        >
                                                            🗑️
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

            {/* Modal Ukuran */}
            {showUkuranModal && selectedPelanggan && (
                <ModalUkuran
                    pelanggan={selectedPelanggan}
                    onClose={() => setShowUkuranModal(false)}
                />
            )}

            {/* Modal Form */}
            {showModal && (
                <FormPelanggan
                    editData={editData}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    )
}

export default Pelanggan
