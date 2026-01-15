import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { pesananService } from '../services/pesananService'
import { pembayaranService } from '../services/pembayaranService'
import './DetailPesanan.css'

const STATUS_OPTIONS = ['ANTRI', 'POTONG', 'JAHIT', 'SELESAI', 'DIAMBIL', 'BATAL']

function DetailPesanan() {
    const { noNota } = useParams()
    const navigate = useNavigate()
    const [pesanan, setPesanan] = useState(null)
    const [pembayaranList, setPembayaranList] = useState([])
    const [pembayaranSummary, setPembayaranSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Modal states
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [catatan, setCatatan] = useState('')
    const [updating, setUpdating] = useState(false)

    const [showPembayaranModal, setShowPembayaranModal] = useState(false)
    const [jumlahBayar, setJumlahBayar] = useState('')
    const [metodeBayar, setMetodeBayar] = useState('TUNAI')
    const [keteranganBayar, setKeteranganBayar] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [pesananData, pembayaranData] = await Promise.all([
                pesananService.getById(noNota),
                pembayaranService.getHistory(noNota),
            ])
            setPesanan(pesananData.data)
            setNewStatus(pesananData.data.statusPesanan)
            setPembayaranList(pembayaranData.data)
            setPembayaranSummary(pembayaranData.summary)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [noNota])

    const handleUpdateStatus = async () => {
        if (newStatus === pesanan.statusPesanan) {
            setShowStatusModal(false)
            return
        }

        setUpdating(true)
        try {
            await pesananService.updateStatus(noNota, {
                statusBaru: newStatus,
                catatanPerubahan: catatan,
            })
            setShowStatusModal(false)
            setCatatan('')
            fetchData()
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal update status')
        } finally {
            setUpdating(false)
        }
    }

    const handleInputPembayaran = async () => {
        if (!jumlahBayar || jumlahBayar <= 0) {
            alert('Jumlah bayar harus diisi dan lebih dari 0')
            return
        }

        setSubmitting(true)
        try {
            await pembayaranService.create(noNota, {
                jumlahBayar: parseInt(jumlahBayar),
                metodeBayar,
                keterangan: keteranganBayar,
            })
            setShowPembayaranModal(false)
            setJumlahBayar('')
            setMetodeBayar('TUNAI')
            setKeteranganBayar('')
            fetchData()
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal mencatat pembayaran')
        } finally {
            setSubmitting(false)
        }
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

    const formatDateTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
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

    // Generate full nota for WhatsApp
    const generateNota = () => {
        let nota = `*NOTA PESANAN*\n`
        nota += `No Nota: *${pesanan.noNota}*\n`
        nota += `Tanggal: ${formatDate(pesanan.tglMasuk)}\n\n`

        nota += `*PELANGGAN*\n`
        nota += `Nama: ${pesanan.pelanggan.namaLengkap}\n`
        nota += `No WA: ${pesanan.pelanggan.noWa}\n`
        if (pesanan.pelanggan.alamat) {
            nota += `Alamat: ${pesanan.pelanggan.alamat}\n`
        }
        nota += `\n`

        nota += `*DETAIL PESANAN*\n`
        pesanan.detailPesanan.forEach((item, idx) => {
            nota += `${idx + 1}. ${item.jenisPakaian.namaJenis} - ${item.namaItem}\n`
            nota += `   Model: ${item.model || '-'}\n`
            nota += `   Qty: ${item.qty} pcs\n`
            nota += `   Harga: ${formatCurrency(item.harga)}\n`
            nota += `   Subtotal: ${formatCurrency(item.subtotal)}\n`
            nota += `\n`
        })

        nota += `*TOTAL BIAYA: ${formatCurrency(pesanan.totalBiaya)}*\n\n`

        nota += `*PEMBAYARAN*\n`
        nota += `Total Terbayar: ${formatCurrency(pembayaranSummary?.totalTerbayar || 0)}\n`
        nota += `Sisa Bayar: ${formatCurrency(pesanan.sisaBayar)}\n`
        if (pesanan.sisaBayar > 0) {
            nota += `⚠️ _Mohon segera melunasi sisanya_\n`
        } else {
            nota += `✅ _Sudah Lunas_\n`
        }
        nota += `\n`

        nota += `*STATUS PESANAN*\n`
        nota += `Status: *${pesanan.statusPesanan}*\n`
        nota += `Tanggal Janji Selesai: ${formatDate(pesanan.tglJanjiSelesai)}\n\n`

        nota += `Terima kasih telah mempercayai jasa kami! 🙏\n`
        nota += `_Jika ada pertanyaan silakan hubungi kami._`

        return nota
    }

    const handleSendWhatsApp = () => {
        const message = generateNota()
        const encoded = encodeURIComponent(message)
        const url = `https://wa.me/${pesanan.pelanggan.noWa}?text=${encoded}`
        window.open(url, '_blank')
    }

    if (loading) {
        return (
            <div className="detail-pesanan-wireframe">
                <div className="container">
                    <div className="loading-state-detail">
                        <div className="spinner"></div>
                        <p>Loading data pesanan...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !pesanan) {
        return (
            <div className="detail-pesanan-wireframe">
                <div className="container">
                    <div className="error-state-detail">
                        <p>{error || 'Pesanan tidak ditemukan'}</p>
                        <button onClick={() => navigate('/pesanan')} className="btn-back">
                            ← Kembali ke List Pesanan
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="detail-pesanan-wireframe">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb-wireframe">
                    <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/pesanan" className="breadcrumb-link">Pesanan</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{noNota}</span>
                </div>

                {/* Page Header */}
                <div className="page-header-detail">
                    <div className="header-left">
                        <h1 className="page-title-detail">Pesanan {noNota}</h1>
                        <span className={`status-badge ${getStatusBadgeClass(pesanan.statusPesanan)}`}>
                            {pesanan.statusPesanan}
                        </span>
                    </div>
                    <div className="header-actions">
                        {pesanan.statusPesanan === 'ANTRI' && (
                            <button
                                onClick={() => navigate(`/pesanan/edit/${noNota}`)}
                                className="btn-action btn-edit"
                                title="Edit Pesanan"
                            >
                                ✏️ Edit
                            </button>
                        )}
                        <button
                            onClick={handleSendWhatsApp}
                            className="btn-action btn-whatsapp"
                            title="Kirim Nota via WhatsApp"
                        >
                            📱 WhatsApp
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="btn-action btn-print"
                            title="Print Nota"
                        >
                            🖨️ Print
                        </button>
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="btn-update-status"
                        >
                            🔄 Update Status
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="detail-content">
                    {/* Informasi Pelanggan */}
                    <div className="card-section">
                        <div className="section-header">
                            <span className="section-icon">👤</span>
                            <h3 className="section-title">Informasi Pelanggan</h3>
                        </div>
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="info-label">Nama:</span>
                                <span className="info-value">{pesanan.pelanggan.namaLengkap}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">No. WA:</span>
                                <span className="info-value">
                                    <a href={`https://wa.me/${pesanan.pelanggan.noWa}`} target="_blank" rel="noopener noreferrer" className="wa-link">
                                        {pesanan.pelanggan.noWa}
                                    </a>
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{pesanan.pelanggan.email || '-'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Alamat:</span>
                                <span className="info-value">{pesanan.pelanggan.alamat || '-'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tgl Masuk:</span>
                                <span className="info-value">{formatDate(pesanan.tglMasuk)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tgl Janji Selesai:</span>
                                <span className="info-value">{formatDate(pesanan.tglJanjiSelesai)}</span>
                            </div>              </div>
                    </div>

                    {/* Detail Pesanan */}
                    <div className="card-section">
                        <div className="section-header">
                            <span className="section-icon">📦</span>
                            <h3 className="section-title">Detail Pesanan</h3>
                        </div>
                        <div className="table-wrapper-detail">
                            <table className="table-detail">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Jenis</th>
                                        <th>Nama Item</th>
                                        <th>Model</th>
                                        <th>Qty</th>
                                        <th>Harga</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pesanan.detailPesanan.map((item, index) => (
                                        <tr key={item.idDetail}>
                                            <td>{index + 1}</td>
                                            <td>{item.jenisPakaian.namaJenis}</td>
                                            <td>{item.namaItem}</td>
                                            <td>{item.model || '-'}</td>
                                            <td>{item.qty}</td>
                                            <td>{formatCurrency(item.harga)}</td>
                                            <td className="subtotal-cell">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="6" className="total-label">Total Biaya</td>
                                        <td className="total-value">{formatCurrency(pesanan.totalBiaya)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Pembayaran */}
                    <div className="card-section">
                        <div className="section-header">
                            <span className="section-icon">💰</span>
                            <h3 className="section-title">Pembayaran</h3>
                        </div>

                        <div className="pembayaran-summary">
                            <div className="summary-row">
                                <span>Total Biaya:</span>
                                <span>{formatCurrency(pembayaranSummary?.totalBiaya || pesanan.totalBiaya)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Total Terbayar:</span>
                                <span>{formatCurrency(pembayaranSummary?.totalTerbayar || 0)}</span>
                            </div>
                            <div className="summary-row sisa-bayar-row">
                                <span>Sisa Bayar:</span>
                                <span className={pesanan.sisaBayar > 0 ? 'sisa-bayar-pending-detail' : 'sisa-bayar-lunas-detail'}>
                                    {formatCurrency(pesanan.sisaBayar)}
                                </span>
                            </div>
                        </div>

                        {pembayaranList.length > 0 && (
                            <>
                                <h4 className="subsection-title">History Pembayaran</h4>
                                <div className="pembayaran-timeline">
                                    {pembayaranList.map((bayar) => (
                                        <div key={bayar.idBayar} className="timeline-item">
                                            <div className="timeline-marker success">✓</div>
                                            <div className="timeline-content">
                                                <div className="timeline-amount">{formatCurrency(bayar.nominal)}</div>
                                                <div className="timeline-meta">
                                                    {bayar.metodeBayar} • {formatDateTime(bayar.createdAt)}
                                                </div>
                                                {bayar.catatan && (
                                                    <div className="timeline-note">{bayar.catatan}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => setShowPembayaranModal(true)}
                            className="btn-input-payment"
                            disabled={pesanan.sisaBayar <= 0}
                        >
                            ➕ Input Pembayaran
                        </button>
                    </div>

                    {/* Foto Referensi - Placeholder */}
                    <div className="card-section">
                        <div className="section-header">
                            <span className="section-icon">📸</span>
                            <h3 className="section-title">Foto Referensi</h3>
                        </div>
                        <div className="foto-placeholder">
                            <div className="placeholder-icon">📸</div>
                            <p>Fitur foto referensi akan segera hadir</p>
                            <small>Upload foto model pakaian untuk referensi penjahit</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Update Status Pesanan</h3>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Status Baru:</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="input-wireframe"
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Catatan:</label>
                                <textarea
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                    className="input-wireframe"
                                    rows="3"
                                    placeholder="Tambah catatan (opsional)"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="btn-cancel"
                                disabled={updating}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="btn-confirm"
                                disabled={updating}
                            >
                                {updating ? 'Loading...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pembayaran Modal */}
            {showPembayaranModal && (
                <div className="modal-overlay" onClick={() => setShowPembayaranModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Input Pembayaran</h3>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Jumlah Bayar:</label>
                                <input
                                    type="number"
                                    value={jumlahBayar}
                                    onChange={(e) => setJumlahBayar(e.target.value)}
                                    className="input-wireframe"
                                    placeholder="Masukkan jumlah"
                                />
                            </div>
                            <div className="form-group">
                                <label>Metode Bayar:</label>
                                <select
                                    value={metodeBayar}
                                    onChange={(e) => setMetodeBayar(e.target.value)}
                                    className="input-wireframe"
                                >
                                    <option value="TUNAI">Tunai</option>
                                    <option value="TRANSFER">Transfer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Keterangan:</label>
                                <textarea
                                    value={keteranganBayar}
                                    onChange={(e) => setKeteranganBayar(e.target.value)}
                                    className="input-wireframe"
                                    rows="2"
                                    placeholder="Catatan (opsional)"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowPembayaranModal(false)}
                                className="btn-cancel"
                                disabled={submitting}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleInputPembayaran}
                                className="btn-confirm"
                                disabled={submitting}
                            >
                                {submitting ? 'Loading...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DetailPesanan
