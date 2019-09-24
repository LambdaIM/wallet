const state = {
  address: '',
  blance: 0,
  loginState: false,

  DistributionReward: 0,
  balanceSto: 0,
  coinList: [],
  Delegation: 0,
  Distribution: 0
};

console.log('--------***************');
const mutations = {
  setaddress: function (state, address) {
    console.log('mutations');
    state.address = address;
  },
  setblance: function (state, blance) {
    state.blance = blance;
  },
  setLogin: function (state, loginState) {
    console.log('setLogin');
    state.loginState = loginState;
  },
  setDistributionReward: function(state, Reward) {
    state.DistributionReward = Reward;
  },
  setbalanceSto: function(state, balanceSto) {
    state.balanceSto = balanceSto;
  },
  setcoinList: function(state, list) {
    state.coinList = list;
  },
  setDelegation: function(state, value) {
    state.Delegation = value;
  },
  setDistribution: function(state, value) {
    state.Distribution = value;
  }


};


const actions = {
  setaddress: function (context, address) {
    console.log('actions');
    context.commit('setaddress', address);
  },
  setblance: function (context, blance) {
    context.commit('setblance', blance);
  },
  setLogin: function (context, loginState) {
    console.log('actions login');
    context.commit('setLogin', loginState);
  },
  setDistributionReward: function(context, DistributionReward) {
    context.commit('setDistributionReward', DistributionReward);
  },
  setbalanceSto: function(context, balanceSto) {
    context.commit('setbalanceSto', balanceSto);
  },
  setcoinList: function(context, list) {
    context.commit('setcoinList', list);
  },
  setDelegation: function(context, value) {
    context.commit('setDelegation', value);
  },
  setDistribution: function(context, value) {
    context.commit('setDistribution', value);
  }
};
const getters = {
  getaddress: state => {
    return state.address;
  },
  getblance: state => {
    return state.blance;
  },
  balanceLamb: state => {
    return state.blance;
  },
  getDistributionReward: state => {
    return state.DistributionReward;
  },
  getbalanceSto(state) {
    return state.balanceSto;
  },
  getcoinList(state) {
    return state.coinList;
  },
  getDelegation(state) {
    return state.Delegation;
  },
  getDistribution(state) {
    return state.Distribution;
  }
};


export default {
  state,
  mutations,
  actions,
  getters
};
