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
      },
      {
        path: 'myorderlist',
        name: 'myorderlist',
        component: () => import('@/views/Home/marketorderlistlink.vue')
      },
      {
        path: 'lambdas3',
        name: 'lambdas3',
        component: () => import('@/views/Home/markets3link.vue')
      },
      {
        path: 'mysellorder',
        name: 'mysellorder',
        component: () => import('@/views/Home/marketsellorderlink.vue')
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
    path: '/validator',
    name: 'validator',
    component: () =>
            import('@/views/validator/index.vue')
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
      },
      {
        path: 'syncdata/:marketname/:marketAddress',
        name: 'buyspace',
        component: () => import('@/views/market/syncsellorder.vue')
      },
      {
        path: 'sellorderinfo/:orderid',
        name: 'sellorderinfo',
        component: () => import('@/views/market/sellorderinfo.vue')
      }
    ]


  }, {
    path: '/orderinfo/:id',
    name: 'orderinfo',
    component: () =>
            import('@/views/market/orderinfo.vue')
  },
  {
    path: '/guide',
    name: 'guide',
    component: () => import('@/views/Home/guide.vue'),
    children: [{
      path: '',
      name: 'guide',
      meta: {
        path: ''
      },
      component: () => import('@/views/Home/stepguide/gettbb.vue')
    },
    {
      path: 'pledge',
      meta: {
        path: 'pledge'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/pledge.vue')
    },
    {
      path: 'subaccount',
      meta: {
        path: 'subaccount'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/subaccount.vue')
    },
    {
      path: 'miningmanagement',
      meta: {
        path: 'miningmanagement'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/miningmanagement.vue')
    },
    {
      path: 'initializeminer',
      meta: {
        path: 'initializeminer'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/Initializeminer.vue')
    },
    {
      path: 'configminer',
      meta: {
        path: 'configminer'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/configminer.vue')
    },
    {
      path: 'addstorage',
      meta: {
        path: 'addstorage'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/addstorage.vue')
    },
    {
      path: 'configstorage',
      meta: {
        path: 'configstorage'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/configstorage.vue')
    },
    {
      path: 'sellingspace',
      meta: {
        path: 'sellingspace'
      },
      name: 'guide',
      component: () => import('@/views/Home/stepguide/sellingspace.vue')
    }
    ]
  }, {
    path: '*',
    redirect: '/'
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
