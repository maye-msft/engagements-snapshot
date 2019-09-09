<template>
  <el-row :gutter="10">
    <el-col :xs="24" :md="6">
      <el-button type="primary" @click="addCategory('Category')" style="width:100%;">
        <i class="el-icon-plus"></i> Add Category
      </el-button>
    </el-col>
    <el-col :xs="24" :md="6">
      <el-button type="danger" @click="confirm(removeAllCategory)" style="width:100%;">
        <i class="el-icon-delete"></i> Clear Categories
      </el-button>
    </el-col>

    <el-col :xs="24" style>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(category,i) in categories"
          :key="i"
          :name="i"
          :title="category.name"
        >
          <el-form>
            <el-row>
              <el-col :xs="24">
                <el-form-item label="Category Name">
                  <el-input v-model="category.name" @blur="handleChange"></el-input>
                </el-form-item>
              </el-col>

              <template v-for="(rule, index) in category.rules">
                <el-col :xs="24" style="text-align:left">
                  <div style="text-align:left;">
                    <span>Rule #{{index+1}}</span>
                  </div>
                  <div style="text-align:right;">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      @click="removeCategoryRule([i, index])"
                      circle
                    ></el-button>
                  </div>
                </el-col>

                <el-col :xs="24">
                  <el-form-item style="width:100%" label="Primary Condition Entities">
                    <el-select
                      style="width:100%"
                      v-model="rule.primaryobjects"
                      multiple
                      placeholder="Primary Condition Entities"
                      @change="handleChange"
                    >
                      <el-option
                        v-for="entity in entities"
                        :key="entity.name"
                        :label="entity.name"
                        :value="entity.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24">
                  <el-form-item style="width:100%" label="Secondary Condition Entities">
                    <el-select
                      style="width:100%"
                      v-model="rule.secondaryobjects"
                      multiple
                      placeholder="Secondary Condition Entities"
                      @change="handleChange"
                    >
                      <el-option
                        v-for="entity in entities"
                        :key="entity.name"
                        :label="entity.name"
                        :value="entity.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
          <el-row>
            <el-col :xs="24" :md="12" style="text-align:left">
              <el-button type="primary" @click="addCategoryRule([i, 'Rule'])">
                <i class="el-icon-delete"></i> Add Category Rule
              </el-button>
            </el-col>
            <el-col :xs="24" :md="12" style="text-align:right">
              <el-button type="danger" @click="removeCategory(i)">
                <i class="el-icon-delete"></i> Remove Category
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import util from "../util"
export default {
  data() {
    return {
      activeNames: ["1"]
    };
  },
  methods: {
    ...mapActions("Category", [
      "addCategory",
      "removeCategory",
      "removeAllCategory",
      "addCategoryRule",
      "removeCategoryRule",
      "saveCategory"
    ]),
    handleChange(val) {
      this.saveCategory();
    },
    confirm(cb) {
      util.confirm(cb)
    }
  },
  computed: {
    // ...mapState({
    //   entities: state => state.Entity.entities,
    //   categories: state => state.Category.categories
    // })
    ...mapState("Entity", ['entities']),
    ...mapState("Category", ['categories'])
  }
};
</script>