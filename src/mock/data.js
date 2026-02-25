import { reactive } from 'vue'

// ============ HOST MOCK DATA ============
export const hostData = reactive({
    user: {
        id: 'USR-88421',
        nickname: 'DJ Khalid',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        isKycVerified: false,
        hasPinSetup: false,
        pin: null,
        pinAttempts: 0,
        pinLockedUntil: null
    },

    // Agency membership (null = unjoined)
    agency: {
        id: 'AG-15502',
        name: 'Dubai Elite Club',
        logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=DubaiElite'
    },
    pendingApplication: null,

    // Balance
    balance: {
        available: 452000,
        frozen: 83200,
        frozenDays: 3
    },

    // Monthly cycle history (newest first)
    cycles: [
        {
            cycleStart: '2026-03-01', cycleEnd: '2026-03-31',
            currentLevel: 2, coinsEarned: 185000,
            validDays: { current: 12, target: 15 },
            validHours: { current: 22.5, target: 30 },
            baseSalary: 86320, micBonus: 0,
            status: 'in_progress'  // 进行中
        },
        {
            cycleStart: '2026-02-01', cycleEnd: '2026-02-28',
            currentLevel: 2, coinsEarned: 162000,
            validDays: { current: 15, target: 15 },
            validHours: { current: 31.2, target: 30 },
            baseSalary: 86320, micBonus: 21580,
            status: 'settled'  // 已结算
        },
        {
            cycleStart: '2026-01-01', cycleEnd: '2026-01-31',
            currentLevel: 1, coinsEarned: 120000,
            validDays: { current: 15, target: 15 },
            validHours: { current: 30, target: 30 },
            baseSalary: 59760, micBonus: 14940,
            status: 'settled'  // 已结算
        },
        {
            cycleStart: '2025-12-01', cycleEnd: '2025-12-31',
            currentLevel: 1, coinsEarned: 88000,
            validDays: { current: 10, target: 15 },
            validHours: { current: 18, target: 30 },
            baseSalary: 0, micBonus: 0,
            status: 'unmet'  // 未达标
        },
        {
            cycleStart: '2025-11-01', cycleEnd: '2025-11-30',
            currentLevel: 1, coinsEarned: 52000,
            validDays: { current: 8, target: 15 },
            validHours: { current: 12, target: 30 },
            baseSalary: 0, micBonus: 0,
            status: 'frozen'  // 冻结中
        }
    ],

    // Shortcut: current cycle = first item
    get taskProgress() { return this.cycles[0] },

    // Settlement mode (depends on agency setting)
    payoutModel: 'dual_track',  // 'unified' | 'dual_track'

    // Bills history
    bills: [
        { id: 'B-10250', type: 'policy_bonus', label: 'New Host Bonus (Coins)', amount: 15000, date: '2026-03-05', month: 'Mar 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10241', type: 'gift_income', label: 'Gift Revenue', amount: 45000, date: '2026-02-18', month: 'Feb 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10240', type: 'gift_income', label: 'Gift Revenue', amount: 12300, date: '2026-02-15', month: 'Feb 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10239', type: 'base_salary', label: 'Base Salary (L2)', amount: 86320, date: '2026-02-01', month: 'Feb 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10220', type: 'gift_income', label: 'Gift Revenue', amount: 78500, date: '2026-01-28', month: 'Jan 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10219', type: 'gift_income', label: 'Gift Revenue', amount: 33200, date: '2026-01-22', month: 'Jan 2026', agency: 'Dubai Elite Club', status: 'refunded' },
        { id: 'B-10218', type: 'base_salary', label: 'Base Salary (L1)', amount: 59760, date: '2026-01-01', month: 'Jan 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10217', type: 'mic_bonus', label: 'Mic Bonus (L1)', amount: 14940, date: '2026-01-01', month: 'Jan 2026', agency: 'Dubai Elite Club', status: 'normal' },
        { id: 'B-10200', type: 'gift_income', label: 'Gift Revenue', amount: 52100, date: '2025-12-20', month: 'Dec 2025', agency: 'MidEast Stars', status: 'normal' },
        { id: 'B-10199', type: 'chargeback', label: 'Chargeback Deduction', amount: -15000, date: '2025-12-15', month: 'Dec 2025', agency: 'MidEast Stars', status: 'rejected' },
    ]
})

