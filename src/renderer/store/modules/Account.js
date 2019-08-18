const state = {
  address: '',
  blance: 0,
  loginState: false,
  Totalblance:0,
  DistributionReward:0,
  balanceSto:0,
  coinList:[]
}

console.log('--------***************');
const mutations = {
  setaddress: function (state, address) {
    console.log('mutations')
    state.address = address;
  },
  setblance: function (state, blance) {
    state.blance = blance;
  },
  setLogin: function (state,loginState) {
    console.log('setLogin');
    state.loginState=loginState;
  },
  setTotalblance:function(state,Totalblance){
    state.Totalblance = Totalblance;
  },
  setDistributionReward:function(state,Reward){
    state.DistributionReward = Reward;
  },
  setbalanceSto:function(state,balanceSto){
    state.balanceSto = balanceSto;
  },
  setcoinList:function(state,list){
    state.coinList = list;
  }
}


const actions = {
  setaddress: function (context, address) {
    console.log('actions')
    context.commit('setaddress', address)
  },
  setblance: function (context, blance ) {
    context.commit('setblance', blance)
  },
  set: function (context, loginState) {
    console.log('actions login')
    context.commit('setLogin', loginState)
  },
  setTotalblance: function (context, Totalblance ) {
    context.commit('setTotalblance', Totalblance)
  },
  setDistributionReward:function(context,DistributionReward){
    context.commit('setDistributionReward', DistributionReward)
  },
  setbalanceSto:function(context,balanceSto){
    context.commit('setbalanceSto', balanceSto)
  },
  setcoinList:function(context,list){
    context.commit('setcoinList', list)
  }
}
const getters = {
  getaddress: state => {
    return state.address
  },
  getblance: state => {
    return state.blance
  },
  getTotalblance:(state)=>{
    return state.Totalblance
  },
  getDistributionReward:(state)=>{
    return state.DistributionReward
  },
  getbalanceSto(state){
    return state.balanceSto
  },
  getcoinList(state){
    return state.coinList
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}