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
        pinLockedUntil: null,
        paymentInfo: {
            country: '',
            methodId: '',
            formData: {}
        }
    },

    // Agency membership (null = unjoined)
    agency: { id: 'AG-15502', name: 'Dubai Elite Club' },
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
    payoutModel: 'unified',  // 'unified' | 'dual_track'

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
    ],

    // 提现记录
    withdrawRecords: [
        { id: 'W-1001', orderNo: 'WD202603010001', amount: 500.00, fee: 15.00, diamondsDeducted: 50000, paymentMethod: 'Local Banks', accountNo: '****4567', status: 'SUCCESS', subStatus: null, createdAt: '2026-03-01', month: 'Mar 2026' },
        { id: 'W-1002', orderNo: 'WD202603020002', amount: 1200.00, fee: 25.00, diamondsDeducted: 120000, paymentMethod: 'Aman', accountNo: '****4567', status: 'PENDING', subStatus: 'TRANSMIT', createdAt: '2026-03-02', month: 'Mar 2026' },
        { id: 'W-1003', orderNo: 'WD202602280003', amount: 300.00, fee: 10.00, diamondsDeducted: 30000, paymentMethod: 'Fawry', accountNo: '****8901', status: 'FAILED', subStatus: null, createdAt: '2026-02-28', month: 'Feb 2026' },
        { id: 'W-1004', orderNo: 'WD202602150004', amount: 800.00, fee: 20.00, diamondsDeducted: 80000, paymentMethod: 'Local Banks', accountNo: '****4567', status: 'SUCCESS', subStatus: null, createdAt: '2026-02-15', month: 'Feb 2026' },
        { id: 'W-1005', orderNo: 'WD202602100005', amount: 250.00, fee: 8.00, diamondsDeducted: 25000, paymentMethod: 'Meeza Wallets', accountNo: '****8901', status: 'BOUNCEBACK', subStatus: null, createdAt: '2026-02-10', month: 'Feb 2026' },
        { id: 'W-1006', orderNo: 'WD202602050006', amount: 1500.00, fee: 30.00, diamondsDeducted: 150000, paymentMethod: 'Local Banks', accountNo: '****4567', status: 'PENDING', subStatus: 'REVIEW', createdAt: '2026-02-05', month: 'Feb 2026' },
        { id: 'W-1007', orderNo: 'WD202601200007', amount: 600.00, fee: 18.00, diamondsDeducted: 60000, paymentMethod: 'Aman', accountNo: '****1234', status: 'SUCCESS', subStatus: null, createdAt: '2026-01-20', month: 'Jan 2026' },
        { id: 'W-1008', orderNo: 'WD202601100008', amount: 450.00, fee: 12.00, diamondsDeducted: 45000, paymentMethod: 'Fawry', accountNo: '****4567', status: 'SUCCESS', subStatus: null, createdAt: '2026-01-10', month: 'Jan 2026' },
        { id: 'W-1009', orderNo: 'WD202512250009', amount: 200.00, fee: 6.00, diamondsDeducted: 20000, paymentMethod: 'Local Banks', accountNo: '****8901', status: 'FAILED', subStatus: null, createdAt: '2025-12-25', month: 'Dec 2025' },
        { id: 'W-1010', orderNo: 'WD202512150010', amount: 1000.00, fee: 22.00, diamondsDeducted: 100000, paymentMethod: 'Meeza Wallets', accountNo: '****4567', status: 'SUCCESS', subStatus: null, createdAt: '2025-12-15', month: 'Dec 2025' },
    ]
})

