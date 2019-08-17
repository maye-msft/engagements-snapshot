<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Security">
      <security-pane></security-pane>
    </el-tab-pane>
    <el-tab-pane label="Entity">
      <entity-pane></entity-pane>
    </el-tab-pane>
    <el-tab-pane label="Category Rule">
      <category-pane></category-pane>
    </el-tab-pane>

  </el-tabs>


</template>

<script>
import EntityPane from './Settings/EntityPane'
import CategoryPane from './Settings/CategoryPane'
import SecurityPane from './Settings/SecurityPane'
  export default {
    components: { SecurityPane, EntityPane, CategoryPane },
    methods: {
      format (percentage) {
        return percentage === 100 ? 'Full' : `${percentage}%`
      }
    }
  }
</script>