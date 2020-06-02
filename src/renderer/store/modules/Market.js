import setseting from '@/common/js/seting.js';
const settings = require('electron-settings');
var select_Market = settings.get('market.address');
var id;
const state = {
  statusType: null,
  selectMarket: select_Market || null
};
const mutations = {
  setstatusType: function(state, info) {
    console.log('mutations');
    state.statusType = info;
  },
  setselectMarket: function(state, info) {
    console.log('mutations');
    state.selectMarket = info;
    clearTimeout(id);
    // id = setTimeout(() => {
    setseting.set('market.address', info);
    // }, 1000 * 5);
  }
};
const actions = {
  setstatusType: function(context, info) {
    console.log('actions');
    context.commit('setstatusType', info);
  },
  setselectMarket: function(context, info) {
    console.log('actions');
    context.commit('setselectMarket', info);
  }
};
const getters = {
  statusType: state => {
    return state.statusType;
  },
  getselectMarket: function() {
    return state.selectMarket;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
