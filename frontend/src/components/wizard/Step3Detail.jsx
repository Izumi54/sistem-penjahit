import useWizardStore from '../../stores/wizardStore'

function Step3Detail() {
    const { items, updateItem, nextStep } = useWizardStore()

    if (items.length === 0) {
        return (
            <div>
                <h2 className="step-title">Step 3: Detail Item</h2>
                <div className="alert alert-warning">
                    Belum ada item. Kembali ke Step 2 untuk menambahkan item terlebih dahulu.
                </div>
            </div>
        )
    }

    const handleChange = (itemId, field, value) => {
        updateItem(itemId, { [field]: value })
    }

    const handleNext = () => {
        // Validate all items have required fields
        const hasEmpty = items.some((item) => !item.namaItem || !item.hargaSatuan)
        if (hasEmpty) {
            alert('Semua item harus diisi nama dan harga')
            return
        }
        nextStep()
    }

    return (
        <div>
            <h2 className="step-title">Step 3: Detail & Model Pakaian</h2>
            <p className="text-muted mb-md">
                Lengkapi detail untuk setiap item pesanan
            </p>

            {items.map((item, index) => (
                <div key={item.id} className="item-detail-card">
                    <h3 className="item-title">Item #{index + 1}</h3>

                    <div className="form-group">
                        <label className="form-label required">Nama Item</label>
                        <input
                            type="text"
                            className="input"
                            value={item.namaItem}
                            onChange={(e) => handleChange(item.id, 'namaItem', e.target.value)}
                            placeholder="contoh: Kemeja Formal Biru"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required">Jumlah (PCS)</label>
                            <input
                                type="number"
                                className="input"
                                value={item.jumlahPcs || 1}
                                onChange={(e) => handleChange(item.id, 'jumlahPcs', parseInt(e.target.value) || 1)}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Harga Satuan (Rp)</label>
                            <input
                                type="number"
                                className="input"
                                value={item.hargaSatuan || ''}
                                onChange={(e) => handleChange(item.id, 'hargaSatuan', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Model Spesifik (Opsional)</label>
                        <textarea
                            className="input"
                            rows="2"
                            value={item.modelSpesifik || ''}
                            onChange={(e) => handleChange(item.id, 'modelSpesifik', e.target.value)}
                            placeholder="Deskripsi model: lengan panjang, kerah kotak, kancing 6, dll"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Catatan Penjahit (Opsional)</label>
                        <textarea
                            className="input"
                            rows="2"
                            value={item.catatanPenjahit || ''}
                            onChange={(e) => handleChange(item.id, 'catatanPenjahit', e.target.value)}
                            placeholder="Catatan khusus untuk penjahit"
                        />
                    </div>

                    {item.hargaSatuan > 0 && (
                        <div className="subtotal-display">
                            <strong>Subtotal:</strong> Rp {((item.hargaSatuan || 0) * (item.jumlahPcs || 1)).toLocaleString('id-ID')}
                        </div>
                    )}
                </div>
            ))}

            <div className="mt-lg">
                <button onClick={handleNext} className="btn btn-primary btn-block">
                    Lanjut ke Step 4 (Konfirmasi) →
                </button>
            </div>
        </div>
    )
}

export default Step3Detail
