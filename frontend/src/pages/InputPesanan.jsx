import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../stores/wizardStore'
import { pesananService } from '../services/pesananService'
import { pelangganService } from '../services/pelangganService'
import Step1Pelanggan from '../components/wizard/Step1Pelanggan'
import Step2Items from '../components/wizard/Step2Items'
import Step3Detail from '../components/wizard/Step3Detail'
import Step4Ukuran from '../components/wizard/Step4Ukuran'
import Step5Konfirmasi from '../components/wizard/Step5Konfirmasi'
import './InputPesanan.css'

function InputPesanan() {
    const navigate = useNavigate()
    const { currentStep, prevStep, nextStep, reset, getPayload, items } = useWizardStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleNextGlobal = () => {
        // Step 2 Validation: Check if items exist
        if (currentStep === 2) {
            if (items.length === 0) {
                alert('Tambahkan minimal 1 item')
                return
            }
        }

        // Step 3 Validation: Check item details
        if (currentStep === 3) {
            const hasEmpty = items.some((item) => !item.namaItem || !item.hargaSatuan)
            if (hasEmpty) {
                alert('Semua item harus diisi nama dan harga')
                return
            }
        }

        // Step 4: No strict validation (optional measurement)

        nextStep()
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const payload = getPayload()

            // If new customer, create customer first
            let idPelanggan = payload.idPelanggan
            if (payload.pelangganBaru) {
                const pelangganResponse = await pelangganService.create(payload.pelangganBaru)
                idPelanggan = pelangganResponse.data.idPelanggan
            }

            // Save ukuran data if exists (skip grouped items)
            if (payload.ukuranData && Object.keys(payload.ukuranData).length > 0) {
                // For each jenis, save ukuran to pelanggan
                // Skip keys that start with "item_" (grouped ukuran)
                for (const key of Object.keys(payload.ukuranData)) {
                    // Skip grouped items (they have key format: "item_12345")
                    if (key.startsWith('item_')) {
                        continue
                    }

                    const idJenis = key
                    const ukuranFields = payload.ukuranData[idJenis]
                    
                    if (Object.keys(ukuranFields).length > 0) {
                        // Convert object {LD: "90", LP: "75"} to array [{kodeUkuran: "LD", nilai: 90}, ...]
                        const ukuranArray = Object.entries(ukuranFields).map(([kodeUkuran, nilai]) => ({
                            kodeUkuran,
                            nilai: parseFloat(nilai),
                        }))

                        await pelangganService.saveUkuran(idPelanggan, {
                            idJenis,
                            ukuran: ukuranArray,
                        })
                    }
                }
            }

            // Create pesanan
            const pesananPayload = {
                idPelanggan,
                tglMasuk: payload.tglMasuk,
                tglJanjiSelesai: payload.tglJanjiSelesai,
                totalDp: payload.totalDp,
                catatanPesanan: payload.catatanPesanan,
                detailPesanan: payload.detailPesanan,
            }

            const response = await pesananService.create(pesananPayload)

            // Success
            reset()
            navigate(`/dashboard`)
        } catch (err) {
            // Handle duplicate pelanggan error
            if (err.response?.status === 409) {
                setError(`Duplikat Pelanggan: ${err.response.data.error}.`)
            } else {
                setError(err.response?.data?.error || 'Gagal membuat pesanan')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (confirm('Yakin ingin membatalkan? Data yang diinput akan hilang.')) {
            reset()
            navigate('/dashboard')
        }
    }

    return (
        <div className="input-pesanan-page">
            <div className="wizard-header">
                <div className="container">
                    <h1 className="page-title">➕ Input Pesanan Baru</h1>
                    <div className="wizard-progress">
                        {[1, 2, 3, 4, 5].map(step => (
                            <div key={step} style={{display: 'contents'}}>
                             <div className={`step ${currentStep >= step ? 'active' : ''}`}>
                                <div className="step-number">{step}</div>
                                <div className="step-label">
                                    {step === 1 && 'Pelanggan'}
                                    {step === 2 && 'Jenis'}
                                    {step === 3 && 'Detail'}
                                    {step === 4 && 'Ukuran'}
                                    {step === 5 && 'Konfirmasi'}
                                </div>
                             </div>
                             {step < 5 && <div className="step-line"></div>}
                            </div>
                        ))}
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
                    {currentStep === 4 && <Step4Ukuran />}
                    {currentStep === 5 && <Step5Konfirmasi />}

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
                            
                            {/* Global Next Button for Steps 2-4 */}
                            {currentStep >= 2 && currentStep < 5 && (
                                <button
                                    onClick={handleNextGlobal}
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    Lanjut →
                                </button>
                            )}

                            {/* Save Button for Step 5 */}
                            {currentStep === 5 && (
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
