const state ={
    info:null
  }
  const mutations={
      setinfo:function(state, info){
        console.log('mutations')
        state.info=info;
      }
  }
  const actions={
    setinfo:function(context, info){
        console.log('actions')
        context.commit('setinfo', info)
    }
  }
  const  getters= {
    info: state => {
      return state.info
    } 
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }