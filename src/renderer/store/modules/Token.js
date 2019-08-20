import storage from 'electron-json-storage'

const state = {
  access_token: ''
}

const mutations = {
  setToken (state, token) {
    state.access_token = token
  },
  saveToken (state) {
    // var p = path.join(__dirname, '../../../../../static/', 'token.json')
    // fs.writeFileSync(p, `{"TOKEN":"${this.access_token}"}`,'utf8')
    storage.set('token', state.access_token, function (error) {
      if (error) {
        throw error
      }
    })
  }
}

const actions = {
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  saveToken ({ commit }) {
    commit('saveToken')
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
