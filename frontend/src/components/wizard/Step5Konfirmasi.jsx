import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Step5Konfirmasi.css'
import useWizardStore from '../../stores/wizardStore'

function Step5Konfirmasi() {
    const {
        pelanggan,
        isNewPelanggan,
        items,
        tglMasuk,
        tglJanjiSelesai,
        totalDp,
        catatanPesanan,
        getTotalBiaya,
        getSisaBayar,
        setTanggal,
        setDownPayment,
        setCatatan,
    } = useWizardStore()

    const totalBiaya = getTotalBiaya()
    const sisaBayar = getSisaBayar()

    // Calendar state
    const [jadwalData, setJadwalData] = useState({})
    const [selectedDate, setSelectedDate] = useState(tglJanjiSelesai ? new Date(tglJanjiSelesai) : null)
    const [showCalendar, setShowCalendar] = useState(false)

    // Fetch jadwal when month changes
    useEffect(() => {
        if (showCalendar) {
            fetchJadwal(new Date())
        }
    }, [showCalendar])

    const fetchJadwal = async (date) => {
        try {
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const response = await fetch(
                `/api/pesanan/jadwal?month=${month}&year=${year}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            const data = await response.json()
            setJadwalData(data.data || {})
        } catch (err) {
            console.error('Fetch jadwal error:', err)
        }
    }

    const getDateClass = (date) => {
        const dateKey = date.toISOString().split('T')[0]
        const count = jadwalData[dateKey] || 0
        if (count === 0) return 'available'
        if (count <= 3) return 'busy-low'
        if (count <= 7) return 'busy-medium'
        return 'busy-high'
    }

    const handleDateSelect = (date) => {
        const dateString = date.toISOString().split('T')[0]
        setSelectedDate(date)
        setTanggal(tglMasuk, dateString)
        setShowCalendar(false)
    }

    const getWarningMessage = () => {
        if (!selectedDate) return null
        const dateKey = selectedDate.toISOString().split('T')[0]
        const count = jadwalData[dateKey] || 0
        if (count === 0) return { type: 'success', msg: '✅ Jadwal tersedia!' }
        if (count <= 3) return { type: 'info', msg: `ℹ️ ${count} pesanan dijadwalkan` }
        if (count <= 7) return { type: 'warning', msg: `⚠️ ${count} pesanan - Jadwal cukup padat` }
        return { type: 'danger', msg: `🔴 ${count} pesanan - Jadwal sangat padat!` }
    }

    return (
        <div>
            <h2 className="step-title">Step 5: Konfirmasi Pesanan</h2>

            {/* Ringkasan Pelanggan */}
            <div className="summary-section">
                <h3 className="summary-title">
                    {isNewPelanggan ? '👤 Pelanggan Baru' : '👤 Pelanggan'}
                </h3>
                <div className="summary-content">
                    <p><strong>Nama:</strong> {pelanggan?.namaLengkap}</p>
                    <p><strong>No. WA:</strong> {pelanggan?.noWa}</p>
                    {!isNewPelanggan && pelanggan?.idPelanggan && (
                        <p><strong>Kode:</strong> {pelanggan.idPelanggan}</p>
                    )}
                </div>
            </div>

            {/* Ringkasan Items */}
            <div className="summary-section">
                <h3 className="summary-title">📦 Detail Pesanan ({items.length} item)</h3>
                <div className="summary-content">
                    {items.length === 0 ? (
                        <p className="text-muted">Belum ada item</p>
                    ) : (
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Harga</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => {
                                    const subtotal = (item.hargaSatuan || 0) * (item.jumlahPcs || 1)
                                    return (
                                        <tr key={index}>
                                            <td>{item.namaItem}</td>
                                            <td>{item.jumlahPcs || 1}</td>
                                            <td> Rp {(item.hargaSatuan || 0).toLocaleString('id-ID')}</td>
                                            <td>Rp {subtotal.toLocaleString('id-ID')}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3">Total Biaya</th>
                                    <th>Rp {totalBiaya.toLocaleString('id-ID')}</th>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>

            {/* Tanggal */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label required">Tanggal Masuk</label>
                    <input
                        type="date"
                        className="input"
                        value={tglMasuk}
                        onChange={(e) => setTanggal(e.target.value, tglJanjiSelesai)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Tanggal Janji Selesai</label>
                    <div className="calendar-input-wrapper">
                        <input
                            type="text"
                            className="input"
                            value={tglJanjiSelesai || ''}
                            onClick={() => setShowCalendar(!showCalendar)}
                            readOnly
                            placeholder="Pilih tanggal dari kalender"
                        />
                        <button
                            type="button"
                            className="btn-calendar-toggle"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            📅
                        </button>
                    </div>

                    {showCalendar && (
                        <div className="calendar-container">
                            <Calendar
                                onChange={handleDateSelect}
                                value={selectedDate}
                                minDate={tglMasuk ? new Date(tglMasuk) : new Date()}
                                tileClassName={({ date }) => getDateClass(date)}
                                onActiveStartDateChange={({ activeStartDate }) => fetchJadwal(activeStartDate)}
                            />
                            <div className="calendar-legend">
                                <span className="legend-item"><span className="dot available"></span> Tersedia</span>
                                <span className="legend-item"><span className="dot busy-low"></span> 1-3 pesanan</span>
                                <span className="legend-item"><span className="dot busy-medium"></span> 4-7 pesanan</span>
                                <span className="legend-item"><span className="dot busy-high"></span> 8+ pesanan</span>
                            </div>
                        </div>
                    )}

                    {selectedDate && getWarningMessage() && (
                        <div className={`alert alert-${getWarningMessage().type} mt-sm`}>
                            {getWarningMessage().msg}
                        </div>
                    )}
                </div>
            </div>

            {/* Pembayaran */}
            <div className="payment-section">
                <h3 className="summary-title">💰 Pembayaran</h3>

                <div className="form-group">
                    <label className="form-label">Down Payment (DP)</label>
                    <input
                        type="number"
                        className="input"
                        placeholder="0"
                        value={totalDp}
                        onChange={(e) => setDownPayment(e.target.value)}
                        max={totalBiaya}
                    />
                    <small className="text-muted">Kosongkan jika belum ada DP</small>
                </div>

                <div className="payment-summary">
                    <div className="payment-row">
                        <span>Total Biaya:</span>
                        <span className="font-semibold">Rp {totalBiaya.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="payment-row">
                        <span>DP:</span>
                        <span>Rp {(parseInt(totalDp) || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="payment-row total">
                        <span>Sisa Bayar:</span>
                        <span className="font-bold text-lg">Rp {sisaBayar.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>

            {/* Catatan */}
            <div className="form-group">
                <label className="form-label">Catatan Pesanan (Opsional)</label>
                <textarea
                    className="input"
                    rows="3"
                    placeholder="Catatan tambahan untuk pesanan ini"
                    value={catatanPesanan}
                    onChange={(e) => setCatatan(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Step5Konfirmasi
