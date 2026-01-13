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

    // Update status state
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [catatan, setCatatan] = useState('')
    const [updating, setUpdating] = useState(false)

    // Pembayaran state
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
            fetchData() // Reload data
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
            fetchData() // Reload data
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal mencatat pembayaran')
        } finally {
            setSubmitting(false)
        }
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

    if (loading) {
        return (
            <div className="detail-pesanan-page">
                <div className="container">
                    <div className="text-center p-xl">
                        <div className="spinner"></div>
                        <p className="text-muted mt-md">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !pesanan) {
        return (
            <div className="detail-pesanan-page">
                <div className="container">
                    <div className="alert alert-error">{error || 'Pesanan tidak ditemukan'}</div>
                    <Link to="/pesanan" className="btn btn-secondary mt-md">
                        ← Kembali ke List
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="detail-pesanan-page">
            {/* Header */}
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link to="/dashboard">Dashboard</Link> / <Link to="/pesanan">Pesanan</Link> / {noNota}
                    </div>
                    <div className="flex justify-between items-center mt-sm">
                        <div>
                            <h1 className="page-title">Pesanan {noNota}</h1>
                            <span className={`badge ${getStatusBadgeClass(pesanan.statusPesanan)}`}>
                                {pesanan.statusPesanan}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="btn btn-primary"
                        >
                            🔄 Update Status
                        </button>
                    </div>
                </div>
            </div>

            <div className="container page-content">
                {/* Pelanggan Info */}
                <div className="card">
                    <h2 className="section-title">👤 Informasi Pelanggan</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Nama:</span>
                            <span className="info-value">{pesanan.pelanggan.namaLengkap}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">No. WA:</span>
                            <span className="info-value">{pesanan.pelanggan.noWa}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tgl Masuk:</span>
                            <span className="info-value">
                                {new Date(pesanan.tglMasuk).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tgl Janji Selesai:</span>
                            <span className="info-value">
                                {new Date(pesanan.tglJanjiSelesai).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Detail Items */}
                <div className="card mt-md">
                    <h2 className="section-title">📦 Detail Pesanan</h2>
                    <div className="table-responsive">
                        <table className="table">
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
                                        <td className="font-semibold">{item.namaItem}</td>
                                        <td>{item.modelSpesifik || '-'}</td>
                                        <td>{item.jumlahPcs}</td>
                                        <td>Rp {item.hargaSatuan.toLocaleString('id-ID')}</td>
                                        <td>Rp {item.subtotal.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="6">Total Biaya</th>
                                    <th>Rp {pesanan.totalBiaya.toLocaleString('id-ID')}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Pembayaran */}
                <div className="card mt-md">
                    <div className="flex justify-between items-center mb-md">
                        <h2 className="section-title">💰 Pembayaran</h2>
                        {pembayaranSummary && pembayaranSummary.sisaBayar > 0 && (
                            <button
                                onClick={() => setShowPembayaranModal(true)}
                                className="btn btn-primary btn-sm"
                            >
                                ➕ Input Pembayaran
                            </button>
                        )}
                    </div>

                    <div className="payment-summary">
                        <div className="payment-row">
                            <span>Total Biaya:</span>
                            <span>
                                Rp {pembayaranSummary ? pembayaranSummary.totalBiaya.toLocaleString('id-ID') : '0'}
                            </span>
                        </div>
                        <div className="payment-row">
                            <span>Total Terbayar:</span>
                            <span>
                                Rp {pembayaranSummary ? pembayaranSummary.totalPaid.toLocaleString('id-ID') : '0'}
                            </span>
                        </div>
                        <div className="payment-row total">
                            <span>Sisa Bayar:</span>
                            <span
                                className={
                                    pembayaranSummary && pembayaranSummary.sisaBayar > 0
                                        ? 'text-error'
                                        : 'text-success'
                                }
                            >
                                Rp {pembayaranSummary ? pembayaranSummary.sisaBayar.toLocaleString('id-ID') : '0'}
                            </span>
                        </div>
                    </div>

                    {pembayaranList && pembayaranList.length > 0 && (
                        <>
                            <h3 className="subsection-title">History Pembayaran</h3>
                            <div className="payment-history">
                                {pembayaranList.map((p) => (
                                    <div key={p.idBayar} className="payment-item">
                                        <div className="payment-marker"></div>
                                        <div className="payment-content">
                                            <div className="payment-header">
                                                <span className="payment-amount">
                                                    Rp {p.nominal.toLocaleString('id-ID')}
                                                </span>
                                                <span className="payment-method">
                                                    {p.jenisBayar} - {p.metodeBayar}
                                                </span>
                                            </div>
                                            <div className="payment-date">
                                                {new Date(p.tglBayar).toLocaleString('id-ID')}
                                            </div>
                                            {p.catatan && (
                                                <div className="payment-note">{p.catatan}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* History Status */}
                <div className="card mt-md">
                    <h2 className="section-title">📝 History Status</h2>
                    <div className="history-timeline">
                        {pesanan.historyStatus.map((h) => (
                            <div key={h.idHistory} className="history-item">
                                <div className="history-marker"></div>
                                <div className="history-content">
                                    <div className="history-header">
                                        <span className={`badge ${getStatusBadgeClass(h.statusBaru)}`}>
                                            {h.statusBaru}
                                        </span>
                                        <span className="text-sm text-muted">
                                            {new Date(h.createdAt).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    {h.catatanPerubahan && (
                                        <div className="history-note">{h.catatanPerubahan}</div>
                                    )}
                                    <div className="history-user">oleh {h.user.namaLengkap}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="actions-footer mt-lg">
                    <Link to="/pesanan" className="btn btn-secondary">
                        ← Kembali ke List
                    </Link>
                </div>
            </div>

            {/* Update Status Modal */}
            {showStatusModal && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">🔄 Update Status Pesanan</h2>
                            <button onClick={() => setShowStatusModal(false)} className="modal-close">
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label required">Status Baru</label>
                                <select
                                    className="input"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Catatan (Opsional)</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    placeholder="Catatan perubahan status"
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="btn btn-secondary"
                                disabled={updating}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="btn btn-primary"
                                disabled={updating}
                            >
                                {updating ? '⏳ Updating...' : '💾 Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Pembayaran Modal */}
            {showPembayaranModal && (
                <div className="modal-overlay" onClick={() => setShowPembayaranModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">💰 Input Pembayaran</h2>
                            <button onClick={() => setShowPembayaranModal(false)} className="modal-close">
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            {pembayaranSummary && (
                                <div className="alert alert-info mb-md">
                                    Sisa Bayar: <strong>Rp {pembayaranSummary.sisaBayar.toLocaleString('id-ID')}</strong>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label required">Jumlah Bayar</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Masukkan jumlah"
                                    value={jumlahBayar}
                                    onChange={(e) => setJumlahBayar(e.target.value)}
                                    max={pembayaranSummary ? pembayaranSummary.sisaBayar : undefined}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Metode Bayar</label>
                                <select
                                    className="input"
                                    value={metodeBayar}
                                    onChange={(e) => setMetodeBayar(e.target.value)}
                                >
                                    <option value="TUNAI">Tunai</option>
                                    <option value="TRANSFER">Transfer</option>
                                    <option value="QRIS">QRIS</option>
                                    <option value="LAINNYA">Lainnya</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Keterangan (Opsional)</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    placeholder="Catatan pembayaran (misal: Cicilan ke-1)"
                                    value={keteranganBayar}
                                    onChange={(e) => setKeteranganBayar(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => setShowPembayaranModal(false)}
                                className="btn btn-secondary"
                                disabled={submitting}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleInputPembayaran}
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? '⏳ Menyimpan...' : '💾 Simpan Pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DetailPesanan
