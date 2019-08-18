const state = {
  engagements: [],
  objects: {}
}

const mutations = {
  setEngagements (state, engagements) {
    state.engagements = engagements
  },
  setObjects (state, objects) {
    state.objects = objects
  }
}

const actions = {
  setEngagements ({ commit }, engagements) {
    commit('setEngagements', engagements)
  },
  setObjects ({ commit }, objects) {
    commit('setObjects', objects)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
