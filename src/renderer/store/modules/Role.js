import roleconfig from '@/roleconfig.json';
const settings = require('electron-settings');
console.log('加载role');
var rolelist = settings.get('userrolelist') || {};
var defaultwallet = settings.get('defaultwallet');
var defaultrole = rolelist[defaultwallet];
const state = {
    role: defaultrole,
    roleconfig: roleconfig,
};
const mutations = {
    setrole: function(state, role) {
        console.log('mutations');
        state.role = role;
        // state.roleconfig.role;
        var defaultwallet = settings.get('defaultwallet');
        settings.set(`userrolelist.${defaultwallet}`, role);
    },
    readrole: function(state) {
        var defaultwallet = settings.get('defaultwallet');
        var rolelist = settings.get('userrolelist') || {};
        var result = rolelist[defaultwallet];
        state.role = result || null;
    },
};
const actions = {
    setrole: function(context, role) {
        console.log('actions');
        context.commit('setrole', role);
    },
    readrole: function(context) {
        context.commit('readrole');
    },
};
const getters = {
    role: state => {
        return state.role;
    },
    roleconfig: state => {
        return state.roleconfig;
    },
};

export default {
    state,
    mutations,
    actions,
    getters,
};
