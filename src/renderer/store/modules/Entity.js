import fs from 'fs'
import path from 'path'

const state = {
  entities: []
}

const mutations = {
  addEntity (state, entity) {
    state.entities.push({ name: entity, keywords: '' })
  },
  removeEntity (state, index) {
    state.entities.splice(index, 1)
  },
  setEntity (state, param) {
    state.entities[param[0]].name = param[1].name
    state.entities[param[0]].keywords = param[1].keywords
  },
  deleteAllEntity (state) {
    state.entities = []
  },
  importEntities (state, entities) {
    state.entities = entities
  },
  saveEntity (state) {
    var p = path.join(__dirname, '../../../../static/', 'entity.json')
    fs.writeFileSync(p, JSON.stringify(state.entities, null, 4), 'utf8')
  }
}

const actions = {
  addEntity ({ commit }, data) {
    commit('addEntity', data)
    commit('saveEntity')
  },
  removeEntity ({ commit }, index) {
    commit('removeEntity', index)
    commit('saveEntity')
  },
  setEntity ({ commit }, param) {
    commit('setEntity', param)
  },
  deleteAllEntity ({ commit }) {
    commit('deleteAllEntity')
    commit('saveEntity')
  },
  importEntities ({ commit }, data) {
    commit('importEntities', data)
    commit('saveEntity')
  },
  saveEntity ({ commit }) {
    commit('saveEntity')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}