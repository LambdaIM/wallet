import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview';
import './common/reset.less';
import './common/position.less';
import './common/media.less';
import 'iview/dist/styles/iview.css';
import './my-theme/index.less';

Vue.use(iView);
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