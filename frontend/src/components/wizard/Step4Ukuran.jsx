import { useState, useEffect } from 'react'
import useWizardStore from '../../stores/wizardStore'
import { jenisPakaianService } from '../../services/jenisPakaianService'

function Step4Ukuran() {
    const { items, pelanggan, ukuranData, setUkuranData, nextStep } = useWizardStore()
    const [templates, setTemplates] = useState({}) // { idJenis: { templateData } }
    const [loading, setLoading] = useState(false)
    const [autoFilled, setAutoFilled] = useState(false)

    // Get unique jenis from items
    const uniqueJenis = Array.from(
        new Set(items.map((item) => item.idJenis))
    ).map((idJenis) => items.find((item) => item.idJenis === idJenis))

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
            // Load template for each jenis
            const promises = uniqueJenis.map(async (item) => {
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

    const handleNext = () => {
        // Validation: check all jenis have ukuran data (optional for MVP)
        const hasEmpty = uniqueJenis.some((item) => {
            const template = templates[item.idJenis]
            if (!template || template.length === 0) return false // No template, skip

            const ukuran = ukuranData[item.idJenis]
            if (!ukuran) return true // No data entered

            // Check if all template fields have values
            return template.some((field) => !ukuran[field.kodeUkuran])
        })

        if (hasEmpty) {
            if (!confirm('Beberapa ukuran belum diisi. Lanjutkan tanpa ukuran?')) {
                return
            }
        }

        nextStep()
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

    if (uniqueJenis.length === 0) {
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

            <div className="alert alert-info mt-lg">
                💡 <strong>Tips:</strong> Ukuran badan akan disimpan untuk pelanggan ini. Bisa dilewati jika belum sempat ukur.
            </div>

            <div className="mt-lg">
                <button onClick={handleNext} className="btn btn-primary btn-block">
                    Lanjut ke Step 5 (Konfirmasi) →
                </button>
            </div>
        </div>
    )
}

export default Step4Ukuran
