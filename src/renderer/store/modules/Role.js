const settings = require('electron-settings');
console.log('加载role');
const state = {
  role: settings.get('userrole') || null
};
const mutations = {
  setrole: function(state, role) {
    console.log('mutations');
    state.role = role;
    settings.set('userrole', role);
  }
};
const actions = {
  setrole: function(context, role) {
    console.log('actions');
    context.commit('setrole', role);
  }
};
const getters = {
  role: state => {
    return state.role;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
