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
import locale_en from 'iview/dist/locale/en-US';
import locale_zh from 'iview/dist/locale/zh-CN';

import filters from './common/js/filter.js';
import VueClipboard from 'vue-clipboard2';

import VueI18n from 'vue-i18n';
import messages from './lang/index.js';
const settings = require("electron-settings");

const {  remote } = require('electron');

 

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(VueClipboard)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


var language = settings.get('set.language')||'en';
// var language = 'en';
// console.log(language);
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: language, // set locale
  messages:messages, // set locale messages
})
if(language=='en'){
  Vue.use(iView, { locale_en });
}else{
  Vue.use(iView, { locale_zh });
}


/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
    i18n,
}).$mount('#app')


//CommandOrControl+Shift+K
remote.globalShortcut.register('F12', () => {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
  })
  
  window.addEventListener('beforeunload', () => {
    remote.globalShortcut.unregisterAll()
  })

