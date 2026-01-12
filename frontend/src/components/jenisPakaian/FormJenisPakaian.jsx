import { useState, useEffect } from 'react'
import { jenisPakaianService } from '../../services/jenisPakaianService'
import './FormJenisPakaian.css'

function FormJenisPakaian({ editData, onClose, onSuccess }) {
    const isEdit = !!editData

    const [formData, setFormData] = useState({
        namaJenis: editData?.namaJenis || '',
        keterangan: editData?.keterangan || '',
    })

    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Load templates if editing
    useEffect(() => {
        if (isEdit) {
            loadTemplates()
        }
    }, [editData])

    const loadTemplates = async () => {
        try {
            const data = await jenisPakaianService.getTemplate(editData.idJenis)
            setTemplates(data.data || [])
        } catch (err) {
            console.error('Load templates error:', err)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isEdit) {
                await jenisPakaianService.update(editData.idJenis, formData)
            } else {
                await jenisPakaianService.create(formData)
            }
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    const addTemplate = () => {
        setTemplates([
            ...templates,
            {
                kodeUkuran: '',
                namaUkuran: '',
                satuan: 'cm',
                urutan: templates.length + 1,
            },
        ])
    }

    const removeTemplate = (index) => {
        setTemplates(templates.filter((_, i) => i !== index))
    }

    const updateTemplate = (index, field, value) => {
        const updated = [...templates]
        updated[index][field] = value
        setTemplates(updated)
    }

    const saveTemplates = async () => {
        if (!isEdit) {
            alert('Simpan jenis pakaian terlebih dahulu sebelum menambah template')
            return
        }

        setLoading(true)
        try {
            await jenisPakaianService.saveTemplate(editData.idJenis, templates)
            alert('Template ukuran berhasil disimpan!')
            onSuccess()
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal menyimpan template')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content modal-large"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEdit ? '✏️ Edit Jenis Pakaian' : '➕ Tambah Jenis Pakaian'}
                    </h2>
                    <button onClick={onClose} className="modal-close">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {error && <div className="alert alert-error mb-md">{error}</div>}

                    {/* Basic Info */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="namaJenis" className="form-label required">
                                Nama Jenis Pakaian
                            </label>
                            <input
                                type="text"
                                id="namaJenis"
                                name="namaJenis"
                                value={formData.namaJenis}
                                onChange={handleChange}
                                className="input"
                                placeholder="contoh: Kemeja Pria, Gamis Wanita"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="keterangan" className="form-label">
                                Keterangan (Opsional)
                            </label>
                            <textarea
                                id="keterangan"
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                className="input"
                                rows="2"
                                placeholder="Keterangan tambahan"
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? '⏳ Menyimpan...'
                                    : isEdit
                                        ? '💾 Update'
                                        : '➕ Tambah'}
                            </button>
                        </div>
                    </form>

                    {/* Template Section - Only for Edit */}
                    {isEdit && (
                        <>
                            <hr className="divider" />
                            <div className="template-section">
                                <div className="flex justify-between items-center mb-md">
                                    <h3>📏 Template Ukuran</h3>
                                    <button onClick={addTemplate} className="btn btn-sm btn-secondary">
                                        ➕ Tambah Ukuran
                                    </button>
                                </div>

                                {templates.length === 0 ? (
                                    <p className="text-muted text-sm">
                                        Belum ada template ukuran. Klik "Tambah Ukuran" untuk menambahkan.
                                    </p>
                                ) : (
                                    <div className="template-list">
                                        {templates.map((t, index) => (
                                            <div key={index} className="template-item">
                                                <input
                                                    type="text"
                                                    placeholder="Kode (contoh: LD)"
                                                    className="input input-sm"
                                                    value={t.kodeUkuran}
                                                    onChange={(e) =>
                                                        updateTemplate(index, 'kodeUkuran', e.target.value)
                                                    }
                                                    style={{ width: '100px' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Nama Ukuran (contoh: Lebar Dada)"
                                                    className="input input-sm"
                                                    value={t.namaUkuran}
                                                    onChange={(e) =>
                                                        updateTemplate(index, 'namaUkuran', e.target.value)
                                                    }
                                                    style={{ flex: 1 }}
                                                />
                                                <select
                                                    className="input input-sm"
                                                    value={t.satuan}
                                                    onChange={(e) =>
                                                        updateTemplate(index, 'satuan', e.target.value)
                                                    }
                                                    style={{ width: '80px' }}
                                                >
                                                    <option value="cm">cm</option>
                                                    <option value="m">m</option>
                                                    <option value="inch">inch</option>
                                                </select>
                                                <button
                                                    onClick={() => removeTemplate(index)}
                                                    className="btn btn-sm btn-error"
                                                    title="Hapus"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-md">
                                    <button
                                        onClick={saveTemplates}
                                        className="btn btn-primary btn-block"
                                        disabled={loading || templates.length === 0}
                                    >
                                        💾 Simpan Template Ukuran
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FormJenisPakaian