// ============ AGENCY MOCK DATA ============
export const agencyData = reactive({
    current: {
        id: 'AG-15502',
        name: 'Dubai Elite Club',
        logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=DubaiElite',
        contact: '+971-50-1234567',
        ownerUid: 'USR-00001',
        adminName: 'Sarah Ahmed',
        adminAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        payoutModel: 'dual_track',
        hostCount: 41,
        totalBalance: 3850000,
        frozenBalance: 420000,
        status: 'active',
        cycleTotalDiamonds: 4200000,
        cycleHostDiamonds: 2940000,
        cycleAgencyDiamonds: 1260000,
        activeHosts: 38,
        totalOnlineHours: 1240.5
    },

    members: [
        { id: 'USR-88421', nickname: 'DJ Khalid', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', monthlyEarnings: 185000, coinsEarned: 185000, status: 'active', validDays: 12, validHours: 45.5, isNew: false },
        { id: 'USR-77312', nickname: 'Aisha Moon', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', monthlyEarnings: 312000, coinsEarned: 312000, status: 'active', validDays: 15, validHours: 62.0, isNew: false },
        { id: 'USR-66203', nickname: 'Omar Beats', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', monthlyEarnings: 95000, coinsEarned: 95000, status: 'active', validDays: 8, validHours: 25.0, isNew: true },
        { id: 'USR-55194', nickname: 'Sara Light', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', monthlyEarnings: 0, coinsEarned: 0, status: 'frozen', validDays: 0, validHours: 0, isNew: false },
        { id: 'USR-44085', nickname: 'Yusuf Flow', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', monthlyEarnings: 45000, coinsEarned: 45000, status: 'active', validDays: 5, validHours: 18.5, isNew: true },
        { id: 'USR-33076', nickname: 'Nadia Rose', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', monthlyEarnings: 128000, coinsEarned: 128000, status: 'active', validDays: 10, validHours: 35.0, isNew: false },
    ],

    pendingApplications: (() => {
        const firstNames = ['Alex', 'Bella', 'Chris', 'Dana', 'Emma', 'Fadi', 'Grace', 'Hassan', 'Ivy', 'Jake', 'Kira', 'Leo', 'Mia', 'Noah', 'Omar', 'Priya', 'Quinn', 'Rami', 'Sara', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zane']
        const lastNames = ['Star', 'Moon', 'Sky', 'Wave', 'Fire', 'Storm', 'Dawn', 'Peak', 'Flow', 'Zen', 'Ray', 'Glow', 'Drift', 'Rush', 'Spark', 'Vibe', 'Edge', 'Mist', 'Blaze', 'Nova']
        const apps = []
        for (let i = 1; i <= 99; i++) {
            const fn = firstNames[i % firstNames.length]
            const ln = lastNames[i % lastNames.length]
            const day = String(Math.max(1, 23 - Math.floor(i / 5))).padStart(2, '0')
            apps.push({
                id: `APP-${String(i).padStart(3, '0')}`,
                userId: `USR-${90000 + i}`,
                nickname: `${fn} ${ln}`,
                avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i % 70 + 1}.jpg`,
                appliedAt: `2026-02-${day}`
            })
        }
        return apps
    })(),

    historyCycles: [
        { month: 'February 2026', totalDiamonds: 3850000, activeHosts: 35, totalHosts: 40, totalHours: 1120.5 },
        { month: 'January 2026', totalDiamonds: 3120000, activeHosts: 32, totalHosts: 38, totalHours: 980.0 },
        { month: 'December 2025', totalDiamonds: 2850000, activeHosts: 28, totalHosts: 35, totalHours: 850.5 }
    ]
})

// ============ RECOMMENDED AGENCIES ============
export const recommendedAgencies = reactive([
    { id: 'AG-15502', name: 'Dubai Elite Club', logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=DubaiElite', badge: 'Top Rated' },
    { id: 'AG-09871', name: 'MidEast Stars', logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=MidEastStars', badge: 'Popular' },
    { id: 'AG-22340', name: 'Gulf Talent Hub', logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=GulfTalent', badge: 'New' },
    { id: 'AG-31105', name: 'Riyadh Vibes', logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=RiyadhVibes', badge: null },
    { id: 'AG-45670', name: 'Cairo Nights', logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=CairoNights', badge: 'Growing' },
])

// ============ ADMIN DATA ============
export const adminData = reactive({
    agencies: [
        { id: 'AG-15502', name: 'Dubai Elite Club', hostCount: 41, payoutModel: 'dual_track', nextMonthPayoutModel: 'dual_track', status: 'active', monthlyVolume: 3850000 },
        { id: 'AG-09871', name: 'MidEast Stars', hostCount: 128, payoutModel: 'unified', nextMonthPayoutModel: 'unified', status: 'active', monthlyVolume: 12400000 },
        { id: 'AG-22340', name: 'Gulf Talent Hub', hostCount: 23, payoutModel: 'dual_track', nextMonthPayoutModel: 'dual_track', status: 'active', monthlyVolume: 950000 },
        { id: 'AG-31105', name: 'Riyadh Vibes', hostCount: 67, payoutModel: 'unified', nextMonthPayoutModel: 'unified', status: 'frozen', monthlyVolume: 0 },
        { id: 'AG-45670', name: 'Cairo Nights', hostCount: 35, payoutModel: 'dual_track', nextMonthPayoutModel: 'dual_track', status: 'active', monthlyVolume: 2100000 },
    ],

    trendData: [
        { day: 'Feb 17', value: 1850000 },
        { day: 'Feb 18', value: 2100000 },
        { day: 'Feb 19', value: 1950000 },
        { day: 'Feb 20', value: 2800000 },
        { day: 'Feb 21', value: 3200000 },
        { day: 'Feb 22', value: 2900000 },
        { day: 'Feb 23', value: 3500000 },
    ],

    salaryTiers: [
        { level: 1, coinsReq: 100000, days: 15, hours: 30, baseSalary: 59760, micBonus: 14940 },
        { level: 2, coinsReq: 150000, days: 15, hours: 30, baseSalary: 86320, micBonus: 21580 },
        { level: 3, coinsReq: 250000, days: 15, hours: 30, baseSalary: 146080, micBonus: 36520 },
        { level: 4, coinsReq: 500000, days: 15, hours: 30, baseSalary: 292160, micBonus: 73040 },
        { level: 5, coinsReq: 700000, days: 10, hours: 20, baseSalary: 411680, micBonus: 102920 },
    ]
})

// ============ CONSTANTS ============
export const DIAMOND_RATE = 8300 // 1 USD = 8300 Diamonds
export const MIN_WITHDRAW_USD = 5
export const MIN_WITHDRAW_DIAMONDS = MIN_WITHDRAW_USD * DIAMOND_RATE
export const MAX_PIN_ATTEMPTS = 3
export const PIN_LOCK_HOURS = 24
