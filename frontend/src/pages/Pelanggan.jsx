import { useState, useEffect } from 'react'
import { pelangganService } from '../services/pelangganService'
import FormPelanggan from '../components/pelanggan/FormPelanggan'
import './Pelanggan.css'

function Pelanggan() {
    const [pelanggan, setPelanggan] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Pagination & search
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [gender, setGender] = useState('')

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [editData, setEditData] = useState(null)

    // Fetch pelanggan
    const fetchPelanggan = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await pelangganService.getAll({
                page,
                limit: 10,
                search,
                gender,
            })
            setPelanggan(data.data)
            setTotalPages(data.pagination.totalPages)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data pelanggan')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPelanggan()
    }, [page, search, gender])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1) // Reset to first page
    }

    const handleFilterGender = (e) => {
        setGender(e.target.value)
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

    return (
        <div className="pelanggan-page">
            {/* Header */}
            <div className="page-header">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="page-title">Kelola Pelanggan</h1>
                            <p className="page-subtitle">
                                Manajemen data pelanggan dan ukuran
                            </p>
                        </div>
                        <button onClick={handleAdd} className="btn btn-primary">
                            ➕ Tambah Pelanggan
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container page-content">
                {/* Search & Filter */}
                <div className="card mb-lg">
                    <div className="search-filter-bar">
                        <input
                            type="text"
                            placeholder="🔍 Cari nama, nomor WA, atau email..."
                            className="input search-input"
                            value={search}
                            onChange={handleSearch}
                        />
                        <select
                            className="input"
                            value={gender}
                            onChange={handleFilterGender}
                        >
                            <option value="">Semua Gender</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="card">
                    {loading ? (
                        <div className="text-center p-xl">
                            <div className="spinner"></div>
                            <p className="text-muted mt-md">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    ) : pelanggan.length === 0 ? (
                        <div className="text-center p-xl">
                            <p className="text-muted">
                                {search || gender
                                    ? 'Tidak ada pelanggan yang sesuai filter'
                                    : 'Belum ada data pelanggan. Tambah pelanggan pertama Anda!'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Kode</th>
                                            <th>Nama Lengkap</th>
                                            <th>Gender</th>
                                            <th>No. WA</th>
                                            <th>Email</th>
                                            <th>Pesanan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pelanggan.map((item) => (
                                            <tr key={item.idPelanggan}>
                                                <td>
                                                    <span className="badge badge-info">
                                                        {item.idPelanggan}
                                                    </span>
                                                </td>
                                                <td className="font-semibold">{item.namaLengkap}</td>
                                                <td>
                                                    <span className="badge">
                                                        {item.jenisKelamin === 'L' ? '👨 L' : '👩 P'}
                                                    </span>
                                                </td>
                                                <td>{item.noWa}</td>
                                                <td>{item.email || '-'}</td>
                                                <td>{item._count?.pesanan || 0}</td>
                                                <td>
                                                    <div className="flex gap-sm">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="btn btn-sm btn-secondary"
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(item.idPelanggan, item.namaLengkap)
                                                            }
                                                            className="btn btn-sm btn-error"
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
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        ← Prev
                                    </button>
                                    <span className="pagination-info">
                                        Halaman {page} dari {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

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
