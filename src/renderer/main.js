import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview';
import './common/css/reset.less';
import './common/css/position.less';
import './common/css/media.less';
import 'iview/dist/styles/iview.css';
import './my-theme/index.less';

import filters from './common/js/filter.js'
import VueClipboard from 'vue-clipboard2'

const {  remote } = require('electron');

 

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(iView);
Vue.use(VueClipboard)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')


//CommandOrControl+Shift+K
remote.globalShortcut.register('F12', () => {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
  })
  
  window.addEventListener('beforeunload', () => {
    remote.globalShortcut.unregisterAll()
  })

