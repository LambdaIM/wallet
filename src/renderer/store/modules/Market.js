const state = {
  statusType: null
};
const mutations = {
  setstatusType: function(state, info) {
    console.log('mutations');
    state.statusType = info;
  }
};
const actions = {
  setstatusType: function(context, info) {
    console.log('actions');
    context.commit('setstatusType', info);
  }
};
const getters = {
  statusType: state => {
    return state.statusType;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
