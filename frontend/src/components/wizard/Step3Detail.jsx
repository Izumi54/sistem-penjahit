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

                    {/* NEW: Grouped measurement toggle */}
                    {item.jumlahPcs > 1 && (
                        <div className="form-group" style={{
                            padding: '1rem', 
                            background: '#fef3c7', 
                            borderRadius: '8px', 
                            border: '1px solid #fbbf24',
                            marginBottom: '1rem'
                        }}>
                            <label className="checkbox-label" style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                cursor: 'pointer',
                                margin: 0
                            }}>
                                <input
                                    type="checkbox"
                                    checked={item.isGrouped || false}
                                    onChange={(e) => handleChange(item.id, 'isGrouped', e.target.checked)}
                                    style={{width: '1.25rem', height: '1.25rem', cursor: 'pointer'}}
                                />
                                <span style={{fontSize: '0.95rem', fontWeight: '500'}}>
                                    🔢 Item ini memiliki <strong>ukuran berbeda</strong> untuk setiap PCS
                                </span>
                            </label>
                            <p style={{
                                fontSize: '0.85rem', 
                                color: '#92400e', 
                                marginTop: '0.5rem',
                                marginBottom: 0,
                                marginLeft: '1.75rem'
                            }}>
                                Jika dicentang, Anda akan diminta mengisi ukuran terpisah untuk setiap PCS di Step 4
                            </p>
                        </div>
                    )}


                                        {/* Tambahan Bahan - PROPER FORM */}
                    <div className="form-group" style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                            <label className="form-label" style={{margin: 0}}>🧵 Tambahan Bahan</label>
                            <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => {
                                    const current = item.tambahanBahan || []
                                    handleChange(item.id, 'tambahanBahan', [...current, {nama: '', qty: 1, harga: 0}])
                                }}
                                style={{fontSize: '0.875rem', padding: '0.375rem 0.75rem'}}
                            >
                                ➕ Tambah Bahan
                            </button>
                        </div>
                        
                        {(item.tambahanBahan || []).map((bahan, bahanIdx) => (
                            <div key={bahanIdx} className="bahan-item-card">
                                <input
                                    type="text"
                                    className="input bahan-input-nama"
                                    placeholder="Nama bahan"
                                    value={bahan.nama}
                                    onChange={(e) => {
                                        const updated = [...(item.tambahanBahan || [])]
                                        updated[bahanIdx].nama = e.target.value
                                        handleChange(item.id, 'tambahanBahan', updated)
                                    }}
                                />
                                <input
                                    type="number"
                                    className="input bahan-input-qty"
                                    placeholder="Qty"
                                    value={bahan.qty}
                                    onChange={(e) => {
                                        const updated = [...(item.tambahanBahan || [])]
                                        updated[bahanIdx].qty = parseInt(e.target.value) || 1
                                        handleChange(item.id, 'tambahanBahan', updated)
                                    }}
                                    min="1"
                                />
                                <input
                                    type="number"
                                    className="input bahan-input-harga"
                                    placeholder="Harga"
                                    value={bahan.harga}
                                    onChange={(e) => {
                                        const updated = [...(item.tambahanBahan || [])]
                                        updated[bahanIdx].harga = parseInt(e.target.value) || 0
                                        handleChange(item.id, 'tambahanBahan', updated)
                                    }}
                                    min="0"
                                />
                                <button
                                    type="button"
                                    className="btn-delete-bahan"
                                    onClick={() => {
                                        const updated = (item.tambahanBahan || []).filter((_, i) => i !== bahanIdx)
                                        handleChange(item.id, 'tambahanBahan', updated)
                                    }}
                                    title="Hapus"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        
                        {(item.tambahanBahan || []).length === 0 && (
                            <p style={{fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', margin: '0.5rem 0'}}>
                                Klik "➕ Tambah Bahan" untuk menambahkan kancing, resleting, dll
                            </p>
                        )}
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
                            {(() => {
                                const subtotalItem = (item.hargaSatuan || 0) * (item.jumlahPcs || 1)
                                const subtotalBahan = (item.tambahanBahan || []).reduce((sum, b) => sum + (b.qty * b.harga), 0)
                                const total = subtotalItem + subtotalBahan
                                
                                return (
                                    <>
                                        <div style={{marginBottom: '0.5rem'}}>
                                            <strong>Subtotal Item:</strong> Rp {subtotalItem.toLocaleString('id-ID')}
                                        </div>
                                        {subtotalBahan > 0 && (
                                            <div style={{marginBottom: '0.5rem', color: '#059669'}}>
                                                <strong>+ Tambahan Bahan:</strong> Rp {subtotalBahan.toLocaleString('id-ID')}
                                            </div>
                                        )}
                                        <div style={{paddingTop: '0.5rem', borderTop: '2px solid #e5e7eb', fontSize: '1.125rem'}}>
                                            <strong>TOTAL:</strong> Rp {total.toLocaleString('id-ID')}
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    )}
                </div>
            ))}

        </div>
    )
}

export default Step3Detail
