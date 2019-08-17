
const state = {
  access_token: ''
}

const mutations = {
  setToken (state, token) {
    state.access_token = token
  }
}

const actions = {
  setToken ({ commit }, token) {
    commit('setToken', token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
