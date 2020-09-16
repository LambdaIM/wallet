import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';
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
import GlobalFn from './Global.js';

import Role from './role.js';
const settings = require('electron-settings');

const { remote } = require('electron');

var packagejson = require('../../package.json');

document.title = packagejson.description + '  v' + packagejson.version;
window.title = document.title;
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.use(VueClipboard);
Vue.use(GlobalFn);
// if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Role(Vue);
Vue.config.productionTip = false;

var language = settings.get('set.language') || 'en';
// var language = 'en';
// console.log(language);
Vue.use(VueI18n);
// Vue.use(iView);
// Vue.locale = () => {};

const i18n = new VueI18n({
    locale: language, // set locale
    messages: {
        en: Object.assign({}, messages.en, locale_en),
        zh: Object.assign({}, messages.zh, locale_zh),
    }, // set locale messages
});


if (language == 'en') {
    Vue.use(iView, { locale: locale_en });
} else {
    Vue.use(iView, { locale: locale_zh });
}

console.log('new app');
/* eslint-disable no-new */
var app = new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
    i18n,
}).$mount('#app');

// CommandOrControl+Shift+K
remote.globalShortcut.register('F12', () => {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools();
});

window.addEventListener('beforeunload', () => {
    remote.globalShortcut.unregisterAll();
});
