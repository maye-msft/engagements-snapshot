<template>
  <el-row :gutter="10">
    <el-col :xs="24" :md="4">
      <el-button type="primary" @click="addEntity('Entity')" style="width:100%;">
        <i class="el-icon-plus"></i> Add Entity
      </el-button>
    </el-col>
    <el-col :xs="24" :md="4">
      <el-button type="danger" @click="deleteAllEntity()" style="width:100%;">
        <i class="el-icon-delete"></i> Clear Entities
      </el-button>
    </el-col>

    <el-col :xs="24" style>
      <el-collapse v-model="activeNames" >
        <el-collapse-item v-for="(entity,i) in entities" :key="i" :name="i" :title="entity.name">
          <el-row>
            <el-col :xs="24">
              <!-- <el-form> -->
                <!-- <el-form-item label="Entity Name">
                  <el-input v-model="entity.name" @blur="handleChange"></el-input>
                </el-form-item>
                <el-form-item label="Keywords">
                  <el-input type="textarea" v-model="entity.keywords" @blur="handleChange"></el-input>
                </el-form-item>
              </el-form> -->
              <entity-item :idx="i"></entity-item>
            </el-col>
            <el-col :xs="24" style="text-align:right">
              <el-button type="danger" @click="removeEntity(i)">
                <i class="el-icon-delete"></i> Remove Entity
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
import EntityItem from "./EntityItem"

export default {
  components: { EntityItem },
  data() {
    return {
      activeNames: ["1"]
    };
  },
  methods: {
    ...mapActions("Entity", ["addEntity", "removeEntity", "deleteAllEntity", "saveEntity"]),
    handleChange(val) {
      this.saveEntity();
    }
  },
  computed: {
    // ...mapState({
    //   entities: state => state.Entity.entities
    // })
    ...mapState("Entity", ['entities']),
  }
};
</script>