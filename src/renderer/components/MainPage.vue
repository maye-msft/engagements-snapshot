<template>
    <el-container id="page">
    <el-row style="width:100%">
        <el-col :xs="24" style="width:100%">
            <el-header>
        <query-form ></query-form>
            </el-header>
        </el-col>

        <el-col :xs="24">
        Main {{main}}
        </el-col>
   </el-row>
    </el-container>
</template>

<script>

import { mapState } from 'vuex'
import QueryForm from './MainPage/QueryForm'
// import { createNamespacedHelpers } from 'vuex'

// const { mapState } = createNamespacedHelpers('Counter')

export default {
  components: { QueryForm },
  methods: {
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    }
  },
  computed: {
    ...mapState({
      main: state => state.Counter.main
    })
  }
}
</script>

<style>
#page {
  font-family: Helvetica, sans-serif;
  text-align: center;
  margin: 0.5rem
}

</style>