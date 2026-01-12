import { useState } from 'react'
import { pelangganService } from '../../services/pelangganService'
import './FormPelanggan.css'

function FormPelanggan({ editData, onClose, onSuccess }) {
    const isEdit = !!editData

    const [formData, setFormData] = useState({
        namaLengkap: editData?.namaLengkap || '',
        jenisKelamin: editData?.jenisKelamin || 'L',
        noWa: editData?.noWa || '',
        email: editData?.email || '',
        alamat: editData?.alamat || '',
        catatan: editData?.catatan || '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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
                await pelangganService.update(editData.idPelanggan, formData)
            } else {
                await pelangganService.create(formData)
            }
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEdit ? '✏️ Edit Pelanggan' : '➕ Tambah Pelanggan'}
                    </h2>
                    <button onClick={onClose} className="modal-close">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && (
                        <div className="alert alert-error mb-md">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="namaLengkap" className="form-label required">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="namaLengkap"
                            name="namaLengkap"
                            value={formData.namaLengkap}
                            onChange={handleChange}
                            className="input"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="jenisKelamin" className="form-label required">
                                Jenis Kelamin
                            </label>
                            <select
                                id="jenisKelamin"
                                name="jenisKelamin"
                                value={formData.jenisKelamin}
                                onChange={handleChange}
                                className="input"
                                required
                            >
                                <option value="L">👨 Laki-laki</option>
                                <option value="P">👩 Perempuan</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="noWa" className="form-label required">
                                Nomor WhatsApp
                            </label>
                            <input
                                type="tel"
                                id="noWa"
                                name="noWa"
                                value={formData.noWa}
                                onChange={handleChange}
                                className="input"
                                placeholder="081234567890"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email (Opsional)
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="alamat" className="form-label">
                            Alamat (Opsional)
                        </label>
                        <textarea
                            id="alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="input"
                            rows="3"
                            placeholder="Alamat lengkap pelanggan"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="catatan" className="form-label">
                            Catatan (Opsional)
                        </label>
                        <textarea
                            id="catatan"
                            name="catatan"
                            value={formData.catatan}
                            onChange={handleChange}
                            className="input"
                            rows="2"
                            placeholder="Catatan tambahan"
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
                            {loading ? '⏳ Menyimpan...' : isEdit ? '💾 Update' : '➕ Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormPelanggan
