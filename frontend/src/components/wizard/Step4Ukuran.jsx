import { useState, useEffect } from 'react'
import useWizardStore from '../../stores/wizardStore'
import { jenisPakaianService } from '../../services/jenisPakaianService'

function Step4Ukuran() {
    const { items, pelanggan, ukuranData, setUkuranData, updateGroupedUkuran, nextStep } = useWizardStore()
    const [templates, setTemplates] = useState({}) // { idJenis: { templateData } }
    const [loading, setLoading] = useState(false)
    const [autoFilled, setAutoFilled] = useState(false)

    // Separate grouped items from regular jenis
    const groupedItems = items.filter(item => item.isGrouped)
    const regularItems = items.filter(item => !item.isGrouped)
    
    // Get unique jenis from regular (non-grouped) items only
    const uniqueJenis = Array.from(
        new Set(regularItems.map((item) => item.idJenis))
    ).map((idJenis) => regularItems.find((item) => item.idJenis === idJenis))

    useEffect(() => {
        loadTemplates()
        // Auto-populate ukuran if pelanggan lama
        if (pelanggan && !pelanggan.isNew && pelanggan.idPelanggan) {
            loadExistingUkuran()
        }
    }, [])

    const loadTemplates = async () => {
        setLoading(true)
        try {
            // Load template for each jenis (both grouped and non-grouped)
            const allItems = [...uniqueJenis, ...groupedItems]
            const promises = allItems.map(async (item) => {
                const response = await jenisPakaianService.getTemplate(item.idJenis)
                return { idJenis: item.idJenis, template: response.data }
            })

            const results = await Promise.all(promises)
            const templatesObj = {}
            results.forEach(({ idJenis, template }) => {
                templatesObj[idJenis] = template
            })
            setTemplates(templatesObj)
        } catch (err) {
            console.error('Load templates error:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadExistingUkuran = async () => {
        try {
            // For each jenis in items, try to fetch existing ukuran
            const promises = uniqueJenis.map(async (item) => {
                try {
                    const response = await fetch(
                        `/api/pelanggan/${pelanggan.idPelanggan}/ukuran/${item.idJenis}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    )

                    if (!response.ok) return null

                    const data = await response.json()
                    if (data.data && data.data.length > 0) {
                        // Use most recent ukuran (first in array)
                        const latestUkuran = data.data[0]
                        return { idJenis: item.idJenis, ukuran: latestUkuran }
                    }
                    return null
                } catch (err) {
                    console.error(`Error loading ukuran for ${item.namaJenis}:`, err)
                    return null
                }
            })

            const results = await Promise.all(promises)

            // Pre-fill ukuranData with existing values
            results.forEach((result) => {
                if (result) {
                    const { idJenis, ukuran } = result
                    const ukuranObj = {}

                    // Map database fields to kodeUkuran format
                    if (ukuran.lingkarDada) ukuranObj['LINGKAR_DADA'] = ukuran.lingkarDada
                    if (ukuran.panjangBaju) ukuranObj['PANJANG_BAJU'] = ukuran.panjangBaju
                    if (ukuran.lingkarPinggang) ukuranObj['LINGKAR_PINGGANG'] = ukuran.lingkarPinggang
                    if (ukuran.panjangLengan) ukuranObj['PANJANG_LENGAN'] = ukuran.panjangLengan
                    if (ukuran.lingkarLeher) ukuranObj['LINGKAR_LEHER'] = ukuran.lingkarLeher
                    if (ukuran.lingkarPinggul) ukuranObj['LINGKAR_PINGGUL'] = ukuran.lingkarPinggul
                    if (ukuran.panjangCelana) ukuranObj['PANJANG_CELANA'] = ukuran.panjangCelana
                    if (ukuran.lingkarPaha) ukuranObj['LINGKAR_PAHA'] = ukuran.lingkarPaha
                    if (ukuran.lingkarBetis) ukuranObj['LINGKAR_BETIS'] = ukuran.lingkarBetis

                    setUkuranData(idJenis, ukuranObj)
                    setAutoFilled(true) // Mark as auto-filled
                }
            })
        } catch (err) {
            console.error('Load existing ukuran error:', err)
        }
    }

    const handleUkuranChange = (idJenis, kodeUkuran, nilai) => {
        const currentUkuran = ukuranData[idJenis] || {}
        setUkuranData(idJenis, {
            ...currentUkuran,
            [kodeUkuran]: nilai,
        })
    }



    if (loading) {
        return (
            <div>
                <h2 className="step-title">Step 4: Input Ukuran Badan</h2>
                <div className="text-center p-xl">
                    <div className="spinner"></div>
                    <p className="text-muted mt-md">Loading template ukuran...</p>
                </div>
            </div>
        )
    }

    // Check if there are NO items at all (both regular and grouped)
    if (items.length === 0) {
        return (
            <div>
                <h2 className="step-title">Step 4: Input Ukuran Badan</h2>
                <div className="alert alert-warning">
                    Belum ada item. Kembali ke Step 2 untuk menambahkan item terlebih dahulu.
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="step-title">Step 4: Input Ukuran Badan</h2>

            {autoFilled && (
                <div className="alert alert-info mb-md">
                    ✅ Ukuran otomatis diisi dari data sebelumnya. Anda bisa mengubah jika ada perubahan.
                </div>
            )}

            <p className="text-muted mb-md">
                Masukkan ukuran badan untuk setiap jenis pakaian (opsional, bisa dilewati)
            </p>

            {uniqueJenis.map((item) => {
                const template = templates[item.idJenis] || []
                const currentUkuran = ukuranData[item.idJenis] || {}

                return (
                    <div key={item.idJenis} className="ukuran-section">
                        <h3 className="ukuran-title">
                            📏 {item.namaItem}
                            <span className="text-sm text-muted ml-sm">({item.idJenis})</span>
                        </h3>

                        {template.length === 0 ? (
                            <div className="alert alert-info">
                                Tidak ada template ukuran untuk jenis ini. Lewati atau isi manual nanti.
                            </div>
                        ) : (
                            <div className="ukuran-grid">
                                {template.map((field) => (
                                    <div key={field.kodeUkuran} className="form-group">
                                        <label className="form-label">
                                            {field.namaUkuran}
                                            <span className="text-muted ml-sm">({field.satuan})</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="0"
                                            step="0.1"
                                            value={currentUkuran[field.kodeUkuran] || ''}
                                            onChange={(e) =>
                                                handleUkuranChange(item.idJenis, field.kodeUkuran, e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}

            {/* NEW: Grouped Items Section */}
            {groupedItems.map((item) => {
                const template = templates[item.idJenis] || []
                const groupedUkuranKey = `item_${item.id}`
                const groupedUkuranArray = ukuranData[groupedUkuranKey] || []

                return (
                    <div key={item.id} className="ukuran-section" style={{
                        border: '2px solid #fbbf24',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        background: '#fffbeb'
                    }}>
                        <h3 className="ukuran-title" style={{color: '#92400e'}}>
                            🔢 {item.namaItem} ({item.jumlahPcs} PCS - Ukuran Berbeda)
                            <span className="text-sm text-muted ml-sm">({item.idJenis})</span>
                        </h3>
                        
                        <p style={{fontSize: '0.9rem', color: '#78350f', marginBottom: '1rem'}}>
                            Isi ukuran untuk setiap PCS. Anda bisa skip beberapa PCS jika belum sempat ukur.
                        </p>

                        {Array.from({ length: item.jumlahPcs }).map((_, pcsIdx) => {
                            const pcsUkuran = groupedUkuranArray[pcsIdx] || {}
                            const filledCount = Object.keys(pcsUkuran).filter(k => pcsUkuran[k]).length
                            const totalFields = template.length

                            return (
                                <details 
                                    key={pcsIdx} 
                                    open={pcsIdx === 0}
                                    style={{
                                        marginBottom: '1rem',
                                        background: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid #d97706',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <summary style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        background: filledCount > 0 ? '#dcfce7' : 'white',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>PCS #{pcsIdx + 1}</span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: filledCount > 0 ? '#059669' : '#9ca3af'
                                        }}>
                                            {filledCount > 0 ? `✓ Terisi ${filledCount}/${totalFields}` : 'Belum diisi'}
                                        </span>
                                    </summary>
                                    
                                    <div style={{padding: '1rem'}}>
                                        {template.length === 0 ? (
                                            <div className="alert alert-info">
                                                Tidak ada template ukuran untuk jenis ini.
                                            </div>
                                        ) : (
                                            <div className="ukuran-grid">
                                                {template.map((field) => (
                                                    <div key={field.kodeUkuran} className="form-group">
                                                        <label className="form-label">
                                                            {field.namaUkuran}
                                                            <span className="text-muted ml-sm">({field.satuan})</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="input"
                                                            placeholder="0"
                                                            step="0.1"
                                                            value={pcsUkuran[field.kodeUkuran] || ''}
                                                            onChange={(e) =>
                                                                updateGroupedUkuran(item.id, pcsIdx, field.kodeUkuran, e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </details>
                            )
                        })}
                    </div>
                )
            })}

            <div className="alert alert-info mt-lg">
                💡 <strong>Tips:</strong> Ukuran badan akan disimpan untuk pelanggan ini. Bisa dilewati jika belum sempat ukur.
            </div>


        </div>
    )
}

export default Step4Ukuran
