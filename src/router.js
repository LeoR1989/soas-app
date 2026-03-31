import { createRouter, createWebHistory } from 'vue-router'
import { hostData } from './mock/data.js'

const routes = [
    // Demo Home
    {
        path: '/',
        name: 'DemoHome',
        component: () => import('./views/DemoHome.vue')
    },
    {
        path: '/host',
        name: 'HostUnjoined',
        component: () => import('./views/host/HostUnjoined.vue')
    },
    {
        path: '/host/dashboard',
        name: 'HostDashboard',
        component: () => import('./views/host/HostDashboard.vue')
    },
    {
        path: '/host/bills',
        name: 'HostBills',
        component: () => import('./views/host/HostBills.vue')
    },
    {
        path: '/host/withdraw',
        name: 'HostWithdraw',
        component: () => import('./views/host/HostWithdraw.vue')
    },
    {
        path: '/host/recharge',
        name: 'HostRecharge',
        component: () => import('./views/host/HostRecharge.vue')
    },
    {
        path: '/host/task-rules',
        name: 'HostTaskRules',
        component: () => import('./views/host/HostTaskRules.vue')
    },
    {
        path: '/recharge/agreement',
        name: 'RechargeAgreement',
        component: () => import('./views/host/RechargeAgreement.vue')
    },
    {
        path: '/host/agreement',
        name: 'HostAgreement',
        component: () => import('./views/host/HostAgreement.vue')
    },
    {
        path: '/host/coin-history',
        name: 'CoinHistory',
        component: () => import('./views/host/CoinHistory.vue')
    },
    {
        path: '/host/diamond-wallet',
        name: 'DiamondWallet',
        component: () => import('./views/host/HostDiamondWallet.vue')
    },
    {
        path: '/host/diamond-bills',
        name: 'DiamondBills',
        component: () => import('./views/host/HostDiamondBills.vue')
    },
    {
        path: '/host/unjoined-withdraw',
        name: 'UnjoinedWithdraw',
        component: () => import('./views/host/HostUnjoinedWithdraw.vue')
    },
    // Agency Center
    {
        path: '/agency',
        name: 'AgencyDashboard',
        component: () => import('./views/agency/AgencyDashboard.vue')
    },
    {
        path: '/agency/dashboard',
        redirect: '/agency'
    },
    {
        path: '/agency/recharge',
        name: 'AgencyRecharge',
        component: () => import('./views/agency/AgencyRecharge.vue')
    },
    {
        path: '/agency/history',
        name: 'AgencyHistory',
        component: () => import('./views/agency/AgencyHistory.vue')
    },
    {
        path: '/agency/profile',
        name: 'AgencyProfile',
        component: () => import('./views/agency/AgencyProfile.vue')
    },
    {
        path: '/agency/profile-readonly',
        name: 'AgencyProfileReadonly',
        component: () => import('./views/agency/AgencyProfileReadonly.vue')
    },
    {
        path: '/agency/rules',
        name: 'AgencyRules',
        component: () => import('./views/agency/AgencyRules.vue')
    },
    {
        path: '/agency/agreement',
        name: 'AgencyAgreement',
        component: () => import('./views/agency/AgencyAgreement.vue')
    },
    {
        path: '/agency/withdraw',
        name: 'AgencyWithdraw',
        component: () => import('./views/agency/AgencyWithdraw.vue')
    },
    // Admin Portal
    {
        path: '/admin',
        name: 'AdminPortal',
        component: () => import('./views/admin/AdminPortal.vue')
    },
    // BD Center (推广员)
    {
        path: '/bd',
        name: 'BdDashboard',
        component: () => import('./views/bd/BdDashboard.vue')
    },
    {
        path: '/bd/history',
        name: 'BdHistory',
        component: () => import('./views/bd/BdHistory.vue')
    },
    {
        path: '/bd/recharge',
        name: 'BdRecharge',
        component: () => import('./views/bd/BdRecharge.vue')
    },
    {
        path: '/bd/withdraw',
        name: 'BdWithdraw',
        component: () => import('./views/bd/BdWithdraw.vue')
    },
    {
        path: '/bd/task-rules',
        name: 'BdTaskRules',
        component: () => import('./views/bd/BdTaskRules.vue')
    }
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

// Route guards for host joined/unjoined state
router.beforeEach((to, from) => {
    if (to.name === 'HostUnjoined' && hostData.agency) {
        return { name: 'HostDashboard' }
    }
    // Non-agency users can access DiamondWallet, Recharge, Withdraw, Bills, and CoinHistory
    // so we only restrict HostDashboard
    if (to.name === 'HostDashboard' && !hostData.agency) {
        return { name: 'HostUnjoined' }
    }
})

export default router
