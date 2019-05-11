import Vue from 'vue'
import Router from 'vue-router'
const settings = require("electron-settings");
const path = require('path');
var {DAEMON_CONFIG} =require('../../configmain.js');

Vue.use(Router)
settings.setPath(path.join(DAEMON_CONFIG.BASE_PATH,'set.json') );


 var walletRouter = new Router({
    routes: [{
        path: '/',
        name: 'Login',
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
        path: '/detail/:id/:txType',
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
    },
    {
        path: '/validator',
        name: 'validator',
        component: () =>
            import('@/views/validator/index.vue')
    },
    {
        path: '/miner',
        name: 'miner',
        component: () =>
            import('@/views/miner/index.vue')
    },
    {
        path: '/sign',
        name: 'sign',
        component: () =>
            import('@/views/sign/index.vue')
    },
    ]
})

var notNeedLogin=['Login','Register','Success','Export','Import']
var _this=this;
walletRouter.beforeResolve((to, from, next) => {
    // ...
    console.log('router')
    var open = settings.get('isopenfile');

    if(notNeedLogin.indexOf(to.name)==-1){
        
        console.log('open',open)
        console.log(_this)
        if(open==false){
            next("/")
        }else{
            next()    
        }

    }else{
        if(to.name=='Login'&&open==true){
            next('Home')
        }else{
            next()
        }
        
    }
            
  })


export default  walletRouter