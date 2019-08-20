<template>
  <el-form>
    <el-row>
      <el-col :xs="24">
        <el-form-item label="Azure DevOps Access Token">
          <el-input v-model="access_token" @change="saveToken" show-password></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import fs from 'fs'
import path from 'path'
import { log } from 'util';
export default {
  computed: {

      access_token: {
        get() {
          return this.$store.state.Token.access_token;
        },
        set(value) {
          this.setToken(value);
          
         
        }
      }

    
  },
  methods: {
    ...mapActions("Token", ["setToken", "saveToken"]),

  }
};
</script>


