const state ={
    address:'',
    walletname:'',
    blance:0

  }
  
  const mutations={
      setaddress:function(state, {address,walletName}){
        console.log('mutations')
        console.log('set',address,walletName)
        state.address = address;
        state.walletname=walletName;
      },
      setblance:function(state, blance){
        state.blance = blance;
      }

  }


  const actions={
    setaddress:function(context, {address,walletName}){
        console.log('actions')
        context.commit('setaddress', {address,walletName})
    },
    setblance:function({blance}){
        commit('setblance',address)
    }
  }
  const  getters= {
    getaddress: state => {
      console.log('getaddress')
      return state.address
    },
    getWalletName: state => {
      console.log('getWalletName')
      return state.walletname
    }
  }
  
  
  export default {
    state,
    mutations,
    actions,
    getters
  }