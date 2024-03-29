import Vue from 'vue';
import Vuex from 'vuex';

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import register from './modules/Register';
import account from './modules/Account';
import validator from './modules/Validator';
import market from './modules/Market';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    register,
    account,
    validator,
    market
  },
  plugins: [
    // createPersistedState(),
    // createSharedMutations()  https://github.com/SimulatedGREG/electron-vue/issues/733
  ],
  strict: process.env.NODE_ENV !== 'production'
});
