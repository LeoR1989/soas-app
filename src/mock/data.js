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
            currentLevel: 0, coinsEarned: 88000,
            validDays: { current: 10, target: 15 },
            validHours: { current: 18, target: 30 },
            baseSalary: 0, micBonus: 0,
            status: 'unmet'  // 未达标
        },
        {
            cycleStart: '2025-11-01', cycleEnd: '2025-11-30',
            currentLevel: 0, coinsEarned: 52000,
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
        { id: 'B-10250', type: 'system_grant', label: 'System Grant', amount: 50000, date: '2026-03-05 14:30:22', month: 'Mar 2026', status: 'normal' },
        { id: 'B-10241', type: 'task_salary', label: 'Task Salary Reward', taskLevel: 'Lv.2', amount: 86320, date: '2026-02-28 18:00:00', month: 'Feb 2026', status: 'normal' },
        { id: 'B-10240', type: 'diamond_exchange', label: 'Diamond Exchange', subtitle: '120,000', amount: -120000, date: '2026-02-20 09:15:40', month: 'Feb 2026', status: 'normal' },
        { id: 'B-10239', type: 'diamond_withdraw', label: 'Diamond Withdrawal', subtitle: 'WD202602150004', amount: -80000, date: '2026-02-15 11:22:05', month: 'Feb 2026', status: 'normal' },
        { id: 'B-10238', type: 'system_deduct', label: 'System Deduction', amount: -15000, date: '2026-02-10 16:45:38', month: 'Feb 2026', status: 'normal' },
        { id: 'B-10220', type: 'task_salary', label: 'Task Salary Reward', taskLevel: 'Lv.1', amount: 59760, date: '2026-01-31 18:00:00', month: 'Jan 2026', status: 'normal' },
        { id: 'B-10219', type: 'system_grant', label: 'System Grant', amount: 30000, date: '2026-01-15 10:05:12', month: 'Jan 2026', status: 'normal' },
        { id: 'B-10218', type: 'diamond_exchange', label: 'Diamond Exchange', subtitle: '50,000', amount: -50000, date: '2026-01-10 20:33:17', month: 'Jan 2026', status: 'normal' },
        { id: 'B-10200', type: 'diamond_withdraw', label: 'Diamond Withdrawal', subtitle: 'WD202512250009', amount: -20000, date: '2025-12-25 13:48:55', month: 'Dec 2025', status: 'normal' },
        { id: 'B-10199', type: 'system_deduct', label: 'System Deduction', amount: -8000, date: '2025-12-15 08:12:30', month: 'Dec 2025', status: 'normal' },
    ],

    // 提现记录
    withdrawRecords: [
        { id: 'W-1001', orderNo: 'WD202603010001', amount: 500.00, fee: 15.00, tax: 3.75, diamondsDeducted: 50000, paymentMethod: 'Local Banks', accountNo: '****4567', status: 'SUCCESS', subStatus: null, localAmount: 25425, localCurrency: 'EGP', createdAt: '2026-03-01T14:23:45', month: 'Mar 2026' },
        { id: 'W-1002', orderNo: 'WD202603020002', amount: 1200.00, fee: 25.00, tax: 9.00, diamondsDeducted: 120000, paymentMethod: 'Aman', accountNo: '****4567', status: 'PENDING', subStatus: 'TRANSMIT', localAmount: 61020, localCurrency: 'EGP', createdAt: '2026-03-02T09:15:30', month: 'Mar 2026' },
        { id: 'W-1003', orderNo: 'WD202602280003', amount: 300.00, fee: 10.00, tax: 2.25, diamondsDeducted: 30000, paymentMethod: 'Fawry', accountNo: '****8901', status: 'FAILED', subStatus: null, localAmount: 15255, localCurrency: 'EGP', createdAt: '2026-02-28T16:42:10', month: 'Feb 2026' },
        { id: 'W-1004', orderNo: 'WD202602150004', amount: 800.00, fee: 20.00, tax: 6.00, diamondsDeducted: 80000, paymentMethod: 'Local Banks', accountNo: '****4567', status: 'SUCCESS', subStatus: null, localAmount: 40680, localCurrency: 'EGP', createdAt: '2026-02-15T11:30:00', month: 'Feb 2026' },
        { id: 'W-1005', orderNo: 'WD202602100005', amount: 250.00, fee: 8.00, tax: 1.88, diamondsDeducted: 25000, paymentMethod: 'Meeza Wallets', accountNo: '****8901', status: 'BOUNCEBACK', subStatus: null, localAmount: 12713, localCurrency: 'EGP', createdAt: '2026-02-10T08:20:55', month: 'Feb 2026' },
        { id: 'W-1006', orderNo: 'WD202602050006', amount: 1500.00, fee: 30.00, tax: 11.25, diamondsDeducted: 150000, paymentMethod: 'Local Banks', accountNo: '****4567', status: 'PENDING', subStatus: 'REVIEW', localAmount: 76275, localCurrency: 'EGP', createdAt: '2026-02-05T10:05:20', month: 'Feb 2026' },
        { id: 'W-1007', orderNo: 'WD202601200007', amount: 600.00, fee: 18.00, tax: 4.50, diamondsDeducted: 60000, paymentMethod: 'Aman', accountNo: '****1234', status: 'SUCCESS', subStatus: null, localAmount: 30510, localCurrency: 'EGP', createdAt: '2026-01-20T14:50:30', month: 'Jan 2026' },
        { id: 'W-1008', orderNo: 'WD202601100008', amount: 450.00, fee: 12.00, tax: 3.38, diamondsDeducted: 45000, paymentMethod: 'Fawry', accountNo: '****4567', status: 'SUCCESS', subStatus: null, localAmount: 22883, localCurrency: 'EGP', createdAt: '2026-01-10T09:40:15', month: 'Jan 2026' },
        { id: 'W-1009', orderNo: 'WD202512250009', amount: 200.00, fee: 6.00, tax: 1.50, diamondsDeducted: 20000, paymentMethod: 'Local Banks', accountNo: '****8901', status: 'FAILED', subStatus: null, localAmount: 10170, localCurrency: 'EGP', createdAt: '2025-12-25T17:30:00', month: 'Dec 2025' },
        { id: 'W-1010', orderNo: 'WD202512150010', amount: 1000.00, fee: 22.00, tax: 7.50, diamondsDeducted: 100000, paymentMethod: 'Meeza Wallets', accountNo: '****4567', status: 'SUCCESS', subStatus: null, localAmount: 50850, localCurrency: 'EGP', createdAt: '2025-12-15T12:15:45', month: 'Dec 2025' },
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
                { id: 'USR-44085', nickname: 'Yusuf Flow', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', monthlyEarnings: 0, coinsEarned: 0, status: 'exited', validDays: 0, validHours: 0, isNew: false },
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
        { id: 'ABL-9821', month: '2026-03', date: '2026-03-04 14:00:21', label: 'Task Salary Reward', amount: 156000, type: 'task_salary', status: 'normal', host: { id: 'USR-77312', nickname: 'Aisha Moon', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' } },
        { id: 'ABL-9820', month: '2026-03', date: '2026-03-03 11:30:00', label: 'System Grant', amount: 200000, type: 'system_grant', status: 'normal' },
        { id: 'ABL-9819', month: '2026-03', date: '2026-03-01 10:00:00', label: 'Diamond Withdrawal', amount: -500000, type: 'diamond_withdraw', status: 'normal', subtitle: 'WDO-20260301-8842' },
        { id: 'ABL-9818', month: '2026-02', date: '2026-02-28 23:59:59', label: 'Diamond Exchange', amount: -120000, type: 'diamond_exchange', status: 'normal', subtitle: '120,000' },
        { id: 'ABL-9817', month: '2026-02', date: '2026-02-15 16:30:00', label: 'Task Salary Reward', amount: 81000, type: 'task_salary', status: 'normal', host: { id: 'USR-88421', nickname: 'DJ Khalid', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' } },
        { id: 'ABL-9816', month: '2026-02', date: '2026-02-10 09:00:00', label: 'System Deduction', amount: -30000, type: 'system_deduct', status: 'normal' },
    ],

    withdrawRecords: [
        { id: 'AWR-1002', month: '2026-03', amount: 5000.00, status: 'PENDING', subStatus: 'REVIEW', orderNo: 'WDO-20260301-8842', accountNo: '**** **** **** 1234', paymentMethod: 'Bank Transfer', diamondsDeducted: 500000, fee: 25.00, tax: 18.75, localAmount: 254250, localCurrency: 'EGP', createdAt: '2026-03-01T10:00:00' },
        { id: 'AWR-1001', month: '2026-02', amount: 12500.00, status: 'SUCCESS', subStatus: null, orderNo: 'WDO-20260215-9912', accountNo: '**** **** **** 1234', paymentMethod: 'Bank Transfer', diamondsDeducted: 1250000, fee: 25.00, tax: 46.88, localAmount: 635625, localCurrency: 'EGP', createdAt: '2026-02-15T09:30:00' },
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
        { level: 1, coinsReq: 100000, days: 15, hours: 30, baseSalary: 59760, agencyBase: 6640, micBonus: 14940, agencyMicBonus: 1660 },
        { level: 2, coinsReq: 150000, days: 15, hours: 30, baseSalary: 86320, agencyBase: 19920, micBonus: 21580, agencyMicBonus: 4980 },
        { level: 3, coinsReq: 250000, days: 15, hours: 30, baseSalary: 146080, agencyBase: 33200, micBonus: 36520, agencyMicBonus: 8300 },
        { level: 4, coinsReq: 500000, days: 15, hours: 30, baseSalary: 292160, agencyBase: 66400, micBonus: 73040, agencyMicBonus: 16600 },
        { level: 5, coinsReq: 700000, days: 10, hours: 20, baseSalary: 411680, agencyBase: 92960, micBonus: 102920, agencyMicBonus: 23240 },
        { level: 6, coinsReq: 1000000, days: 10, hours: 20, baseSalary: 584320, agencyBase: 139440, micBonus: 146080, agencyMicBonus: 34860 },
        { level: 7, coinsReq: 1500000, days: 10, hours: 20, baseSalary: 876480, agencyBase: 199200, micBonus: 219120, agencyMicBonus: 49800 },
        { level: 8, coinsReq: 2000000, days: 10, hours: 20, baseSalary: 1181920, agencyBase: 239040, micBonus: 295480, agencyMicBonus: 59760 },
        { level: 9, coinsReq: 2500000, days: 10, hours: 20, baseSalary: 1494000, agencyBase: 298800, micBonus: 373500, agencyMicBonus: 74700 },
        { level: 10, coinsReq: 3000000, days: 10, hours: 20, baseSalary: 1792800, agencyBase: 358560, micBonus: 448200, agencyMicBonus: 89640 },
        { level: 11, coinsReq: 3500000, days: 10, hours: 20, baseSalary: 2091600, agencyBase: 418320, micBonus: 522900, agencyMicBonus: 104580 },
        { level: 12, coinsReq: 4000000, days: 10, hours: 20, baseSalary: 2390400, agencyBase: 478080, micBonus: 597600, agencyMicBonus: 119520 },
        { level: 13, coinsReq: 4500000, days: 10, hours: 20, baseSalary: 2656000, agencyBase: 537840, micBonus: 664000, agencyMicBonus: 134460 },
        { level: 14, coinsReq: 5000000, days: 10, hours: 20, baseSalary: 2921600, agencyBase: 597600, micBonus: 730400, agencyMicBonus: 149400 },
        { level: 15, coinsReq: 6000000, days: 10, hours: 20, baseSalary: 3505920, agencyBase: 717120, micBonus: 876480, agencyMicBonus: 179280 },
        { level: 16, coinsReq: 7000000, days: 10, hours: 20, baseSalary: 4090240, agencyBase: 836640, micBonus: 1022560, agencyMicBonus: 209160 },
        { level: 17, coinsReq: 8500000, days: 10, hours: 20, baseSalary: 4966720, agencyBase: 1015920, micBonus: 1241680, agencyMicBonus: 253980 },
        { level: 18, coinsReq: 10000000, days: 10, hours: 20, baseSalary: 5843200, agencyBase: 1195200, micBonus: 1460800, agencyMicBonus: 298800 },
        { level: 19, coinsReq: 12500000, days: 10, hours: 20, baseSalary: 7304000, agencyBase: 1494000, micBonus: 1826000, agencyMicBonus: 373500 },
        { level: 20, coinsReq: 15000000, days: 10, hours: 20, baseSalary: 8764800, agencyBase: 1792800, micBonus: 2191200, agencyMicBonus: 448200 },
        { level: 21, coinsReq: 20000000, days: 10, hours: 20, baseSalary: 11686400, agencyBase: 2390400, micBonus: 2921600, agencyMicBonus: 597600 },
        { level: 22, coinsReq: 25000000, days: 5, hours: 10, baseSalary: 14608000, agencyBase: 2988000, micBonus: 3652000, agencyMicBonus: 747000 },
        { level: 23, coinsReq: 30000000, days: 5, hours: 10, baseSalary: 17529600, agencyBase: 3585600, micBonus: 4382400, agencyMicBonus: 896400 },
        { level: 24, coinsReq: 35000000, days: 5, hours: 10, baseSalary: 20451200, agencyBase: 4183200, micBonus: 5112800, agencyMicBonus: 1045800 },
        { level: 25, coinsReq: 40000000, days: 5, hours: 10, baseSalary: 23372800, agencyBase: 4780800, micBonus: 5843200, agencyMicBonus: 1195200 },
        { level: 26, coinsReq: 45000000, days: 5, hours: 10, baseSalary: 26294400, agencyBase: 5378400, micBonus: 6573600, agencyMicBonus: 1344600 },
        { level: 27, coinsReq: 50000000, days: 5, hours: 10, baseSalary: 29216000, agencyBase: 5976000, micBonus: 7304000, agencyMicBonus: 1494000 },
        { level: 28, coinsReq: 75000000, days: 5, hours: 10, baseSalary: 43824000, agencyBase: 8964000, micBonus: 10956000, agencyMicBonus: 2241000 },
        { level: 29, coinsReq: 100000000, days: 5, hours: 10, baseSalary: 58432000, agencyBase: 11952000, micBonus: 14608000, agencyMicBonus: 2988000 },
        { level: 30, coinsReq: 125000000, days: 5, hours: 10, baseSalary: 73040000, agencyBase: 14940000, micBonus: 18260000, agencyMicBonus: 3735000 },
        { level: 31, coinsReq: 150000000, days: 5, hours: 10, baseSalary: 87648000, agencyBase: 17928000, micBonus: 21912000, agencyMicBonus: 4482000 },
        { level: 32, coinsReq: 200000000, days: 5, hours: 10, baseSalary: 116864000, agencyBase: 23904000, micBonus: 29216000, agencyMicBonus: 5976000 },
        { level: 33, coinsReq: 250000000, days: 5, hours: 10, baseSalary: 146080000, agencyBase: 29880000, micBonus: 36520000, agencyMicBonus: 7470000 },
        { level: 34, coinsReq: 300000000, days: 5, hours: 10, baseSalary: 175296000, agencyBase: 35856000, micBonus: 43824000, agencyMicBonus: 8964000 },
        { level: 35, coinsReq: 350000000, days: 5, hours: 10, baseSalary: 204512000, agencyBase: 41832000, micBonus: 51128000, agencyMicBonus: 10458000 },
        { level: 36, coinsReq: 400000000, days: 5, hours: 10, baseSalary: 233728000, agencyBase: 47808000, micBonus: 58432000, agencyMicBonus: 11952000 },
        { level: 37, coinsReq: 450000000, days: 5, hours: 10, baseSalary: 262944000, agencyBase: 53784000, micBonus: 65736000, agencyMicBonus: 13446000 },
        { level: 38, coinsReq: 500000000, days: 5, hours: 10, baseSalary: 292160000, agencyBase: 59760000, micBonus: 73040000, agencyMicBonus: 14940000 },
        { level: 39, coinsReq: 750000000, days: 5, hours: 10, baseSalary: 438240000, agencyBase: 89640000, micBonus: 109560000, agencyMicBonus: 22410000 },
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

    // ============ BD MANAGEMENT DATA ============
    bds: [
        { id: 'BD-00101', nickname: 'Ali Promoter', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', level: 5, agencyCount: 8, validAgencies: 7, teamRevenue: 31_900_000, status: 'active', bindDate: '2025-12-01', signedThisMonth: 2, signedLastMonth: 3 },
        { id: 'BD-00102', nickname: 'Fatima Sales', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', level: 4, agencyCount: 6, validAgencies: 4, teamRevenue: 24_800_000, status: 'active', bindDate: '2025-11-15', signedThisMonth: 1, signedLastMonth: 2 },
        { id: 'BD-00103', nickname: 'Omar Growth', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', level: 5, agencyCount: 8, validAgencies: 6, teamRevenue: 33_500_000, status: 'active', bindDate: '2026-01-01', signedThisMonth: 3, signedLastMonth: 2 },
        { id: 'BD-00104', nickname: 'Layla Connect', avatar: 'https://randomuser.me/api/portraits/women/25.jpg', level: 2, agencyCount: 3, validAgencies: 2, teamRevenue: 8_200_000, status: 'active', bindDate: '2026-02-01', signedThisMonth: 1, signedLastMonth: 0 },
        { id: 'BD-00105', nickname: 'Rami Network', avatar: 'https://randomuser.me/api/portraits/men/61.jpg', level: 5, agencyCount: 5, validAgencies: 5, teamRevenue: 35_600_000, status: 'frozen', bindDate: '2025-10-15', signedThisMonth: 0, signedLastMonth: 1 },
    ],

    // BD旗下公会（按BD ID索引）
    bdAgencies: {
        'BD-00101': [
            { id: 'AG-15502', name: 'Dubai Elite Club', totalHosts: 41, validHostCount: 12, income: 3_850_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
            { id: 'AG-09871', name: 'MidEast Stars', totalHosts: 128, validHostCount: 35, income: 12_400_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
            { id: 'AG-22340', name: 'Gulf Talent Hub', totalHosts: 23, validHostCount: 8, income: 2_950_000, bindDate: '2026-01-10', expireDate: '2026-04-30' },
            { id: 'AG-45670', name: 'Cairo Nights', totalHosts: 35, validHostCount: 10, income: 4_100_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
            { id: 'AG-56781', name: 'Nile Creators', totalHosts: 15, validHostCount: 6, income: 2_620_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
            { id: 'AG-67892', name: 'Sahara Vibes', totalHosts: 8, validHostCount: 3, income: 980_000, bindDate: '2026-03-01', expireDate: '2026-06-30' },
            { id: 'AG-78903', name: 'Red Sea Studio', totalHosts: 20, validHostCount: 7, income: 3_200_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
            { id: 'AG-89014', name: 'Luxor Live', totalHosts: 12, validHostCount: 6, income: 1_800_000, bindDate: '2026-01-20', expireDate: '2026-04-30' },
        ],
        'BD-00102': [
            { id: 'AG-20101', name: 'Pyramid Stars', totalHosts: 32, validHostCount: 15, income: 6_800_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
            { id: 'AG-20102', name: 'Alexandria Vibes', totalHosts: 18, validHostCount: 9, income: 4_200_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
            { id: 'AG-20103', name: 'Delta Network', totalHosts: 25, validHostCount: 11, income: 5_500_000, bindDate: '2026-01-15', expireDate: '2026-04-30' },
            { id: 'AG-20104', name: 'Suez Connect', totalHosts: 14, validHostCount: 4, income: 3_100_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
            { id: 'AG-20105', name: 'Sinai Live', totalHosts: 10, validHostCount: 3, income: 2_800_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
            { id: 'AG-20106', name: 'Aswan Talent', totalHosts: 8, validHostCount: 2, income: 2_400_000, bindDate: '2026-03-01', expireDate: '2026-06-30' },
        ],
        'BD-00103': [
            { id: 'AG-30101', name: 'Jeddah Elite', totalHosts: 45, validHostCount: 20, income: 8_500_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
            { id: 'AG-30102', name: 'Riyadh Connect', totalHosts: 55, validHostCount: 25, income: 9_200_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
            { id: 'AG-30103', name: 'Dammam Stars', totalHosts: 20, validHostCount: 8, income: 3_800_000, bindDate: '2026-01-10', expireDate: '2026-04-30' },
            { id: 'AG-30104', name: 'Mecca Network', totalHosts: 30, validHostCount: 12, income: 4_500_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
            { id: 'AG-30105', name: 'Medina Live', totalHosts: 15, validHostCount: 6, income: 2_800_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
            { id: 'AG-30106', name: 'Tabuk Talent', totalHosts: 12, validHostCount: 5, income: 1_900_000, bindDate: '2026-03-01', expireDate: '2026-06-30' },
            { id: 'AG-30107', name: 'Abha Stars', totalHosts: 8, validHostCount: 3, income: 1_500_000, bindDate: '2026-03-05', expireDate: '2026-06-30' },
            { id: 'AG-30108', name: 'Taif Hub', totalHosts: 6, validHostCount: 2, income: 1_300_000, bindDate: '2026-03-10', expireDate: '2026-06-30' },
        ],
        'BD-00104': [
            { id: 'AG-40101', name: 'Kuwait Connect', totalHosts: 18, validHostCount: 7, income: 3_200_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
            { id: 'AG-40102', name: 'Bahrain Elite', totalHosts: 12, validHostCount: 5, income: 2_600_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
            { id: 'AG-40103', name: 'Qatar Stars', totalHosts: 8, validHostCount: 3, income: 2_400_000, bindDate: '2026-03-01', expireDate: '2026-06-30' },
        ],
        'BD-00105': [
            { id: 'AG-50101', name: 'Oman Network', totalHosts: 25, validHostCount: 12, income: 7_200_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
            { id: 'AG-50102', name: 'UAE Connect', totalHosts: 35, validHostCount: 18, income: 9_800_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
            { id: 'AG-50103', name: 'Jordan Stars', totalHosts: 20, validHostCount: 10, income: 6_500_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
            { id: 'AG-50104', name: 'Lebanon Live', totalHosts: 15, validHostCount: 8, income: 5_800_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
            { id: 'AG-50105', name: 'Iraq Hub', totalHosts: 10, validHostCount: 5, income: 6_300_000, bindDate: '2026-01-15', expireDate: '2026-04-30' },
        ],
    },

    // BD旗下公会历史月度快照（按BD ID -> 月份索引）
    // 当前月 (2026-03) 使用 bdAgencies 实时数据，这里存储往期
    bdAgencySnapshots: {
        'BD-00101': {
            '2026-02': {
                stats: { level: 4, agencyCount: 7, validAgencies: 5, teamRevenue: 25_200_000 },
                agencies: [
                    { id: 'AG-15502', name: 'Dubai Elite Club', totalHosts: 38, validHostCount: 10, income: 3_200_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
                    { id: 'AG-09871', name: 'MidEast Stars', totalHosts: 120, validHostCount: 30, income: 10_800_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
                    { id: 'AG-22340', name: 'Gulf Talent Hub', totalHosts: 20, validHostCount: 6, income: 2_400_000, bindDate: '2026-01-10', expireDate: '2026-04-30' },
                    { id: 'AG-45670', name: 'Cairo Nights', totalHosts: 30, validHostCount: 8, income: 3_500_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
                    { id: 'AG-56781', name: 'Nile Creators', totalHosts: 12, validHostCount: 5, income: 2_100_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
                    { id: 'AG-78903', name: 'Red Sea Studio', totalHosts: 18, validHostCount: 6, income: 2_800_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
                    { id: 'AG-89014', name: 'Luxor Live', totalHosts: 10, validHostCount: 4, income: 1_400_000, bindDate: '2026-01-20', expireDate: '2026-04-30' },
                ]
            },
            '2026-01': {
                stats: { level: 3, agencyCount: 5, validAgencies: 4, teamRevenue: 18_500_000 },
                agencies: [
                    { id: 'AG-15502', name: 'Dubai Elite Club', totalHosts: 35, validHostCount: 9, income: 2_800_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
                    { id: 'AG-09871', name: 'MidEast Stars', totalHosts: 110, validHostCount: 26, income: 9_200_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
                    { id: 'AG-22340', name: 'Gulf Talent Hub', totalHosts: 18, validHostCount: 5, income: 1_900_000, bindDate: '2026-01-10', expireDate: '2026-04-30' },
                    { id: 'AG-78903', name: 'Red Sea Studio', totalHosts: 16, validHostCount: 5, income: 2_500_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
                    { id: 'AG-89014', name: 'Luxor Live', totalHosts: 8, validHostCount: 3, income: 1_100_000, bindDate: '2026-01-20', expireDate: '2026-04-30' },
                ]
            },
            '2025-12': {
                stats: { level: 1, agencyCount: 3, validAgencies: 2, teamRevenue: 6_800_000 },
                agencies: [
                    { id: 'AG-15502', name: 'Dubai Elite Club', totalHosts: 30, validHostCount: 7, income: 2_200_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
                    { id: 'AG-09871', name: 'MidEast Stars', totalHosts: 95, validHostCount: 20, income: 2_800_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
                    { id: 'AG-78903', name: 'Red Sea Studio', totalHosts: 14, validHostCount: 5, income: 1_800_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
                ]
            },
        },
        'BD-00102': {
            '2026-02': {
                stats: { level: 3, agencyCount: 5, validAgencies: 3, teamRevenue: 16_800_000 },
                agencies: [
                    { id: 'AG-20101', name: 'Pyramid Stars', totalHosts: 28, validHostCount: 12, income: 5_600_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
                    { id: 'AG-20102', name: 'Alexandria Vibes', totalHosts: 15, validHostCount: 7, income: 3_500_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                    { id: 'AG-20103', name: 'Delta Network', totalHosts: 22, validHostCount: 9, income: 4_200_000, bindDate: '2026-01-15', expireDate: '2026-04-30' },
                    { id: 'AG-20104', name: 'Suez Connect', totalHosts: 12, validHostCount: 3, income: 2_100_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
                    { id: 'AG-20105', name: 'Sinai Live', totalHosts: 8, validHostCount: 2, income: 1_400_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
                ]
            },
            '2026-01': {
                stats: { level: 2, agencyCount: 3, validAgencies: 2, teamRevenue: 10_500_000 },
                agencies: [
                    { id: 'AG-20101', name: 'Pyramid Stars', totalHosts: 25, validHostCount: 10, income: 4_800_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
                    { id: 'AG-20102', name: 'Alexandria Vibes', totalHosts: 12, validHostCount: 5, income: 2_900_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                    { id: 'AG-20103', name: 'Delta Network', totalHosts: 18, validHostCount: 7, income: 2_800_000, bindDate: '2026-01-15', expireDate: '2026-04-30' },
                ]
            },
            '2025-12': {
                stats: { level: 1, agencyCount: 1, validAgencies: 1, teamRevenue: 4_800_000 },
                agencies: [
                    { id: 'AG-20101', name: 'Pyramid Stars', totalHosts: 20, validHostCount: 8, income: 4_800_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
                ]
            },
        },
        'BD-00103': {
            '2026-02': {
                stats: { level: 4, agencyCount: 7, validAgencies: 5, teamRevenue: 26_500_000 },
                agencies: [
                    { id: 'AG-30101', name: 'Jeddah Elite', totalHosts: 40, validHostCount: 18, income: 7_200_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                    { id: 'AG-30102', name: 'Riyadh Connect', totalHosts: 50, validHostCount: 22, income: 8_100_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
                    { id: 'AG-30103', name: 'Dammam Stars', totalHosts: 18, validHostCount: 7, income: 3_200_000, bindDate: '2026-01-10', expireDate: '2026-04-30' },
                    { id: 'AG-30104', name: 'Mecca Network', totalHosts: 25, validHostCount: 10, income: 3_800_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
                    { id: 'AG-30105', name: 'Medina Live', totalHosts: 12, validHostCount: 5, income: 2_200_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
                    { id: 'AG-30106', name: 'Tabuk Talent', totalHosts: 10, validHostCount: 3, income: 1_200_000, bindDate: '2026-03-01', expireDate: '2026-06-30' },
                    { id: 'AG-30107', name: 'Abha Stars', totalHosts: 6, validHostCount: 2, income: 800_000, bindDate: '2026-03-05', expireDate: '2026-06-30' },
                ]
            },
            '2026-01': {
                stats: { level: 3, agencyCount: 4, validAgencies: 3, teamRevenue: 19_200_000 },
                agencies: [
                    { id: 'AG-30101', name: 'Jeddah Elite', totalHosts: 35, validHostCount: 15, income: 6_000_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                    { id: 'AG-30102', name: 'Riyadh Connect', totalHosts: 45, validHostCount: 18, income: 7_000_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
                    { id: 'AG-30103', name: 'Dammam Stars', totalHosts: 15, validHostCount: 6, income: 2_700_000, bindDate: '2026-01-10', expireDate: '2026-04-30' },
                    { id: 'AG-30104', name: 'Mecca Network', totalHosts: 20, validHostCount: 8, income: 3_500_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
                ]
            },
            '2025-12': {
                stats: { level: 2, agencyCount: 2, validAgencies: 2, teamRevenue: 12_500_000 },
                agencies: [
                    { id: 'AG-30101', name: 'Jeddah Elite', totalHosts: 28, validHostCount: 12, income: 5_200_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                    { id: 'AG-30102', name: 'Riyadh Connect', totalHosts: 40, validHostCount: 15, income: 7_300_000, bindDate: '2025-12-15', expireDate: '2026-03-31' },
                ]
            },
        },
        'BD-00104': {
            '2026-02': {
                stats: { level: 1, agencyCount: 2, validAgencies: 1, teamRevenue: 5_400_000 },
                agencies: [
                    { id: 'AG-40101', name: 'Kuwait Connect', totalHosts: 15, validHostCount: 5, income: 2_800_000, bindDate: '2026-02-01', expireDate: '2026-05-31' },
                    { id: 'AG-40102', name: 'Bahrain Elite', totalHosts: 10, validHostCount: 4, income: 2_600_000, bindDate: '2026-02-15', expireDate: '2026-05-31' },
                ]
            },
            '2026-01': {
                stats: { level: 0, agencyCount: 0, validAgencies: 0, teamRevenue: 0 },
                agencies: []
            },
            '2025-12': {
                stats: { level: 0, agencyCount: 0, validAgencies: 0, teamRevenue: 0 },
                agencies: []
            },
        },
        'BD-00105': {
            '2026-02': {
                stats: { level: 5, agencyCount: 5, validAgencies: 5, teamRevenue: 34_200_000 },
                agencies: [
                    { id: 'AG-50101', name: 'Oman Network', totalHosts: 23, validHostCount: 11, income: 6_800_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
                    { id: 'AG-50102', name: 'UAE Connect', totalHosts: 32, validHostCount: 16, income: 9_200_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
                    { id: 'AG-50103', name: 'Jordan Stars', totalHosts: 18, validHostCount: 9, income: 6_100_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
                    { id: 'AG-50104', name: 'Lebanon Live', totalHosts: 13, validHostCount: 7, income: 5_500_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                    { id: 'AG-50105', name: 'Iraq Hub', totalHosts: 9, validHostCount: 5, income: 6_600_000, bindDate: '2026-01-15', expireDate: '2026-04-30' },
                ]
            },
            '2026-01': {
                stats: { level: 4, agencyCount: 4, validAgencies: 4, teamRevenue: 28_500_000 },
                agencies: [
                    { id: 'AG-50101', name: 'Oman Network', totalHosts: 20, validHostCount: 10, income: 6_200_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
                    { id: 'AG-50102', name: 'UAE Connect', totalHosts: 28, validHostCount: 14, income: 8_500_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
                    { id: 'AG-50103', name: 'Jordan Stars', totalHosts: 15, validHostCount: 8, income: 5_500_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
                    { id: 'AG-50104', name: 'Lebanon Live', totalHosts: 10, validHostCount: 6, income: 8_300_000, bindDate: '2026-01-01', expireDate: '2026-04-30' },
                ]
            },
            '2025-12': {
                stats: { level: 3, agencyCount: 3, validAgencies: 3, teamRevenue: 18_800_000 },
                agencies: [
                    { id: 'AG-50101', name: 'Oman Network', totalHosts: 18, validHostCount: 8, income: 5_500_000, bindDate: '2025-10-15', expireDate: '2026-01-31' },
                    { id: 'AG-50102', name: 'UAE Connect', totalHosts: 25, validHostCount: 12, income: 7_800_000, bindDate: '2025-11-01', expireDate: '2026-02-28' },
                    { id: 'AG-50103', name: 'Jordan Stars', totalHosts: 12, validHostCount: 6, income: 5_500_000, bindDate: '2025-12-01', expireDate: '2026-03-31' },
                ]
            },
        },
    },

    // BD薪资结算历史（按BD ID索引）
    bdSalaryHistory: {
        'BD-00101': [
            { month: 'March 2026', issuedAt: '2026-03-15 10:00:00', type: 'bd_task', level: 5, teamRevenue: 31_900_000, salary: 2_490_000, status: 'pending_confirm' },
            { month: 'February 2026', issuedAt: '2026-02-28 18:00:00', type: 'system', level: 5, teamRevenue: 25_200_000, salary: 2_490_000, status: 'issued', reason: 'February performance settlement' },
            { month: 'January 2026', issuedAt: '2026-01-31 17:30:00', type: 'bd_task', level: 4, teamRevenue: 18_500_000, salary: 1_660_000, status: 'issued' },
            { month: 'December 2025', issuedAt: '2025-12-31 16:00:00', type: 'system', level: 2, teamRevenue: 6_800_000, salary: 415_000, status: 'issued', reason: 'December quarterly bonus' },
        ],
        'BD-00102': [
            { month: 'March 2026', issuedAt: '2026-03-14 11:00:00', type: 'bd_task', level: 4, teamRevenue: 24_800_000, salary: 1_660_000, status: 'pending_confirm' },
            { month: 'February 2026', issuedAt: '2026-02-28 18:30:00', type: 'system', level: 3, teamRevenue: 16_800_000, salary: 830_000, status: 'issued', reason: 'February performance settlement' },
            { month: 'January 2026', issuedAt: '2026-01-31 17:00:00', type: 'bd_task', level: 2, teamRevenue: 10_500_000, salary: 415_000, status: 'issued' },
        ],
        'BD-00103': [
            { month: 'March 2026', issuedAt: '2026-03-16 09:30:00', type: 'system', level: 6, teamRevenue: 33_500_000, salary: 3_320_000, status: 'pending_confirm', reason: 'March early settlement' },
            { month: 'February 2026', issuedAt: '2026-02-28 19:00:00', type: 'bd_task', level: 5, teamRevenue: 26_500_000, salary: 2_490_000, status: 'issued' },
            { month: 'January 2026', issuedAt: '2026-01-31 18:00:00', type: 'system', level: 3, teamRevenue: 19_200_000, salary: 830_000, status: 'issued', reason: 'January performance settlement' },
        ],
        'BD-00104': [
            { month: 'March 2026', issuedAt: '2026-03-13 14:00:00', type: 'bd_task', level: 2, teamRevenue: 8_200_000, salary: 415_000, status: 'pending_confirm' },
            { month: 'February 2026', issuedAt: '2026-02-28 17:00:00', type: 'system', level: 1, teamRevenue: 5_400_000, salary: 207_500, status: 'issued', reason: 'February performance settlement' },
        ],
        'BD-00105': [
            { month: 'March 2026', issuedAt: '2026-03-15 12:00:00', type: 'system', level: 5, teamRevenue: 35_600_000, salary: 2_490_000, status: 'pending_confirm', reason: 'March performance settlement' },
            { month: 'February 2026', issuedAt: '2026-02-28 20:00:00', type: 'bd_task', level: 5, teamRevenue: 34_200_000, salary: 2_490_000, status: 'issued' },
            { month: 'January 2026', issuedAt: '2026-01-31 19:00:00', type: 'system', level: 4, teamRevenue: 28_500_000, salary: 1_660_000, status: 'issued', reason: 'January performance settlement' },
            { month: 'December 2025', issuedAt: '2025-12-31 15:30:00', type: 'bd_task', level: 3, teamRevenue: 18_800_000, salary: 830_000, status: 'issued' },
        ],
    },

    // BD提现订单
    bdWithdrawOrders: [
        { orderNo: 'BWD-20260305001', bdId: 'BD-00101', bdName: 'Ali Promoter', diamonds: 500_000, usdAmount: '60.24', status: 'pending', date: '2026-03-05' },
        { orderNo: 'BWD-20260228001', bdId: 'BD-00102', bdName: 'Fatima Sales', diamonds: 800_000, usdAmount: '96.39', status: 'completed', date: '2026-02-28' },
        { orderNo: 'BWD-20260225001', bdId: 'BD-00103', bdName: 'Omar Growth', diamonds: 1_200_000, usdAmount: '144.58', status: 'completed', date: '2026-02-25' },
        { orderNo: 'BWD-20260220001', bdId: 'BD-00101', bdName: 'Ali Promoter', diamonds: 300_000, usdAmount: '36.14', status: 'completed', date: '2026-02-20' },
        { orderNo: 'BWD-20260215001', bdId: 'BD-00104', bdName: 'Layla Connect', diamonds: 200_000, usdAmount: '24.10', status: 'processing', date: '2026-02-15' },
        { orderNo: 'BWD-20260210001', bdId: 'BD-00105', bdName: 'Rami Network', diamonds: 1_500_000, usdAmount: '180.72', status: 'rejected', date: '2026-02-10' },
        { orderNo: 'BWD-20260201001', bdId: 'BD-00102', bdName: 'Fatima Sales', diamonds: 600_000, usdAmount: '72.29', status: 'completed', date: '2026-02-01' },
        { orderNo: 'BWD-20260120001', bdId: 'BD-00103', bdName: 'Omar Growth', diamonds: 900_000, usdAmount: '108.43', status: 'completed', date: '2026-01-20' },
    ],

    // Admin withdraw orders
    withdrawOrders: [
        { orderNo: 'WD-20260301001', uid: 'H-10001', name: 'Sara Ahmed', agencyId: 'AG-15502', agencyName: 'Dubai Elite Club', diamonds: 50000, usdAmount: '6.02', status: 'completed', date: '2026-03-01' },
        { orderNo: 'WD-20260301002', uid: 'H-20001', name: 'Layla Omar', agencyId: 'AG-09871', agencyName: 'MidEast Stars', diamonds: 120000, usdAmount: '14.46', status: 'pending', date: '2026-03-01' },
        { orderNo: 'WD-20260228001', uid: 'H-50001', name: 'Hana Youssef', agencyId: 'AG-45670', agencyName: 'Cairo Nights', diamonds: 200000, usdAmount: '24.10', status: 'completed', date: '2026-02-28' },
        { orderNo: 'WD-20260228002', uid: 'H-10003', name: 'Nour Hassan', agencyId: 'AG-15502', agencyName: 'Dubai Elite Club', diamonds: 80000, usdAmount: '9.64', status: 'processing', date: '2026-02-28' },
        { orderNo: 'WD-20260227001', uid: 'H-20002', name: 'Amira Khalid', agencyId: 'AG-09871', agencyName: 'MidEast Stars', diamonds: 45000, usdAmount: '5.42', status: 'completed', date: '2026-02-27' },
        { orderNo: 'WD-20260225001', uid: 'H-30001', name: 'Rania Mahmoud', agencyId: 'AG-22340', agencyName: 'Gulf Talent Hub', diamonds: 30000, usdAmount: '3.61', status: 'rejected', date: '2026-02-25' },
    ],

    // ============ SETTLEMENT BUDGET ACCOUNT ============
    settlementBudget: {
        balance: 50_000_000,
        transactions: [
            { id: 'SBT-001', type: 'recharge', amount: 30_000_000, date: '2026-03-01 10:00:00', note: 'Monthly budget top-up', operator: 'Saul@gugukapp.com' },
            { id: 'SBT-002', type: 'recharge', amount: 20_000_000, date: '2026-02-15 14:00:00', note: 'Q1 budget allocation', operator: 'Saul@gugukapp.com' },
            { id: 'SBT-003', type: 'settlement', amount: -2_490_000, date: '2026-02-28 18:00:00', bdUid: 'BD-00102', bdName: 'Fatima Sales', reason: 'February performance settlement', status: 'issued', orderId: 'STL-20260228001', operator: 'Saul@gugukapp.com' },
            { id: 'SBT-004', type: 'settlement', amount: -3_320_000, date: '2026-02-28 18:30:00', bdUid: 'BD-00103', bdName: 'Omar Growth', reason: 'February performance settlement', status: 'issued', orderId: 'STL-20260228002', operator: 'Leo@gugukapp.com' },
        ],
    },

    // Settlement orders (for tracking status)
    settlementOrders: [
        { id: 'STL-20260228001', bdUid: 'BD-00102', bdName: 'Fatima Sales', diamonds: 2_490_000, reason: 'February performance settlement', status: 'issued', createdAt: '2026-02-28 18:00:00', confirmedAt: '2026-02-28 19:15:00' },
        { id: 'STL-20260228002', bdUid: 'BD-00103', bdName: 'Omar Growth', diamonds: 3_320_000, reason: 'February performance settlement', status: 'issued', createdAt: '2026-02-28 18:30:00', confirmedAt: '2026-02-28 20:00:00' },
    ],
})

// ============ BD (推广员) MOCK DATA ============
export const bdData = reactive({
    user: {
        id: 'BD-00101',
        nickname: 'Ali Promoter',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        isKycVerified: false,
        hasPinSetup: false,
        pin: null,
        pinAttempts: 0,
        pinLockedUntil: null,
        paymentInfo: {
            country: '',
            methodId: '',
            formData: {}
        },
        superAdminId: 'SA-00001',
        superAdminName: 'Hassan Leader',
        bindDate: '2025-12-01', // BD与SA绑定日期
    },

    // 钻石余额
    balance: {
        available: 1_245_000,
        frozen: 207_500,
    },

    // BD薪资等级表 (USD折算为钻石, 1 USD = 8300 💎)
    // 双条件: 有效公会数 + 团队总流水
    // 有效公会: ≥5名有效主播 且 公会收入≥$200(1,660,000💎)
    // 有效主播: 完成20小时+10天月排班
    salaryTiers: [
        { level: 1, validGuildsReq: 1, teamRevenueReq: 2_490_000,  totalSalary: 207_500 },
        { level: 2, validGuildsReq: 2, teamRevenueReq: 4_980_000,  totalSalary: 415_000 },
        { level: 3, validGuildsReq: 3, teamRevenueReq: 8_300_000,  totalSalary: 830_000 },
        { level: 4, validGuildsReq: 4, teamRevenueReq: 16_600_000, totalSalary: 1_660_000 },
        { level: 5, validGuildsReq: 5, teamRevenueReq: 24_900_000, totalSalary: 2_490_000 },
        { level: 6, validGuildsReq: 6, teamRevenueReq: 33_200_000, totalSalary: 3_320_000 },
        { level: 7, validGuildsReq: 7, teamRevenueReq: 49_800_000, totalSalary: 4_980_000 },
        { level: 8, validGuildsReq: 8, teamRevenueReq: 66_400_000, totalSalary: 6_640_000 },
    ],

    // BD旗下公会
    // validHostCount: 有效主播数(完成20h+10天)
    // income: 公会当月收入
    // 有效公会条件: validHostCount >= 5 且 income >= 1,660,000 (≥$200)
    agencies: [
        { id: 'AG-15502', name: 'Dubai Elite Club', totalHosts: 41, validHostCount: 12, income: 3_850_000, status: 'active', bindDate: '2025-12-15' },
        { id: 'AG-09871', name: 'MidEast Stars', totalHosts: 128, validHostCount: 35, income: 12_400_000, status: 'active', bindDate: '2025-11-01' },
        { id: 'AG-22340', name: 'Gulf Talent Hub', totalHosts: 23, validHostCount: 8, income: 2_950_000, status: 'active', bindDate: '2026-01-10' },
        { id: 'AG-45670', name: 'Cairo Nights', totalHosts: 35, validHostCount: 10, income: 4_100_000, status: 'active', bindDate: '2026-02-01' },
        { id: 'AG-56781', name: 'Nile Creators', totalHosts: 15, validHostCount: 6, income: 2_620_000, status: 'active', bindDate: '2026-02-15' },
        { id: 'AG-67892', name: 'Sahara Vibes', totalHosts: 8, validHostCount: 3, income: 980_000, status: 'active', bindDate: '2026-03-01' },
        { id: 'AG-78903', name: 'Red Sea Studio', totalHosts: 20, validHostCount: 7, income: 3_200_000, status: 'active', bindDate: '2025-10-15' },
        { id: 'AG-89014', name: 'Luxor Live', totalHosts: 12, validHostCount: 6, income: 1_800_000, status: 'active', bindDate: '2026-01-20' },
    ],

    // 当前周期汇总 - 双条件判定
    get currentCycle() {
        const VALID_GUILD_MIN_HOSTS = 5
        const VALID_GUILD_MIN_INCOME = 1_660_000 // $200 * 8300
        const teamRevenue = this.agencies.reduce((sum, a) => sum + a.income, 0)
        const validGuilds = this.agencies.filter(a => a.validHostCount >= VALID_GUILD_MIN_HOSTS && a.income >= VALID_GUILD_MIN_INCOME).length
        let currentLevel = 0
        let currentSalary = 0
        for (let i = this.salaryTiers.length - 1; i >= 0; i--) {
            const tier = this.salaryTiers[i]
            if (validGuilds >= tier.validGuildsReq && teamRevenue >= tier.teamRevenueReq) {
                currentLevel = tier.level
                currentSalary = tier.totalSalary
                break
            }
        }
        return { teamRevenue, validGuilds, currentLevel, currentSalary, totalGuilds: this.agencies.length }
    },

    // 周期结算历史
    cycles: [
        {
            month: 'March 2026', cycleStart: '2026-03-01', cycleEnd: '2026-03-31',
            level: 5, teamRevenue: 31_300_000, validGuilds: 6, totalGuilds: 8,
            salary: 2_490_000,
            status: 'in_progress'
        },
        {
            month: 'February 2026', cycleStart: '2026-02-01', cycleEnd: '2026-02-28',
            level: 5, teamRevenue: 25_200_000, validGuilds: 6, totalGuilds: 7,
            salary: 2_490_000,
            status: 'settled'
        },
        {
            month: 'January 2026', cycleStart: '2026-01-01', cycleEnd: '2026-01-31',
            level: 4, teamRevenue: 18_500_000, validGuilds: 5, totalGuilds: 6,
            salary: 1_660_000,
            status: 'settled'
        },
        {
            month: 'December 2025', cycleStart: '2025-12-01', cycleEnd: '2025-12-31',
            level: 2, teamRevenue: 6_800_000, validGuilds: 3, totalGuilds: 4,
            salary: 415_000,
            status: 'settled'
        },
    ],

    // 流水记录
    bills: [
        { id: 'BBL-3001', month: '2026-03', date: '2026-03-15 10:00:00', label: 'Task Salary Reward', taskLevel: 'Lv.5', amount: 2_490_000, type: 'task_salary', status: 'normal' },
        { id: 'BBL-3002', month: '2026-03', date: '2026-03-10 14:00:00', label: 'System Grant', amount: 500_000, type: 'system_grant', status: 'normal' },
        { id: 'BBL-3003', month: '2026-03', date: '2026-03-05 09:00:00', label: 'Diamond Withdrawal', subtitle: 'BWD-20260305-001', amount: -500_000, type: 'diamond_withdraw', status: 'normal' },
        { id: 'BBL-2001', month: '2026-02', date: '2026-02-28 23:59:59', label: 'Task Salary Reward', taskLevel: 'Lv.5', amount: 2_490_000, type: 'task_salary', status: 'normal' },
        { id: 'BBL-2002', month: '2026-02', date: '2026-02-20 15:00:00', label: 'Diamond Exchange', subtitle: '200,000', amount: -200_000, type: 'diamond_exchange', status: 'normal' },
        { id: 'BBL-2003', month: '2026-02', date: '2026-02-12 11:00:00', label: 'System Deduction', amount: -100_000, type: 'system_deduct', status: 'normal' },
        { id: 'BBL-1001', month: '2026-01', date: '2026-01-31 23:59:59', label: 'Task Salary Reward', taskLevel: 'Lv.4', amount: 1_660_000, type: 'task_salary', status: 'normal' },
        { id: 'BBL-1002', month: '2026-01', date: '2026-01-20 10:00:00', label: 'Diamond Withdrawal', subtitle: 'BWD-20260120-001', amount: -300_000, type: 'diamond_withdraw', status: 'normal' },
    ],

    // 提现记录
    withdrawRecords: [
        { id: 'BWR-1001', month: '2026-03', amount: 60.24, status: 'PENDING', subStatus: 'REVIEW', orderNo: 'BWD-20260305-001', accountNo: '**** 5678', paymentMethod: 'Bank Transfer', diamondsDeducted: 500_000, fee: 15.00, tax: 8.50, localAmount: null, localCurrency: 'EGP', createdAt: '2026-03-05T09:00:00' },
        { id: 'BWR-1002', month: '2026-01', amount: 36.14, status: 'SUCCESS', subStatus: null, orderNo: 'BWD-20260120-001', accountNo: '**** 5678', paymentMethod: 'Bank Transfer', diamondsDeducted: 300_000, fee: 10.00, tax: 5.40, localAmount: 1838, localCurrency: 'EGP', createdAt: '2026-01-20T10:00:00' },
    ],

    // 待确认的结算通知 (from admin settlement)
    pendingSettlements: [
        { id: 'STL-20260315001', diamonds: 2_490_000, reason: '双方为商业合作/推广服务关系，非全职雇佣关系。\n日常出勤：Admin每天在线时间不小于6小时（沙特时间11:00-17:00），且回应官方消息不超过30分钟。\n房间管理：每天按时安排官方房间排班，组织主播带玩游戏，无重大事故（如空房1小时以上）。房间每天开播时间至少8小时，保证至少3-5名主播在麦，并需执行播放BGM、欢迎用户等互动标准。\n招募指标：每个月至少成功招募10名"有效主播"。（有效主播标准：月在麦时长≥30小时，上麦天数≥15天，且非挂机）。\n薪资结构：底薪$200 + 绩效。\n- 底薪有阶梯发放标准：有效主播5-9人发120；少于5人取消底薪。若官方房严重缺岗累计超3次，需扣除底薪50。\n- 绩效包含：团队主播流水提成8%，以及每招募1名有效主播奖励1美金。', fromAdmin: true, createdAt: '2026-03-15 10:00:00', status: 'pending_confirm' },
        { id: 'STL-20260312001', diamonds: 1_800_000, reason: '春季活动推广奖金：3月春季推广活动中表现优异，成功拉动团队整体流水增长15%，特发此奖金。', fromAdmin: true, createdAt: '2026-03-12 14:30:00', status: 'pending_confirm' },
        { id: 'STL-20260310001', diamonds: 500_000, reason: '新公会拓展激励（Cairo Nights）：成功协助 Cairo Nights 公会完成初期搭建，招募有效主播12名，超额完成目标。', fromAdmin: true, createdAt: '2026-03-10 09:15:00', status: 'pending_confirm' },
        { id: 'STL-20260308001', diamonds: 3_320_000, reason: '1月推广绩效结算（补发）：因系统故障导致1月结算延迟，现补发全额绩效薪资。含底薪$200 + 团队流水提成8% + 有效主播招募奖励。', fromAdmin: true, createdAt: '2026-03-08 16:00:00', status: 'pending_confirm' },
        { id: 'STL-20260305001', diamonds: 750_000, reason: '优秀推广员月度奖励：2月综合考核排名第2，获得平台优秀推广员专项奖励。', fromAdmin: true, createdAt: '2026-03-05 11:00:00', status: 'pending_confirm' },
    ],
})

// ============ SUPER ADMIN (推广管理员) MOCK DATA ============
export const superAdminData = reactive({
    user: {
        id: 'SA-00001',
        nickname: 'Hassan Leader',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        isKycVerified: true,
        hasPinSetup: true,
        pin: '123456',
        pinAttempts: 0,
        pinLockedUntil: null,
        paymentInfo: {
            country: 'EG',
            methodId: 'eg_bank',
            formData: { bankName: 'CIB', accountNo: '1234567890', accountName: 'Hassan Mohamed' }
        },
    },

    // 钻石余额
    balance: {
        available: 8_750_000,
        frozen: 1_200_000,
    },

    // Super Admin薪资等级表 (USD折算为钻石)
    salaryTiers: [
        { level: 1, teamIncomeReq: 24_900_000, minValidBDs: 3, baseSalary: 2_490_000 },
        { level: 2, teamIncomeReq: 41_500_000, minValidBDs: 4, baseSalary: 4_150_000 },
        { level: 3, teamIncomeReq: 83_000_000, minValidBDs: 5, baseSalary: 4_980_000 },
        { level: 4, teamIncomeReq: 166_000_000, minValidBDs: 5, baseSalary: 5_810_000 },
        { level: 5, teamIncomeReq: 332_000_000, minValidBDs: 5, baseSalary: 8_300_000 },
    ],

    // 旗下BD列表
    bds: [
        { id: 'BD-00101', nickname: 'Ali Promoter', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', level: 6, agencyCount: 6, validAgencies: 5, totalIncome: 20_100_000, status: 'active', isValid: true, bindDate: '2025-12-01' },
        { id: 'BD-00102', nickname: 'Fatima Sales', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', level: 4, agencyCount: 4, validAgencies: 4, totalIncome: 12_800_000, status: 'active', isValid: true, bindDate: '2025-11-15' },
        { id: 'BD-00103', nickname: 'Omar Growth', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', level: 5, agencyCount: 8, validAgencies: 6, totalIncome: 18_500_000, status: 'active', isValid: true, bindDate: '2026-01-01' },
        { id: 'BD-00104', nickname: 'Layla Connect', avatar: 'https://randomuser.me/api/portraits/women/25.jpg', level: 2, agencyCount: 3, validAgencies: 2, totalIncome: 5_200_000, status: 'active', isValid: false, bindDate: '2026-02-01' },
        { id: 'BD-00105', nickname: 'Rami Network', avatar: 'https://randomuser.me/api/portraits/men/61.jpg', level: 5, agencyCount: 5, validAgencies: 5, totalIncome: 15_600_000, status: 'active', isValid: true, bindDate: '2025-10-15' },
    ],

    // 当前周期汇总
    get currentCycle() {
        const teamTotalIncome = this.bds.reduce((sum, bd) => sum + bd.totalIncome, 0)
        const validBDs = this.bds.filter(bd => bd.isValid).length
        let currentLevel = 0
        for (let i = this.salaryTiers.length - 1; i >= 0; i--) {
            if (teamTotalIncome >= this.salaryTiers[i].teamIncomeReq && validBDs >= this.salaryTiers[i].minValidBDs) {
                currentLevel = this.salaryTiers[i].level
                break
            }
        }
        return { teamTotalIncome, validBDs, totalBDs: this.bds.length, currentLevel }
    },

    // 周期结算历史
    cycles: [
        {
            month: 'March 2026', cycleStart: '2026-03-01', cycleEnd: '2026-03-31',
            level: 3, teamTotalIncome: 72_200_000, validBDs: 4,
            baseSalary: 4_980_000, totalSalary: 4_980_000,
            status: 'in_progress'
        },
        {
            month: 'February 2026', cycleStart: '2026-02-01', cycleEnd: '2026-02-28',
            level: 2, teamTotalIncome: 58_000_000, validBDs: 4,
            baseSalary: 4_150_000, totalSalary: 4_150_000,
            status: 'settled'
        },
        {
            month: 'January 2026', cycleStart: '2026-01-01', cycleEnd: '2026-01-31',
            level: 1, teamTotalIncome: 35_000_000, validBDs: 3,
            baseSalary: 2_490_000, totalSalary: 2_490_000,
            status: 'settled'
        },
        {
            month: 'December 2025', cycleStart: '2025-12-01', cycleEnd: '2025-12-31',
            level: 0, teamTotalIncome: 18_000_000, validBDs: 2,
            baseSalary: 0, totalSalary: 0,
            status: 'unmet' // 未达标
        },
    ],

    // 流水记录
    bills: [
        { id: 'SBL-3001', month: '2026-03', date: '2026-03-12 10:00:00', label: 'Team Bonus', amount: 500_000, type: 'team_bonus', status: 'normal' },
        { id: 'SBL-3002', month: '2026-03', date: '2026-03-08 14:00:00', label: 'Withdrawal', amount: -2_000_000, type: 'withdraw', status: 'normal' },
        { id: 'SBL-2001', month: '2026-02', date: '2026-02-28 23:59:59', label: 'Monthly Salary Settlement', amount: 4_150_000, type: 'salary', status: 'normal' },
        { id: 'SBL-2002', month: '2026-02', date: '2026-02-20 11:00:00', label: 'Exchange Coins', amount: -500_000, type: 'exchange_coins', status: 'normal' },
        { id: 'SBL-2003', month: '2026-02', date: '2026-02-15 16:00:00', label: 'Withdrawal', amount: -1_500_000, type: 'withdraw', status: 'normal' },
        { id: 'SBL-1001', month: '2026-01', date: '2026-01-31 23:59:59', label: 'Monthly Salary Settlement', amount: 2_490_000, type: 'salary', status: 'normal' },
        { id: 'SBL-1002', month: '2026-01', date: '2026-01-18 10:00:00', label: 'Exchange Coins', amount: -300_000, type: 'exchange_coins', status: 'normal' },
    ],

    // 提现记录
    withdrawRecords: [
        { id: 'SWR-1001', month: '2026-03', amount: 240.96, status: 'SUCCESS', subStatus: null, orderNo: 'SWD-20260308-001', accountNo: '**** 7890', paymentMethod: 'Bank Transfer', diamondsDeducted: 2_000_000, fee: 50.00, createdAt: '2026-03-08 14:00:00' },
        { id: 'SWR-1002', month: '2026-02', amount: 180.72, status: 'SUCCESS', subStatus: null, orderNo: 'SWD-20260215-001', accountNo: '**** 7890', paymentMethod: 'Bank Transfer', diamondsDeducted: 1_500_000, fee: 35.00, createdAt: '2026-02-15 16:00:00' },
        { id: 'SWR-1003', month: '2026-01', amount: 120.48, status: 'PENDING', subStatus: 'TRANSMIT', orderNo: 'SWD-20260118-001', accountNo: '**** 7890', paymentMethod: 'Bank Transfer', diamondsDeducted: 1_000_000, fee: 25.00, createdAt: '2026-01-18 10:00:00' },
    ],
})

// ============ CONSTANTS ============
export const DIAMOND_RATE = 8300 // 1 USD = 8300 Diamonds
export const MIN_WITHDRAW_USD = 5
export const MIN_WITHDRAW_DIAMONDS = MIN_WITHDRAW_USD * DIAMOND_RATE
export const MAX_PIN_ATTEMPTS = 3
export const PIN_LOCK_HOURS = 24
