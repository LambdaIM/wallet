import Vue from 'vue'
import Router from 'vue-router'

const settings = require("electron-settings");

Vue.use(Router)


export default new Router({
    routes: [{
        path: '/',
        name: 'Login',
        // beforeEnter: (to, from, next) => {
        //     var open = settings.get('isopenfile')
        //     console.log('open',open)
        //     if(open){
        //         next("/home")
        //     }else{
        //         next()
        //     }
        // },
        component: () =>
            import('@/views/account/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import('@/views/Home.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import('@/views/account/Register/Register.vue'), 
    },
    {
        path: '/success',
        name: 'Success',
        component: () =>
            import('@/views/account/Register/Success.vue'),
    },
    {
        path: '/export',
        name: 'Export',
        component: () =>
            import('@/views/account/Register/Export.vue'),
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: () =>
            import('@/views/Detail.vue')
    },
    {
        path: '/import',
        name: 'Import',
        component: () =>
            import('@/views/account/Import.vue')
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () =>
            import('@/views/account/Settings.vue')
    },
    {
        path: '/customer',
        name: 'Customer',
        component: () =>
            import('@/views/Customer.vue')
    },
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/test',
        name: 'test',
        component: () =>
            import('@/views/Test.vue')
    },
    {
        path: '/api',
        name: 'api',
        component: () =>
            import('@/views/Api.vue')
    }
    ]
})