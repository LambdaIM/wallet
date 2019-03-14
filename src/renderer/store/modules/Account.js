const state = {
  address: '',
  blance: 0

}

console.log('--------***************')
const mutations = {
  setaddress: function (state, address) {
    console.log('mutations')
    state.address = address;
  },
  setblance: function (state, blance) {
    state.blance = blance;
  }

}


const actions = {
  setaddress: function (context, address) {
    console.log('actions')
    context.commit('setaddress', address)
  },
  setblance: function ({ blance }) {
    commit('setblance', address)
  }
}
const getters = {
  getaddress: state => {
    return state.address
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}