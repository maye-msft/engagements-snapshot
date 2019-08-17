<template>
  <el-form :label-position="'Top'" :model="queryForm">
    <el-row :gutter="5">
      <el-col :xs="24" :md="7">
        <el-form-item>
          <el-date-picker
            v-model="queryForm.fromDate"
            type="date"
            placeholder="From"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :md="7">
        <el-form-item>
          <el-date-picker
            v-model="queryForm.toDate"
            type="date"
            placeholder="To"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-select v-model="queryForm.industry" placeholder="Industry" style="width:100%">
          <el-option v-for="item in industryitems" :label="item" :value="item" v-bind:key="item"></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :md="2">
        <el-button type="primary" @click="onSubmit" style="width:100%;"><i class="el-icon-search"></i></el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>

export default {
  data () {
    return {
      queryForm: {
        fromDate: '',
        toDate: '',
        industry: ''
      },
      industryitems: [
        'Automotive',
        'Education',
        'Financial Services',
        'Government',
        'Health',
        'Manufacturing & Resources',
        'Media & Communications',
        'Other Commercial Industries']
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style>

.el-col {
        margin-top: 10px;
  border-radius: 4px;
}
</style>