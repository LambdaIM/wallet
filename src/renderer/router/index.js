import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: () =>
                import ('@/views/account/Login.vue')
        },
        {
            path: '/home',
            name: 'Home',
            component: () =>
                import ('@/views/Home.vue')
        },
        {
            path: '/register',
            name: 'Register',
            component: () =>
                import ('@/views/account/Register.vue')
        },
        {
            path: '/import',
            name: 'Import',
            component: () =>
                import ('@/views/account/Import.vue')
        },
        {
            path: '/settings',
            name: 'Settings',
            component: () =>
                import ('@/views/account/Settings.vue')
        },
        {
            path: '/customer',
            name: 'Customer',
            component: () =>
                import ('@/views/Customer.vue')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})