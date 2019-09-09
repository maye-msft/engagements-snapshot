<template>
  <div >
    <el-table
      :data="engagements"
      stripe
      border
      :height="tableheight()"
      id="result-table"
      :default-sort="{prop: 'date', order: 'descending'}"
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p v-html="objects[scope.row.id].value.fields['System.Description']"></p>
          <hr />
          <div v-for="ent in scope.row.entity">
            <p>Entity: {{ent.entity}} | Keyword: {{ent.keyword}} | Score: {{ent.score}}</p>
          </div>
          <!-- <el-form >
        <el-form-item style="width:80%;font-size:small">
           
            <>
          </el-form-item>-->
          <!-- <template v-for="fieldkey in Object.keys(objects[props.row.id].value.fields)">
          <template v-if="typeof objects[props.row.id].value.fields[fieldkey] != 'object'">
            <el-form-item :label="fieldkey" style="font-size:medium">
              <span v-html="objects[props.row.id].value.fields[fieldkey]"></span>
            </el-form-item>
          </template>
          <template
            v-else
            v-for="subfieldkey in Object.keys(objects[props.row.id].value.fields[fieldkey] )"
          >
            <template
              v-if="typeof objects[props.row.id].value.fields[fieldkey][subfieldkey] != 'object'"
            >
              <el-form-item :label="fieldkey+'-'+subfieldkey">
                <span v-html="objects[props.row.id].value.fields[fieldkey][subfieldkey]"></span>
              </el-form-item>
            </template>
          </template>
          </template>-->
          <!-- </el-form> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="ID" width="100">
        <template slot-scope="scope">
          <el-button @click="showUrl(scope.row.engagementUrl)" type="text">{{ scope.row.id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="organization"
        label="Org"
        width="180"
        :filters="orgs"
        :filter-method="filterOrg"
      >
        <template slot-scope="scope">
          <el-button
            @click="showUrl(scope.row.organizationUrl)"
            type="text"
          >{{ scope.row.organization }}</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="title" label="Ttile" width="250"></el-table-column>

      <el-table-column
        sortable
        prop="status"
        label="Status"
        :filters="[{value:'Active', text:'Active'}, {value:'Healthy', text:'Healthy'}, {value:'Not Engaged',text:'Not Engaged'}, {value:'Business Blocked',text:'Business Blocked'}]"
        :filter-method="(value, row)=>{return row.status.indexOf(value)!=-1}"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag
            :type="status2Tag(scope.row.status)"
            disable-transitions
          >{{showStatus(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="category"
        label="Category"
        :filters="cates"
        :filter-method="filterCate"
        width="180"
      >
        <template slot-scope="scope">
          <el-tag v-for="cate in scope.row.category" :type="'success'" disable-transitions>{{cate}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
      sortable
      prop="entity"
      label="Entity"
      width="180"
    >

        <template slot-scope="scope">
          <el-tag 
            :type="'success'"
            disable-transitions
          >{{JSON.stringify(scope.row.entity)}}</el-tag>
        </template>


      </el-table-column>-->
      <el-table-column sortable prop="state" label="State" width="180">
        <template slot-scope="scope">
          <el-tag :type="'info'" disable-transitions>{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="Time" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }} - {{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="assignedto" label="Assigned To" width="150"></el-table-column>
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
      objects: state => state.Engagement.objects
    }),
    orgs() {
      var orgs = [];
      var cache = [];
      this.engagements.forEach(eng => {
        if (cache.indexOf(eng.organizationId) != -1) return;
        cache.push(eng.organizationId);
        orgs.push({ text: eng.organization, value: eng.organizationId });
      });
      return orgs;
    },
    cates() {
      var cates = [{ text: "N/A", value: "N/A" }];
      var cache = [];
      this.engagements.forEach(eng => {
        if (eng.category) {
          eng.category.forEach(cate => {
            if (cache.indexOf(cate) != -1) return;
            cates.push({ text: cate, value: cate });
            cache.push(cate);
          });
        }
      });
      return cates;
    }
  },
  mounted() {
    
    
  },
  methods: {
    tableheight(){
      return screen.height-200
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