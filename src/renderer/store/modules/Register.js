const state = {
  word: [],
  combineWords: '',
}

const mutations = {
  setWord: function (state, word) {
    // console.log('mutations');
    state.word = word;
  },
  setCombineWord: function (state, word) {
    // console.log('mutations');
    state.combineWords = word;
  },
}

const actions = {
  setWord: function (context, word) {
    // console.log('actions')
    context.commit('setWord', word);
  },
  setCombineWord: function (context, word) {
    // console.log('actions')
    context.commit('setCombineWord', word);
  },
}

const  getters= {
  getCombineWords: state => {
    return state.combineWords
  },
  getWords: state => {
    return state.word
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}