import { create } from 'zustand'

/**
 * Zustand store for Pesanan Wizard (5 steps)
 */
const useWizardStore = create((set, get) => ({
    // Current step (1-5)
    currentStep: 1,

    // Step 1: Pelanggan
    pelanggan: null,
    isNewPelanggan: false,

    // Step 2: Items (array of detail pesanan)
    items: [],

    // Step 4: Ukuran Badan (object with idJenis as key)
    ukuranData: {}, // { idJenis: { kodeUkuran: nilai, ... } }

    // Step 5: Tanggal & Pembayaran
    tglMasuk: new Date().toISOString().split('T')[0],
    tglJanjiSelesai: '',
    totalDp: 0,
    catatanPesanan: '',

    // Actions
    setStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),

    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

    setPelanggan: (pelanggan, isNew = false) =>
        set({ pelanggan, isNewPelanggan: isNew }),

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, { ...item, id: Date.now() }],
        })),

    updateItem: (itemId, updates) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
            ),
        })),

    removeItem: (itemId) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
        })),

    // Ukuran data actions
    setUkuranData: (idJenis, ukuranObj) =>
        set((state) => ({
            ukuranData: {
                ...state.ukuranData,
                [idJenis]: ukuranObj,
            },
        })),

    updateUkuran: (idJenis, kodeUkuran, nilai) =>
        set((state) => ({
            ukuranData: {
                ...state.ukuranData,
                [idJenis]: {
                    ...(state.ukuranData[idJenis] || {}),
                    [kodeUkuran]: nilai,
                },
            },
        })),

    setTanggal: (tglMasuk, tglJanjiSelesai) =>
        set({ tglMasuk, tglJanjiSelesai }),

    setDownPayment: (totalDp) => set({ totalDp }),

    setCatatan: (catatanPesanan) => set({ catatanPesanan }),

    // Calculate total biaya from items
    getTotalBiaya: () => {
        const { items } = get()
        return items.reduce((total, item) => {
            const subtotal = (item.hargaSatuan || 0) * (item.jumlahPcs || 1)
            return total + subtotal
        }, 0)
    },

    // Calculate sisa bayar
    getSisaBayar: () => {
        const { totalDp } = get()
        const totalBiaya = get().getTotalBiaya()
        return totalBiaya - totalDp
    },

    // Get payload untuk submit
    getPayload: () => {
        const {
            pelanggan,
            isNewPelanggan,
            items,
            ukuranData,
            tglMasuk,
            tglJanjiSelesai,
            totalDp,
            catatanPesanan,
        } = get()

        return {
            // If new customer, send customer data, else send existing ID
            idPelanggan: isNewPelanggan ? null : pelanggan?.idPelanggan,
            pelangganBaru: isNewPelanggan ? {
                namaLengkap: pelanggan?.namaLengkap,
                jenisKelamin: pelanggan?.jenisKelamin,
                noWa: pelanggan?.noWa,
                email: pelanggan?.email || null,
                alamat: pelanggan?.alamat || null,
            } : null,
            ukuranData, // Include ukuran data for saving
            tglMasuk,
            tglJanjiSelesai,
            totalDp: parseInt(totalDp) || 0,
            catatanPesanan,
            detailPesanan: items.map((item) => ({
                idJenis: item.idJenis,
                namaItem: item.namaItem,
                modelSpesifik: item.modelSpesifik || '',
                jumlahPcs: item.jumlahPcs || 1,
                hargaSatuan: parseInt(item.hargaSatuan) || 0,
                catatanPenjahit: item.catatanPenjahit || '',
            })),
        }
    },

    // Reset wizard
    reset: () =>
        set({
            currentStep: 1,
            pelanggan: null,
            isNewPelanggan: false,
            items: [],
            ukuranData: {},
            tglMasuk: new Date().toISOString().split('T')[0],
            tglJanjiSelesai: '',
            totalDp: 0,
            catatanPesanan: '',
        }),
}))

export default useWizardStore
