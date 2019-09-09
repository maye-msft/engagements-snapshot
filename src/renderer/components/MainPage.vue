<template>
  <el-container id="page" style="width:98%">
    <!-- <el-row style="width:98%">
      <el-col :xs="24">
        <el-header>
          <query-form ref="queryform"></query-form>
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
    </el-row>-->

    <el-tabs type="border-card" style="height: 100%;width:100%">
      <el-tab-pane label="Query">
        <el-row :gutter="20">
          <el-col :span="6">
            <query-form ref="queryform"></query-form>
          </el-col>
          <el-col :span="18" style="height: 100%;">
            <query-result></query-result>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="Entity">
        <entity-pane></entity-pane>
      </el-tab-pane>
      <el-tab-pane label="Category Rule">
        <category-pane></category-pane>
      </el-tab-pane>
      <el-tab-pane label="Access Token">
        <security-pane></security-pane>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="Add Keyword" :visible.sync="dialogFormVisible">
      <el-form>
        <el-row :gutter="1">
          <el-col :xs="24">
            <el-form-item label="Keyword" style="font-size:8px;text-align:left">
              <el-input autocomplete="off" v-model="createRuleForm.keyword"></el-input>

              <el-radio-group v-model="createRuleForm.newEntity" style="width:100%">
                <el-radio label="new">New entity</el-radio>
                <el-radio label="exist">Existing entity</el-radio>
              </el-radio-group>

              <el-input
                autocomplete="off"
                v-model="createRuleForm.newEntityName"
                placeholder="Input Entity Name"
                v-if="createRuleForm.newEntity=='new'"
              ></el-input>

              <el-select
                v-model="createRuleForm.entity"
                placeholder="Select an Entity"
                v-if="createRuleForm.newEntity=='exist'"
                style="width:100%"
              >
                <el-option
                  v-for="(entity, idx) in entities"
                  :key="entity.name"
                  :label="entity.name"
                  :value="idx"
                ></el-option>
              </el-select>

              <el-radio-group v-model="createRuleForm.newCategory" style="width:100%">
                <el-radio label="new">New category</el-radio>
                <el-radio label="exist">Existing category</el-radio>
                <el-radio label="none">None</el-radio>
              </el-radio-group>

              <el-input
                autocomplete="off"
                v-model="createRuleForm.newCategoryName"
                v-if="createRuleForm.newCategory=='new'"
                placeholder="Input Category Name"
              ></el-input>

              <el-select
                v-model="createRuleForm.category"
                placeholder="Select a category"
                v-if="createRuleForm.newCategory=='exist'"
                style="width:100%"
              >
                <el-option
                  v-for="(category, idx) in categories"
                  :key="category.name"
                  :label="category.name"
                  :value="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addKeyword">Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import QueryForm from "./MainPage/QueryForm";
import QueryResult from "./MainPage/QueryResult";
import EntityPane from "./MainPage/Settings/EntityPane";
import CategoryPane from "./MainPage/Settings/CategoryPane";
import SecurityPane from "./MainPage/Settings/SecurityPane";
import fs from "fs";
import path from "path";
import os from "os";
import storage from "electron-json-storage";
import contextMenu from "electron-context-menu";

// import { createNamespacedHelpers } from 'vuex'

// const { mapState } = createNamespacedHelpers('Counter')

