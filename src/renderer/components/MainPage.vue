<template>
  <el-container id="page">
    <el-row style="width:98%">
      <el-col :xs="24">
        <el-header>
          <query-form></query-form>
        </el-header>
      </el-col>
      <el-col :xs="24">
        <el-tabs
          v-model="tab"
          :tab-position="'left'"
          @tab-click="handleClick"
          style="margin:20px; "
        >
          <el-tab-pane name="result">
            <span slot="label">
              <i class="el-icon-s-data"></i>
            </span>
            <query-result></query-result>
          </el-tab-pane>
          <el-tab-pane label="Settings" name="settings">
            <span slot="label">
              <i class="el-icon-s-tools"></i>
            </span>
            <settings></settings>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"
import QueryForm from "./MainPage/QueryForm"
import Settings from "./MainPage/Settings"
import QueryResult from "./MainPage/QueryResult"
import fs from 'fs'
import path from 'path'
import os from 'os'
import storage  from 'electron-json-storage'
// import { createNamespacedHelpers } from 'vuex'

// const { mapState } = createNamespacedHelpers('Counter')

export default {
  components: { QueryForm, QueryResult, Settings },
  methods: {
    ...mapActions('Entity', ["importEntities"]),
    ...mapActions('Category', ["importCategories"]),
    ...mapActions('Token', ["setToken"]),
    startHacking() {
      this.$notify({
        title: "It works!",
        type: "success",
        message:
          "We've laid the ground work for you. It's time for you to build something epic!",
        duration: 5000
      });
    },
    handleClick(tab, event) {
      //console.log(tab, event);
    }
  },
  computed: {
    ...mapState({
      main: state => state.Counter.main,
      entities: state => state.Entity.entities,
      categories: state => state.Category.categories,
      access_token: state => state.Token.access_token
    })
  },
  data() {
    return {
      tab: "result"
    };
  },
  mounted() {
    // var p = path.join(__dirname, '../../../static/', 'scenario.json')
    // var scenario = JSON.parse(fs.readFileSync(p, 'utf8'))
    // this.importEntities(scenario.entities)
    // this.importCategories(scenario.categories)


    const defaultDataPath = storage.getDefaultDataPath()
    console.log(defaultDataPath);
    var that = this;
    storage.get('token', function(error, data) {
      if (error) throw error;
      
      if(Object.keys(data).length==0) {
        var token_path = path.join(__static, 'token.json')
        var token_json = JSON.parse(fs.readFileSync(token_path, 'utf8'))
        that.setToken(token_json.TOKEN)
      }
    });

    storage.get('category', function(error, data) {
      if (error) throw error;

      if(Object.keys(data).length==0) {
        var category_path = path.join(__static, 'category.json')
        var category_json = JSON.parse(fs.readFileSync(category_path, 'utf8'))
        that.importCategories(category_json)
      }
    });

    storage.get('entity', function(error, data) {
      if (error) throw error;

      if(Object.keys(data).length==0) {
        var entity_path = path.join(__static, 'entity.json')
        var entity_json = JSON.parse(fs.readFileSync(entity_path, 'utf8'))
        that.importEntities(entity_json)
      }
    });
    





  }
};
</script>

<style>
#page {
  font-family: Helvetica, sans-serif;
  text-align: center;
  margin: 0.5rem;
}
</style>