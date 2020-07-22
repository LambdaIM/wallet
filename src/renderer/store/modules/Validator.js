const settings = require('electron-settings');
var gaspriceconfig = settings.get('gasprice');
if (gaspriceconfig == undefined) {
    gaspriceconfig = 0.025;
}
const state = {
    info: null,
    gas_prise: gaspriceconfig,
};
const mutations = {
    setinfo: function(state, info) {
        console.log('mutations');
        state.info = info;
    },
    setgasprise: function(state, prise) {
        console.log('mutations');
        state.gas_prise = prise;
    },
};
const actions = {
    setinfo: function(context, info) {
        console.log('actions');
        context.commit('setinfo', info);
    },
    setgasprise: function(context, prise) {
        console.log('actions');
        context.commit('setgasprise', prise);
    },
};
const getters = {
    info: state => {
        return state.info;
    },
    gasprise: state => {
        return state.gas_prise;
    },
};

export default {
    state,
    mutations,
    actions,
    getters,
};
