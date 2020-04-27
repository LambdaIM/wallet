const state = {
  statusType: null,
  selectMarket: null
};
const mutations = {
  setstatusType: function(state, info) {
    console.log('mutations');
    state.statusType = info;
  },
  setselectMarket: function(state, info) {
    console.log('mutations');
    state.selectMarket = info;
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
