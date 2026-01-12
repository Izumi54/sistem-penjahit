/**
 * Helper functions
 */

/**
 * Generate kode pelanggan otomatis (P0001, P0002, ...)
 */
export const generateKodePelanggan = (lastKode) => {
    if (!lastKode) {
        return 'P0001'
    }

    // Extract number from last kode (e.g., 'P0001' -> 1)
    const lastNumber = parseInt(lastKode.substring(1))
    const newNumber = lastNumber + 1

    // Pad with zeros (e.g., 1 -> '0001')
    return 'P' + newNumber.toString().padStart(4, '0')
}

/**
 * Format phone number (add +62 prefix if not exists)
 */
export const formatPhoneNumber = (phone) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')

    // Add +62 prefix if starts with 0
    if (cleaned.startsWith('0')) {
        return '+62' + cleaned.substring(1)
    }

    // Add +62 prefix if doesn't start with country code
    if (!cleaned.startsWith('62')) {
        return '+62' + cleaned
    }

    return '+' + cleaned
}
