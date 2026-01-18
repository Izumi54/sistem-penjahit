import { useState, useEffect } from 'react'
import useWizardStore from '../../stores/wizardStore'
import { jenisPakaianService } from '../../services/jenisPakaianService'

function Step2Items() {
    const { items, addItem, removeItem, nextStep } = useWizardStore()
    const [jenisPakaianList, setJenisPakaianList] = useState([])
    const [selectedJenis, setSelectedJenis] = useState('')
    const [loading, setLoading] = useState(false

    )

    useEffect(() => {
        loadJenisPakaian()
    }, [])

    const loadJenisPakaian = async () => {
        setLoading(true)
        try {
            const data = await jenisPakaianService.getAll()
            setJenisPakaianList(data.data)
        } catch (err) {
            console.error('Load jenis pakaian error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddItem = () => {
        if (!selectedJenis) {
            alert('Pilih jenis pakaian terlebih dahulu')
            return
        }

        const jenis = jenisPakaianList.find((j) => j.idJenis === selectedJenis)
        const newItem = {
            idJenis: jenis.idJenis,
            namaItem: jenis.namaJenis,
            jumlahPcs: 1,
            hargaSatuan: jenis.hargaMulaiDari || 0,
            modelSpesifik: '',
            catatanPenjahit: '',
        }

        addItem(newItem)
        setSelectedJenis('') // Reset selection
    }



    return (
        <div>
            <h2 className="step-title">Step 2: Jenis Pakaian & Item</h2>

            {/* Add Item Form */}
            <div className="add-item-section">
                <div className="form-group">
                    <label className="form-label required">Pilih Jenis Pakaian</label>
                    <select
                        className="input"
                        value={selectedJenis}
                        onChange={(e) => setSelectedJenis(e.target.value)}
                    >
                        <option value="">-- Pilih Jenis Pakaian --</option>
                        {jenisPakaianList.map((j) => (
                            <option key={j.idJenis} value={j.idJenis}>
                                {j.namaJenis}
                                {j.hargaMulaiDari > 0 && ` - Mulai dari Rp ${j.hargaMulaiDari.toLocaleString('id-ID')}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAddItem}
                    className="btn btn-secondary"
                    disabled={!selectedJenis}
                >
                    ➕ Tambah Item
                </button>
            </div>

            {/* Items List */}
            {items.length > 0 && (
                <div className="items-list mt-lg">
                    <h3 className="items-title">📦 Item yang Ditambahkan ({items.length})</h3>
                    {items.map((item, index) => (
                        <div key={item.id} className="item-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold">{index + 1}. {item.namaItem}</div>
                                    <div className="text-sm text-muted">Jenis: {item.idJenis}</div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="btn btn-sm btn-error"
                                    title="Hapus"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>
    )
}

export default Step2Items
