<template>
  <el-form>
    <el-form-item label="Entity Name">
      <el-input v-model.lazy="name" @blur="handleChange"></el-input>
    </el-form-item>
    <el-form-item label="Keywords">
      <el-input type="textarea" v-model.lazy="keywords" @blur="handleChange"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  props: ["idx"],
  data() {
    return {
      name:'',
      keywords:''
    };
  },
  methods: {
    ...mapActions("Entity", [
      "setEntity",
      "saveEntity"
    ]),
    handleChange(val) {
      this.setEntity([this.idx, {name: this.name, keywords:this.keywords}])

    }
  },
  mounted(){
    if(this.$store.state.Entity.entities[this.idx]) {
      this.name = this.$store.state.Entity.entities[this.idx].name;
      this.keywords = this.$store.state.Entity.entities[this.idx].keywords;
    }
  },
  computed: {
    // name: {
    //   get() {
    //     return this.$store.state.Entity.entities[this.idx].name;
    //   },
    //   set(value) {
    //     this.setEntity([this.idx, {name: value, keywords:this.keywords}])
    //   }
    // },
    // keywords: {
    //   get() {
    //     return this.$store.state.Entity.entities[this.idx].keywords;
    //   },
    //   set(value) {
    //     this.setEntity([this.idx, {name: this.name, keywords:value}])
    //   }
    // }
  }
};
</script>