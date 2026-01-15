import { useState, useEffect } from 'react'
import Select from 'react-select'
import useWizardStore from '../../stores/wizardStore'
import { pelangganService } from '../../services/pelangganService'

function Step1Pelanggan() {
    const { pelanggan, setPelanggan, nextStep } = useWizardStore()
    const [mode, setMode] = useState('existing') // 'existing' or 'new'
    const [pelangganList, setPelangganList] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const [formData, setFormData] = useState({
        namaLengkap: '',
        jenisKelamin: 'L',
        noWa: '',
        email: '',
        alamat: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [duplicateWarning, setDuplicateWarning] = useState(null)

    useEffect(() => {
        if (mode === 'existing') {
            loadPelanggan()
        }
    }, [mode])

    const loadPelanggan = async () => {
        setLoading(true)
        try {
            const data = await pelangganService.getAll({ page: 1, limit: 1000 })
            setPelangganList(data.data)
        } catch (err) {
            setError('Gagal load pelanggan')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (mode === 'existing') {
            if (!selectedId) {
                alert('Pilih pelanggan terlebih dahulu')
                return
            }
            const selected = pelangganList.find((p) => p.idPelanggan === selectedId)
            setPelanggan(selected, false)
        } else {
            if (!formData.namaLengkap || !formData.noWa) {
                alert('Nama dan nomor WA harus diisi')
                return
            }
            // Clear previous warning
            setDuplicateWarning(null)
            setPelanggan(formData, true)
            
        }
        nextStep()
    }

    return (
        <div>
            <h2 className="step-title">Step 1: Pilih Pelanggan</h2>

            {/* Mode toggle */}
            <div className="mode-toggle mb-lg">
                <label className="radio-label">
                    <input
                        type="radio"
                        value="existing"
                        checked={mode === 'existing'}
                        onChange={() => setMode('existing')}
                    />
                    <span>Pelanggan Lama</span>
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        value="new"
                        checked={mode === 'new'}
                        onChange={() => setMode('new')}
                    />
                    <span>Pelanggan Baru</span>
                </label>
            </div>

            {/* Existing customer */}
            {mode === 'existing' && (
                <div className="form-group">
                    <label className="form-label required">Cari Pelanggan</label>
                    <Select
                        options={pelangganList.map(p => ({
                            value: p.idPelanggan,
                            label: `${p.namaLengkap} - ${p.noWa}`,
                            data: p
                        }))}
                        value={pelangganList.find(p => p.idPelanggan === selectedId) ? {
                            value: selectedId,
                            label: `${pelangganList.find(p => p.idPelanggan === selectedId).namaLengkap} - ${pelangganList.find(p => p.idPelanggan === selectedId).noWa}`
                        } : null}
                        onChange={(option) => setSelectedId(option?.value || '')}
                        placeholder="Ketik nama atau nomor WA untuk mencari..."
                        isClearable
                        isSearchable
                        noOptionsMessage={() => 'Pelanggan tidak ditemukan'}
                        loadingMessage={() => 'Loading...'}
                        isLoading={loading}
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: '#D1D5DB',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#9CA3AF' },
                                padding: '0.25rem'
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected ? '#4F46E5' : state.isFocused ? '#EEF2FF' : 'white',
                                color: state.isSelected ? 'white' : '#1F2937',
                                cursor: 'pointer'
                            })
                        }}
                    />
                    {selectedId && (
                        <p className="text-sm text-muted mt-sm">
                            ✅ Dipilih: {pelangganList.find(p => p.idPelanggan === selectedId)?.namaLengkap}
                        </p>
                    )}
                </div>
            )}
    
            {duplicateWarning && (
                <div className="alert alert-warning" style={{marginBottom: '1rem'}}>
                    <p style={{margin: 0, fontWeight: 600}}>⚠️ {duplicateWarning.error}</p>
                    <p style={{margin: '0.5rem 0', fontSize: '0.875rem'}}>
                        Pelanggan: {duplicateWarning.existingNama} (ID: {duplicateWarning.existingId})
                    </p>
                    <button 
                        onClick={() => {
                            setMode('existing')
                            setSelectedId(duplicateWarning.existingId)
                            setDuplicateWarning(null)
                        }}
                        className="btn btn-sm"
                        style={{fontSize: '0.875rem', padding: '0.375rem 1rem', marginTop: '0.5rem'}}
                    >
                        ✅ Gunakan Pelanggan Ini
                    </button>
                </div>
            )}

            {/* New customer */}
            {mode === 'new' && (
                <div>
                    <div className="form-group">
                        <label className="form-label required">Nama Lengkap</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.namaLengkap}
                            onChange={(e) =>
                                setFormData({ ...formData, namaLengkap: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required">Jenis Kelamin</label>
                            <select
                                className="input"
                                value={formData.jenisKelamin}
                                onChange={(e) =>
                                    setFormData({ ...formData, jenisKelamin: e.target.value })
                                }
                            >
                                <option value="L">👨 Laki-laki</option>
                                <option value="P">👩 Perempuan</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Nomor WhatsApp</label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="081234567890"
                                value={formData.noWa}
                                onChange={(e) =>
                                    setFormData({ ...formData, noWa: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email (Opsional)</label>
                        <input
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alamat (Ops ional)</label>
                        <textarea
                            className="input"
                            rows="3"
                            value={formData.alamat}
                            onChange={(e) =>
                                setFormData({ ...formData, alamat: e.target.value })
                            }
                        />
                    </div>
                </div>
            )}

            <div className="mt-lg">
                <button onClick={handleNext} className="btn btn-primary btn-block">
                    Lanjut ke Step 2 →
                </button>
            </div>
        </div>
    )
}

export default Step1Pelanggan