// ============ RECHARGE MOCK DATA ============
export const recentContacts = [
    { uid: '63231548', name: 'وكيله نجمه ☆', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=star1' },
    { uid: '52198734', name: 'Ahmed Ali', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ahmed' },
    { uid: '41873926', name: 'Sara Moon', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sara' },
    { uid: '78432156', name: 'Youssef K.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=youssef' },
    { uid: '39218476', name: 'Fatima Rose', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=fatima' },
]

export const mockUsers = [
    ...recentContacts,
    { uid: '11223344', name: 'TestUser01', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=test1' },
    { uid: '55667788', name: 'VIP Player', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vip1' },
]

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

    // To support history cycles, we group members by cycleMonth
    // members[0] = recent 1 (e.g. March 2026)
    // members[1] = recent 2 (e.g. February 2026)
    // members[2] = recent 3 (e.g. January 2026)
    membersHistory: [
        {
            month: '2026-03', // e.g. March
            members: [
                { id: 'USR-88421', nickname: 'DJ Khalid', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', monthlyEarnings: 185000, coinsEarned: 185000, status: 'active', validDays: 12, validHours: 45.5, isNew: false },
                { id: 'USR-77312', nickname: 'Aisha Moon', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', monthlyEarnings: 312000, coinsEarned: 312000, status: 'active', validDays: 15, validHours: 62.0, isNew: false },
                { id: 'USR-66203', nickname: 'Omar Beats', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', monthlyEarnings: 95000, coinsEarned: 95000, status: 'active', validDays: 8, validHours: 25.0, isNew: true },
                { id: 'USR-55194', nickname: 'Sara Light', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', monthlyEarnings: 0, coinsEarned: 0, status: 'frozen', validDays: 0, validHours: 0, isNew: false },
                { id: 'USR-44085', nickname: 'Yusuf Flow', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', monthlyEarnings: 45000, coinsEarned: 45000, status: 'active', validDays: 5, validHours: 18.5, isNew: true },
                { id: 'USR-33076', nickname: 'Nadia Rose', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', monthlyEarnings: 128000, coinsEarned: 128000, status: 'active', validDays: 10, validHours: 35.0, isNew: false },
            ]
        },
        {
            month: '2026-02',
            members: [
                { id: 'USR-88421', nickname: 'DJ Khalid', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', monthlyEarnings: 162000, coinsEarned: 162000, status: 'active', validDays: 15, validHours: 31.2, isNew: false },
                { id: 'USR-77312', nickname: 'Aisha Moon', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', monthlyEarnings: 290000, coinsEarned: 290000, status: 'active', validDays: 20, validHours: 55.0, isNew: false },
                { id: 'USR-33076', nickname: 'Nadia Rose', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', monthlyEarnings: 110000, coinsEarned: 110000, status: 'active', validDays: 12, validHours: 25.0, isNew: false },
            ]
        },
        {
            month: '2026-01',
            members: [
                { id: 'USR-88421', nickname: 'DJ Khalid', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', monthlyEarnings: 120000, coinsEarned: 120000, status: 'active', validDays: 15, validHours: 30.0, isNew: false },
                { id: 'USR-77312', nickname: 'Aisha Moon', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', monthlyEarnings: 250000, coinsEarned: 250000, status: 'active', validDays: 18, validHours: 42.0, isNew: false },
                { id: 'USR-33076', nickname: 'Nadia Rose', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', monthlyEarnings: 95000, coinsEarned: 95000, status: 'active', validDays: 10, validHours: 20.0, isNew: false },
                { id: 'USR-11223', nickname: 'Old Member', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=old', monthlyEarnings: 50000, coinsEarned: 50000, status: 'active', validDays: 5, validHours: 12.0, isNew: false },
            ]
        }
    ],

    // Fallback current members, default to first month
    get members() {
        return this.membersHistory[0].members;
    },

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
    bills: [
        { id: 'ABL-9821', month: '2026-03', date: '2026-03-04 14:00:21', label: 'Host Contribution', amount: 156000, type: 'host_contribution', status: 'normal', host: { id: 'USR-77312', nickname: 'Aisha Moon', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' } },
        { id: 'ABL-9819', month: '2026-03', date: '2026-03-01 10:00:00', label: 'Withdrawal', amount: -500000, type: 'withdraw', status: 'normal' },
        { id: 'ABL-9818', month: '2026-02', date: '2026-02-28 23:59:59', label: 'Exchange Coins', amount: -120000, type: 'exchange_coins', status: 'normal' },
        { id: 'ABL-9817', month: '2026-02', date: '2026-02-15 16:30:00', label: 'Host Contribution', amount: 81000, type: 'host_contribution', status: 'normal', host: { id: 'USR-88421', nickname: 'DJ Khalid', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' } },
    ],

    withdrawRecords: [
        { id: 'AWR-1002', month: '2026-03', amount: 5000.00, status: 'PENDING', subStatus: 'REVIEW', orderNo: 'WDO-20260301-8842', accountNo: '**** **** **** 1234', paymentMethod: 'Bank Transfer', diamondsDeducted: 500000, fee: 25.00, createdAt: '2026-03-01 10:00:00' },
        { id: 'AWR-1001', month: '2026-02', amount: 12500.00, status: 'SUCCESS', subStatus: null, orderNo: 'WDO-20260215-9912', accountNo: '**** **** **** 1234', paymentMethod: 'Bank Transfer', diamondsDeducted: 1250000, fee: 25.00, createdAt: '2026-02-15 09:30:00' },
    ],

    historyCycles: [
        { month: 'February 2026', totalDiamonds: 3850000, activeHosts: 35, totalHosts: 40, totalHours: 1120.5, hostDiamonds: 2695000, agencyDiamonds: 1155000 },
        { month: 'January 2026', totalDiamonds: 3120000, activeHosts: 32, totalHosts: 38, totalHours: 980.0, hostDiamonds: 2184000, agencyDiamonds: 936000 },
        { month: 'December 2025', totalDiamonds: 2850000, activeHosts: 28, totalHosts: 35, totalHours: 850.5, hostDiamonds: 1995000, agencyDiamonds: 855000 }
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
        { id: 'AG-15502', name: 'Dubai Elite Club', hostCount: 41, activeHostCount: 38, payoutModel: 'dual_track', nextMonthPayoutModel: 'dual_track', status: 'active', monthlyVolume: 3850000, lastMonthVolume: 3120000 },
        { id: 'AG-09871', name: 'MidEast Stars', hostCount: 128, activeHostCount: 115, payoutModel: 'unified', nextMonthPayoutModel: 'unified', status: 'active', monthlyVolume: 12400000, lastMonthVolume: 10800000 },
        { id: 'AG-22340', name: 'Gulf Talent Hub', hostCount: 23, activeHostCount: 18, payoutModel: 'dual_track', nextMonthPayoutModel: 'dual_track', status: 'active', monthlyVolume: 950000, lastMonthVolume: 780000 },
        { id: 'AG-31105', name: 'Riyadh Vibes', hostCount: 67, activeHostCount: 0, payoutModel: 'unified', nextMonthPayoutModel: 'unified', status: 'frozen', monthlyVolume: 0, lastMonthVolume: 4200000 },
        { id: 'AG-45670', name: 'Cairo Nights', hostCount: 35, activeHostCount: 30, payoutModel: 'dual_track', nextMonthPayoutModel: 'dual_track', status: 'active', monthlyVolume: 2100000, lastMonthVolume: 1850000 },
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
    ],

    // Mock hosts per agency for admin view
    agencyHosts: {
        'AG-15502': [
            { uid: 'H-10001', name: 'Sara Ahmed', status: 'active', joinDate: '2025-11-15', currentCoins: 185000, lastMonthCoins: 162000, currentDiamonds: 86320, lastMonthDiamonds: 72000, activeDays: 22, lastMonthActiveDays: 25, micHours: 45.5, lastMonthMicHours: 52.0 },
            { uid: 'H-10002', name: 'Fatima Ali', status: 'left', joinDate: '2025-12-01', currentCoins: 95000, lastMonthCoins: 88000, currentDiamonds: 42150, lastMonthDiamonds: 38000, activeDays: 18, lastMonthActiveDays: 20, micHours: 33.2, lastMonthMicHours: 38.0 },
            { uid: 'H-10003', name: 'Nour Hassan', status: 'active', joinDate: '2026-01-10', currentCoins: 250000, lastMonthCoins: 210000, currentDiamonds: 146080, lastMonthDiamonds: 120000, activeDays: 28, lastMonthActiveDays: 26, micHours: 58.0, lastMonthMicHours: 55.0 },
        ],
        'AG-09871': [
            { uid: 'H-20001', name: 'Layla Omar', status: 'active', joinDate: '2025-10-05', currentCoins: 320000, lastMonthCoins: 280000, currentDiamonds: 195000, lastMonthDiamonds: 170000, activeDays: 30, lastMonthActiveDays: 28, micHours: 65.0, lastMonthMicHours: 60.0 },
            { uid: 'H-20002', name: 'Amira Khalid', status: 'active', joinDate: '2025-11-20', currentCoins: 145000, lastMonthCoins: 130000, currentDiamonds: 68000, lastMonthDiamonds: 58000, activeDays: 20, lastMonthActiveDays: 22, micHours: 40.5, lastMonthMicHours: 42.0 },
        ],
        'AG-22340': [
            { uid: 'H-30001', name: 'Rania Mahmoud', status: 'active', joinDate: '2026-01-15', currentCoins: 78000, lastMonthCoins: 52000, currentDiamonds: 32000, lastMonthDiamonds: 22000, activeDays: 15, lastMonthActiveDays: 12, micHours: 28.0, lastMonthMicHours: 20.0 },
        ],
        'AG-45670': [
            { uid: 'H-50001', name: 'Hana Youssef', status: 'active', joinDate: '2025-09-01', currentCoins: 410000, lastMonthCoins: 380000, currentDiamonds: 250000, lastMonthDiamonds: 230000, activeDays: 30, lastMonthActiveDays: 29, micHours: 72.0, lastMonthMicHours: 68.0 },
            { uid: 'H-50002', name: 'Dina Mostafa', status: 'left', joinDate: '2026-02-01', currentCoins: 55000, lastMonthCoins: 0, currentDiamonds: 18000, lastMonthDiamonds: 0, activeDays: 10, lastMonthActiveDays: 0, micHours: 15.0, lastMonthMicHours: 0 },
        ],
    },

    // Admin withdraw orders
    withdrawOrders: [
        { orderNo: 'WD-20260301001', uid: 'H-10001', name: 'Sara Ahmed', agencyId: 'AG-15502', agencyName: 'Dubai Elite Club', diamonds: 50000, usdAmount: '6.02', status: 'completed', date: '2026-03-01' },
        { orderNo: 'WD-20260301002', uid: 'H-20001', name: 'Layla Omar', agencyId: 'AG-09871', agencyName: 'MidEast Stars', diamonds: 120000, usdAmount: '14.46', status: 'pending', date: '2026-03-01' },
        { orderNo: 'WD-20260228001', uid: 'H-50001', name: 'Hana Youssef', agencyId: 'AG-45670', agencyName: 'Cairo Nights', diamonds: 200000, usdAmount: '24.10', status: 'completed', date: '2026-02-28' },
        { orderNo: 'WD-20260228002', uid: 'H-10003', name: 'Nour Hassan', agencyId: 'AG-15502', agencyName: 'Dubai Elite Club', diamonds: 80000, usdAmount: '9.64', status: 'processing', date: '2026-02-28' },
        { orderNo: 'WD-20260227001', uid: 'H-20002', name: 'Amira Khalid', agencyId: 'AG-09871', agencyName: 'MidEast Stars', diamonds: 45000, usdAmount: '5.42', status: 'completed', date: '2026-02-27' },
        { orderNo: 'WD-20260225001', uid: 'H-30001', name: 'Rania Mahmoud', agencyId: 'AG-22340', agencyName: 'Gulf Talent Hub', diamonds: 30000, usdAmount: '3.61', status: 'rejected', date: '2026-02-25' },
    ],
})

// ============ CONSTANTS ============
export const DIAMOND_RATE = 8300 // 1 USD = 8300 Diamonds
export const MIN_WITHDRAW_USD = 5
export const MIN_WITHDRAW_DIAMONDS = MIN_WITHDRAW_USD * DIAMOND_RATE
export const MAX_PIN_ATTEMPTS = 3
export const PIN_LOCK_HOURS = 24
