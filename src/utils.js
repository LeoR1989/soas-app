// Utility functions for the SOAS app

/**
 * Format number with thousands separator (e.g. 452000 → "452,000")
 */
export function formatNumber(num) {
    if (num == null) return '0'
    return Math.abs(num).toLocaleString('en-US')
}

/**
 * Format diamonds to USD string (e.g. 452000 → "$54.46")
 */
export function diamondsToUSD(diamonds, rate = 8300) {
    const usd = diamonds / rate
    return `$${usd.toFixed(2)}`
}

/**
 * Generate avatar color from name string
 */
export function avatarColor(name) {
    const colors = [
        '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
        '#3B82F6', '#EF4444', '#06B6D4', '#F97316'
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

/**
 * Generate avatar initials from nickname (e.g. "Mike Ian" → "MI")
 */
export function avatarInitials(name) {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

/**
 * Format date to "AbbrMonth YYYY" (e.g. "Nov 2025")
 */
export function formatMonth(dateStr) {
    const d = new Date(dateStr)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Simulate async delay
 */
export function delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Group bills by month and format the header as MM.DD-MM.DD
 */
export function groupBillsByMonth(bills) {
    const groups = {}
    const currentYear = new Date().getFullYear(); // e.g. 2026

    // Sort bills by date descending to ensure the newest are first
    const sortedBills = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedBills.forEach(bill => {
        const d = new Date(bill.date);
        const y = d.getFullYear();
        const m = d.getMonth();

        const lastDay = new Date(y, m + 1, 0).getDate();

        const monthStr = String(m + 1).padStart(2, '0');
        const startStr = `${monthStr}.01`;
        const endStr = `${monthStr}.${lastDay}`;

        let headerLabel = `${startStr}-${endStr}`;
        if (y !== currentYear) {
            headerLabel = `${startStr}.${y}-${endStr}.${y}`;
        }

        if (!groups[headerLabel]) groups[headerLabel] = [];
        groups[headerLabel].push(bill);
    });

    return groups;
}
