// import fs from 'fs'
// import path from 'path'
import storage from 'electron-json-storage'
const state = {
  categories: []
}

const mutations = {
  addCategory (state, category) {
    state.categories.push({ name: category, rules: [] })
  },
  removeCategory (state, index) {
    state.categories.splice(index, 1)
  },
  removeAllCategory (state, index) {
    state.categories = []
  },
  addCategoryRule (state, param) {
    var cateIndex = param[0]
    var rule = param[1]
    state.categories[cateIndex].rules.push({
      name: rule,
      primaryobjects: [],
      secondaryobjects: []
    })
  },
  removeCategoryRule (state, param) {
    var cateIndex = param[0]
    var index = param[1]
    state.categories[cateIndex].rules.splice(index, 1)
  },
  importCategories (state, categories) {
    state.categories = categories
  },
  saveCategory (state) {
    storage.set('category', state.categories, function (error) {
      if (error) {
        throw error
      }
    })

    // var p = path.join(__dirname, '../../../../static/', 'category.json')
    // fs.writeFileSync(p, JSON.stringify(state.categories, null, 4), 'utf8')
  }
}

const actions = {
  addCategory ({ commit }, category) {
    commit('addCategory', category)
    commit('saveCategory')
  },
  removeCategory ({ commit }, index) {
    commit('removeCategory', index)
    commit('saveCategory')
  },
  removeAllCategory ({ commit }, index) {
    commit('removeAllCategory', index)
    commit('saveCategory')
  },
  addCategoryRule ({ commit }, param) {
    commit('addCategoryRule', param)
    commit('saveCategory')
  },
  removeCategoryRule ({ commit }, param) {
    commit('removeCategoryRule', param)
    commit('saveCategory')
  },
  importCategories ({ commit }, categories) {
    commit('importCategories', categories)
    commit('saveCategory')
  },
  saveCategory ({ commit }) {
    commit('saveCategory')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
