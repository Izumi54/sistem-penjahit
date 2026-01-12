import { useState, useEffect } from 'react'
import { jenisPakaianService } from '../services/jenisPakaianService'
import FormJenisPakaian from '../components/jenisPakaian/FormJenisPakaian'
import './JenisPakaian.css'

function JenisPakaian() {
    const [jenisPakaian, setJenisPakaian] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [editData, setEditData] = useState(null)

    // Fetch data
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await jenisPakaianService.getAll()
            setJenisPakaian(data.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAdd = () => {
        setEditData(null)
        setShowModal(true)
    }

    const handleEdit = (item) => {
        setEditData(item)
        setShowModal(true)
    }

    const handleDelete = async (id, nama) => {
        if (!confirm(`Yakin ingin menghapus jenis pakaian "${nama}"?`)) {
            return
        }

        try {
            await jenisPakaianService.delete(id)
            fetchData()
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal menghapus data')
        }
    }

    const handleFormSuccess = () => {
        setShowModal(false)
        fetchData()
    }

    return (
        <div className="jenis-pakaian-page">
            <div className="page-header">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="page-title">Kelola Jenis Pakaian</h1>
                            <p className="page-subtitle">
                                Master data jenis pakaian dan template ukuran
                            </p>
                        </div>
                        <button onClick={handleAdd} className="btn btn-primary">
                            ➕ Tambah Jenis Pakaian
                        </button>
                    </div>
                </div>
            </div>

            <div className="container page-content">
                <div className="card">
                    {loading ? (
                        <div className="text-center p-xl">
                            <div className="spinner"></div>
                            <p className="text-muted mt-md">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error">{error}</div>
                    ) : jenisPakaian.length === 0 ? (
                        <div className="text-center p-xl">
                            <p className="text-muted">
                                Belum ada data jenis pakaian. Tambah data pertama Anda!
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nama Jenis</th>
                                        <th>Keterangan</th>
                                        <th>Template Ukuran</th>
                                        <th>Digunakan</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jenisPakaian.map((item) => (
                                        <tr key={item.idJenis}>
                                            <td>
                                                <span className="badge badge-info">{item.idJenis}</span>
                                            </td>
                                            <td className="font-semibold">{item.namaJenis}</td>
                                            <td>{item.keterangan || '-'}</td>
                                            <td>{item._count?.templateUkuran || 0} ukuran</td>
                                            <td>{item._count?.ukuranPelanggan || 0} data</td>
                                            <td>
                                                <div className="flex gap-sm">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="btn btn-sm btn-secondary"
                                                        title="Edit & Atur Template"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item.idJenis, item.namaJenis)
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
                    )}
                </div>
            </div>

            {showModal && (
                <FormJenisPakaian
                    editData={editData}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    )
}

export default JenisPakaian
