import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../stores/wizardStore'
import { pesananService } from '../services/pesananService'
import Step1Pelanggan from '../components/wizard/Step1Pelanggan'
import Step2Items from '../components/wizard/Step2Items'
import Step3Detail from '../components/wizard/Step3Detail'
import Step4Konfirmasi from '../components/wizard/Step4Konfirmasi'
import './InputPesanan.css'

function InputPesanan() {
    const navigate = useNavigate()
    const { currentStep, prevStep, reset, getPayload } = useWizardStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const payload = getPayload()
            const response = await pesananService.create(payload)

            // Success
            reset()
            navigate(`/pesanan/${response.data.noNota}`)
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal membuat pesanan')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (confirm('Yakin ingin membatalkan? Data yang diinput akan hilang.')) {
            reset()
            navigate('/pesanan')
        }
    }

    return (
        <div className="input-pesanan-page">
            {/* Header */}
            <div className="wizard-header">
                <div className="container">
                    <h1 className="page-title">➕ Input Pesanan Baru</h1>
                    <div className="wizard-progress">
                        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <div className="step-label">Pelanggan</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <div className="step-label">Jenis & Ukuran</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <div className="step-label">Detail</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                            <div className="step-number">4</div>
                            <div className="step-label">Konfirmasi</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container wizard-content">
                <div className="card">
                    {error && (
                        <div className="alert alert-error mb-lg">
                            {error}
                        </div>
                    )}

                    {/* Step Components */}
                    {currentStep === 1 && <Step1Pelanggan />}
                    {currentStep === 2 && <Step2Items />}
                    {currentStep === 3 && <Step3Detail />}
                    {currentStep === 4 && <Step4Konfirmasi />}

                    {/* Navigation */}
                    <div className="wizard-nav">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    ← Kembali
                                </button>
                            )}
                        </div>
                        <div className="flex gap-md">
                            <button
                                onClick={handleCancel}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            {currentStep === 4 && (
                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? '⏳ Menyimpan...' : '💾 Simpan Pesanan'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InputPesanan
