import Vue from 'vue';
import Router from 'vue-router';
const settings = require('electron-settings');
const path = require('path');
var { DAEMON_CONFIG } = require('../../configmain.js');

Vue.use(Router);
settings.setPath(path.join(DAEMON_CONFIG.BASE_PATH, 'set.json'));


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
    children: [
      {
        path: '',
        name: 'txlist',
        component: () => import('@/views/Home/txlist.vue')
      },
      {
        path: 'coinlist',
        name: 'coinlist',
        component: () => import('@/views/Home/coinlist.vue')
      },
      {
        path: 'localtxlist',
        name: 'localtxlist',
        component: () => import('@/views/Home/localtxlist.vue')
      },
      {
        path: 'subaccount',
        name: 'subaccount',
        component: () => import('@/views/Home/subaccount.vue')
      }

    ],
    component: () =>
            import('@/views/Home/indexMenu.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
            import('@/views/account/Register/Register.vue')
  },
  {
    path: '/success',
    name: 'Success',
    component: () =>
            import('@/views/account/Register/Success.vue')
  },
  {
    path: '/export',
    name: 'Export',
    component: () =>
            import('@/views/account/Register/Export.vue')
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
    path: '/staking',
    name: 'Staking',
    component: () =>
            import('@/views/staking/Staking.vue')
  },
  {
    path: '/stakinginfo/:operator_address',
    name: 'Stakinginfo',
    component: () =>
            import('@/views/staking/Stakinginfo.vue')
  },
  {
    path: '/partner',
    name: 'partner',
    component: () =>
            import('@/views/partner/index.vue')
  },
  {
    path: '/partnerinfo/:operator_address',
    name: 'partnerinfo',
    component: () =>
            import('@/views/partner/partnerinfo.vue')
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/validator',
    name: 'validator',
    component: () =>
            import('@/views/validator/index.vue')
  },
  {
    path: '/sign',
    name: 'sign',
    component: () =>
            import('@/views/sign/index.vue')
  },
  {
    path: '/proposal',
    name: 'proposal',
    component: () =>
            import('@/views/proposal/index.vue')
  }, {
    path: '/proposalinfo/:proposal_id',
    name: 'proposalinfo',
    component: () =>
            import('@/views/proposal/info.vue')
  }, {
    path: '/market',
    name: 'market',
    component: () => import('@/views/market/indexMenu.vue'),
    children: [
      {
        path: '',
        name: 'myorderlist',
        component: () => import('@/views/market/myorderlist.vue')
      },
      {
        path: 'buyspace',
        name: 'buyspace',
        component: () => import('@/views/market/buyspace.vue')
      },
      {
        path: 'mysellorder',
        name: 'mysellorderlist',
        component: () => import('@/views/market/mysellorderlist.vue')
      },
      {
        path: 'lambdas3',
        name: 'lambdas3',
        component: () => import('@/views/market/lambdas3.vue')
      }
    ]


  }, {
    path: '/orderinfo/:id',
    name: 'orderinfo',
    component: () =>
            import('@/views/market/orderinfo.vue')
  }
  ]
});

var notNeedLogin = ['Login', 'Register', 'Success', 'Export', 'Import'];
var _this = this;
walletRouter.beforeResolve((to, from, next) => {
  // ...
  console.log('router');
  var open = settings.get('isopenfilev1');

  if (notNeedLogin.indexOf(to.name) == -1) {
    console.log('open', open);
    console.log(_this);
    if (open == false) {
      next('/');
    } else {
      next();
    }
  } else if (to.name == 'Login' && open == true) {
    next('Home');
  } else {
    next();
  }
});


export default walletRouter;
