<template>
  <div >
    <h4 style="padding-bottom:20px">{{ engagements.length}} Engagement(s) Found</h4>

    <el-table
      :data="engagements"
      stripe
      border
      :height="tableheight()"
      :default-sort="{prop: 'date', order: 'descending'}"
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p style="width:100%; max-width:600px" v-html="scope.row.fields['System.Description']"></p>
        </template>
      </el-table-column>
      <el-table-column sortable label="ID" width="100">
        <template slot-scope="scope">
          <el-button @click="showUrl(`https://csefy19.visualstudio.com/Organizations/_workitems/edit/${scope.row.id}`)" type="text">{{ scope.row.id }}</el-button>
        </template>
      </el-table-column>

      <el-table-column v-for="column in selectedColumns" :label="formatColumn(column)" :width="columnWdith(column)">
        <template slot-scope="scope">
          <span>{{ calcValue(scope, column) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-for="column in selectedColumns" sortable :prop="column" :label="column" ></el-table-column> -->

    </el-table>
  </div>
</template>
<style>
#result-table {
  height: calc(100% - 400px);    
}
</style>>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState({
      engagements: state => state.Engagement.engagements,
      objects: state => state.Engagement.objects,
      selectedColumns: state => state.Engagement.selectedColumns
    }),
    // orgs() {
    //   var orgs = [];
    //   var cache = [];
    //   this.engagements.forEach(eng => {
    //     if (cache.indexOf(eng.organizationId) != -1) return;
    //     cache.push(eng.organizationId);
    //     orgs.push({ text: eng.organization, value: eng.organizationId });
    //   });
    //   return orgs;
    // },
    // cates() {
    //   var cates = [{ text: "N/A", value: "N/A" }];
    //   var cache = [];
    //   this.engagements.forEach(eng => {
    //     if (eng.category) {
    //       eng.category.forEach(cate => {
    //         if (cache.indexOf(cate) != -1) return;
    //         cates.push({ text: cate, value: cate });
    //         cache.push(cate);
    //       });
    //     }
    //   });
    //   return cates;
    // }


  },
  mounted() {
    
    
  },
  methods: {
    calcValue(scope, fields) {
      var obj = scope.row
      var fieldArray = fields.split("/")
      for(var i = 0;i<fieldArray.length;i++) {
        if(fieldArray[i]!='')
          obj = obj[fieldArray[i]] 
        if(!obj) {
          return null
        }
      }
      return obj
    },
    columnWdith(column) {
      var name = this.formatColumn(column)
      if(name=="Title") {
        return 250
      } else {
        return this.formatColumn(column).length*15
      }
    },
    tableheight(){
      return 600
    },
    formatColumn(column) {
      const items = column.split("/")
      const name = []
      items.forEach((item)=>{
        if(item!=='' && item!='fields') {
          if(item.indexOf(".")==-1) {
            name.push(item)
          } else {
            name.push(column.substr(column.lastIndexOf(".")+1))
          }
        }
      })
      return name.join("-")
      
    },
    showUrl(url) {
      require("electron").shell.openExternal(url);
      //console.log(row);
    },
    filterOrg(value, row) {
      return row.organizationId === value;
    },
    filterCate(value, row) {
      return (
        (row.category && row.category.indexOf(value) != -1) ||
        (!row.category && value == "N/A")
      );
    },
    status2Tag(status) {
      if (!status) {
        return "";
      } else if (status.indexOf("Yellow") != -1) {
        return "warning";
      } else if (status.indexOf("Green") != -1) {
        return "success";
      } else if (status.indexOf("Black") != -1) {
        return "danger";
      } else if (status.indexOf("Gray") != -1) {
        return "info";
      } else {
        return "";
      }
    },
    showStatus(tag) {
      if (tag) return tag.substr(0, tag.indexOf("("));
      else return "";
    },
    
  }
};
</script>