export default {
  components: {
    QueryForm,
    QueryResult,
    EntityPane,
    CategoryPane,
    SecurityPane
  },
  methods: {
    ...mapActions("Entity", [
      "importEntities",
      "addEntityWithKeyword",
      "saveEntity"
    ]),
    ...mapActions("Category", [
      "importCategories",
      "addCategoryRuleWithName",
      "saveCategory"
    ]),
    ...mapActions("Token", ["setToken"]),
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
    },
    addKeyword() {
      if (this.createRuleForm.keyword.trim().length == 0) {
        alert("Keyword is empty!");
        return;
      }

      if (this.createRuleForm.newEntity == "new") {
        if (this.createRuleForm.newEntityName.trim().length == 0) {
          alert("Entity name is empty!");
          return;
        }
        this.addEntityWithKeyword([
          this.createRuleForm.newEntityName.trim(),
          this.createRuleForm.keyword.trim()
        ]);
      } else {
        if (this.selectedEntity) {
          if (this.selectedEntity.keywords) {
            this.selectedEntity.keywords =
              this.selectedEntity.keywords +
              "\n" +
              this.createRuleForm.keyword.trim();
          } else {
            this.selectedEntity.keywords = this.createRuleForm.keyword.trim();
          }
        }
        this.saveEntity();
      }
      var entity = null;
      if (this.createRuleForm.newEntity == "new") {
        entity = this.createRuleForm.newEntityName.trim();
      } else {
        entity = this.createRuleForm.entity.name;
      }
      if (this.createRuleForm.newCategory == "new") {
        if (this.createRuleForm.newCategoryName.trim().length == 0) {
          alert("Category name is empty!");
          return;
        }

        this.addCategoryRuleWithName([
          this.createRuleForm.newCategoryName.trim(),
          entity
        ]);
      } else if (this.createRuleForm.newCategory == "exist") {
        if (this.selectedCate) {
          this.selectedCate.rules = this.selectedCate.rules || [];
          this.selectedCate.rules.push({
            name: "Rule",
            primaryobjects: [entity],
            secondaryobjects: []
          });
        }
        this.saveCategory();
      }
      setTimeout(() => {
        this.$refs.queryform.updateCategory();
        this.dialogFormVisible = false;
      }, 2000);
    }
  },
  computed: {
    ...mapState({
      main: state => state.Counter.main,
      entities: state => state.Entity.entities,
      categories: state => state.Category.categories,
      access_token: state => state.Token.access_token
    }),
    selectedEntity() {
      if (
        this.createRuleForm.entity != -1 &&
        this.entities &&
        this.entities.length > this.createRuleForm.entity
      ) {
        return this.entities[this.createRuleForm.entity];
      } else {
        return null;
      }
    },
    selectedCate() {
      if (
        this.createRuleForm.category != -1 &&
        this.categories &&
        this.categories.length > this.createRuleForm.category
      ) {
        return this.categories[this.createRuleForm.category];
      } else {
        return null;
      }
    }
  },
  data() {
    return {
      tab: "result",
      dialogFormVisible: false,
      createRuleForm: {
        newEntity: "new",
        newCategory: "new",
        keyword: "",
        newEntityName: "",
        category: 0,
        entity: 0
      }

      // createRuleForm_keyword:'test'
    };
  },
  mounted() {
    // var p = path.join(__dirname, '../../../static/', 'scenario.json')
    // var scenario = JSON.parse(fs.readFileSync(p, 'utf8'))
    // this.importEntities(scenario.entities)
    // this.importCategories(scenario.categories)

    const defaultDataPath = storage.getDefaultDataPath();
    console.log("defaultDataPath=" + defaultDataPath);

    var that = this;
    storage.get("token", function(error, data) {
      if (error) throw error;

      if (Object.keys(data).length == 0) {
        try {
          var token_path = path.join(__static, "token.json");
          var token_json = JSON.parse(fs.readFileSync(token_path, "utf8"));
          that.setToken(token_json.TOKEN);
        } catch (err) {}
      }
    });

    storage.get("category", function(error, data) {
      if (error) throw error;

      if (Object.keys(data).length == 0) {
        var category_path = path.join(__static, "category.json");
        var category_json = JSON.parse(fs.readFileSync(category_path, "utf8"));
        that.importCategories(category_json);
      }
    });

    storage.get("entity", function(error, data) {
      if (error) throw error;

      if (Object.keys(data).length == 0) {
        var entity_path = path.join(__static, "entity.json");
        var entity_json = JSON.parse(fs.readFileSync(entity_path, "utf8"));
        that.importEntities(entity_json);
      }
    });

    contextMenu({
      prepend: (defaultActions, params, browserWindow) => [
        // {
        //   label: 'Rainbow',
        //   // Only show it when right-clicking images
        //   visible: params.mediaType === 'image'
        // },
        {
          label: "Create “{selection}” as keyword",
          visible: params.selectionText.trim().length > 0,
          click: () => {
            that.dialogFormVisible = true;
            var keyword = params.selectionText.trim();
            that.createRuleForm.keyword = keyword;
            that.createRuleForm.newEntityName = keyword;
            that.createRuleForm.newEntity = "new";
            that.createRuleForm.newCategoryName = keyword;
            // that.createRuleForm_keyword = keyword
            //require('electron').shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`)
          }
        }
      ]
    });
  }
};
</script>

<style>
#page {
  font-family: Helvetica, sans-serif;
  text-align: center;
  margin: 0.5rem;
  overflow: hidden;
  height:100%
}
</style>