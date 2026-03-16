// Payment configuration for each supported country
// Each country has: currency, payment methods with their form fields

export const paymentCountries = [
    { code: 'EG', name: 'Egypt', nameZh: '埃及', nameAr: 'مصر', flag: '🇪🇬' },
    { code: 'QA', name: 'Qatar', nameZh: '卡塔尔', nameAr: 'قطر', flag: '🇶🇦' },
    { code: 'AE', name: 'UAE', nameZh: '阿联酋', nameAr: 'الإمارات', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', nameZh: '沙特阿拉伯', nameAr: 'السعودية', flag: '🇸🇦' },
    { code: 'MA', name: 'Morocco', nameZh: '摩洛哥', nameAr: 'المغرب', flag: '🇲🇦' },
    { code: 'JO', name: 'Jordan', nameZh: '约旦', nameAr: 'الأردن', flag: '🇯🇴' },
    { code: 'NG', name: 'Nigeria', nameZh: '尼日利亚', nameAr: 'نيجيريا', flag: '🇳🇬' },
    { code: 'TN', name: 'Tunisia', nameZh: '突尼斯', nameAr: 'تونس', flag: '🇹🇳' },
    { code: 'KW', name: 'Kuwait', nameZh: '科威特', nameAr: 'الكويت', flag: '🇰🇼' },
    { code: 'TR', name: 'Turkey', nameZh: '土耳其', nameAr: 'تركيا', flag: '🇹🇷' },
    { code: 'KM', name: 'Comoros', nameZh: '科摩罗', nameAr: 'جزر القمر', flag: '🇰🇲' }
]

export const paymentMethods = {
    EG: {
        currency: 'EGP',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Blom Bank', 'CIB', 'QNB Alahli', 'Banque Misr', 'National Bank of Egypt', 'Faisal Islamic Bank', 'HSBC Egypt', 'Arab African International Bank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: 'Max 29 alphanumeric characters', zh: '最多29位数字/字母', ar: 'بحد أقصى 29 حرفًا أو رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            },
            {
                id: 'aman',
                name: 'Aman',
                icon: '💵',
                desc: { en: 'Cash pickup, limit 5-5,000 EGP', zh: '线下现金提取，转给收款方金额限额 5-5000 EGP', ar: 'سحب نقدي، الحد 5-5000 جنيه مصري' },
                arrivalTime: { en: 'Depends on pickup time', zh: '依赖于收款人到门店取现时间', ar: 'يعتمد على وقت الاستلام' },
                fields: [
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: '11 digits starting with 0', zh: '0开头11位数字', ar: '11 رقمًا تبدأ بـ 0' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            },
            {
                id: 'meeza',
                name: 'Meeza Wallets',
                icon: '📱',
                desc: { en: 'E-wallet transfer, limit 5-60,000 EGP', zh: '电子钱包转账，转给收款方金额限额 5-60000 EGP', ar: 'تحويل المحفظة الإلكترونية، الحد 5-60,000 جنيه مصري' },
                arrivalTime: { en: '0-1 days', zh: '0-1天', ar: '0-1 أيام' },
                fields: [
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: '11 digits starting with 0', zh: '0开头11位数字', ar: '11 رقمًا تبدأ بـ 0' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            },
            {
                id: 'fawry',
                name: 'Fawry',
                icon: '⚡',
                desc: { en: 'Cash pickup, limit 1-200,000 EGP', zh: '线下现金提取，转给收款方金额限额 1-200000 EGP', ar: 'سحب نقدي، الحد 1-200,000 جنيه مصري' },
                arrivalTime: { en: 'Depends on pickup time', zh: '依赖于收款人到门店取现时间', ar: 'يعتمد على وقت الاستلام' },
                fields: [
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: '11 digits starting with 0', zh: '0开头11位数字', ar: '11 رقمًا تبدأ بـ 0' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    QA: {
        currency: 'QAR',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Qatar National Bank', 'Commercial Bank of Qatar', 'Doha Bank', 'Qatar Islamic Bank', 'Al Khalij Commercial Bank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: 'Max 29 alphanumeric characters', zh: '最多29位数字/字母', ar: 'بحد أقصى 29 حرفًا أو رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    AE: {
        currency: 'AED',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Emirates NBD', 'Abu Dhabi Commercial Bank', 'First Abu Dhabi Bank', 'Dubai Islamic Bank', 'Mashreq Bank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'IBAN', zh: 'IBAN账号', ar: 'رقم IBAN' }, required: true, hint: { en: 'AE + 21 digits', zh: 'AE开头+21位数字', ar: 'AE + 21 رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            },
            {
                id: 'ewallet',
                name: 'E-Wallet',
                icon: '📱',
                desc: { en: 'E-wallet transfer, limit 5-50,000 AED', zh: '电子钱包转账，限额 5-50000 AED', ar: 'تحويل المحفظة الإلكترونية، الحد 5-50,000 درهم' },
                arrivalTime: { en: '0-1 days', zh: '0-1天', ar: '0-1 أيام' },
                fields: [
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Phone Number', zh: '手机号码', ar: 'رقم الهاتف' }, required: true, hint: { en: 'UAE phone number', zh: '阿联酋手机号码', ar: 'رقم هاتف إماراتي' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    SA: {
        currency: 'SAR',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Al Rajhi Bank', 'Saudi National Bank', 'Riyad Bank', 'Banque Saudi Fransi', 'Arab National Bank', 'Alinma Bank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'IBAN', zh: 'IBAN账号', ar: 'رقم IBAN' }, required: true, hint: { en: 'SA + 22 digits', zh: 'SA开头+22位数字', ar: 'SA + 22 رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            },
            {
                id: 'stcpay',
                name: 'STC Pay',
                icon: '📱',
                desc: { en: 'STC Pay wallet transfer, limit 5-20,000 SAR', zh: 'STC Pay钱包转账，限额 5-20000 SAR', ar: 'تحويل محفظة STC Pay، الحد 5-20,000 ريال' },
                arrivalTime: { en: '0-1 days', zh: '0-1天', ar: '0-1 أيام' },
                fields: [
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Phone Number', zh: '手机号码', ar: 'رقم الهاتف' }, required: true, hint: { en: 'Saudi phone number', zh: '沙特手机号码', ar: 'رقم هاتف سعودي' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    MA: {
        currency: 'MAD',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Attijariwafa Bank', 'BMCE Bank', 'Banque Populaire', 'CIH Bank', 'Crédit du Maroc'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: 'Max 24 digits', zh: '最多24位数字', ar: 'بحد أقصى 24 رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    JO: {
        currency: 'JOD',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Arab Bank', 'Housing Bank', 'Jordan Islamic Bank', 'Bank of Jordan', 'Cairo Amman Bank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'IBAN', zh: 'IBAN账号', ar: 'رقم IBAN' }, required: true, hint: { en: 'JO + 28 characters', zh: 'JO开头+28位字符', ar: 'JO + 28 حرفًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    NG: {
        currency: 'NGN',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['GTBank', 'Access Bank', 'Zenith Bank', 'First Bank of Nigeria', 'UBA', 'Ecobank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: '10 digits', zh: '10位数字', ar: '10 أرقام' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    TN: {
        currency: 'TND',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Banque de Tunisie', 'BIAT', 'Attijari Bank', 'STB', 'Amen Bank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: 'Max 20 digits', zh: '最多20位数字', ar: 'بحد أقصى 20 رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    KW: {
        currency: 'KWD',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['National Bank of Kuwait', 'Kuwait Finance House', 'Gulf Bank', 'Burgan Bank', 'Al Ahli Bank of Kuwait'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'IBAN', zh: 'IBAN账号', ar: 'رقم IBAN' }, required: true, hint: { en: 'KW + 28 characters', zh: 'KW开头+28位字符', ar: 'KW + 28 حرفًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    TR: {
        currency: 'TRY',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '0-1 business days', zh: '0-1个工作日', ar: '0-1 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Ziraat Bankası', 'İş Bankası', 'Garanti BBVA', 'Yapı Kredi', 'Akbank', 'Halkbank'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'IBAN', zh: 'IBAN账号', ar: 'رقم IBAN' }, required: true, hint: { en: 'TR + 24 digits', zh: 'TR开头+24位数字', ar: 'TR + 24 رقمًا' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    },
    KM: {
        currency: 'KMF',
        methods: [
            {
                id: 'local_banks',
                name: 'Local Banks',
                icon: '🏦',
                desc: { en: 'Local bank account transfer', zh: '本地银行账户转账', ar: 'تحويل الحساب المصرفي المحلي' },
                arrivalTime: { en: '1-3 business days', zh: '1-3个工作日', ar: '1-3 أيام عمل' },
                fields: [
                    { key: 'bankName', type: 'select', label: { en: 'Target Bank', zh: '目标机构', ar: 'البنك المستهدف' }, required: true, options: ['Banque Centrale des Comores', 'Exim Bank Comoros', 'Banque de Développement des Comores'] },
                    { key: 'alias', type: 'text', label: { en: 'Alias', zh: '收款方别名', ar: 'الاسم المستعار' }, required: false },
                    { key: 'accountNo', type: 'text', label: { en: 'Account Number', zh: '收款方账号', ar: 'رقم الحساب' }, required: true, hint: { en: 'Account number', zh: '银行账号', ar: 'رقم الحساب المصرفي' } },
                    { key: 'payeeName', type: 'text', label: { en: 'Payee Name', zh: '收款方名称', ar: 'اسم المستفيد' }, required: true }
                ]
            }
        ]
    }
}

// USD → Local currency exchange rates (mock)
export const currencyExchangeRates = {
    EGP: 50.85,
    QAR: 3.64,
    AED: 3.67,
    SAR: 3.75,
    MAD: 10.05,
    JOD: 0.71,
    NGN: 1550.00,
    TND: 3.18,
    KWD: 0.31,
    TRY: 38.50,
    KMF: 460.00
}

// Withdraw fee & tax rate (mock)
export const WITHDRAW_FEE_RATE = 0.02   // 2% service fee
export const WITHDRAW_TAX_RATE = 0.005  // 0.5% tax

// Helper to get localized text
export function getLocalizedText(textObj, locale) {
    if (typeof textObj === 'string') return textObj
    return textObj[locale] || textObj['en'] || ''
}
