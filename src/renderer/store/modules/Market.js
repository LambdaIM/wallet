const settings = require('electron-settings');
var select_Market = settings.get('market.address');
var id;
const state = {
  statusType: null,
  selectMarket: select_Market || null,
  loanmarket: null
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
    id = setTimeout(() => {
      settings.set('market.address', info);
    }, 1000 * 5);
  },
  setloanmarket: function(state, info) {
    state.loanmarket = info;
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
  },
  setloanmarket: function(context, info) {
    context.commit('setloanmarket', info);
  }

};
const getters = {
  statusType: state => {
    return state.statusType;
  },
  getselectMarket: function() {
    return state.selectMarket;
  },
  getselectloanmarket: function() {
    return state.loanmarket;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
