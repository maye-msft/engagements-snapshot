const state = {
  engagements: [],
  objects: {},
  selectedColumns: [
    '/fields/System.Title',
    '/Organization/fields/System.Title',
    '/fields/CSEngineering-V2.CountrySelection',
    '/fields/System.State',
    '/Categories'
  ]
}

const mutations = {
  setEngagements (state, engagements) {
    state.engagements = engagements
  },
  setObjects (state, objects) {
    state.objects = objects
  },
  setSelectedColumns (state, selectedColumns) {
    state.selectedColumns = selectedColumns
  }
}

const actions = {
  setEngagements ({ commit }, engagements) {
    commit('setEngagements', engagements)
  },
  setObjects ({ commit }, objects) {
    commit('setObjects', objects)
  },
  setSelectedColumns ({ commit }, selectedColumns) {
    commit('setSelectedColumns', selectedColumns)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
