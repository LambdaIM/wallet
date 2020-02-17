import roleconfig from '@/roleconfig.json';
const settings = require('electron-settings');
console.log('加载role');
const state = {
  role: settings.get('userrole') || null,
  roleconfig: roleconfig

};
const mutations = {
  setrole: function(state, role) {
    console.log('mutations');
    state.role = role;
    // state.roleconfig.role;
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
  },
  roleconfig: state => {
    return state.roleconfig;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
