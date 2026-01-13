import useWizardStore from '../../stores/wizardStore'

function Step4Konfirmasi() {
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

    return (
        <div>
            <h2 className="step-title">Step 4: Konfirmasi Pesanan</h2>

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
                                            <td>Rp {(item.hargaSatuan || 0).toLocaleString('id-ID')}</td>
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
                    <input
                        type="date"
                        className="input"
                        value={tglJanjiSelesai}
                        onChange={(e) => setTanggal(tglMasuk, e.target.value)}
                        min={tglMasuk}
                    />
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

export default Step4Konfirmasi
