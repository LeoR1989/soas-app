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
        path: '/host/frozen-bills',
        name: 'FrozenBills',
        component: () => import('./views/host/FrozenBills.vue')
    },
    {
        path: '/host/withdraw',
        name: 'HostWithdraw',
        component: () => import('./views/host/HostWithdraw.vue')
    },
    // Agency Center
    {
        path: '/agency',
        name: 'AgencyDashboard',
        component: () => import('./views/agency/AgencyDashboard.vue')
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
    // Admin Portal
    {
        path: '/admin',
        name: 'AdminPortal',
        component: () => import('./views/admin/AdminPortal.vue')
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
    if (['HostDashboard', 'HostBills', 'HostWithdraw'].includes(to.name) && !hostData.agency) {
        return { name: 'HostUnjoined' }
    }
})

export default router
