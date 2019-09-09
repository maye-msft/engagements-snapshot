<template>
  <el-form>
    <el-row>
      <el-col :xs="24">
        <el-form-item label="Azure DevOps Access Token">
          <el-input v-model="access_token" @change="saveToken" show-password></el-input>
          <span v-if="access_token">Token file location: {{defaultDataPath}}</span>
          <el-button v-else @click="showUrl()" type="text">How To Get Access Token</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import fs from "fs";
import path from "path";
import { log } from "util";
import storage from "electron-json-storage";
export default {
  computed: {
    defaultDataPath() {
      return storage.getDefaultDataPath();
    },
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
    showUrl() {
       require("electron").shell.openExternal(`https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&viewFallbackFrom=vsts`)
    }
  }
};
</script>


