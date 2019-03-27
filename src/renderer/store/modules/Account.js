const state = {
  address: '',
  blance: 0,
  loginState: false
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
  }
}


const actions = {
  setaddress: function (context, address) {
    console.log('actions')
    context.commit('setaddress', address)
  },
  setblance: function ({ blance }) {
    commit('setblance', address)
  },
  set: function (context, loginState) {
    console.log('actions login')
    context.commit('setLogin', loginState)
  },
}
const getters = {
  getaddress: state => {
    return state.address
  },
}


export default {
  state,
  mutations,
  actions,
  getters
}